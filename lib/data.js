// Dados estruturados do site Mestra Mercedes
// Editar aqui é mais seguro do que editar o componente.
//
// ⚠️ TODOs PRIORITÁRIOS (placeholders gerados por IA na criação do site):
// 1. Substituir TODOS os testimonials por reais (com autorização escrita)
// 2. Atualizar WHATSAPP_NUMBER com o número real da Mestra Mercedes
// 3. Confirmar/ajustar os 6 serviços com a Mestra (Reiki vs Ventosaterapia / Tarot etc)
// 4. Confirmar contadores no Hero (500+ vidas? 20+ anos?)

// ----------- CONTATO -----------

export const WHATSAPP_NUMBER = "5511999999999"; // TODO: trocar pelo real
export const WHATSAPP_MESSAGE = "Olá Mestra Mercedes! Gostaria de agendar uma consulta. 🙏✨";
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

// ----------- IDENTIDADE -----------

export const BRAND = {
  name: "Mercedes Miagawa",
  prefix: "Mestra",
  role: "Terapeuta Energética",
  city: "Indaiatuba",
  state: "SP",
  // Métricas exibidas no Hero
  vidasTransformadas: "500+",
  anosExperiencia: "20+",
  numEspecialidades: "6",
};

// ----------- SERVIÇOS -----------
// ⚠️ Os serviços atuais foram gerados em fase inicial.
// Confirmar com Mercedes se incluem TAROT, VENTOSATERAPIA (autora curso),
// AURICULOTERAPIA (Celina certificada), BANHO 7 ERVAS, EKILIBRIUM, etc.

export const services = [
  {
    icon: "✦",
    name: "Reiki",
    desc: "Harmonização dos chacras e desbloqueio dos canais de energia vital para restaurar equilíbrio físico e emocional.",
    tags: ["Alívio de dores", "Redução do estresse", "Equilíbrio emocional"],
  },
  {
    icon: "◈",
    name: "Radiestesia",
    desc: "Uso de pêndulos para diagnóstico energético profundo e orientação espiritual personalizada.",
    tags: ["Diagnóstico energético", "Orientação espiritual", "Limpeza de ambientes"],
  },
  {
    icon: "☯",
    name: "Feng Shui",
    desc: "Harmonização de espaços para atrair abundância, saúde e prosperidade para sua vida.",
    tags: ["Harmonia no lar", "Atração de prosperidade", "Bem-estar familiar"],
  },
  {
    icon: "∞",
    name: "Numerologia",
    desc: "Decodificação do mapa numerológico para revelar seu propósito e caminhos de evolução.",
    tags: ["Autoconhecimento", "Clareza de propósito", "Decisões assertivas"],
  },
  {
    icon: "◉",
    name: "Limpeza Energética",
    desc: "Remoção de energias densas e bloqueios que impedem seu crescimento e felicidade.",
    tags: ["Leveza interior", "Proteção energética", "Renovação espiritual"],
  },
  {
    icon: "✧",
    name: "Consultoria Espiritual",
    desc: "Sessão completa integrando todas as terapias para uma transformação profunda e duradoura.",
    tags: ["Visão holística", "Plano personalizado", "Acompanhamento"],
  },
  // Sugestões para adicionar (descobertos no scan dos arquivos):
  // { icon:"🔮", name:"Tarot", desc:"Leitura de cartas com a Mestra Mercedes para clareza sobre amor, trabalho e propósito.", tags:[...] },
  // { icon:"🌿", name:"Ventosaterapia", desc:"Técnica milenar com curso ministrado por Eduardo Cavaglieri.", tags:[...] },
  // { icon:"👂", name:"Auriculoterapia", desc:"Sessões com profissional certificado (Celina Frizani).", tags:[...] },
];

// ----------- DEPOIMENTOS -----------
// ⚠️ TODOS ESTES SÃO PLACEHOLDERS GERADOS POR IA — NÃO USAR ASSIM EM PRODUÇÃO!
// Substituir por depoimentos REAIS com autorização escrita usando o template:
// 📚 Knowledge Base/📄 Documentos/Templates/Termo Uso de Imagem.md

export const testimonials = [
  {
    name: "Ana Lima", // TODO: depoimento real
    city: "São Paulo",
    text: "Depois da sessão com a Mestra Mercedes minha vida mudou completamente. Sentia um bloqueio enorme no amor e após o Reiki conheci meu parceiro em 3 semanas!",
    placeholder: true, // remover quando substituir
  },
  {
    name: "Carlos Mendes",
    city: "Campinas",
    text: "A limpeza energética foi transformadora. Meu negócio estava parado há 2 anos, e após a consultoria, em 1 mês triplicou o faturamento.",
    placeholder: true,
  },
  {
    name: "Patricia Souza",
    city: "Santos",
    text: "A Numerologia revelou meu propósito de vida. Mudei de carreira e hoje vivo com muito mais felicidade e propósito verdadeiro.",
    placeholder: true,
  },
  {
    name: "Roberto Silva",
    city: "Rio de Janeiro",
    text: "Sofria com ansiedade há anos. Após 3 sessões de Reiki com a Mestra Mercedes, encontrei uma paz que nunca havia experimentado.",
    placeholder: true,
  },
];

// ----------- AGENDA -----------

export const availableTimes = [
  "09:00", "10:00", "11:00",
  "14:00", "15:00", "16:00", "17:00", "18:00",
];

// ----------- PAIN POINTS (problemas do cliente) -----------

export const painPoints = [
  ["💫", "Ansiedade e estresse constantes",
   "Seu corpo e mente vivem em alerta, sem conseguir descansar de verdade?"],
  ["🌑", "Cansaço sem explicação",
   "Dorme bem mas acorda exausto? Pode ser bloqueio energético impedindo sua vitalidade."],
  ["🔒", "Bloqueios financeiros ou amorosos",
   "Por mais que tente, as coisas não fluem no amor, nos relacionamentos ou no dinheiro?"],
  ["🧭", "Sensação de estar perdido",
   "Falta de propósito, direção ou clareza sobre o que fazer com sua vida?"],
];
