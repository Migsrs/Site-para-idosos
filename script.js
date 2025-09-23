// ==========================
// Controle de Sessão
// ==========================
function getUsuarioLogado() {
  const u = localStorage.getItem("usuario-logado");
  return u ? JSON.parse(u) : null;
}

function loginUsuario(usuario) {
  localStorage.setItem("usuario-logado", JSON.stringify(usuario));
}

function logoutUsuario() {
  localStorage.removeItem("usuario-logado");
  window.location.href = "login.html";
}

// ==========================
// DOMContentLoaded
// ==========================
document.addEventListener("DOMContentLoaded", () => {
  const pagina = window.location.pathname.split("/").pop();

  // Páginas públicas que não exigem login
  const paginasPublicas = ["index.html", "login.html", "cadastro.html", ""];

  if (!paginasPublicas.includes(pagina)) {
    const usuario = getUsuarioLogado();
    if (!usuario) {
      window.location.href = "login.html";
    }
  }

  // Menu dinâmico
  const headerNav = document.querySelector("header nav");
  if (headerNav) {
    headerNav.innerHTML = `
      <a href="index.html">Início</a>
      <a href="servicos.html">Serviços</a>
      <a href="contato.html">Contato</a>
      <a href="adicionar.html">Adicionar Serviço</a>
    `;
    const usuario = getUsuarioLogado();
    if (usuario) {
      const saudacao = document.createElement("span");
      saudacao.innerText = `Olá, ${usuario.nome} (${usuario.tipo})`;
      saudacao.style.marginLeft = "15px";
      saudacao.style.fontWeight = "bold";
      headerNav.appendChild(saudacao);

      const logoutBtn = document.createElement("a");
      logoutBtn.href = "#";
      logoutBtn.innerText = "Sair";
      logoutBtn.style.marginLeft = "10px";
      logoutBtn.addEventListener("click", (e) => {
        e.preventDefault();
        logoutUsuario();
      });
      headerNav.appendChild(logoutBtn);
    } else {
      const loginLink = document.createElement("a");
      loginLink.href = "login.html";
      loginLink.innerText = "Login";
      loginLink.style.marginLeft = "10px";

      const cadastroLink = document.createElement("a");
      cadastroLink.href = "cadastro.html";
      cadastroLink.innerText = "Cadastro";
      cadastroLink.style.marginLeft = "10px";

      headerNav.appendChild(loginLink);
      headerNav.appendChild(cadastroLink);
    }
  }

  // ==========================
  // Slideshow da Home
  // ==========================
  let slideIndex = 0;
  const slides = document.querySelectorAll(".slide");
  if (slides.length > 0) {
    slides.forEach((slide, i) => slide.style.opacity = 0);
    slides[0].style.opacity = 1;

    setInterval(() => {
      slides[slideIndex].style.opacity = 0;
      slideIndex = (slideIndex + 1) % slides.length;
      slides[slideIndex].style.opacity = 1;
    }, 4000);
  }

  // ==========================
  // Mostrar serviços na página de serviços
  // ==========================
  const listaServicos = document.getElementById("lista-servicos");
  if (listaServicos) {
    listaServicos.innerHTML = "";
    for (let i = 0; i < localStorage.length; i++) {
      const chave = localStorage.key(i);
      if (chave.startsWith("servico-")) {
        const li = document.createElement("li");
        li.textContent = localStorage.getItem(chave);
        listaServicos.appendChild(li);
      }
    }
  }
});

// ==========================
// Cadastro
// ==========================
const formCadastro = document.getElementById("form-cadastro");
if (formCadastro) {
  formCadastro.addEventListener("submit", (e) => {
    e.preventDefault();
    const nome = document.getElementById("cadastro-nome").value.trim();
    const email = document.getElementById("cadastro-email").value.trim().toLowerCase();
    const senha = document.getElementById("cadastro-senha").value;
    const tipo = document.getElementById("cadastro-tipo").value;

    if (!nome || !email || !senha || !tipo) return;

    const usuarioExistente = localStorage.getItem(`usuario-${email}`);
    if (usuarioExistente) {
      document.getElementById("resposta-cadastro").innerText = "Email já cadastrado!";
      return;
    }

    const usuario = { nome, email, senha, tipo };
    localStorage.setItem(`usuario-${email}`, JSON.stringify(usuario));
    document.getElementById("resposta-cadastro").innerText =
      "Cadastro realizado com sucesso! Agora faça login.";
    formCadastro.reset();
  });
}

// ==========================
// Login
// ==========================
const formLogin = document.getElementById("form-login");
if (formLogin) {
  formLogin.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("login-email").value.trim().toLowerCase();
    const senha = document.getElementById("login-senha").value;
    const tipo = document.getElementById("login-tipo").value;

    const usuario = JSON.parse(localStorage.getItem(`usuario-${email}`));

    if (usuario && usuario.senha === senha && usuario.tipo === tipo) {
      loginUsuario(usuario);
      window.location.href = "index.html";
    } else {
      document.getElementById("resposta-login").innerText =
        "Credenciais inválidas. Verifique email, senha e tipo de usuário.";
    }
  });
}

// ==========================
// Formulário de Contato
// ==========================
const formContato = document.getElementById("form-contato");
if (formContato) {
  formContato.addEventListener("submit", (e) => {
    e.preventDefault();
    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const mensagem = document.getElementById("mensagem").value.trim();

    if (!nome || !email || !mensagem) return;

    document.getElementById("resposta-contato").innerText =
      `Obrigado, ${nome}! Recebemos sua mensagem e entraremos em contato pelo email ${email}.`;

    formContato.reset();
  });
}

// ==========================
// Adicionar Serviços
// ==========================
const formServico = document.getElementById("form-servico");
if (formServico) {
  formServico.addEventListener("submit", (e) => {
    e.preventDefault();
    const novoServico = document.getElementById("novo-servico").value.trim();
    if (!novoServico) return;

    localStorage.setItem(`servico-${Date.now()}`, novoServico);
    document.getElementById("resposta-servico").innerText =
      `Serviço "${novoServico}" adicionado com sucesso!`;

    formServico.reset();
  });
}
