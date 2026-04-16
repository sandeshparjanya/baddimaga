import React from 'react';
import Link from 'next/link';
import { db } from '../../../db';
import { loans, comments, users } from '../../../db/schema';
import { eq, desc } from 'drizzle-orm';
import CommentForm from './CommentForm';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function SaalaPage({ params }: { params: { id: string } }) {
  const cookieStore = await cookies();
  const userId = cookieStore.get('baddi_user_id')?.value;
  if (!userId) redirect('/login');

  const [currentUserObj] = await db.select().from(users).where(eq(users.id, userId));

  const [loan] = await db.select().from(loans).where(eq(loans.id, params.id));
  if (!loan) return <div className="baddi-container" style={{ textAlign: 'center', marginTop: '40px' }}>Saala not found.</div>;

  const allComments = await db
    .select({
      id: comments.id,
      content: comments.content,
      createdAt: comments.createdAt,
      userName: users.name,
    })
    .from(comments)
    .leftJoin(users, eq(comments.userId, users.id))
    .where(eq(comments.loanId, loan.id))
    .orderBy(desc(comments.createdAt));

  const formatRupees = (amt: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amt);
  const formatDate = (date: Date) => new Intl.DateTimeFormat('en-IN', { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' }).format(date);

  return (
    <main className="baddi-container" style={{ display: 'flex', flexDirection: 'column', height: '100dvh', padding: '16px' }}>
      <header className="baddi-header" style={{ marginBottom: '16px', flexShrink: 0 }}>
        <h1 className="baddi-title" style={{ fontSize: '1.5rem' }}>{loan.borrowerName}</h1>
        <p className="baddi-subtitle" style={{ color: 'var(--baddi-primary)' }}>{formatRupees(loan.principalAmount)} @ {loan.interestRate}%</p>
      </header>

      <div className="baddi-card" style={{ flexShrink: 0, marginBottom: '16px' }}>
        <div className="flex-between">
          <span className="metric-label">Status</span>
          <span style={{ fontWeight: 600, color: loan.status === 'active' ? 'var(--baddi-success)' : 'var(--baddi-sub)' }}>{loan.status.toUpperCase()}</span>
        </div>
        <div className="flex-between" style={{ marginTop: '8px' }}>
          <span className="metric-label">Due Date</span>
          <span style={{ fontWeight: 600 }}>{loan.dueDateStr}</span>
        </div>
        <div className="flex-between" style={{ marginTop: '8px' }}>
          <span className="metric-label">Monthly Interest</span>
          <span style={{ fontWeight: 600, color: 'var(--baddi-success)' }}>{formatRupees(loan.interestAmountDisplay || 0)}</span>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column-reverse', gap: '16px', padding: '16px 4px' }}>
        {allComments.length === 0 ? (
           <div style={{ textAlign: 'center', color: 'var(--baddi-sub)', margin: 'auto 0' }}>No messages yet. Start the chat!</div>
        ) : (
          allComments.map(c => {
             const isMe = c.userName === currentUserObj.name;
             return (
               <div key={c.id} style={{ alignSelf: isMe ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
                 {!isMe && <div style={{ fontSize: '0.75rem', color: 'var(--baddi-sub)', marginBottom: '4px', marginLeft: '8px' }}>{c.userName}</div>}
                 <div style={{ 
                   background: isMe ? 'var(--baddi-primary)' : 'var(--baddi-card)', 
                   color: '#fff', 
                   padding: '12px 16px', 
                   borderRadius: '20px',
                   borderBottomRightRadius: isMe ? '4px' : '20px',
                   borderBottomLeftRadius: !isMe ? '4px' : '20px',
                   border: isMe ? 'none' : '1px solid rgba(255,255,255,0.05)'
                 }}>
                   {c.content}
                 </div>
                 <div style={{ fontSize: '0.65rem', color: 'var(--baddi-sub)', marginTop: '6px', textAlign: isMe ? 'right' : 'left', marginRight: isMe ? '8px' : 0, marginLeft: !isMe ? '8px' : 0 }}>
                   {formatDate(c.createdAt)}
                 </div>
               </div>
             )
          })
        )}
      </div>

      <div style={{ flexShrink: 0, paddingBottom: '8px', paddingTop: '16px' }}>
        <CommentForm loanId={loan.id} />
        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <Link href="/" style={{ color: 'var(--baddi-sub)', textDecoration: 'none', fontSize: '0.9rem' }}>← Back to Dashboard</Link>
        </div>
      </div>
    </main>
  );
}
