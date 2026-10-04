import PageShell from "@/components/PageShell";
import { CONTACT } from "@/lib/config";

export const metadata = { title: "Support" };

export default function SupportPage() {
  return (
    <PageShell
      title="Support"
      subtitle="Questions? We reply fast."
    >
      <div className="card">
        <p className="muted" style={{ margin: 0 }}>
          WeChat: {CONTACT.wechat.id} — {CONTACT.wechat.responseTime}
        </p>
        <p className="muted" style={{ margin: "0.5rem 0 0" }}>
          WhatsApp: {CONTACT.whatsapp.id}
        </p>
        <p className="muted" style={{ margin: "0.5rem 0 0" }}>
          Email: {CONTACT.email}
        </p>
      </div>
    </PageShell>
  );
}
