import type { Metadata, Viewport } from "next";
import { getSettings, setting } from "@/lib/content";
import "./globals.css";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const settings = getSettings();
  const name = setting(settings, "site_name", "Keuskupan Agung ROBLOX");
  const description = setting(
    settings,
    "meta_description",
    "Situs resmi Keuskupan Agung ROBLOX.",
  );
  return {
    title: {
      default: `${name} — Ut Unum Sint`,
      template: `%s · ${name}`,
    },
    description,
    icons: {
      icon: "/icon.svg",
    },
    openGraph: {
      title: `${name} — Ut Unum Sint`,
      description,
      type: "website",
      locale: "id_ID",
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#4a1620",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
