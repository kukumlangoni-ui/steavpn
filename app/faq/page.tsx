import PageShell from '@/components/PageShell';
import { PLANS, formatCNY, formatTZS } from '@/lib/config';

export const metadata = { title: 'FAQ' };

const gettingStarted = [
  {
    q: 'What is STEA VPN?',
    a: 'STEA VPN is a private VPN service that lets you browse the internet securely and access websites and apps that may be blocked where you are. You get a personal subscription link that works with popular VPN apps on iPhone, Android, Windows, Mac, and Linux.',
  },
  {
    q: 'Which countries does it work in?',
    a: 'It works in every country. That\u2019s the whole point \u2014 VPN without borders. If you\u2019re somewhere with a strict internet firewall, our setup guide walks you through exactly which app to install and how to connect.',
  },
  {
    q: 'Which devices can I use it on?',
    a: 'iPhone, iPad, Android phones and tablets, Windows PCs, Macs, and Linux. One subscription works on as many devices as you want. No device limits.',
  },
  {
    q: 'Do I need to install an app?',
    a: 'Yes \u2014 a VPN app is how you connect. On iPhone we recommend Clash Lite. On Android it\u2019s FlClash. On Windows, Mac, and Linux it\u2019s Clash Verge Rev. Our guide walks you through every step with the correct download link for your device. Visit the Guide page.',
  },
  {
    q: 'Do I need to create an account or sign up?',
    a: 'No account. No signup. No password to remember. You pay once, we send you a private subscription link, and you paste that link into your VPN app. That\u2019s it.',
  },
];

const paymentAndSetup = [
  {
    q: 'How much does it cost?',
    a: `Three plans:\n\u2022 ${PLANS[0].name} \u2014 ${formatCNY(PLANS[0].cny)} or ${formatTZS(PLANS[0].tzs)}\n\u2022 ${PLANS[1].name} \u2014 ${formatCNY(PLANS[1].cny)} or ${formatTZS(PLANS[1].tzs)} (most popular)\n\u2022 ${PLANS[2].name} \u2014 ${formatCNY(PLANS[2].cny)} or ${formatTZS(PLANS[2].tzs)}\nPrices are one-time per plan. No automatic renewal. See the Pricing page for details.`,
  },
  {
    q: 'How do I pay?',
    a: `Three options:\n\u2022 WeChat Pay \u2014 scan our QR code or add our WeChat ID\n\u2022 Bank transfer \u2014 send to our Tanzanian bank account (Selcom Microfinance Bank, details on the pay page)\n\u2022 Alipay \u2014 scan our QR code\nAfter paying, send us a screenshot on WeChat or WhatsApp and we\u2019ll activate you.`,
  },
  {
    q: 'How fast will I get my subscription link?',
    a: 'Within 30 minutes during business hours (8am\u201311pm EAT). Usually much faster \u2014 often a few minutes. If it\u2019s been longer than an hour and you haven\u2019t heard back, message us again on WeChat.',
  },
  {
    q: 'What if I don\u2019t know how to install a VPN app?',
    a: 'We\u2019ll walk you through it. Open the Guide page, pick your device, and follow the numbered steps. If you get stuck, message us on WeChat with a screenshot of the screen you\u2019re on. We\u2019ll help you through it.',
  },
  {
    q: 'Can I share my subscription link with friends?',
    a: 'No. Each link is for one customer. Sharing it or reselling it may cause it to be suspended. If you want to buy a plan for someone else, message us and we\u2019ll set them up separately.',
  },
];

const usingService = [
  {
    q: 'My VPN stopped working. What do I do?',
    a: 'First, try restarting the app and disconnecting/reconnecting. If that doesn\u2019t work, message us on WeChat with:\n\u2022 A screenshot of the error\n\u2022 Your device type\nWe\u2019ll send you a fresh link or help you troubleshoot.',
  },
  {
    q: 'Do you keep logs of what I browse?',
    a: 'No. We don\u2019t log the websites you visit, the apps you use, or your traffic. The VPN service itself is provided by our upstream partner and is built to be privacy-preserving.',
  },
  {
    q: 'Do you offer refunds?',
    a: 'If you can\u2019t connect within the first 24 hours after purchase, message us and we\u2019ll either help you get it working or refund you. After 24 hours, refunds are at our discretion. Full terms on the Terms page.',
  },
  {
    q: 'How do I renew when my plan expires?',
    a: 'You\u2019ll get a reminder from us before your plan ends. To renew, pay the same way you paid the first time, send us the payment screenshot, and we\u2019ll extend your subscription. If you don\u2019t renew, your link stops working at the expiry date.',
  },
  {
    q: 'Can I change my plan mid-subscription?',
    a: 'Yes. Message us on WeChat. If you\u2019re upgrading, we\u2019ll credit the unused portion of your current plan toward the new one.',
  },
];

function FaqSection({ title, items }: { title: string; items: { q: string; a: string }[] }) {
  return (
    <section style={{ marginBottom: '2.5rem' }}>
      <h2
        style={{
          fontSize: '0.8rem',
          fontWeight: 700,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: '#f59e0b',
          margin: '0 0 1rem',
        }}
      >
        {title}
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {items.map((item, i) => (
          <details
            key={i}
            className="faq-item"
            style={{
              background: 'var(--surface, #111)',
              border: '1px solid var(--border, #1f1f1f)',
              borderRadius: 12,
              overflow: 'hidden',
            }}
          >
            <summary
              style={{
                padding: '1.1rem 1.25rem',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.95rem',
                listStyle: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem',
                userSelect: 'none',
              }}
            >
              <span>{item.q}</span>
              <span
                className="faq-arrow"
                style={{
                  flexShrink: 0,
                  width: 20,
                  height: 20,
                  color: 'var(--text-muted)',
                  transition: 'transform 0.2s ease',
                  fontSize: '0.9rem',
                  textAlign: 'center',
                  lineHeight: '20px',
                }}
              >
                +
              </span>
            </summary>
            <div
              style={{
                padding: '0 1.25rem 1.25rem',
                color: 'var(--text-muted, #a1a1aa)',
                lineHeight: 1.65,
                fontSize: '0.95rem',
              }}
            >
              {item.a.split('\n').map((line, j) => (
                <p key={j} style={{ margin: j === 0 ? 0 : '0.5rem 0 0' }}>{line}</p>
              ))}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}

export default function FaqPage() {
  return (
    <PageShell
      title="Frequently Asked Questions"
      subtitle="Everything you need to know about STEA VPN."
    >
      <style>{`
        .faq-item summary::-webkit-details-marker {
          display: none;
        }
        .faq-item[open] .faq-arrow {
          transform: rotate(45deg);
          color: #f59e0b;
        }
        .faq-item[open] summary {
          border-bottom: 1px solid var(--border, #1f1f1f);
        }
        .faq-bottom {
          margin-top: 3rem;
          padding: 2rem;
          background: rgba(245, 158, 11, 0.06);
          border: 1px solid rgba(245, 158, 11, 0.25);
          border-radius: 14px;
          text-align: center;
        }
        .faq-bottom p {
          margin: 0 0 1rem;
          font-size: 1.05rem;
        }
        .faq-bottom a {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }
      `}</style>

      <FaqSection title="Getting started" items={gettingStarted} />
      <FaqSection title="Payment and setup" items={paymentAndSetup} />
      <FaqSection title="Using the service" items={usingService} />

      <div className="faq-bottom">
        <p>Still have a question?</p>
        <a href="/support" className="btn-primary">
          Message us on WeChat →
        </a>
      </div>
    </PageShell>
  );
}
