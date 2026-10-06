'use client';
import { useEffect, useState, useRef } from 'react';
import { adminApi } from '@/lib/adminApi';
import { SITE } from '@/lib/config';

type PaymentSettings = {
  wechat_id: string;
  whatsapp: string;
  email: string;
  alipay_id: string | null;
  bank_name: string;
  bank_account_name: string;
  bank_account_number: string;
  wechat_qr_url: string | null;
  alipay_qr_url: string | null;
};

export default function PaymentSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [settings, setSettings] = useState<PaymentSettings | null>(null);

  const wechatInputRef = useRef<HTMLInputElement>(null);
  const alipayInputRef = useRef<HTMLInputElement>(null);

  function load() {
    setLoading(true);
    adminApi.getPaymentSettings()
      .then((data) => setSettings(data.settings))
      .catch(() => setError('Failed to load payment settings'))
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    setError('');
    try {
      const data = await adminApi.updatePaymentSettings(settings);
      setSettings(data.settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  }

  async function handleUpload(slot: 'wechat' | 'alipay', file: File) {
    setError('');
    try {
      await adminApi.uploadPaymentQR(slot, file);
      load();
    } catch (err: any) {
      setError(err.message || 'Upload failed');
    }
  }

  async function handleRemove(slot: 'wechat' | 'alipay') {
    setError('');
    try {
      await adminApi.deletePaymentQR(slot);
      load();
    } catch (err: any) {
      setError(err.message || 'Failed to remove');
    }
  }

  function updateField<K extends keyof PaymentSettings>(key: K, value: PaymentSettings[K]) {
    setSettings((prev) => prev ? { ...prev, [key]: value } : prev);
  }

  if (loading) {
    return <div style={{ padding: '2rem 0' }}>Loading…</div>;
  }

  if (!settings) {
    return <div style={{ padding: '2rem 0', color: '#ef4444' }}>Failed to load payment settings</div>;
  }

  return (
    <div style={{ maxWidth: 720 }}>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.25rem' }}>
        Payment settings
      </h1>
      <p className="muted" style={{ marginBottom: '2rem' }}>
        Manage contact details, bank info, and QR codes shown on the payment page.
      </p>

      {error && (
        <div className="card" style={{ borderColor: '#ef4444', color: '#ef4444', marginBottom: '1.5rem', padding: '0.75rem 1rem' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSave}>
        {/* Contact */}
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600, margin: '0 0 1.25rem' }}>Contact</h2>
          <div style={{ display: 'grid', gap: '1rem' }}>
            <Field label="WeChat ID">
              <input
                type="text"
                value={settings.wechat_id}
                onChange={(e) => updateField('wechat_id', e.target.value)}
                className="input"
                style={{ width: '100%' }}
              />
            </Field>
            <Field label="WhatsApp">
              <input
                type="text"
                value={settings.whatsapp}
                onChange={(e) => updateField('whatsapp', e.target.value)}
                className="input"
                style={{ width: '100%' }}
              />
            </Field>
            <Field label="Email">
              <input
                type="email"
                value={settings.email}
                onChange={(e) => updateField('email', e.target.value)}
                className="input"
                style={{ width: '100%' }}
              />
            </Field>
            <Field label="Alipay ID (optional)">
              <input
                type="text"
                value={settings.alipay_id || ''}
                onChange={(e) => updateField('alipay_id', e.target.value || null)}
                className="input"
                style={{ width: '100%' }}
              />
            </Field>
          </div>
        </div>

        {/* Bank */}
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600, margin: '0 0 1.25rem' }}>Bank transfer</h2>
          <div style={{ display: 'grid', gap: '1rem' }}>
            <Field label="Bank name">
              <input
                type="text"
                value={settings.bank_name}
                onChange={(e) => updateField('bank_name', e.target.value)}
                className="input"
                style={{ width: '100%' }}
              />
            </Field>
            <Field label="Account holder">
              <input
                type="text"
                value={settings.bank_account_name}
                onChange={(e) => updateField('bank_account_name', e.target.value)}
                className="input"
                style={{ width: '100%' }}
              />
            </Field>
            <Field label="Account number">
              <input
                type="text"
                value={settings.bank_account_number}
                onChange={(e) => updateField('bank_account_number', e.target.value)}
                className="input"
                style={{ width: '100%' }}
              />
            </Field>
          </div>
        </div>

        {/* QR Codes */}
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600, margin: '0 0 1.25rem' }}>QR Codes</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
            <QRPanel
              label="WeChat QR"
              qrUrl={settings.wechat_qr_url ? SITE.apiBase + settings.wechat_qr_url : null}
              onUpload={(file) => handleUpload('wechat', file)}
              onRemove={() => handleRemove('wechat')}
              inputRef={wechatInputRef}
            />
            <QRPanel
              label="Alipay QR"
              qrUrl={settings.alipay_qr_url ? SITE.apiBase + settings.alipay_qr_url : null}
              onUpload={(file) => handleUpload('alipay', file)}
              onRemove={() => handleRemove('alipay')}
              inputRef={alipayInputRef}
            />
          </div>
        </div>

        {/* Save */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? 'Saving…' : 'Save settings'}
          </button>
          {saved && (
            <span style={{ color: '#22c55e', fontSize: '0.9rem', fontWeight: 500 }}>
              ✓ Saved
            </span>
          )}
        </div>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.4rem', color: 'var(--text)' }}>
        {label}
      </label>
      {children}
    </div>
  );
}

function QRPanel({
  label,
  qrUrl,
  onUpload,
  onRemove,
  inputRef,
}: {
  label: string;
  qrUrl: string | null;
  onUpload: (file: File) => void;
  onRemove: () => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
}) {
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) onUpload(file);
  }

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '0.95rem', fontWeight: 500, marginBottom: '0.75rem' }}>{label}</div>

      {qrUrl ? (
        <div style={{ marginBottom: '0.75rem' }}>
          <img
            src={qrUrl}
            alt={label}
            style={{
              width: 200,
              height: 200,
              borderRadius: 8,
              background: '#fff',
              objectFit: 'contain',
            }}
          />
        </div>
      ) : (
        <div
          style={{
            width: 200,
            height: 200,
            margin: '0 auto 0.75rem',
            borderRadius: 8,
            border: '1px dashed var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-muted)',
            fontSize: '0.85rem',
            background: 'var(--surface-2)',
          }}
        >
          Not uploaded
        </div>
      )}

      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button
          type="button"
          className="btn-secondary"
          onClick={() => inputRef.current?.click()}
          style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
        >
          {qrUrl ? 'Replace' : 'Upload'}
        </button>
        {qrUrl && (
          <button
            type="button"
            onClick={onRemove}
            style={{
              fontSize: '0.85rem',
              padding: '0.5rem 1rem',
              borderRadius: 6,
              background: 'transparent',
              border: '1px solid var(--border)',
              color: 'var(--text-muted)',
              cursor: 'pointer',
            }}
          >
            Remove
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
    </div>
  );
}
