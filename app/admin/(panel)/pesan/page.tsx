import Link from "next/link";
import {
  ArrowUpRight,
  Inbox,
  Mail,
  MailOpen,
  MessageSquare,
  Phone,
} from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { getMessages } from "@/lib/admin-data";
import { formatDateTimeID, timeAgo } from "@/lib/utils";
import {
  AdminPageHeader,
  EmptyState,
  SearchBox,
  StatusBadge,
} from "@/components/admin/ui";

export const dynamic = "force-dynamic";

export default async function AdminMessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  await requireAdmin("messages.view");
  const { q, status } = await searchParams;
  const all = getMessages();
  const keyword = (q || "").toLowerCase();
  const searched = keyword
    ? all.filter((item) =>
        `${item.name} ${item.email} ${item.subject} ${item.message}`
          .toLowerCase()
          .includes(keyword),
      )
    : all;
  const filtered =
    status && status !== "semua"
      ? searched.filter((item) => item.status === status)
      : searched;

  const counts = {
    semua: all.length,
    new: all.filter((item) => item.status === "new").length,
    read: all.filter((item) => item.status === "read").length,
    replied: all.filter((item) => item.status === "replied").length,
  };

  return (
    <>
      <AdminPageHeader
        eyebrow="Interaksi"
        title="Pesan Umat"
        description="Pesan yang dikirim melalui formulir kontak situs. Tindak lanjuti dengan doa, jawaban, atau pendampingan yang sesuai."
      />

      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {[
            { key: "semua", label: "Semua" },
            { key: "new", label: "Baru" },
            { key: "read", label: "Dibaca" },
            { key: "replied", label: "Dibalas" },
          ].map((item) => {
            const active = (status || "semua") === item.key;
            const params = new URLSearchParams();
            if (q) params.set("q", q);
            if (item.key !== "semua") params.set("status", item.key);
            const href = params.toString()
              ? `/admin/pesan?${params.toString()}`
              : "/admin/pesan";
            return (
              <Link
                key={item.key}
                href={href}
                className={`border px-3.5 py-2 text-[9px] font-extrabold uppercase tracking-[0.11em] transition ${
                  active
                    ? "border-wine-900 bg-wine-900 text-white"
                    : "border-stone-300 bg-white text-stone-500 hover:border-stone-400 hover:text-wine-900"
                }`}
              >
                {item.label} ({counts[item.key as keyof typeof counts]})
              </Link>
            );
          })}
        </div>
        <SearchBox
          action="/admin/pesan"
          defaultValue={q}
          placeholder="Cari nama, email, atau isi pesan..."
          hidden={{ status }}
        />
      </div>

      <div className="admin-card overflow-hidden">
        {filtered.length ? (
          <div className="divide-y divide-stone-100">
            {filtered.map((message) => (
              <Link
                key={message.id}
                href={`/admin/pesan/${message.id}`}
                className={`group flex flex-col gap-3 px-5 py-4 transition hover:bg-cream/45 sm:flex-row sm:items-center ${
                  message.status === "new" ? "bg-gold-50/35" : ""
                }`}
              >
                <div className="flex min-w-0 flex-1 items-start gap-3">
                  <span
                    className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                      message.status === "new"
                        ? "bg-wine-900 text-gold-200"
                        : "bg-stone-100 text-stone-500"
                    }`}
                  >
                    {message.status === "new" ? (
                      <Mail className="h-3.5 w-3.5" />
                    ) : (
                      <MailOpen className="h-3.5 w-3.5" />
                    )}
                  </span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <p className="text-[11px] font-bold text-wine-950">
                        {message.name}
                      </p>
                      <span className="text-[8px] font-semibold text-stone-400">
                        {message.email}
                      </span>
                      {message.phone && (
                        <span className="flex items-center gap-1 text-[8px] text-stone-400">
                          <Phone className="h-2.5 w-2.5" />
                          {message.phone}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 truncate font-display text-[15px] font-semibold leading-snug text-wine-950">
                      {message.subject}
                    </p>
                    <p className="mt-0.5 line-clamp-1 text-[10px] leading-4 text-stone-500">
                      {message.message}
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-3 pl-12 sm:flex-col sm:items-end sm:gap-1.5 sm:pl-0">
                  <StatusBadge status={message.status} />
                  <p className="text-[8px] font-semibold text-stone-400">
                    {timeAgo(message.created_at)}
                  </p>
                  <p className="hidden text-[8px] text-stone-300 lg:block">
                    {formatDateTimeID(message.created_at)}
                  </p>
                </div>
                <ArrowUpRight className="hidden h-4 w-4 shrink-0 text-stone-300 transition group-hover:text-gold-600 sm:block" />
              </Link>
            ))}
          </div>
        ) : (
          <div className="p-5">
            <EmptyState
              icon={<Inbox className="h-5 w-5" />}
              title="Tidak ada pesan ditemukan"
              description="Pesan dari formulir kontak akan muncul di sini. Coba ubah filter status atau kata kunci."
            />
          </div>
        )}
      </div>

      <p className="mt-4 flex items-center gap-2 text-[9px] font-semibold text-stone-400">
        <MessageSquare className="h-3 w-3" />
        Pesan yang belum ditindaklanjuti ditandai sebagai “Baru”.
      </p>
    </>
  );
}
