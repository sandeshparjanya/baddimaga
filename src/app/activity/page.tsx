import React from 'react';
import Link from 'next/link';
import { db } from '../../db';
import { loans, payments } from '../../db/schema';
import { eq, desc } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function ActivityPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('baddi_user_id')?.value;
  if (!userId) redirect('/login');

  const allPayments = await db
    .select({
      id: payments.id,
      amount: payments.amount,
      paymentType: payments.paymentType,
      paymentDate: payments.paymentDate,
      borrowerName: loans.borrowerName,
    })
    .from(payments)
    .leftJoin(loans, eq(payments.loanId, loans.id))
    .orderBy(desc(payments.paymentDate));

  const formatRupees = (amt: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amt);
  const formatDate = (date: Date) => new Intl.DateTimeFormat('en-IN', { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' }).format(date);

  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const thisWeek = allPayments.filter(p => new Date(p.paymentDate) >= oneWeekAgo);
  const thisMonth = allPayments.filter(p => new Date(p.paymentDate) < oneWeekAgo && new Date(p.paymentDate) >= startOfMonth);
  const older = allPayments.filter(p => new Date(p.paymentDate) < startOfMonth);

  const renderList = (list: any[], title: string) => {
    if (list.length === 0) return null;
    return (
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ marginBottom: '16px', fontSize: '1.1rem', fontWeight: 600, color: 'var(--baddi-sub)' }}>{title}</h3>
        <div className="baddi-card" style={{ padding: '0 16px' }}>
          {list.map((payment, idx) => (
            <div key={payment.id} className="flex-between" style={{ padding: '16px 0', borderBottom: idx === list.length - 1 ? 'none' : '1px dashed rgba(255,255,255,0.05)' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '1rem' }}>{payment.borrowerName}</div>
                <div className="metric-label" style={{ fontSize: '0.75rem', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {payment.paymentType === 'interest' ? '💰 Interest' : '🏦 Principal'}
                  <span>•</span>
                  {formatDate(payment.paymentDate)}
                </div>
              </div>
              <div style={{ fontWeight: 800, fontSize: '1.1rem', color: payment.paymentType === 'interest' ? 'var(--baddi-success)' : 'var(--baddi-primary)' }}>
                +{formatRupees(payment.amount)}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <main className="baddi-container">
      <header className="baddi-header" style={{ marginBottom: '24px' }}>
        <h1 className="baddi-title" style={{ fontSize: '1.8rem' }}>Ledger</h1>
        <p className="baddi-subtitle" style={{ fontSize: '1rem', marginTop: '8px' }}>All historical activity</p>
      </header>

      {renderList(thisWeek, 'This Week')}
      {renderList(thisMonth, 'Earlier This Month')}
      {renderList(older, 'Older History')}
      
      {allPayments.length === 0 && <div style={{ color: 'var(--baddi-sub)', textAlign: 'center', marginTop: '40px' }}>No payments logged yet.</div>}

      <div style={{ textAlign: 'center', marginTop: '32px', paddingBottom: '32px' }}>
        <Link href="/" className="baddi-btn" style={{ background: 'transparent', border: '1px solid var(--baddi-sub)', color: 'var(--baddi-sub)', textDecoration: 'none', display: 'inline-block' }}>← Back to Dashboard</Link>
      </div>
    </main>
  );
}
