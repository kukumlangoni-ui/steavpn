import PageShell from '@/components/PageShell';
import CopyButton from '@/components/CopyButton';
import { CONTACT } from '@/lib/config';

export const metadata = { title: 'Contact' };

export default function SupportPage() {
  return (
    <PageShell
      title="Get in touch"
      subtitle="We reply fast. Choose whichever channel works for you."
    >
      <style>{`
        .contact-cards {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.25rem;
          margin-bottom: 2rem;
        }
        @media (max-width: 640px) {
          .contact-cards { grid-template-columns: 1fr; }
        }
        .contact-card {
          padding: 2rem;
          background: var(--surface, #111);
          border: 1px solid var(--border, #1f1f1f);
          border-radius: 16px;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .contact-card.primary {
          border-color: rgba(245, 158, 11, 0.3);
          background: rgba(245, 158, 11, 0.03);
        }
        .contact-icon {
          font-size: 2rem;
          line-height: 1;
        }
        .contact-card h2 {
          font-size: 1.35rem;
          font-weight: 700;
          margin: 0;
        }
        .contact-card h2 .tag {
          font-size: 0.75rem;
          font-weight: 500;
          color: #f59e0b;
          background: rgba(245, 158, 11, 0.12);
          padding: '0.2rem 0.6rem';
          border-radius: 999px;
          margin-left: 0.5rem;
          vertical-align: middle;
        }
        .contact-desc {
          color: var(--text-muted, #a1a1aa);
          line-height: 1.6;
          margin: 0;
          font-size: 0.95rem;
        }
        .contact-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          padding: 0.9rem 1rem;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--border, #1f1f1f);
          border-radius: 10px;
          font-family: ui-monospace, Menlo, monospace;
          font-size: 0.9rem;
        }
        .contact-actions {
          display: flex;
          gap: 0.75rem;
          margin-top: 0.5rem;
        }
        .contact-actions .btn-primary,
        .contact-actions .btn-secondary {
          flex: 1;
          justify-content: center;
          min-height: 48px;
        }
        .email-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          color: var(--text-muted, #a1a1aa);
          font-size: 0.95rem;
          margin-bottom: 2rem;
        }
        .email-row a {
          color: var(--accent-1);
          text-decoration: none;
          font-weight: 500;
        }
        .email-row a:hover { text-decoration: underline; }

        .info-card {
          padding: 1.5rem 1.75rem;
          background: var(--surface, #111);
          border: 1px solid var(--border, #1f1f1f);
          border-radius: 14px;
          margin-bottom: 2.5rem;
        }
        .info-card h3 {
          font-size: 1rem;
          font-weight: 600;
          margin: 0 0 0.75rem;
        }
        .info-card ul {
          margin: 0;
          padding: 0;
          list-style: none;
          color: var(--text-muted, #a1a1aa);
          line-height: 1.8;
          font-size: 0.95rem;
        }
        .info-card li::before {
          content: '•';
          color: #f59e0b;
          font-weight: 700;
          margin-right: 0.75rem;
        }

        .bottom-cta {
          text-align: center;
          padding: 2rem;
          background: rgba(245, 158, 11, 0.06);
          border: 1px solid rgba(245, 158, 11, 0.25);
          border-radius: 14px;
        }
        .bottom-cta p {
          margin: 0 0 1rem;
          font-size: 1.05rem;
        }
      `}</style>

      {/* Two CTA cards */}
      <div className="contact-cards">
        {/* WeChat */}
        <div className="contact-card primary">
          <div className="contact-icon">💬</div>
          <h2>
            WeChat
            <span className="tag" style={{ fontSize: '0.75rem', fontWeight: 500, color: '#f59e0b', background: 'rgba(245,158,11,0.12)', padding: '0.2rem 0.6rem', borderRadius: 999, marginLeft: '0.5rem', verticalAlign: 'middle' }}>recommended</span>
          </h2>
          <p className="contact-desc">
            Chat with us on WeChat for instant help.<br />
            Usual reply time: 30 minutes, 8am–11pm EAT
          </p>
          <div className="contact-row">
            <span>{CONTACT.wechat.id}</span>
            <CopyButton text={CONTACT.wechat.id} />
          </div>
          <div className="contact-actions">
            <a
              href={CONTACT.wechat.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              style={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}
            >
              Open WeChat
            </a>
          </div>
        </div>

        {/* WhatsApp */}
        <div className="contact-card">
          <div className="contact-icon">📱</div>
          <h2>WhatsApp</h2>
          <p className="contact-desc">
            Prefer WhatsApp? Message us directly.
          </p>
          <div className="contact-row">
            <span>{CONTACT.whatsapp.id}</span>
            <CopyButton text={CONTACT.whatsapp.id} />
          </div>
          <div className="contact-actions">
            <a
              href={CONTACT.whatsapp.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
              style={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}
            >
              Open WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* Email row */}
      <div className="email-row">
        Prefer email? →
        <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
      </div>

      {/* Response expectations */}
      <div className="info-card">
        <h3>When you message us, please include:</h3>
        <ul>
          <li>Your device (iPhone, Android, Windows, Mac)</li>
          <li>The plan you bought</li>
          <li>A screenshot of your payment (if it&apos;s about activation)</li>
        </ul>
        <p style={{ color: 'var(--text-muted, #a1a1aa)', fontSize: '0.9rem', margin: '0.75rem 0 0' }}>
          This helps us help you faster.
        </p>
      </div>

      {/* Bottom CTA */}
      <div className="bottom-cta">
        <p>Ready to buy?</p>
        <a href="/pricing" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
          See pricing →
        </a>
      </div>
    </PageShell>
  );
}
