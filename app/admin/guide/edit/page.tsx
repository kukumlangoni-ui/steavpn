'use client';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { adminApi } from '@/lib/adminApi';

interface StepImage {
  id: number;
  url: string;
  alt: string;
}

interface Step {
  id: number;
  step_number: number;
  title: string;
  body: string | null;
  image_key: string | null;
  image_url: string | null;
  image_alt: string | null;
  images: StepImage[];
}

interface Device {
  id: number;
  slug: string;
  name: string;
  app_name: string;
  download_label: string;
  download_url: string;
  intro: string | null;
  published: number;
  sort_order: number;
  steps: Step[];
}

export default function GuideEditPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const slug = searchParams.get('slug');

  const [device, setDevice] = useState<Device | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedStepId, setSelectedStepId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [deviceForm, setDeviceForm] = useState({
    name: '',
    app_name: '',
    download_label: '',
    download_url: '',
    intro: '',
    published: 1,
    sort_order: 0,
  });
  const [stepForm, setStepForm] = useState({
    title: '',
    body: '',
    image_alt: '',
  });
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  function load() {
    if (!slug) return;
    setLoading(true);
    adminApi.getGuide()
      .then((data) => {
        const d = data.devices.find((x: any) => x.slug === slug);
        if (d) {
          setDevice(d);
          setDeviceForm({
            name: d.name,
            app_name: d.app_name,
            download_label: d.download_label,
            download_url: d.download_url,
            intro: d.intro || '',
            published: d.published ?? 1,
            sort_order: d.sort_order ?? 0,
          });
          if (d.steps?.length && !selectedStepId) {
            setSelectedStepId(d.steps[0].id);
            setStepForm({
              title: d.steps[0].title,
              body: d.steps[0].body || '',
              image_alt: d.steps[0].image_alt || '',
            });
          }
        }
      })
      .catch(() => setError('Failed to load guide'))
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, [slug]);

  const selectedStep = device?.steps.find((s) => s.id === selectedStepId) || null;

  function selectStep(step: Step) {
    setSelectedStepId(step.id);
    setStepForm({
      title: step.title,
      body: step.body || '',
      image_alt: step.image_alt || '',
    });
    setError('');
    setSuccess('');
  }

  async function saveDevice() {
    if (!device) return;
    setSaving(true);
    setError('');
    try {
      await adminApi.saveDevice({
        id: device.id,
        slug: device.slug,
        ...deviceForm,
      });
      setSuccess('Device saved');
      setTimeout(() => setSuccess(''), 2000);
      load();
    } catch (err: any) {
      setError(err.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  }

  async function saveStep() {
    if (!device || !selectedStep) return;
    setSaving(true);
    setError('');
    try {
      await adminApi.saveStep({
        id: selectedStep.id,
        device_id: device.id,
        step_number: selectedStep.step_number,
        ...stepForm,
      });
      setSuccess('Step saved');
      setTimeout(() => setSuccess(''), 2000);
      load();
    } catch (err: any) {
      setError(err.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!device || !selectedStep || !e.target.files?.[0]) return;
    const file = e.target.files[0];
    setUploading(true);
    setError('');
    try {
      await adminApi.uploadStepImage(device.slug, selectedStep.id, file);
      setSuccess('Image uploaded');
      setTimeout(() => setSuccess(''), 2000);
      load();
    } catch (err: any) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  }

  async function handleDeleteImage(imageId: number) {
    if (!confirm('Delete this image?')) return;
    setError('');
    try {
      await adminApi.deleteStepImage(imageId);
      load();
    } catch (err: any) {
      setError(err.message || 'Failed to delete image');
    }
  }

  async function deleteStep() {
    if (!selectedStep) return;
    if (!confirm(`Delete step "${selectedStep.title}"?`)) return;
    setError('');
    try {
      await adminApi.deleteStep(selectedStep.id);
      setSelectedStepId(null);
      load();
    } catch (err: any) {
      setError(err.message || 'Failed to delete');
    }
  }

  async function addStep() {
    if (!device) return;
    setError('');
    try {
      const newStepNum = (device.steps?.length || 0) + 1;
      const res = await adminApi.saveStep({
        device_id: device.id,
        step_number: newStepNum,
        title: `Step ${newStepNum}`,
        body: '',
      });
      setSelectedStepId(res.step.id);
      setStepForm({ title: res.step.title, body: '', image_alt: '' });
      load();
    } catch (err: any) {
      setError(err.message || 'Failed to add step');
    }
  }

  if (loading) return <div className="muted">Loading…</div>;
  if (!device) return <div className="muted">Device not found.</div>;

  return (
    <div style={{ maxWidth: 1100 }}>
      <button onClick={() => router.push('/admin/guide')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginBottom: '1rem', fontSize: '0.9rem' }}>
        ← Back to guide
      </button>

      <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1.5rem' }}>
        Edit: {device.name}
      </h1>

      {error && <div style={{ padding: '0.75rem 1rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', borderRadius: 8, color: '#ef4444', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}
      {success && <div style={{ padding: '0.75rem 1rem', background: 'rgba(34, 197, 94, 0.1)', border: '1px solid #22c55e', borderRadius: 8, color: '#22c55e', marginBottom: '1rem', fontSize: '0.9rem' }}>{success}</div>}

      {/* Device form */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 600, margin: '0 0 1rem' }}>Device settings</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', marginBottom: '0.75rem' }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            <span className="muted" style={{ fontSize: '0.8rem' }}>Name</span>
            <input value={deviceForm.name} onChange={(e) => setDeviceForm({ ...deviceForm, name: e.target.value })}
              style={{ padding: '0.6rem', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }} />
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            <span className="muted" style={{ fontSize: '0.8rem' }}>App name</span>
            <input value={deviceForm.app_name} onChange={(e) => setDeviceForm({ ...deviceForm, app_name: e.target.value })}
              style={{ padding: '0.6rem', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }} />
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            <span className="muted" style={{ fontSize: '0.8rem' }}>Download label</span>
            <input value={deviceForm.download_label} onChange={(e) => setDeviceForm({ ...deviceForm, download_label: e.target.value })}
              style={{ padding: '0.6rem', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }} />
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            <span className="muted" style={{ fontSize: '0.8rem' }}>Sort order</span>
            <input type="number" value={deviceForm.sort_order} onChange={(e) => setDeviceForm({ ...deviceForm, sort_order: parseInt(e.target.value) || 0 })}
              style={{ padding: '0.6rem', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }} />
          </label>
        </div>
        <label style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', marginBottom: '0.75rem' }}>
          <span className="muted" style={{ fontSize: '0.8rem' }}>Download URL</span>
          <input value={deviceForm.download_url} onChange={(e) => setDeviceForm({ ...deviceForm, download_url: e.target.value })}
            style={{ padding: '0.6rem', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontFamily: 'monospace', fontSize: '0.85rem' }} />
        </label>
        <label style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', marginBottom: '0.75rem' }}>
          <span className="muted" style={{ fontSize: '0.8rem' }}>Intro text</span>
          <textarea value={deviceForm.intro} onChange={(e) => setDeviceForm({ ...deviceForm, intro: e.target.value })} rows={3}
            style={{ padding: '0.6rem', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', resize: 'vertical' }} />
        </label>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', cursor: 'pointer' }}>
            <input type="checkbox" checked={deviceForm.published === 1} onChange={(e) => setDeviceForm({ ...deviceForm, published: e.target.checked ? 1 : 0 })} />
            Published
          </label>
          <button onClick={saveDevice} className="btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }} disabled={saving}>
            {saving ? 'Saving…' : 'Save device'}
          </button>
        </div>
      </div>

      {/* Steps editor */}
      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '1.5rem' }}>
        {/* Step list */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0 }}>Steps</h2>
            <button onClick={addStep} style={{ background: 'none', border: 'none', color: 'var(--accent-1)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 500 }}>
              + Add
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
            {device.steps?.map((step, i) => (
              <div
                key={step.id}
                onClick={() => selectStep(step)}
                style={{
                  padding: '0.6rem 0.875rem',
                  borderRadius: 8,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  background: selectedStepId === step.id ? 'var(--surface-2)' : 'transparent',
                  border: selectedStepId === step.id ? '1px solid var(--accent-1)' : '1px solid transparent',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={(e) => {
                  if (selectedStepId !== step.id) {
                    e.currentTarget.style.background = 'var(--surface)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedStepId !== step.id) {
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--accent-1), var(--accent-2))',
                    color: '#0a0a0a',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {i + 1}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {step.title}
                  </div>
                </div>
                {step.image_url && (
                  <div style={{ width: 16, height: 16, borderRadius: 3, background: 'var(--accent-1)', opacity: 0.6 }} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step editor */}
        <div>
          {selectedStep ? (
            <div className="card">
              <h3 style={{ fontSize: '1rem', fontWeight: 600, margin: '0 0 1rem' }}>
                Step {selectedStep.step_number}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <label style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                  <span className="muted" style={{ fontSize: '0.8rem' }}>Title</span>
                  <input value={stepForm.title} onChange={(e) => setStepForm({ ...stepForm, title: e.target.value })}
                    style={{ padding: '0.6rem', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }} />
                </label>
                <label style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                  <span className="muted" style={{ fontSize: '0.8rem' }}>Body</span>
                  <textarea value={stepForm.body} onChange={(e) => setStepForm({ ...stepForm, body: e.target.value })} rows={4}
                    style={{ padding: '0.6rem', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', resize: 'vertical' }} />
                </label>
                <label style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                  <span className="muted" style={{ fontSize: '0.8rem' }}>Image alt text</span>
                  <input value={stepForm.image_alt} onChange={(e) => setStepForm({ ...stepForm, image_alt: e.target.value })}
                    style={{ padding: '0.6rem', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }} />
                </label>

                {/* Images */}
                <div>
                  <div className="muted" style={{ fontSize: '0.8rem', marginBottom: '0.75rem' }}>Screenshots</div>

                  {selectedStep.images && selectedStep.images.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '0.75rem' }}>
                      {selectedStep.images.map((img) => (
                        <div key={img.id} style={{ position: 'relative' }}>
                          <button
                            onClick={() => handleDeleteImage(img.id)}
                            style={{
                              position: 'absolute',
                              top: 8,
                              right: 8,
                              zIndex: 1,
                              width: 28,
                              height: 28,
                              borderRadius: '50%',
                              background: 'rgba(0,0,0,0.6)',
                              border: 'none',
                              color: '#fff',
                              fontSize: '1rem',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              opacity: 0.8,
                              transition: 'all 0.15s',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = '#ef4444';
                              e.currentTarget.style.opacity = '1';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'rgba(0,0,0,0.6)';
                              e.currentTarget.style.opacity = '0.8';
                            }}
                            title="Remove image"
                          >
                            ✕
                          </button>
                          <img
                            src={`${process.env.NEXT_PUBLIC_API_URL}${img.url}`}
                            alt={img.alt}
                            style={{
                              width: '100%',
                              maxWidth: 360,
                              borderRadius: 8,
                              border: '1px solid var(--border)',
                              display: 'block',
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div
                      style={{
                        padding: '1.5rem',
                        textAlign: 'center',
                        background: 'var(--surface-2)',
                        borderRadius: 8,
                        border: '1px dashed var(--border)',
                        marginBottom: '0.75rem',
                      }}
                    >
                      <span className="muted" style={{ fontSize: '0.85rem' }}>No images yet</span>
                    </div>
                  )}

                  <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: 6, border: '1px solid var(--border-active)', background: 'var(--surface-2)', fontSize: '0.85rem', cursor: 'pointer' }}>
                    📷 {uploading ? 'Uploading…' : (selectedStep.images && selectedStep.images.length > 0 ? 'Add another image' : 'Upload image')}
                    <input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleImageUpload} style={{ display: 'none' }} disabled={uploading} />
                  </label>
                  <span className="muted" style={{ fontSize: '0.75rem', marginLeft: '0.75rem' }}>PNG/JPEG/WebP, max 5 MB</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <button
                    onClick={deleteStep}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: 6,
                      border: '1px solid #ef4444',
                      background: 'transparent',
                      color: '#ef4444',
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                    }}
                  >
                    Delete step
                  </button>
                  <button onClick={saveStep} className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }} disabled={saving}>
                    {saving ? 'Saving…' : 'Save step'}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="card muted" style={{ textAlign: 'center' }}>
              Select a step to edit
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
