// src/utils/seeds.js

export const seedServices = [
  {
    id: crypto.randomUUID(),
    title: "Acompanhamento Geriátrico Domiciliar",
    description:
      "Auxílio na rotina do idoso: medicação, alimentação, mobilidade, prevenção de quedas e orientação à família.",
    hourlyPrice: 110,
    remote: false,
    location: "São Paulo - SP",
    tags: ["Domicílio", "Cuidados", "Prevenção de quedas"],
    ownerEmail: "ana@nurse.com",
    ownerName: "Ana Souza",
    rating: 4.9,
    cover:
      "https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: crypto.randomUUID(),
    title: "Teleassistência Geriátrica",
    description:
      "Monitoramento remoto de sinais vitais, lembretes de medicação e orientação a cuidadores.",
    hourlyPrice: 80,
    remote: true,
    location: "Remoto",
    tags: ["Teleassistência", "Medicação", "Acompanhamento"],
    ownerEmail: "carlos@onco.com",
    ownerName: "Carlos Ferreira",
    rating: 4.7,
    cover:
      "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?q=80&w=1200&auto=format&fit=crop",
  },
];

export const seedUsers = [
  {
    name: "Ana Souza",
    email: "ana@nurse.com",
    password: "123",
    role: "provider",
    dob: "",
    city: "",
    bio: "",
    avatar: "",
    specialties: "Prevenção de quedas, medicação",
    yearsExp: "5",
    certifications: "COREN 12345",
  },
  {
    name: "Carlos Ferreira",
    email: "carlos@onco.com",
    password: "123",
    role: "provider",
    dob: "",
    city: "",
    bio: "",
    avatar: "",
    specialties: "Teleassistência, mobilidade",
    yearsExp: "3",
    certifications: "Primeiros Socorros",
  },
  {
    name: "Paciente Demo",
    email: "paciente@demo.com",
    password: "123",
    role: "client",
    dob: "",
    city: "",
    bio: "",
    avatar: "",
    careNeeds: "Ajuda com medicação",
    caregiverContact: "",
  },
];
