'use client';

import { useState, useEffect, useRef } from 'react';
import { PLANS, BANK, CONTACT, SITE, CurrencyCode, CURRENCIES, formatPrice, getPlanPrice } from '@/lib/config';
import CopyButton from '@/components/CopyButton';
import CurrencyToggle from '@/components/CurrencyToggle';

export default function PricingPage() {
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [currency, setCurrency] = useState<CurrencyCode>('cny');
  const [payment, setPayment] = useState<{
    wechat_id: string;
    whatsapp: string;
    email: string;
    alipay_id: string | null;
    bank_name: string;
    bank_account_name: string;
    bank_account_number: string;
    wechat_qr_url: string | null;
    alipay_qr_url: string | null;
  } | null>(null);

  const paySectionRef = useRef<HTMLElement>(null);

  // Fetch payment settings on mount
  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    fetch(`${SITE.apiBase}/api/payment-settings`, {
      cache: 'no-store',
      signal: controller.signal,
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.settings) {
          setPayment(d.settings);
        } else {
          throw new Error('no settings');
        }
      })
      .catch(() => {
        // Fall back to static config so the section still works
        setPayment({
          wechat_id: CONTACT.wechat.id,
          whatsapp: CONTACT.whatsapp.id,
          email: CONTACT.email,
          alipay_id: null,
          bank_name: BANK.bankName,
          bank_account_name: BANK.accountName,
          bank_account_number: BANK.accountNumber,
          wechat_qr_url: null,
          alipay_qr_url: null,
        });
      })
      .finally(() => clearTimeout(timeoutId));

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, []);

  // Scroll + pulse when a plan is selected (after the section renders)
  useEffect(() => {
    if (selectedPlanId && paySectionRef.current) {
      requestAnimationFrame(() => {
        const el = paySectionRef.current;
        if (!el) return;
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        el.classList.add('pulse');
        setTimeout(() => el.classList.remove('pulse'), 1700);
      });
    }
  }, [selectedPlanId]);

  function handleChoosePlan(planId: string) {
    setSelectedPlanId(planId);
  }

  const selectedPlan = selectedPlanId
    ? PLANS.find((p) => p.id === selectedPlanId)
    : null;

  return (
    <div
      className="container"
      style={{ padding: '4rem 1.25rem 6rem', maxWidth: 1000 }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1
          style={{
            fontSize: 'clamp(1.75rem, 5vw, 2.5rem)',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            marginBottom: '0.75rem',
          }}
        >
          Choose Your Plan
        </h1>
        <p
          style={{
            color: 'var(--text-muted)',
            fontSize: '1.05rem',
            lineHeight: 1.6,
            maxWidth: 520,
            margin: '0 auto',
          }}
        >
          Pay once. Connect for the full period.
        </p>
      </div>

      {/* Currency toggle */}
      <CurrencyToggle value={currency} onChange={setCurrency} />

      {/* Plan cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.5rem',
          marginBottom: '3rem',
        }}
      >
        {PLANS.map((plan) => {
          const isPopular = plan.popular;
          return (
            <div
              key={plan.id}
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                ...(isPopular
                  ? {
                      borderColor: 'var(--accent-1)',
                      boxShadow: '0 0 0 1px var(--accent-1)',
                    }
                  : {}),
              }}
            >
              {isPopular && (
                <div
                  style={{
                    position: 'absolute',
                    top: -12,
                    left: '50%',
                    transform: 'translateX(-50%)',
                  }}
                >
                  <span className="badge-popular">Most Popular</span>
                </div>
              )}

              <div style={{ marginBottom: '1rem' }}>
                <div
                  style={{
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    marginBottom: '0.25rem',
                  }}
                >
                  {plan.name}
                </div>
                <div className="muted" style={{ fontSize: '0.9rem' }}>
                  {plan.duration}
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <div
                  style={{
                    fontSize: '2.5rem',
                    fontWeight: 800,
                    letterSpacing: '-0.02em',
                    lineHeight: 1,
                  }}
                >
                  {formatPrice(getPlanPrice(plan, currency), currency)}
                </div>
                <div
                  className="muted plan-currencies"
                  style={{
                    fontSize: '0.85rem',
                    marginTop: '0.375rem',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    gap: '0.35rem 0.5rem',
                    color: 'rgba(255,255,255,0.62)',
                  }}
                >
                  {CURRENCIES
                    .filter((c) => c.code !== currency)
                    .map((c, i, arr) => (
                      <span key={c.code} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span>{formatPrice(getPlanPrice(plan, c.code), c.code)}</span>
                        {i < arr.length - 1 && <span className="separator" style={{ opacity: 0.4 }}>·</span>}
                      </span>
                    ))}
                </div>
                <div
                  style={{
                    fontSize: '0.7rem',
                    color: 'rgba(255,255,255,0.4)',
                    marginTop: '0.4rem',
                  }}
                >
                  per plan · one-time payment
                </div>
              </div>

              <ul
                style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: '0 0 1.5rem 0',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.6rem',
                  flex: 1,
                }}
              >
                {plan.perks.map((perk, i) => (
                  <li
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.6rem',
                      fontSize: '0.92rem',
                      lineHeight: 1.5,
                    }}
                  >
                    <span
                      style={{
                        color: 'var(--accent-1)',
                        fontWeight: 700,
                        flexShrink: 0,
                        marginTop: 1,
                      }}
                    >
                      ✓
                    </span>
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={() => handleChoosePlan(plan.id)}
                className={isPopular ? 'btn-primary' : 'btn-secondary'}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  cursor: 'pointer',
                }}
              >
                Choose this plan
              </button>
            </div>
          );
        })}
      </div>

      {/* Hint — visible only before a plan is selected */}
      {!selectedPlanId && (
        <p
          style={{
            marginTop: '3rem',
            textAlign: 'center',
            fontSize: '0.95rem',
            color: 'var(--text-muted)',
            lineHeight: 1.6,
          }}
        >
          Select a plan above to see payment options — we accept WeChat,
          Alipay, and Tanzanian bank transfer.
        </p>
      )}

      {/* How to pay section — visible only after a plan is selected */}
      {selectedPlanId && selectedPlan && (
        <section
          ref={paySectionRef}
          id="how-to-pay"
          style={{
            marginTop: '5rem',
            padding: '2.5rem',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 20,
          }}
        >
          {/* Selected plan banner */}
          <div
            style={{
              marginBottom: '2rem',
              padding: '1rem 1.25rem',
              background: 'rgba(245,158,11,0.12)',
              border: '1px solid rgba(245,158,11,0.35)',
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              flexWrap: 'wrap',
            }}
          >
            <div>
              <div
                style={{
                  fontSize: '0.8rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: '#f59e0b',
                  fontWeight: 600,
                  marginBottom: '0.25rem',
                }}
              >
                You selected
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                  {selectedPlan.name}
                </div>
                <div
                  style={{
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    color: 'rgba(255,255,255,0.85)',
                  }}
                >
                  {formatPrice(getPlanPrice(selectedPlan, currency), currency)} · {selectedPlan.duration}
                </div>
                <div
                  style={{
                    fontSize: '0.85rem',
                    color: 'rgba(255,255,255,0.6)',
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '0.35rem 0.5rem',
                    marginTop: '0.15rem',
                  }}
                >
                  {CURRENCIES
                    .filter((c) => c.code !== currency)
                    .map((c, i, arr) => (
                      <span key={c.code} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span>{formatPrice(getPlanPrice(selectedPlan, c.code), c.code)}</span>
                        {i < arr.length - 1 && <span style={{ opacity: 0.4 }}>·</span>}
                      </span>
                    ))}
                </div>
              </div>
            </div>
            <div
              style={{
                fontSize: '0.9rem',
                color: 'var(--text-muted)',
              }}
            >
              Pay using any method below, then send us a screenshot.
            </div>
          </div>

          <h2
            style={{
              fontSize: '2rem',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              margin: '0 0 0.75rem',
            }}
          >
            How to pay
          </h2>
          <p
            style={{
              color: 'var(--text-muted)',
              margin: '0 0 2.5rem',
              fontSize: '1.05rem',
              maxWidth: 640,
              lineHeight: 1.6,
            }}
          >
            After paying, screenshot your confirmation and send it to us on
            WeChat or WhatsApp. We&apos;ll reply with your subscription link
            within 30 minutes.
          </p>

          {/* Payment methods grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {/* WeChat Pay */}
            <div
              style={{
                padding: '1.5rem',
                background: 'var(--surface-2)',
                border: '1px solid var(--border)',
                borderRadius: 14,
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  marginBottom: '1rem',
                }}
              >
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>
                  WeChat Pay
                </h3>
                <span
                  style={{
                    fontSize: '0.7rem',
                    background: 'rgba(245,158,11,0.15)',
                    color: '#f59e0b',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '6px',
                    fontWeight: 700,
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                  }}
                >
                  Recommended
                </span>
              </div>

              {payment?.wechat_qr_url ? (
                <img
                  src={`${SITE.apiBase}${payment.wechat_qr_url}`}
                  alt="WeChat QR code"
                  width={220}
                  height={220}
                  loading="eager"
                  style={{
                    display: 'block',
                    width: 220,
                    height: 220,
                    maxWidth: '100%',
                    background: '#fff',
                    borderRadius: 12,
                    margin: '0 auto 1rem',
                    padding: 8,
                  }}
                />
              ) : (
                <div
                  style={{
                    width: 220,
                    height: 220,
                    maxWidth: '100%',
                    background: 'var(--surface)',
                    borderRadius: 12,
                    margin: '0 auto 1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text-muted)',
                    fontSize: '0.85rem',
                  }}
                >
                  Loading QR…
                </div>
              )}

              <p
                style={{
                  margin: '0 0 0.5rem',
                  fontSize: '0.9rem',
                  color: 'var(--text-muted)',
                }}
              >
                Open WeChat and scan, or add us directly:
              </p>
              <div
                style={{
                  display: 'flex',
                  gap: '0.5rem',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <code style={{ fontSize: '0.95rem', fontWeight: 600 }}>
                  {payment?.wechat_id ?? CONTACT.wechat.id}
                </code>
                <CopyButton text={payment?.wechat_id ?? CONTACT.wechat.id} />
              </div>
            </div>

            {/* Bank Transfer */}
            <div
              style={{
                padding: '1.5rem',
                background: 'var(--surface-2)',
                border: '1px solid var(--border)',
                borderRadius: 14,
              }}
            >
              <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.1rem', fontWeight: 700 }}>
                Bank Transfer
              </h3>
              <p
                style={{
                  margin: '0 0 1rem',
                  fontSize: '0.85rem',
                  color: 'var(--text-muted)',
                }}
              >
                Tanzania — Selcom Microfinance
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                <div>
                  <div
                    style={{
                      fontSize: '0.75rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      color: 'var(--text-muted)',
                      marginBottom: '0.3rem',
                    }}
                  >
                    Bank
                  </div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 600 }}>
                    {payment?.bank_name ?? BANK.bankName}
                  </div>
                </div>

                <div>
                  <div
                    style={{
                      fontSize: '0.75rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      color: 'var(--text-muted)',
                      marginBottom: '0.3rem',
                    }}
                  >
                    Account name
                  </div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 600 }}>
                    {payment?.bank_account_name ?? BANK.accountName}
                  </div>
                </div>

                <div>
                  <div
                    style={{
                      fontSize: '0.75rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      color: 'var(--text-muted)',
                      marginBottom: '0.3rem',
                    }}
                  >
                    Account number
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      gap: '0.5rem',
                      alignItems: 'center',
                    }}
                  >
                    <code
                      style={{ fontSize: '0.95rem', fontWeight: 700, letterSpacing: '0.02em' }}
                    >
                      {payment?.bank_account_number ?? BANK.accountNumber}
                    </code>
                    <CopyButton
                      text={payment?.bank_account_number ?? BANK.accountNumber}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Alipay */}
            <div
              style={{
                padding: '1.5rem',
                background: 'var(--surface-2)',
                border: '1px solid var(--border)',
                borderRadius: 14,
                textAlign: 'center',
              }}
            >
              <h3 style={{ margin: '0 0 1rem', fontSize: '1.1rem', fontWeight: 700 }}>
                Alipay
              </h3>

              {payment?.alipay_qr_url ? (
                <img
                  src={`${SITE.apiBase}${payment.alipay_qr_url}`}
                  alt="Alipay QR code"
                  width={220}
                  height={220}
                  loading="eager"
                  style={{
                    display: 'block',
                    width: 220,
                    height: 220,
                    maxWidth: '100%',
                    background: '#fff',
                    borderRadius: 12,
                    margin: '0 auto 1rem',
                    padding: 8,
                  }}
                />
              ) : (
                <div
                  style={{
                    width: 220,
                    height: 220,
                    maxWidth: '100%',
                    background: 'var(--surface)',
                    borderRadius: 12,
                    margin: '0 auto 1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text-muted)',
                    fontSize: '0.85rem',
                  }}
                >
                  Loading QR…
                </div>
              )}

              <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Scan with Alipay to pay
              </p>
            </div>
          </div>

          {/* Send screenshot CTAs */}
          <div
            style={{
              marginTop: '2.5rem',
              paddingTop: '2rem',
              borderTop: '1px solid var(--border)',
            }}
          >
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0 0 1rem' }}>
              Paid? Send us your screenshot
            </h3>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <a
                href={CONTACT.whatsapp.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                style={{ textDecoration: 'none' }}
              >
                Send on WhatsApp
              </a>
              <a
                href={CONTACT.wechat.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
                style={{ textDecoration: 'none' }}
              >
                Send on WeChat
              </a>
            </div>
          </div>
        </section>
      )}

      <style>{`
        @keyframes payReveal {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        #how-to-pay {
          animation: payReveal 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
          scroll-margin-top: 88px;
        }
        #how-to-pay.pulse {
          animation: payReveal 0.5s cubic-bezier(0.22, 1, 0.36, 1) both,
                     highlightPay 1.6s ease-out 0.5s;
        }

        @keyframes highlightPay {
          0%   { box-shadow: 0 0 0 0 rgba(245,158,11,0.45); }
          50%  { box-shadow: 0 0 0 12px rgba(245,158,11,0); }
          100% { box-shadow: 0 0 0 0 rgba(245,158,11,0); }
        }

        @media (max-width: 640px) {
          #how-to-pay {
            scroll-margin-top: 24px;
            scroll-margin-bottom: 120px;
          }
        }

        @media (max-width: 420px) {
          .plan-currencies {
            flex-direction: column;
            align-items: flex-start !important;
            gap: 0.15rem !important;
          }
          .plan-currencies .separator {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
