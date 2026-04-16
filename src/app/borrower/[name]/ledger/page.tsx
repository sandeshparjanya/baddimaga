import React from 'react';
import Link from 'next/link';
import { db } from '../../../db';
import { loans, payments } from '../../../db/schema';
import { eq, desc, inArray, ilike } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function BorrowerLedgerPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const decodedName = decodeURIComponent(name);

  const cookieStore = await cookies();
  const userId = cookieStore.get('baddi_user_id')?.value;
  if (!userId) redirect('/login');

  const borrowerLoans = await db.select().from(loans).where(ilike(loans.borrowerName, `%${decodedName}%`));
  const loanIds = borrowerLoans.map(l => l.id);

  let allPayments: any[] = [];
  if (loanIds.length > 0) {
    allPayments = await db
      .select()
      .from(payments)
      .where(inArray(payments.loanId, loanIds))
      .orderBy(desc(payments.paymentDate));
  }

  const formatRupees = (amt: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amt);
  const formatDate = (date: Date) => new Intl.DateTimeFormat('en-IN', { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' }).format(date);

  return (
    <main className="baddi-container" style={{ padding: '24px 16px' }}>
      <header className="baddi-header" style={{ marginBottom: '24px' }}>
        <h1 className="baddi-title" style={{ fontSize: '1.5rem' }}>{decodedName} Ledger</h1>
        <p className="baddi-subtitle" style={{ fontSize: '0.9rem', marginTop: '8px' }}>Full historical activity combining all loans.</p>
      </header>

      <div className="baddi-card" style={{ padding: '0 16px', marginBottom: '32px' }}>
        {allPayments.length === 0 ? (
          <div style={{ padding: '32px 0', color: 'var(--baddi-sub)', textAlign: 'center', fontSize: '0.9rem' }}>No payments logged yet.</div>
        ) : (
          allPayments.map((p, idx) => (
             <div key={p.id} className="flex-between" style={{ padding: '16px 0', borderBottom: idx === allPayments.length - 1 ? 'none' : '1px dashed rgba(255,255,255,0.05)' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '1rem', color: p.paymentType === 'interest' ? 'var(--baddi-success)' : 'var(--baddi-primary)' }}>
                  {p.paymentType === 'interest' ? '💰 Interest' : '🏦 Principal'}
                </div>
                <div className="metric-label" style={{ fontSize: '0.75rem', marginTop: '4px' }}>{formatDate(p.paymentDate)}</div>
              </div>
              <div style={{ fontWeight: 800, fontSize: '1.1rem', color: p.paymentType === 'interest' ? 'var(--baddi-success)' : 'var(--baddi-primary)' }}>
                +{formatRupees(p.amount)}
              </div>
            </div>
          ))
        )}
      </div>

      <div style={{ textAlign: 'center', paddingBottom: '32px' }}>
        <Link href={`/borrower/${encodeURIComponent(decodedName)}`} className="baddi-btn" style={{ background: 'transparent', border: '1px solid var(--baddi-sub)', color: 'var(--baddi-sub)', textDecoration: 'none', display: 'inline-block' }}>← Back to {decodedName}</Link>
      </div>
    </main>
  );
}
