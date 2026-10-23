import { getCurrentUser } from "@/lib/auth";
import { getActiveAnnouncements, getSettings } from "@/lib/content";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";

export const dynamic = "force-dynamic";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, settings, announcements] = await Promise.all([
    getCurrentUser(),
    Promise.resolve(getSettings()),
    Promise.resolve(getActiveAnnouncements()),
  ]);

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#konten"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:bg-wine-900 focus:px-4 focus:py-2 focus:text-white"
      >
        Lewati ke konten
      </a>
      <SiteHeader
        settings={settings}
        isAdmin={Boolean(user)}
        announcement={
          announcements[0]
            ? {
                title: announcements[0].title,
                message: announcements[0].message,
                tone: announcements[0].tone,
              }
            : null
        }
      />
      <main id="konten" className="flex-1">
        {children}
      </main>
      <SiteFooter settings={settings} />
    </div>
  );
}
