'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { SITE } from '@/lib/config';
import AdminNav from '@/components/admin/AdminNav';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checked, setChecked] = useState(false);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    if (pathname === '/admin/login') {
      setChecked(true);
      setAuthed(true);
      return;
    }
    fetch(`${SITE.apiBase}/api/admin/me`, { credentials: 'include' })
      .then((r) => setAuthed(r.ok))
      .finally(() => setChecked(true));
  }, [pathname]);

  useEffect(() => {
    if (checked && !authed && pathname !== '/admin/login') {
      router.replace('/admin/login');
    }
  }, [checked, authed, pathname, router]);

  if (!checked) return <div className="container" style={{ padding: '4rem 1.25rem' }}>Loading…</div>;

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 68px)' }}>
      <AdminNav />
      <div style={{ flex: 1, padding: '2rem 2.5rem', overflow: 'auto' }}>
        {children}
      </div>
    </div>
  );
}
