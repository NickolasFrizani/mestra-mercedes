# Mestra Mercedes Miagawa

Landing page profissional de **Mercedes Miagawa** — Terapeuta Energética, Tarot, Radiestesia e Ventosaterapia em Indaiatuba/SP.

🌐 **Live:** https://mestra-mercedes.vercel.app

## 🚀 Stack

- **Next.js 15** (App Router)
- **React 19**
- **Tailwind CSS v4**
- **Geist + Cormorant Garamond** (fonts)
- **Vercel** (deploy + Analytics + Speed Insights)

## 📁 Estrutura

```
mestra-mercedes/
├── app/
│   ├── layout.js              # SEO metadata + JSON-LD LocalBusiness + Analytics
│   ├── page.js                # Orquestra todos componentes
│   ├── sitemap.js             # /sitemap.xml automático
│   ├── robots.js              # /robots.txt automático
│   ├── globals.css            # Animations + custom utilities (.gl, .cd, .sh, .bg, .bo)
│   └── components/            # 11 componentes (1 responsabilidade cada)
│       ├── ParticlesBg.jsx
│       ├── Nav.jsx
│       ├── Hero.jsx
│       ├── PainSection.jsx
│       ├── ServicesSection.jsx
│       ├── AboutSection.jsx
│       ├── HowItWorks.jsx
│       ├── TestimonialsSection.jsx
│       ├── CtaSection.jsx
│       ├── Footer.jsx
│       └── BookingModal.jsx
├── lib/
│   ├── data.js                # SOURCE OF TRUTH: BRAND, services, testimonials, painPoints, copy
│   └── hooks.js               # useParticles, useScrollReveal, scrollToId
├── public/
│   └── photos/
│       ├── photo1.jpg         # Mercedes terapeuta energética (70 KB)
│       └── photo2.jpg         # Mercedes com cartas de tarô (90 KB)
└── scripts/
    └── extract-photos.py      # Extrair base64 → arquivos (reutilizável)
```

## 🛠️ Desenvolvimento

```bash
npm install
npm run dev
# Abrir http://localhost:3000
```

## 📝 Editar conteúdo

**TODA edição de texto/dados é feita em `lib/data.js`.** Os componentes apenas renderizam.

Exemplos:
```javascript
// Mudar número do WhatsApp
export const WHATSAPP_NUMBER = "5519XXXXXXXXX";

// Adicionar novo serviço
export const services = [
  ...existing,
  { icon: "🔮", name: "Tarot", desc: "...", tags: [...] },
];

// Substituir testimonials (remover placeholder: true quando real)
export const testimonials = [
  { name: "Cliente Real", city: "Indaiatuba", text: "...", placeholder: false },
];
```

## 🚦 TODOs Críticos

Ver comentários em `lib/data.js`:

- [ ] Trocar `WHATSAPP_NUMBER` (atual é placeholder `5511999999999`)
- [ ] Substituir 4 testimonials placeholder por reais (com termo de imagem)
- [ ] Confirmar serviços com Mercedes (incluir Tarot? Ventosaterapia? Auriculoterapia?)
- [ ] Confirmar métricas Hero (500+ vidas? 20+ anos?)
- [ ] Integrar BookingModal `handleSubmit` com n8n webhook real (atualmente só simula)

## 📊 Build stats

- Bundle JS inicial: ~36 KB (era 249 KB antes do refactor — **-85.8%**)
- Build time: ~3s
- Lighthouse esperado: 85+

## 🚀 Deploy

Auto-deploy via Vercel a cada push em `main`.

```bash
git add .
git commit -m "feat: ..."
git push origin main
```

## 📈 Analytics

- **Vercel Web Analytics** (visitas, page views, países, dispositivos)
- **Vercel Speed Insights** (Core Web Vitals: LCP, FCP, CLS, INP)

Painel: https://vercel.com/dashboard

## 📞 Contato (do site)

- **Mercedes Miagawa** — `mercedesmiagawa@gmail.com`
- **WhatsApp:** *(a configurar em `lib/data.js`)*
