import { SITE } from './config';

async function request<T = unknown>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${SITE.apiBase}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  return data as T;
}

export const adminApi = {
  // Dashboard
  getDashboard: () => request<{
    ok: boolean;
    stats: { totalCustomers: number; activeSubs: number; expiringSoon: number; expired: number };
    recentCustomers: Array<{ id: number; name: string; phone: string | null; status: string; created_at: string }>;
  }>('/api/admin/dashboard'),

  // Customers
  getCustomers: () => request<{ ok: boolean; customers: any[] }>('/api/admin/customers'),
  getCustomer: (id: number) => request<{ ok: boolean; customer: any; subscriptions: any[] }>(`/api/admin/customers/${id}`),
  createCustomer: (data: Record<string, unknown>) =>
    request<{ ok: boolean; customer: any }>('/api/admin/customers', { method: 'POST', body: JSON.stringify(data) }),
  updateCustomer: (id: number, data: Record<string, unknown>) =>
    request<{ ok: boolean; customer: any }>(`/api/admin/customers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCustomer: (id: number) =>
    request<{ ok: boolean }>(`/api/admin/customers/${id}`, { method: 'DELETE' }),

  // Links
  getLinks: () => request<{ ok: boolean; links: any[] }>('/api/admin/links'),
  createLink: (data: Record<string, unknown>) =>
    request<{ ok: boolean; link: any }>('/api/admin/links', { method: 'POST', body: JSON.stringify(data) }),
  updateLink: (id: number, data: Record<string, unknown>) =>
    request<{ ok: boolean; link: any }>(`/api/admin/links/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteLink: (id: number) =>
    request<{ ok: boolean }>(`/api/admin/links/${id}`, { method: 'DELETE' }),

  // Subscriptions
  getSubscriptions: () => request<{ ok: boolean; subscriptions: any[] }>('/api/admin/subscriptions'),
  createSubscription: (data: Record<string, unknown>) =>
    request<{ ok: boolean; subscription: any }>('/api/admin/subscriptions', { method: 'POST', body: JSON.stringify(data) }),
  updateSubscription: (id: number, data: Record<string, unknown>) =>
    request<{ ok: boolean; subscription: any }>(`/api/admin/subscriptions/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  // Auth
  logout: () =>
    request<{ ok: boolean }>('/api/admin/logout', { method: 'POST' }),

  // Guide
  getGuide: () => request<{ devices: any[] }>('/api/guide'),
  saveDevice: (data: Record<string, unknown>) =>
    request<{ ok: boolean; device: any }>('/api/admin/guide/devices', { method: 'POST', body: JSON.stringify(data) }),
  saveStep: (data: Record<string, unknown>) =>
    request<{ ok: boolean; step: any }>('/api/admin/guide/steps', { method: 'POST', body: JSON.stringify(data) }),
  deleteStep: (id: number) =>
    request<{ ok: boolean }>(`/api/admin/guide/steps/${id}`, { method: 'DELETE' }),
  uploadStepImage: async (slug: string, stepId: number, file: File) => {
    const formData = new FormData();
    formData.append('slug', slug);
    formData.append('step_id', String(stepId));
    formData.append('file', file);
    const res = await fetch(`${SITE.apiBase}/api/admin/guide/upload`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Upload failed');
    return data as { ok: boolean; url: string; step: any };
  },
  reorderSteps: (deviceId: number, order: number[]) =>
    request<{ ok: boolean }>('/api/admin/guide/reorder', {
      method: 'POST',
      body: JSON.stringify({ device_id: deviceId, order }),
    }),

  // Payment settings
  getPaymentSettings: () =>
    request<{ ok: boolean; settings: any }>('/api/payment-settings'),

  updatePaymentSettings: (data: Record<string, unknown>) =>
    request<{ ok: boolean; settings: any }>(
      '/api/admin/payment-settings',
      { method: 'POST', body: JSON.stringify(data) }
    ),

  uploadPaymentQR: async (slot: 'wechat' | 'alipay', file: File) => {
    const fd = new FormData();
    fd.append('slot', slot);
    fd.append('file', file);
    const res = await fetch(`${SITE.apiBase}/api/admin/payment-qr/upload`, {
      method: 'POST',
      credentials: 'include',
      body: fd,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || 'Upload failed');
    return data as { ok: boolean; url: string };
  },

  deletePaymentQR: (slot: 'wechat' | 'alipay') =>
    request<{ ok: boolean }>(`/api/admin/payment-qr/${slot}`, {
      method: 'DELETE',
    }),
};
