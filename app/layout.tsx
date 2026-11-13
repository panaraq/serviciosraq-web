import type { Metadata } from "next";
import { Outfit, Syne } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.serviciosraq.com"),
  title: "RAQ Servicios | Integradores de Tecnología en Margarita",
  description: "Soporte técnico de computadoras y laptops, instalación de sistemas de seguridad HIKVISION certificados y redes de fibra óptica en la Isla de Margarita, Venezuela.",
  keywords: ["soporte tecnico margarita", "hikvision margarita", "fibra optica margarita", "camaras de seguridad margarita", "RAQ servicios"],
  openGraph: {
    title: "RAQ Servicios | Integradores de Tecnología",
    description: "Soporte técnico, seguridad HIKVISION certificada y fibra óptica en Margarita.",
    url: "https://serviciosraq.com",
    siteName: "RAQ Servicios",
    images: [{ url: "/servicios-raq.png", width: 720, height: 277, alt: "Servicios RAQ" }],
    locale: "es_VE",
    type: "website",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/logo.png", type: "image/png", sizes: "512x512" },
    ],
    apple: { url: "/favicon_src.png", sizes: "512x512", type: "image/png" },
    shortcut: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body suppressHydrationWarning className={`${outfit.variable} ${syne.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
