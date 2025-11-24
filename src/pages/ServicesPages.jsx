// src/pages/ServicesPages.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { MapPin, Star, Plus, Pencil, Trash2 } from "lucide-react";

import { Button, Card, Input, Textarea, SearchBar } from "../components/ui";
import { getUserByEmail, userSlug } from "../utils/storage";
import { PromoCarousel } from "./HomePage";

// 🔥 Firestore – média das avaliações
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";

// 🔥 Firestore – serviços (CRUD)
import {
  createService,
  listAllServices,
  updateService,
  deleteService,
} from "../services/firestoreServices";

// =================== LISTAGEM DE SERVIÇOS ===================
export function Services({ session }) {
  const [queryText, setQueryText] = useState("");
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Carrega serviços do Firestore
  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const list = await listAllServices();
        if (active) {
          setServices(list);
        }
      } catch (err) {
        console.error("Erro ao carregar serviços do Firestore:", err);
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  // excluir serviço (apenas do dono) – agora no Firestore
  const handleDelete = async (service) => {
    if (!session || service.ownerEmail !== session.email) {
      alert("Você só pode excluir serviços que você publicou.");
      return;
    }

    if (!confirm("Tem certeza que deseja excluir este serviço?")) return;

    try {
      await deleteService(service.id);
      setServices((prev) => prev.filter((s) => s.id !== service.id));
      alert("Serviço excluído com sucesso!");
    } catch (err) {
      console.error("Erro ao excluir serviço no Firestore:", err);
      alert("Não foi possível excluir o serviço. Tente novamente.");
    }
  };

  const filtered = useMemo(() => {
    const q = queryText.trim().toLowerCase();
    if (!q) return services;
    return services.filter((s) =>
      [s.title, s.description, s.location, ...(s.tags || [])]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [queryText, services]);

  const isProvider = session?.role === "provider";

  return (
    <div className="mx-auto max-w-5xl px-4 pb-28 pt-4 md:pb-8">
      <SearchBar
        value={queryText}
        onChange={(e) => setQueryText(e.target.value)}
      />
      <PromoCarousel />

      {loading ? (
        <Card>
          <p className="text-gray-600">Carregando serviços...</p>
        </Card>
      ) : filtered.length === 0 ? (
        <Card>
          <p className="text-gray-600">
            Nenhum serviço encontrado para sua busca.
          </p>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((s) => (
            <ServiceCard
              key={s.id}
              service={s}
              session={session}
              canDelete={session?.email === s.ownerEmail}
              onDelete={() => handleDelete(s)}
              allowManage={true}
            />
          ))}
        </div>
      )}

      {isProvider && (
        <Link to="/add-service" className="fixed bottom-20 right-4 md:right-8">
          <button className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-600 text-white shadow-lg transition hover:scale-105">
            <Plus className="h-7 w-7" />
          </button>
        </Link>
      )}
    </div>
  );
}

// =================== CARD DE SERVIÇO ===================
export function ServiceCard({
  service,
  session,
  canDelete = false,
  onDelete = null,
  allowManage = false,
}) {
  const provider = getUserByEmail(service.ownerEmail);
  const isOwner = canDelete && session?.email === service.ownerEmail;

  // 🔥 média das avaliações reais do prestador no Firestore
  const [avgRating, setAvgRating] = useState(null);
  const [loadingRating, setLoadingRating] = useState(false);

  useEffect(() => {
    let active = true;
    const fetchAvg = async () => {
      if (!service.ownerEmail) return;
      try {
        setLoadingRating(true);
        const q = query(
          collection(db, "ratings"),
          where("providerEmail", "==", service.ownerEmail)
        );
        const snap = await getDocs(q);

        let sum = 0;
        let count = 0;
        snap.forEach((docSnap) => {
          const data = docSnap.data();
          const stars = Number(data.stars || 0);
          if (!Number.isNaN(stars) && stars > 0) {
            sum += stars;
            count += 1;
          }
        });

        const avg = count > 0 ? sum / count : null;
        if (active) setAvgRating(avg);
      } catch (err) {
        console.error("Erro ao buscar média de avaliações no Firestore:", err);
        if (active) setAvgRating(null);
      } finally {
        if (active) setLoadingRating(false);
      }
    };

    fetchAvg();
    return () => {
      active = false;
    };
  }, [service.ownerEmail]);

  // se não tiver no Firestore, usa o rating estático do serviço (seed/backup)
  const ratingToShow =
    avgRating != null ? avgRating : service.rating != null ? service.rating : null;

  return (
    <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
      {service.cover && (
        <div
          className="h-36 w-full bg-gray-100 md:h-44"
          style={{
            backgroundImage: `url(${service.cover})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      )}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-lg font-semibold leading-tight truncate">
              {service.title}
            </h3>
            <div className="mt-1 text-sm text-gray-600 flex items-center gap-2">
              {provider ? (
                <>
                  {provider.avatar ? (
                    <img
                      src={provider.avatar}
                      alt="avatar"
                      className="h-5 w-5 rounded-full object-cover"
                    />
                  ) : (
                    <MapPin className="h-4 w-4 text-amber-600" />
                  )}
                  <Link
                    className="hover:text-amber-700 underline truncate"
                    to={`/p/${userSlug(provider)}`}
                    title={service.ownerName}
                  >
                    {service.ownerName}
                  </Link>
                </>
              ) : (
                <>por {service.ownerName}</>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="rounded-xl bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-700 whitespace-nowrap">
              R$ {service.hourlyPrice}/h
            </div>

            {allowManage && isOwner && (
              <>
                <Link
                  to={`/edit-service/${service.id}`}
                  className="rounded-xl bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700 hover:bg-blue-100 flex items-center gap-1"
                  title="Editar serviço"
                >
                  <Pencil className="h-4 w-4" />
                  Editar
                </Link>
                {onDelete && (
                  <button
                    onClick={onDelete}
                    className="rounded-xl bg-red-50 px-3 py-1 text-sm font-semibold text-red-700 hover:bg-red-100 flex items-center gap-1"
                    title="Excluir serviço"
                  >
                    <Trash2 className="h-4 w-4" />
                    Excluir
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        <p className="mt-3 line-clamp-3 text-gray-700">
          {service.description}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-gray-600">
          {service.remote ? (
            <span className="rounded-xl bg-gray-100 px-2 py-1">Remoto</span>
          ) : (
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-4 w-4" /> {service.location}
            </span>
          )}
          {service.tags?.slice(0, 3).map((t) => (
            <span key={t} className="rounded-xl bg-gray-100 px-2 py-1">
              #{t}
            </span>
          ))}
          <span className="ml-auto inline-flex items-center gap-1 text-amber-600">
            <Star className="h-4 w-4" />
            {loadingRating
              ? "…"
              : ratingToShow != null
              ? ratingToShow.toFixed(1)
              : "-"}
          </span>
        </div>

        <div className="mt-4">
          {session ? (
            <Link to="/contacts">
              <Button className="w-full">Entrar em contato</Button>
            </Link>
          ) : (
            <Link to="/login">
              <Button className="w-full">Entrar em contato</Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

// =================== FORMULÁRIO COMPARTILHADO ===================
function ServiceForm({ form, setForm, onSubmit, title }) {
  return (
    <div className="mx-auto max-w-2xl px-4 pb-24 pt-4 md:pb-8">
      <h2 className="mb-2 text-2xl font-bold">{title}</h2>
      <Card>
        <form onSubmit={onSubmit} className="grid gap-4">
          <div>
            <label className="text-sm text-gray-700">Título</label>
            <Input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="text-sm text-gray-700">Descrição</label>
            <Textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              required
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm text-gray-700">
                Preço por hora (R$)
              </label>
              <Input
                type="number"
                min="0"
                step="1"
                value={form.hourlyPrice}
                onChange={(e) =>
                  setForm({ ...form, hourlyPrice: e.target.value })
                }
                required
              />
            </div>
            <div className="flex items-end gap-2">
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.remote}
                  onChange={(e) =>
                    setForm({ ...form, remote: e.target.checked })
                  }
                />
                Atuação remota
              </label>
            </div>
          </div>

          {!form.remote && (
            <div>
              <label className="text-sm text-gray-700">Localização</label>
              <Input
                placeholder="Cidade - UF"
                value={form.location}
                onChange={(e) =>
                  setForm({ ...form, location: e.target.value })
                }
              />
            </div>
          )}

          <div>
            <label className="text-sm text-gray-700">
              Tags (separadas por vírgula)
            </label>
            <Input
              placeholder="ex.: medicação, prevenção de quedas, demência leve"
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm text-gray-700">
              Imagem de capa (URL opcional)
            </label>
            <Input
              placeholder="https://..."
              value={form.cover}
              onChange={(e) => setForm({ ...form, cover: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Link
              to="/services"
              className="inline-flex items-center rounded-2xl border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </Link>
            <Button type="submit">Salvar</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

// =================== ADICIONAR SERVIÇO ===================
export function AddService({ session }) {
  const navigate = useNavigate();
  const isProvider = session?.role === "provider";

  useEffect(() => {
    if (!isProvider) navigate("/services");
  }, [isProvider, navigate]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    hourlyPrice: "",
    remote: false,
    location: "",
    tags: "",
    cover: "",
  });

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        hourlyPrice: Number(form.hourlyPrice || 0),
        remote: !!form.remote,
        location: form.remote ? "Remoto" : form.location.trim(),
        tags: form.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        cover: form.cover.trim(),
      };

      await createService(payload, session);
      alert("Serviço adicionado!");
      navigate("/services");
    } catch (err) {
      console.error("Erro ao criar serviço no Firestore:", err);
      alert("Não foi possível adicionar o serviço. Tente novamente.");
    }
  };

  return (
    <ServiceForm
      form={form}
      setForm={setForm}
      onSubmit={onSubmit}
      title="Adicionar serviço"
    />
  );
}

// =================== EDITAR SERVIÇO ===================
export function EditService({ session }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const all = await listAllServices();
        const existing = all.find((s) => s.id === id);

        if (!existing) {
          alert("Serviço não encontrado.");
          navigate("/services");
          return;
        }

        if (!session || existing.ownerEmail !== session.email) {
          alert("Você só pode editar serviços que você publicou.");
          navigate("/services");
          return;
        }

        if (!active) return;

        setForm({
          title: existing.title || "",
          description: existing.description || "",
          hourlyPrice: existing.hourlyPrice || "",
          remote: !!existing.remote,
          // se for remoto, deixo location em branco para não confundir
          location: existing.remote ? "" : existing.location || "",
          tags: Array.isArray(existing.tags)
            ? existing.tags.join(", ")
            : existing.tags || "",
          cover: existing.cover || "",
        });
      } catch (err) {
        console.error("Erro ao carregar serviço para edição:", err);
        alert("Não foi possível carregar o serviço.");
        navigate("/services");
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, [id, session, navigate]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form) return;

    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        hourlyPrice: Number(form.hourlyPrice || 0),
        remote: !!form.remote,
        location: form.remote ? "Remoto" : form.location.trim(),
        tags: form.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        cover: form.cover.trim(),
      };

      await updateService(id, payload);
      alert("Serviço atualizado!");
      navigate("/services");
    } catch (err) {
      console.error("Erro ao atualizar serviço no Firestore:", err);
      alert("Não foi possível atualizar o serviço. Tente novamente.");
    }
  };

  if (loading || !form) {
    return (
      <div className="mx-auto max-w-2xl px-4 pb-24 pt-4 md:pb-8">
        <Card>
          <p className="text-gray-600">Carregando serviço...</p>
        </Card>
      </div>
    );
  }

  return (
    <ServiceForm
      form={form}
      setForm={setForm}
      onSubmit={onSubmit}
      title="Editar serviço"
    />
  );
}
