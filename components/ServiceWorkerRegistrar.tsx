'use client';
import { useEffect } from 'react';

export default function ServiceWorkerRegistrar() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!('serviceWorker' in navigator)) return;
    if (process.env.NODE_ENV !== 'production') return;

    navigator.serviceWorker.register('/sw.js').then((reg) => {
      // Check for updates every time the page loads
      reg.update().catch(() => {});

      // If a new SW is waiting, tell it to activate immediately
      reg.addEventListener('updatefound', () => {
        const newSW = reg.installing;
        if (!newSW) return;
        newSW.addEventListener('statechange', () => {
          if (newSW.state === 'installed' && navigator.serviceWorker.controller) {
            newSW.postMessage('SKIP_WAITING');
          }
        });
      });
    }).catch(() => {});

    // Reload once when a new SW takes over
    let refreshing = false;
    const onControllerChange = () => {
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    };
    navigator.serviceWorker.addEventListener('controllerchange', onControllerChange);

    // Listen for SW_UPDATED message from the service worker
    // This fires when the SW activates after an update, ensuring all tabs
    // get fresh HTML + new JS chunks
    const onMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'SW_UPDATED') {
        window.location.reload();
      }
    };
    navigator.serviceWorker.addEventListener('message', onMessage);

    return () => {
      navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange);
      navigator.serviceWorker.removeEventListener('message', onMessage);
    };
  }, []);
  return null;
}
