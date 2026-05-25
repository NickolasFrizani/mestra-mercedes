// Dados estruturados do site Mestra Mercedes.
// Editar aqui é mais seguro do que editar os componentes.
//
// ⚠️ TODOs PRIORITÁRIOS:
// 1. WHATSAPP_NUMBER — trocar pelo real
// 2. testimonials — substituir placeholders por reais (com termo de imagem)
// 3. services — confirmar com a Mercedes (incluir Tarot / Ventosaterapia / Auriculoterapia?)
// 4. BRAND métricas — confirmar 500+ vidas / 20+ anos / 6 especialidades

// ----------- CONTATO -----------

export const WHATSAPP_NUMBER = "5511999999999"; // TODO: trocar pelo real
export const WHATSAPP_MESSAGE = "Olá Mestra Mercedes! Gostaria de agendar uma consulta. 🙏✨";
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
export const EMAIL = "mercedesmiagawa@gmail.com";

// ----------- IDENTIDADE -----------

export const BRAND = {
  name: "Mercedes Miagawa",
  prefix: "Mestra",
  role: "Terapeuta Energética",
  fullTitle: "Terapeuta Energética & Mestra em Reiki",
  bio: "Com mais de 20 anos de experiência em terapias energéticas, Mestra Mercedes Miagawa dedica sua vida a ajudar pessoas a encontrarem equilíbrio, cura e propósito.",
  bioExtra: "Mestra em Reiki nível III, especialista em Radiestesia e Feng Shui, e profunda conhecedora de Numerologia, ela integra o conhecimento ancestral com técnicas modernas para criar sessões únicas e transformadoras.",
  city: "Indaiatuba",
  state: "SP",
  vidasTransformadas: "500+",  // TODO: confirmar
  anosExperiencia: "20+",       // TODO: confirmar
  numEspecialidades: "6",
};

// ----------- CERTIFICAÇÕES (mostradas na seção About) -----------

export const certifications = [
  "Reiki Mestre III",
  "Feng Shui Avançado",
  "Radiestesia",
  "Numerologia",
  "Limpeza Energética",
  "Consultora Espiritual",
];

// ----------- SERVIÇOS -----------
// ⚠️ Confirmar com Mercedes. Os arquivos identificaram também:
// - Tarot (foto com cartas) · Ventosaterapia (curso Eduardo) · Auriculoterapia (Celina certificada)

export const services = [
  { icon:"✦", name:"Reiki",
    desc:"Harmonização dos chacras e desbloqueio dos canais de energia vital para restaurar equilíbrio físico e emocional.",
    tags:["Alívio de dores","Redução do estresse","Equilíbrio emocional"] },
  { icon:"◈", name:"Radiestesia",
    desc:"Uso de pêndulos para diagnóstico energético profundo e orientação espiritual personalizada.",
    tags:["Diagnóstico energético","Orientação espiritual","Limpeza de ambientes"] },
  { icon:"☯", name:"Feng Shui",
    desc:"Harmonização de espaços para atrair abundância, saúde e prosperidade para sua vida.",
    tags:["Harmonia no lar","Atração de prosperidade","Bem-estar familiar"] },
  { icon:"∞", name:"Numerologia",
    desc:"Decodificação do mapa numerológico para revelar seu propósito e caminhos de evolução.",
    tags:["Autoconhecimento","Clareza de propósito","Decisões assertivas"] },
  { icon:"◉", name:"Limpeza Energética",
    desc:"Remoção de energias densas e bloqueios que impedem seu crescimento e felicidade.",
    tags:["Leveza interior","Proteção energética","Renovação espiritual"] },
  { icon:"✧", name:"Consultoria Espiritual",
    desc:"Sessão completa integrando todas as terapias para uma transformação profunda e duradoura.",
    tags:["Visão holística","Plano personalizado","Acompanhamento"] },
];

// ----------- PAIN POINTS (problemas do cliente) -----------

export const painPoints = [
  ["💫","Ansiedade e estresse constantes","Seu corpo e mente vivem em alerta, sem conseguir descansar de verdade?"],
  ["🌑","Cansaço sem explicação","Dorme bem mas acorda exausto? Pode ser bloqueio energético impedindo sua vitalidade."],
  ["🔒","Bloqueios financeiros ou amorosos","Por mais que tente, as coisas não fluem no amor, nos relacionamentos ou no dinheiro?"],
  ["🧭","Sensação de estar perdido","Falta de propósito, direção ou clareza sobre o que fazer com sua vida?"],
];

// ----------- HOW IT WORKS -----------

export const howSteps = [
  ["01","Escolha","Selecione a terapia ideal"],
  ["02","Agende","Escolha data e horário"],
  ["03","Confirme","Receba por email e WhatsApp"],
  ["04","Transforme","Viva sua transformação"],
];

// ----------- DEPOIMENTOS -----------
// ⚠️ PLACEHOLDERS — substituir com depoimentos REAIS com termo de imagem assinado.

export const testimonials = [
  { name:"Ana Lima", city:"São Paulo",
    text:"Depois da sessão com a Mestra Mercedes minha vida mudou completamente. Sentia um bloqueio enorme no amor e após o Reiki conheci meu parceiro em 3 semanas!",
    placeholder:true },
  { name:"Carlos Mendes", city:"Campinas",
    text:"A limpeza energética foi transformadora. Meu negócio estava parado há 2 anos, e após a consultoria, em 1 mês triplicou o faturamento.",
    placeholder:true },
  { name:"Patricia Souza", city:"Santos",
    text:"A Numerologia revelou meu propósito de vida. Mudei de carreira e hoje vivo com muito mais felicidade e propósito verdadeiro.",
    placeholder:true },
  { name:"Roberto Silva", city:"Rio de Janeiro",
    text:"Sofria com ansiedade há anos. Após 3 sessões de Reiki com a Mestra Mercedes, encontrei uma paz que nunca havia experimentado.",
    placeholder:true },
];

// ----------- AGENDA -----------

export const availableTimes = [
  "09:00","10:00","11:00",
  "14:00","15:00","16:00","17:00","18:00",
];

// ----------- COPY -----------

export const copy = {
  heroBadge: "Terapeuta Energética Certificada",
  heroTitle: "Libere seus bloqueios energéticos e transforme sua vida",
  heroSub: "Há mais de 20 anos guiando pessoas na jornada de cura, equilíbrio e expansão espiritual. Sua transformação começa aqui.",
  painTitle: "Você se identifica com alguma dessas situações?",
  painCta: "Se você respondeu sim, as terapias energéticas podem transformar sua vida.",
  servicesTitle: "Terapias Transformadoras",
  servicesSub: "Cada sessão é única e personalizada para o que sua alma precisa",
  aboutTitle: "Conheça a Mestra Mercedes",
  aboutBadge: "20+ anos transformando vidas com amor e sabedoria",
  howTitle: "Como funciona?",
  testimonialsTitle: "Vidas Transformadas",
  ctaTitle: "Sua jornada de transformação começa agora",
  ctaSub: "Não espere mais para viver a vida que você merece. Agende sua sessão.",
  footerTag: "Terapias Energéticas & Cura Holística",
};
