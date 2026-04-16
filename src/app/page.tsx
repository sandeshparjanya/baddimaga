import React from 'react';
import Link from 'next/link';
import { logout } from './actions';
import { db } from '../db';
import { loans, payments, users } from '../db/schema';
import { eq, desc } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function Home() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('baddi_user_id')?.value;
  if (!userId) redirect('/login');
  
  const [currentUser] = await db.select().from(users).where(eq(users.id, userId));
  
  let avatarUrl = `https://api.dicebear.com/8.x/micah/svg?seed=${currentUser?.name || 'unknown'}&backgroundColor=transparent`;
  if (currentUser?.name === 'Sandy') avatarUrl = 'https://api.dicebear.com/8.x/micah/svg?seed=Felix&backgroundColor=transparent';
  if (currentUser?.name === 'Punith') avatarUrl = 'https://api.dicebear.com/8.x/micah/svg?seed=Leo&backgroundColor=transparent';
  if (currentUser?.name === 'Sangam') avatarUrl = 'https://api.dicebear.com/8.x/micah/svg?seed=Jude&backgroundColor=transparent';

  const allLoans = await db.select().from(loans).where(eq(loans.status, 'active'));
  
  const recentPayments = await db
    .select({
      id: payments.id,
      amount: payments.amount,
      paymentType: payments.paymentType,
      paymentDate: payments.paymentDate,
      borrowerName: loans.borrowerName,
    })
    .from(payments)
    .leftJoin(loans, eq(payments.loanId, loans.id))
    .orderBy(desc(payments.paymentDate))
    .limit(3);
  
  // Calculations
  const bankEmi = 32378;
  const totalDeployed = allLoans.reduce((acc, curr) => acc + curr.principalAmount, 0);
  const totalExpectedInterest = allLoans.reduce((acc, curr) => acc + (curr.interestAmountDisplay || 0), 0);
  
  const currentDeficit = bankEmi - totalExpectedInterest;
  const splitAmount = Math.ceil(currentDeficit / 3);

  // Helper to format rupees
  const formatRupees = (amt: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amt);

  // Helper to format dates
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-IN', { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' }).format(date);
  };

  // Group active loans by base borrower name
  const groupedLoans = allLoans.reduce((acc, loan) => {
    let groupName = loan.borrowerName;
    if (loan.borrowerName.includes('Sandy Uncle')) groupName = 'Sandy Uncle';
    if (loan.borrowerName.includes('Sangam Friend')) groupName = 'Sangam Friend';
    if (loan.borrowerName.includes('Sandy Friend')) groupName = 'Sandy Friend';
    
    if (!acc[groupName]) {
      acc[groupName] = { loans: [], totalPrincipal: 0, totalInterest: 0 };
    }
    acc[groupName].loans.push(loan);
    acc[groupName].totalPrincipal += loan.principalAmount;
    acc[groupName].totalInterest += loan.interestAmountDisplay || 0;
    return acc;
  }, {} as Record<string, typeof allLoans & any>);

  return (
    <main className="baddi-container">
      <header className="baddi-header" style={{ marginBottom: '16px' }}>
        <h1 className="baddi-title">Baddimaga</h1>
        <p className="baddi-subtitle">The EMI Syndicate</p>
      </header>

      {currentUser && (
        <div className="baddi-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img src={avatarUrl} alt={currentUser.name} style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(0,0,0,0.2)', padding: '2px' }} />
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--baddi-sub)' }}>Logged in as</div>
              <div style={{ fontWeight: 600 }}>{currentUser.name}</div>
            </div>
          </div>
          <form action={logout} style={{ margin: 0 }}>
            <button type="submit" className="baddi-btn" style={{ padding: '8px 16px', fontSize: '0.85rem', background: 'rgba(255,59,48,0.1)', color: '#ff453a', border: '1px solid rgba(255,59,48,0.2)' }}>
              Sign Out
            </button>
          </form>
        </div>
      )}

      <div className="baddi-card">
        <div className="metric-label">Actual Deficit</div>
        <div className="metric-amount" style={{ color: 'var(--baddi-secondary)' }}>{formatRupees(currentDeficit)}</div>
        <p style={{ fontSize: '0.85rem', color: 'var(--baddi-sub)' }}>
          Bank EMI: {formatRupees(bankEmi)} — Exp. Interest: {formatRupees(totalExpectedInterest)}
        </p>

        <div className="flex-between" style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div>
            <div className="metric-label">Your Share</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--baddi-primary)' }}>{formatRupees(splitAmount)}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className="metric-label">Deployed</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>{formatRupees(totalDeployed)}</div>
          </div>
        </div>
      </div>

      <h3 style={{ margin: '32px 0 16px', fontSize: '1.2rem', fontWeight: 600 }}>Active Saalas</h3>

      {Object.entries(groupedLoans).map(([groupName, group]: [string, any]) => (
        <div key={groupName} className="baddi-card" style={{ padding: '16px', marginBottom: '20px' }}>
          <div className="flex-between" style={{ marginBottom: '12px', borderBottom: '1px dashed rgba(255,255,255,0.1)', paddingBottom: '8px' }}>
            <div style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--baddi-text)' }}>{groupName}</div>
            <div style={{ textAlign: 'right', fontWeight: 800, fontSize: '1.1rem' }}>
              {formatRupees(group.totalPrincipal)}
            </div>
          </div>
          
          {group.loans.map((loan: any) => (
            <Link key={loan.id} href={`/saala/${loan.id}`} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', fontSize: '0.9rem', textDecoration: 'none', color: 'inherit', borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
              <div>↳ {formatRupees(loan.principalAmount)} @ {loan.interestRate}% <br/><span style={{ color: 'var(--baddi-sub)' }}>&nbsp;&nbsp;&nbsp;(Due: {loan.dueDateStr})</span></div>
              <div style={{ color: 'var(--baddi-success)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                +{formatRupees(loan.interestAmountDisplay || 0)} <span style={{ fontSize: '1.2rem', opacity: 0.8 }}>💬</span>
              </div>
            </Link>
          ))}
        </div>
      ))}

      <div style={{ marginTop: '32px', display: 'flex', gap: '12px' }}>
        <Link href="/log" className="baddi-btn" style={{ flex: 1, display: 'block', textAlign: 'center', textDecoration: 'none' }}>Kassu Banthu 💸</Link>
        <Link href="/new-loan" className="baddi-btn" style={{ flex: 1, display: 'block', textAlign: 'center', textDecoration: 'none', background: 'var(--baddi-card)', border: '1px solid var(--baddi-success)', color: 'var(--baddi-text)' }}>Hosa Saala 📝</Link>
      </div>

      <h3 style={{ margin: '32px 0 16px', fontSize: '1.2rem', fontWeight: 600 }}>Recent Activity</h3>
      {recentPayments.length === 0 ? (
        <div style={{ color: 'var(--baddi-sub)', fontSize: '0.9rem', textAlign: 'center', marginBottom: '32px' }}>No payments logged yet. Go collect some Kassu!</div>
      ) : (
        <div className="baddi-card" style={{ padding: '0 16px' }}>
          {recentPayments.map((payment, idx) => (
            <div key={payment.id} className="flex-between" style={{ padding: '16px 0', borderBottom: idx === recentPayments.length - 1 ? 'none' : '1px solid rgba(255,255,255,0.05)' }}>
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
          <div style={{ textAlign: 'center', padding: '16px 0', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <Link href="/activity" style={{ color: 'var(--baddi-success)', fontWeight: 600, textDecoration: 'none', fontSize: '0.9rem' }}>View Full Ledger →</Link>
          </div>
        </div>
      )}

      <div className="easter-egg">
        Built with ❤️ and ☕ for Sandy, Punith (US party), & Sangamesh.
        <br />Keep hustling.
      </div>
    </main>
  );
}
