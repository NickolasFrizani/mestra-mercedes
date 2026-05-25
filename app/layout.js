import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://mestra-mercedes.vercel.app";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:
      "Mestra Mercedes Miagawa — Terapia Energética, Tarot e Radiestesia em Indaiatuba",
    template: "%s | Mestra Mercedes Miagawa",
  },
  description:
    "Sessões de terapia energética, leitura de tarot, radiestesia e ventosaterapia com a Mestra Mercedes Miagawa. Atendimento presencial em Indaiatuba/SP e online.",
  keywords: [
    "Mestra Mercedes",
    "Mercedes Miagawa",
    "terapia energética",
    "tarot Indaiatuba",
    "radiestesia",
    "ventosaterapia",
    "auriculoterapia",
    "banho 7 ervas",
    "transformador energético ekilibrium",
    "terapia holística Indaiatuba",
  ],
  authors: [{ name: "Mestra Mercedes Miagawa" }],
  creator: "Mestra Mercedes Miagawa",
  publisher: "Mestra Mercedes Miagawa",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: SITE_URL,
    title: "Mestra Mercedes Miagawa — Terapia Energética e Tarot",
    description:
      "Sessões de terapia energética, tarot, radiestesia e ventosaterapia. Atendimento em Indaiatuba/SP e online.",
    siteName: "Mestra Mercedes",
    images: [
      {
        url: "/photos/photo1.jpg",
        width: 800,
        height: 1200,
        alt: "Mestra Mercedes Miagawa, terapeuta energética",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mestra Mercedes Miagawa — Terapia Energética e Tarot",
    description: "Sessões em Indaiatuba/SP e online.",
    images: ["/photos/photo1.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/photos/photo1.jpg",
  },
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Mestra Mercedes Miagawa",
  description:
    "Terapia energética, tarot, radiestesia, ventosaterapia e auriculoterapia em Indaiatuba/SP.",
  image: `${SITE_URL}/photos/photo1.jpg`,
  url: SITE_URL,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Indaiatuba",
    addressRegion: "SP",
    addressCountry: "BR",
  },
  areaServed: {
    "@type": "City",
    name: "Indaiatuba",
  },
  priceRange: "$$",
  serviceType: [
    "Terapia Energética",
    "Leitura de Tarot",
    "Radiestesia",
    "Ventosaterapia",
    "Auriculoterapia",
  ],
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
