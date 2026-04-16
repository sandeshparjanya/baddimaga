import React from 'react';
import Link from 'next/link';
import { db } from '../../db';
import { loans } from '../../db/schema';
import { eq } from 'drizzle-orm';
import PaymentForm from './PaymentForm';

export default async function LogPaymentPage() {
  const activeLoans = await db.select().from(loans).where(eq(loans.status, 'active'));

  return (
    <main className="baddi-container">
      <header className="baddi-header" style={{ marginBottom: '16px' }}>
        <h1 className="baddi-title" style={{ fontSize: '1.8rem' }}>Kassu Banthu</h1>
        <p className="baddi-subtitle">Log a new payment</p>
      </header>

      <div className="baddi-card">
        <PaymentForm loans={activeLoans} />
      </div>

      <div style={{ textAlign: 'center', marginTop: '24px' }}>
        <Link href="/" style={{ color: 'var(--baddi-sub)', textDecoration: 'none' }}>← Cancel and go back</Link>
      </div>
    </main>
  );
}
