import Link from 'next/link';
import React from 'react';

export default function NotFound() {
  return (
    <main className="baddi-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100dvh', textAlign: 'center', padding: '24px' }}>
      <div style={{ fontSize: '5rem', fontWeight: 900, color: 'var(--baddi-primary)', marginBottom: '8px', lineHeight: 1 }}>404</div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--baddi-text)', marginBottom: '16px' }}>Maga, where you going?</h2>
      <p style={{ color: 'var(--baddi-sub)', marginBottom: '40px', fontSize: '0.95rem', maxWidth: '300px', lineHeight: 1.5 }}>
        You seem totally lost.<br />There is absolutely no Kassu waiting to be collected on this page!
      </p>
      <Link href="/" className="baddi-btn" style={{ padding: '12px 32px', textDecoration: 'none', display: 'inline-block', width: 'auto' }}>
        Take me home 🏃💨
      </Link>
    </main>
  );
}
