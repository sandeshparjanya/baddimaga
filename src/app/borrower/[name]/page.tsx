import React from 'react';
import Link from 'next/link';
import { db } from '../../../db';
import { loans, comments, users, payments } from '../../../db/schema';
import { eq, desc, inArray, ilike } from 'drizzle-orm';
import CommentForm from './CommentForm';
import CommentItem from './CommentItem';
import LoanBreakdownItem from './LoanBreakdownItem';
import DeleteBorrowerButton from './DeleteBorrowerButton';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function BorrowerPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const decodedName = decodeURIComponent(name);
  
  const cookieStore = await cookies();
  const userId = cookieStore.get('baddi_user_id')?.value;
  if (!userId) redirect('/login');

  const [currentUserObj] = await db.select().from(users).where(eq(users.id, userId));

  const borrowerLoans = await db.select().from(loans).where(ilike(loans.borrowerName, `%${decodedName}%`));
  const activeLoans = borrowerLoans.filter(l => l.status === 'active');
  const totalPrincipal = activeLoans.reduce((sum, l) => sum + l.principalAmount, 0);
  const totalInterest = activeLoans.reduce((sum, l) => sum + (l.interestAmountDisplay || 0), 0);

  const loanIds = borrowerLoans.map(l => l.id);

  let recentPayments: any[] = [];
  if (loanIds.length > 0) {
    recentPayments = await db
      .select()
      .from(payments)
      .where(inArray(payments.loanId, loanIds))
      .orderBy(desc(payments.paymentDate))
      .limit(5);
  }

  const recentComments = await db
    .select({
      id: comments.id,
      content: comments.content,
      createdAt: comments.createdAt,
      userName: users.name,
    })
    .from(comments)
    .leftJoin(users, eq(comments.userId, users.id))
    .where(eq(comments.borrowerName, decodedName))
    .orderBy(desc(comments.createdAt))
    .limit(5);

  const formatRupees = (amt: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amt);
  const formatDate = (date: Date) => new Intl.DateTimeFormat('en-IN', { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' }).format(date);

  return (
    <main className="baddi-container" style={{ padding: '24px 16px' }}>
      <header className="baddi-header" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="baddi-title" style={{ fontSize: '1.8rem' }}>{decodedName}</h1>
          <p className="baddi-subtitle" style={{ color: 'var(--baddi-primary)', marginTop: '4px' }}>Total Deployed: {formatRupees(totalPrincipal)}</p>
        </div>
        <DeleteBorrowerButton borrowerName={decodedName} />
      </header>

      {/* Aggregate Details */}
      <div className="baddi-card" style={{ marginBottom: '16px' }}>
        <div className="flex-between">
          <span className="metric-label">Active Loans</span>
          <span style={{ fontWeight: 600 }}>{activeLoans.length}</span>
        </div>
        <div className="flex-between" style={{ marginTop: '8px' }}>
          <span className="metric-label">Monthly Expected Interest</span>
          <span style={{ fontWeight: 600, color: 'var(--baddi-success)' }}>{formatRupees(totalInterest)}</span>
        </div>
      </div>

      {activeLoans.length > 0 && (
        <div className="baddi-card" style={{ padding: '0', marginBottom: '32px' }}>
          <div style={{ padding: '12px 16px', fontSize: '0.8rem', color: 'var(--baddi-sub)', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid rgba(255,255,255,0.05)', fontWeight: 600 }}>
            Loan Breakdowns
          </div>
          {activeLoans.map((loan, idx) => (
             <div key={loan.id} style={{ borderBottom: idx === activeLoans.length - 1 ? 'none' : '1px dashed rgba(255,255,255,0.05)' }}>
               <LoanBreakdownItem loan={loan} borrowerGroup={decodedName} />
             </div>
          ))}
        </div>
      )}

      <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '16px' }}>Recent Kassu Banthu</h3>
      <div className="baddi-card" style={{ padding: '0 16px', marginBottom: '32px' }}>
        {recentPayments.length === 0 ? (
          <div style={{ padding: '16px 0', color: 'var(--baddi-sub)', textAlign: 'center', fontSize: '0.9rem' }}>No payments logged yet.</div>
        ) : (
          recentPayments.map((p, idx) => (
            <div key={p.id} className="flex-between" style={{ padding: '16px 0', borderBottom: idx === recentPayments.length - 1 ? 'none' : '1px solid rgba(255,255,255,0.05)' }}>
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
        <div style={{ textAlign: 'center', padding: '16px 0', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <Link href={`/borrower/${encodeURIComponent(decodedName)}/ledger`} style={{ color: 'var(--baddi-success)', fontWeight: 600, textDecoration: 'none', fontSize: '0.9rem' }}>View Full Ledger →</Link>
        </div>
      </div>

      <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '16px' }}>Add Comment</h3>
      <div className="baddi-card" style={{ marginBottom: '32px', paddingBottom: '16px' }}>
        <CommentForm borrowerName={decodedName} />
      </div>

      <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '16px' }}>Recent Comments</h3>
      <div className="baddi-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '40px' }}>
        {recentComments.length === 0 ? (
          <div style={{ color: 'var(--baddi-sub)', textAlign: 'center', fontSize: '0.9rem', padding: '16px 0' }}>No comments yet.</div>
        ) : (
          recentComments.map((c, idx) => (
             <div key={c.id} style={{ borderBottom: idx === recentComments.length - 1 ? 'none' : '1px dashed rgba(255,255,255,0.1)', paddingBottom: idx === recentComments.length - 1 ? 0 : '16px' }}>
                <CommentItem 
                  comment={{ ...c, formattedDate: formatDate(c.createdAt) }} 
                  borrowerName={decodedName} 
                  isOwner={c.userName === currentUserObj?.name} 
                />
             </div>
          ))
        )}
      </div>

      <div style={{ textAlign: 'center', paddingBottom: '32px' }}>
        <Link href="/" className="baddi-btn" style={{ background: 'transparent', border: '1px solid var(--baddi-sub)', color: 'var(--baddi-sub)', textDecoration: 'none', display: 'inline-block' }}>← Back to Dashboard</Link>
      </div>
    </main>
  );
}
