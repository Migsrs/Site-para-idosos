// src/pages/ProfilePages.jsx
import React, { useState, useEffect } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import {
  getUserByEmail,
  getUserBySlug,
  upsertUser,
  calcAge,
  LS_KEYS,
  readLS,
  calcAverageRating,
} from "../utils/storage";
import { Button, Card, Input, Textarea } from "../components/ui";
import { User, ExternalLink, Image as ImageIcon, Star } from "lucide-react";
import { ServiceCard } from "./ServicesPages";

// 🔥 Firestore (para avaliações)
import {
  collection,
  doc,
  getDocs,
  query,
  where,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";

// ---------- MINHA CONTA ----------
export function Account({ session, onLogout }) {
  if (!session) return <Navigate to="/login" replace />;
  const u = getUserByEmail(session.email) || {};
  const age = calcAge(u.dob);

  return (
    <div className="mx-auto max-w-2xl px-4 pb-28 pt-4 md:pb-8">
      <h2 className="mb-2 text-2xl font-bold">Minha conta</h2>
      <Card>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            {u?.avatar ? (
              <img
                src={u.avatar}
                alt="avatar"
                className="h-16 w-16 rounded-full object-cover"
              />
            ) : (
              <div className="h-16 w-16 rounded-full bg-amber-100 flex items-center justify-center">
                <User className="h-7 w-7 text-amber-700" />
              </div>
            )}
            <div className="space-y-1">
              <div className="text-sm text-gray-500">Logado como</div>
              <div className="text-lg font-semibold">
                {u.name || session.name || session.email}
              </div>
              <div className="text-sm text-gray-600">
                Perfil: {(u.role || session.role) === "provider"
                  ? "Prestador"
                  : "Cliente"}
              </div>

              <div className="mt-3 text-sm text-gray-700">
                {u.dob && (
                  <div>
                    <b>Nascimento:</b> {u.dob} {age ? `(${age} anos)` : ""}
                  </div>
                )}
                {u.city && (
                  <div>
                    <b>Cidade:</b> {u.city}
                  </div>
                )}
                {u.bio && (
                  <div className="mt-2">
                    <b>Bio:</b> {u.bio}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {(u.role || session.role) === "provider" && (
              <Link
                to={`/p/${u && u.email ? u.email.split("@")[0] : "profissional"}`}
                className="inline-flex items-center justify-center rounded-2xl bg-amber-50 px-4 py-2 text-amber-700 hover:bg-amber-100"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Ver perfil público
              </Link>
            )}
            <Link
              to="/profile"
              className="inline-flex items-center justify-center rounded-2xl bg-amber-600 px-4 py-2 text-white hover:bg-amber-700"
            >
              Editar perfil
            </Link>
            <Button onClick={onLogout} className="bg-gray-900">
              Sair
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

// ---------- EDITAR PERFIL ----------
export function ProfilePage({ session }) {
  const navigate = useNavigate();
  if (!session) return <Navigate to="/login" replace />;

  const current =
    getUserByEmail(session.email) || {
      email: session.email,
      name: session.name,
      role: session.role,
    };

  const [form, setForm] = useState({
    name: current.name || "",
    email: current.email || "",
    role: current.role || "client",
    dob: current.dob || "",
    city: current.city || "",
    bio: current.bio || "",
    avatar: current.avatar || "",
    specialties: current.specialties || "",
    yearsExp: current.yearsExp || "",
    certifications: current.certifications || "",
    careNeeds: current.careNeeds || "",
    caregiverContact: current.caregiverContact || "",
  });

  const age = calcAge(form.dob);

  const onAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result;
      setForm((f) => ({ ...f, avatar: dataUrl }));
    };
    reader.readAsDataURL(file);
  };

  const onSave = (e) => {
    e.preventDefault();
    upsertUser({ ...current, ...form });
    const s = readLS(LS_KEYS.session, null);
    if (s?.email === form.email) {
      localStorage.setItem(
        LS_KEYS.session,
        JSON.stringify({ ...s, name: form.name, role: form.role })
      );
    }
    alert("Perfil atualizado com sucesso!");
    navigate("/account");
  };

  return (
    <div className="mx-auto max-w-2xl px-4 pb-28 pt-4 md:pb-8">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Meu perfil</h2>
        <Link
          to="/account"
          className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-4 py-2 text-white shadow hover:opacity-90"
        >
          Voltar
        </Link>
      </div>

      <Card>
        <form onSubmit={onSave} className="grid gap-4">
          <div className="flex items-center gap-4">
            {form.avatar ? (
              <img
                src={form.avatar}
                alt="avatar"
                className="h-16 w-16 rounded-full object-cover"
              />
            ) : (
              <div className="h-16 w-16 rounded-full bg-amber-100 flex items-center justify-center">
                <User className="h-7 w-7 text-amber-700" />
              </div>
            )}
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-2 text-sm hover:bg-gray-50">
              <ImageIcon className="h-4 w-4 text-amber-600" />
              <span>Trocar foto</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onAvatarChange}
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm text-gray-700">Nome completo</label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="text-sm text-gray-700">Email</label>
              <Input
                type="email"
                value={form.email}
                disabled
                className="bg-gray-50 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="text-sm text-gray-700">Data de nascimento</label>
              <Input
                type="date"
                value={form.dob}
                onChange={(e) => setForm({ ...form, dob: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm text-gray-700">Idade</label>
              <Input
                value={age ? `${age} anos` : ""}
                readOnly
                className="bg-gray-50"
              />
            </div>
            <div>
              <label className="text-sm text-gray-700">Cidade</label>
              <Input
                placeholder="Cidade - UF"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-700">Biografia</label>
            <Textarea
              placeholder="Fale um pouco sobre você…"
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
            />
          </div>

          {form.role === "provider" ? (
            <div className="grid gap-4 md:grid-cols-3">
              <div className="md:col-span-3">
                <label className="text-sm text-gray-700">Especialidades</label>
                <Input
                  placeholder="ex.: medicação, prevenção de quedas, demência leve"
                  value={form.specialties}
                  onChange={(e) =>
                    setForm({ ...form, specialties: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-sm text-gray-700">
                  Anos de experiência
                </label>
                <Input
                  type="number"
                  min="0"
                  value={form.yearsExp}
                  onChange={(e) =>
                    setForm({ ...form, yearsExp: e.target.value })
                  }
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm text-gray-700">Certificações</label>
                <Input
                  placeholder="ex.: COREN 12345, Primeiros Socorros"
                  value={form.certifications}
                  onChange={(e) =>
                    setForm({ ...form, certifications: e.target.value })
                  }
                />
              </div>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm text-gray-700">Necessidades</label>
                <Input
                  placeholder="ex.: ajuda com medicação, mobilidade"
                  value={form.careNeeds}
                  onChange={(e) =>
                    setForm({ ...form, careNeeds: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-sm text-gray-700">
                  Cuidador principal (contato)
                </label>
                <Input
                  placeholder="Nome e telefone"
                  value={form.caregiverContact}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      caregiverContact: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <Button type="submit">Salvar alterações</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

// ---------- PERFIL PÚBLICO DO PRESTADOR + AVALIAÇÕES ----------
export function PublicProfile({ session }) {
  const { slug } = useParams();
  const u = getUserBySlug(slug);

  const services = readLS(LS_KEYS.services, []).filter(
    (s) => u && s.ownerEmail === u.email
  );

  const [ratings, setRatings] = useState([]);
  const [stars, setStars] = useState(5);
  const [comment, setComment] = useState("");
  const [loadingRatings, setLoadingRatings] = useState(false);

  // 🔥 Busca avaliações no Firestore sempre que mudar o profissional
  useEffect(() => {
    if (!u?.email) return;

    const fetchRatings = async () => {
      try {
        setLoadingRatings(true);
        const q = query(
          collection(db, "ratings"),
          where("providerEmail", "==", u.email)
        );
        const snap = await getDocs(q);
        const list = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));
        setRatings(list);
      } catch (err) {
        console.error("Erro ao buscar avaliações no Firestore:", err);
      } finally {
        setLoadingRatings(false);
      }
    };

    fetchRatings();
  }, [u?.email]);

  if (!u || u.role !== "provider") {
    return (
      <div className="mx-auto max-w-3xl px-4 pb-28 pt-4">
        <Card>
          <div className="text-center">
            <div className="text-xl font-bold">Perfil não encontrado</div>
            <p className="text-gray-600 mt-1">
              Verifique o link. Este perfil pode ser privado ou não existe.
            </p>
            <Link
              to="/services"
              className="inline-flex mt-4 rounded-full bg-amber-600 px-4 py-2 text-white hover:bg-amber-700"
            >
              Voltar aos serviços
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  const age = calcAge(u.dob);
  const avgRating = calcAverageRating(ratings);
  const totalRatings = ratings.length;

  const isLogged = !!session;
  const canRate =
    isLogged && session.role === "client" && session.email !== u.email;

  const handleRatingSubmit = async (e) => {
    e.preventDefault();
    if (!canRate) {
      alert("Apenas clientes logados podem avaliar este profissional.");
      return;
    }

    const trimmedComment = comment.trim();

    try {
      // id composto para garantir UMA avaliação por cliente/provedor
      const ratingId = `${u.email}__${session.email}`;
      const ref = doc(collection(db, "ratings"), ratingId);

      const payload = {
        providerEmail: u.email,
        authorEmail: session.email,
        authorName: session.name || session.email,
        stars,
        comment: trimmedComment,
        updatedAt: serverTimestamp(),
        // se o doc não existir, createdAt será setado; se existir, mantemos o antigo
        createdAt: serverTimestamp(),
      };

      await setDoc(ref, payload, { merge: true });

      // Recarrega lista de avaliações
      const q = query(
        collection(db, "ratings"),
        where("providerEmail", "==", u.email)
      );
      const snap = await getDocs(q);
      const list = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      setRatings(list);
      setComment("");
      alert("Avaliação registrada com sucesso!");
    } catch (err) {
      console.error("Erro ao salvar avaliação no Firestore:", err);
      alert("Não foi possível salvar a avaliação. Tente novamente em instantes.");
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 pb-28 pt-4">
      {/* Cabeçalho do profissional */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 mb-4">
        {u.avatar ? (
          <img
            src={u.avatar}
            alt={u.name}
            className="h-24 w-24 rounded-full object-cover"
          />
        ) : (
          <div className="h-24 w-24 rounded-full bg-amber-100 flex items-center justify-center">
            <User className="h-10 w-10 text-amber-700" />
          </div>
        )}
        <div>
          <h1 className="text-2xl font-bold">{u.name}</h1>
          <div className="text-gray-600 text-sm mt-1">
            {u.city && <span className="mr-3">📍 {u.city}</span>}
            {age && <span>🎂 {age} anos</span>}
          </div>
          {u.bio && <p className="mt-2 text-gray-700">{u.bio}</p>}

          <div className="mt-3 flex items-center gap-2 text-sm text-amber-600">
            <Star className="h-4 w-4 fill-amber-400" />
            {totalRatings > 0 ? (
              <span>
                {avgRating.toFixed(1)} • {totalRatings} avaliação
                {totalRatings > 1 ? "es" : ""}
              </span>
            ) : loadingRatings ? (
              <span>Carregando avaliações…</span>
            ) : (
              <span>Sem avaliações ainda</span>
            )}
          </div>

          <div className="mt-3 flex flex-wrap gap-2 text-sm">
            {u.specialties && (
              <span className="rounded-full bg-amber-50 text-amber-700 px-3 py-1">
                {u.specialties}
              </span>
            )}
            {u.certifications && (
              <span className="rounded-full bg-gray-100 px-3 py-1">
                {u.certifications}
              </span>
            )}
            {u.yearsExp && (
              <span className="rounded-full bg-gray-100 px-3 py-1">
                {u.yearsExp} anos de experiência
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Serviços */}
      <h2 className="text-lg font-semibold mb-2">Serviços oferecidos</h2>
      {services.length === 0 ? (
        <Card>
          <p className="text-gray-600">
            Este profissional ainda não cadastrou serviços.
          </p>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {services.map((s) => (
            <ServiceCard
              key={s.id}
              service={s}
              canDelete={false}
              allowManage={false}
              session={session}
            />
          ))}
        </div>
      )}

      {/* Avaliações */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Avaliações</h2>

        {canRate && (
          <Card className="mb-4">
            <form onSubmit={handleRatingSubmit} className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="text-sm font-medium text-gray-700">
                  Avalie este profissional
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((v) => (
                    <button
                      type="button"
                      key={v}
                      onClick={() => setStars(v)}
                      className="text-amber-400"
                    >
                      <Star
                        className={`h-5 w-5 ${
                          v <= stars ? "fill-amber-400" : "fill-none"
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-xs text-gray-500">
                    {stars} estrela{stars > 1 ? "s" : ""}
                  </span>
                </div>
              </div>
              <div>
                <Textarea
                  placeholder="Conte como foi sua experiência..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>
              <div className="flex justify-end">
                <Button type="submit">Enviar avaliação</Button>
              </div>
            </form>
          </Card>
        )}

        {ratings.length === 0 && !loadingRatings ? (
          <Card>
            <p className="text-gray-600 text-sm">
              Ainda não há avaliações para este profissional.
            </p>
          </Card>
        ) : (
          <div className="space-y-3">
            {ratings
              .slice()
              .sort((a, b) => {
                const da = a.createdAt?.toDate
                  ? a.createdAt.toDate()
                  : new Date(a.createdAt);
                const dbDate = b.createdAt?.toDate
                  ? b.createdAt.toDate()
                  : new Date(b.createdAt);
                return dbDate - da;
              })
              .map((r) => {
                const created =
                  r.createdAt?.toDate?.() || new Date(r.createdAt);
                return (
                  <Card key={r.id} className="py-3 px-4">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <div className="text-sm font-semibold">
                          {r.authorName || "Usuário"}
                        </div>
                        <div className="text-xs text-gray-500">
                          {created.toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-amber-500">
                        {[1, 2, 3, 4, 5].map((v) => (
                          <Star
                            key={v}
                            className={`h-4 w-4 ${
                              v <= r.stars ? "fill-amber-400" : "fill-none"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    {r.comment && (
                      <p className="mt-2 text-sm text-gray-700">
                        {r.comment}
                      </p>
                    )}
                  </Card>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
}
