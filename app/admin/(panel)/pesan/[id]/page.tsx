import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CheckCheck,
  CornerUpLeft,
  Mail,
  MailOpen,
  Phone,
  Send,
  Trash2,
} from "lucide-react";
import { hasPermission, requireAdmin } from "@/lib/auth";
import { getMessageById } from "@/lib/admin-data";
import {
  deleteMessageAction,
  updateMessageStatusAction,
} from "@/lib/actions/messages";
import { formatDateTimeID } from "@/lib/utils";
import { AdminPageHeader, InfoRow, Panel, StatusBadge } from "@/components/admin/ui";
import { DeleteButton } from "@/components/admin/ConfirmSubmitButton";

export const dynamic = "force-dynamic";

export default async function MessageDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireAdmin("messages.view");
  const message = getMessageById(id);
  if (!message) notFound();
  const canManage = hasPermission(user, "messages.manage");
  const mailto = `mailto:${message.email}?subject=${encodeURIComponent(
    `Re: ${message.subject}`,
  )}`;

  return (
    <>
      <AdminPageHeader
        eyebrow="Interaksi"
        title="Detail pesan"
        description="Baca pesan umat dan tindak lanjuti dengan penuh perhatian."
        action={
          <Link
            href="/admin/pesan"
            className="inline-flex items-center gap-2 border border-stone-300 bg-white px-4 py-2.5 text-[9px] font-extrabold uppercase tracking-[0.12em] text-stone-600 transition hover:border-gold-500 hover:text-wine-900"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Kembali
          </Link>
        }
      />

      <div className="grid gap-5 xl:grid-cols-[1fr_330px]">
        <div className="space-y-5">
          <Panel
            title={message.subject}
            description={`Dikirim ${formatDateTimeID(message.created_at)}`}
            action={<StatusBadge status={message.status} />}
          >
            <div className="mb-5 flex flex-wrap items-center gap-3 border-b border-stone-100 pb-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-wine-900 font-display text-sm text-gold-200">
                {message.name
                  .split(" ")
                  .filter(Boolean)
                  .slice(0, 2)
                  .map((part) => part[0])
                  .join("")
                  .toUpperCase()}
              </span>
              <div className="min-w-0">
                <p className="text-[12px] font-bold text-wine-950">
                  {message.name}
                </p>
                <a
                  href={`mailto:${message.email}`}
                  className="mt-0.5 flex items-center gap-1 text-[10px] text-stone-500 transition hover:text-wine-900"
                >
                  <Mail className="h-3 w-3 text-gold-600" />
                  {message.email}
                </a>
              </div>
            </div>
            <div className="whitespace-pre-line text-[12px] leading-7 text-stone-700">
              {message.message}
            </div>
          </Panel>

          {canManage && (
            <Panel title="Tindak lanjut">
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <form action={updateMessageStatusAction}>
                  <input type="hidden" name="id" value={message.id} />
                  <input type="hidden" name="status" value="read" />
                  <button
                    type="submit"
                    disabled={message.status === "read"}
                    className="inline-flex items-center gap-2 border border-stone-300 bg-white px-4 py-2.5 text-[9px] font-extrabold uppercase tracking-[0.12em] text-stone-600 transition hover:border-gold-500 hover:text-wine-900 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <MailOpen className="h-3.5 w-3.5" /> Tandai dibaca
                  </button>
                </form>
                <form action={updateMessageStatusAction}>
                  <input type="hidden" name="id" value={message.id} />
                  <input type="hidden" name="status" value="replied" />
                  <button
                    type="submit"
                    disabled={message.status === "replied"}
                    className="inline-flex items-center gap-2 border border-emerald-300 bg-emerald-50 px-4 py-2.5 text-[9px] font-extrabold uppercase tracking-[0.12em] text-emerald-700 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <CheckCheck className="h-3.5 w-3.5" /> Tandai dibalas
                  </button>
                </form>
                <form action={updateMessageStatusAction}>
                  <input type="hidden" name="id" value={message.id} />
                  <input type="hidden" name="status" value="new" />
                  <button
                    type="submit"
                    disabled={message.status === "new"}
                    className="inline-flex items-center gap-2 border border-stone-300 bg-white px-4 py-2.5 text-[9px] font-extrabold uppercase tracking-[0.12em] text-stone-500 transition hover:border-wine-300 hover:text-wine-900 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <CornerUpLeft className="h-3.5 w-3.5" /> Tandai baru
                  </button>
                </form>
              </div>
              <p className="mt-4 text-[9px] leading-4 text-stone-400">
                Status pesan membantu pengurus memantau pesan yang belum
                ditindaklanjuti. Tindakan ini tercatat di log aktivitas.
              </p>
            </Panel>
          )}
        </div>

        <div className="space-y-5">
          <Panel title="Kontak pengirim">
            <dl className="space-y-0">
              <InfoRow label="Nama" value={message.name} />
              <InfoRow
                label="Email"
                value={
                  <a
                    href={`mailto:${message.email}`}
                    className="text-wine-800 underline decoration-gold-400 underline-offset-2"
                  >
                    {message.email}
                  </a>
                }
              />
              <InfoRow
                label="Telepon"
                value={
                  message.phone ? (
                    <a
                      href={`tel:${message.phone.replace(/\s+/g, "")}`}
                      className="inline-flex items-center gap-1 text-wine-800"
                    >
                      <Phone className="h-3 w-3 text-gold-600" />
                      {message.phone}
                    </a>
                  ) : (
                    "—"
                  )
                }
              />
              <InfoRow
                label="Diterima"
                value={formatDateTimeID(message.created_at)}
              />
              <InfoRow
                label="Status"
                value={<StatusBadge status={message.status} />}
              />
            </dl>
          </Panel>

          <div className="admin-card space-y-3 p-5">
            <a
              href={mailto}
              className="flex w-full items-center justify-center gap-2 bg-wine-900 px-4 py-3 text-[9px] font-extrabold uppercase tracking-[0.13em] text-white transition hover:bg-wine-950"
            >
              <Send className="h-3.5 w-3.5" /> Balas via email
            </a>
            {canManage && (
              <form action={deleteMessageAction}>
                <input type="hidden" name="id" value={message.id} />
                <DeleteButton
                  message={`Hapus pesan dari “${message.name}” secara permanen?`}
                />
              </form>
            )}
            <p className="flex items-start gap-1.5 pt-1 text-[9px] leading-4 text-stone-400">
              <Trash2 className="mt-0.5 h-3 w-3 shrink-0" />
              Pesan yang dihapus tidak dapat dipulihkan.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
