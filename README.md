# Vinculum 👵🧓

Marketplace de assistentes geriátricos, inspirado na experiência mobile do iFood.  
O objetivo é conectar famílias e cuidadores de confiança para idosos, em um formato simples de **MVP**.

> ⚠️ **Aviso importante:** Este projeto é um protótipo educacional/MVP e **não substitui orientação médica ou profissional real**.

---

## 🧩 Visão geral

O **Vinculum** é uma aplicação web construída com **React + Vite + Tailwind CSS**, usando **Firebase Authentication** para login com Google e **localStorage** como “banco de dados” local.

Ele permite:

- cadastro de **clientes** e **prestadores** (cuidadores);
- publicação de serviços por cuidadores;
- visualização de serviços por clientes;
- avaliações com estrelas e comentários para prestadores;
- perfis públicos e privados.

Todo o fluxo foi pensado como um MVP funcional para um sistema de contratação de assistentes geriátricos.

---

## ✨ Funcionalidades principais

### Autenticação

- Login com **email e senha**.
- Login com **Google (Firebase)**.
- Ao entrar com Google pela primeira vez:
  - o email é obtido do Google;
  - o usuário é redirecionado para uma tela de **“Completar cadastro”**;
  - só depois de preencher nome, perfil, dados básicos e bio ele pode acessar o sistema.

### Perfis & usuários

- Dois tipos de usuário:
  - **Cliente**  
  - **Prestador de serviços (cuidador)**  
- Campos de perfil:
  - nome completo  
  - email  
  - data de nascimento (cálculo automático de idade)  
  - cidade  
  - biografia  
  - avatar/foto (upload simples via `FileReader`)  
  - para prestadores: especialidades, anos de experiência, certificações  
  - para clientes: necessidades de cuidado, contato do cuidador principal  

- Páginas de perfil:
  - **Minha conta** (resumo dos dados + botão de logout)
  - **Editar perfil**
  - **Perfil público do prestador** (link compartilhável, com slug amigável)

### Serviços

- Listagem de serviços em um layout inspirado no iFood:
  - cards com título, descrição, preço por hora, tags e rating
  - destaque se o serviço é remoto ou presencial
- **Prestadores podem:**
  - adicionar novos serviços
  - editar serviços que eles mesmos criaram
  - excluir serviços próprios
- **Clientes:**
  - podem ver todos os serviços
  - só conseguem entrar em contato se estiverem logados  
    (senão são redirecionados para o login)

### Avaliações (ratings)

- Clientes logados podem **avaliar prestadores** (estrelas + comentário).
- Cada cliente pode ter **1 avaliação por prestador** (ao enviar de novo, ele atualiza).
- Os dados de avaliação são salvos em `localStorage`:
  - `vinculum_ratings`
- Funções utilitárias calculam:
  - lista de avaliações por prestador
  - **média de estrelas** (`calcAverageRating`)
- A média é exibida:
  - na página de perfil público do prestador
  - nos cards de serviço

### UI / UX

- Layout **mobile-first** com:
  - **AppBar** fixa no topo (localização + menu do usuário)
  - **Bottom Tab Bar** no mobile (Início, Contatos, Conta)
  - **Mini menu do usuário** no canto superior direito (estilo menu do Twitch) com:
    - Minha conta
    - Editar perfil
    - Serviços
    - Contato
    - Sair
- **Botões flutuantes** no canto superior esquerdo:
  - ícone de **Home** → volta para a página inicial
  - **seta de voltar** → volta para a página anterior
- Hero section com banner e call-to-action:
  - “Bem-vindo ao Vinculum”
  - “Conheça nossos serviços”
- Paleta **laranja/dourado** focada em acolhimento e confiança.

---

## 🛠️ Tecnologias utilizadas

- **Frontend**
  - [React](https://react.dev/)
  - [Vite](https://vite.dev/)
  - [React Router DOM](https://reactrouter.com/)
  - [Tailwind CSS](https://tailwindcss.com/)
  - [Lucide React](https://lucide.dev/) (ícones)

- **Autenticação**
  - [Firebase Authentication](https://firebase.google.com/docs/auth) (login com Google)

- **Persistência (MVP)**
  - `localStorage` do navegador:
    - `vinculum_users`
    - `vinculum_session`
    - `vinculum_services`
    - `vinculum_contacts`
    - `vinculum_ratings`
    - `vinculum_google_pending`

---

## 🗂️ Estrutura básica de pastas

```bash
src/
  main.jsx          # ponto de entrada React + Vite
  App.jsx           # definição das rotas e seeds iniciais

  components/
    layout.jsx      # PageLayout, AppBar, BottomTabs, mini menu, botões flutuantes
    ui.jsx          # Button, GhostButton, Input, Textarea, Card, SearchBar etc.

  pages/
    HomePage.jsx        # Hero, banner, tiles de destaque
    AuthPages.jsx       # Login, Register, CompleteGoogleProfile
    ServicesPages.jsx   # listagem de serviços, AddService, EditService, ServiceCard
    ContactsPage.jsx    # página “Fale conosco”
    ProfilePages.jsx    # Account, ProfilePage (editar), PublicProfile
  utils/
    storage.js      # helpers de localStorage, usuários, ratings, slug, idade
    seeds.js        # serviços e usuários de exemplo
  firebase.js       # configuração do Firebase Authentication
  index.css         # Tailwind e estilos globais
