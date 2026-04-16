import React from 'react';
import Link from 'next/link';
import NewLoanForm from './NewLoanForm';

export default async function NewLoanPage({ searchParams }: { searchParams: Promise<{ borrower?: string }> }) {
  const resolvedParams = await searchParams;
  const initialBorrower = resolvedParams.borrower || '';

  return (
    <main className="baddi-container">
      <header className="baddi-header" style={{ marginBottom: '16px' }}>
        <h1 className="baddi-title" style={{ fontSize: '1.8rem', background: '-webkit-linear-gradient(45deg, var(--baddi-success), #34d399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Hosa Saala</h1>
        <p className="baddi-subtitle">{initialBorrower ? `Add a Top Up for ${initialBorrower}` : 'Deploy capital to the market'}</p>
      </header>

      <div className="baddi-card">
        <NewLoanForm initialBorrower={initialBorrower} />
      </div>

      <div style={{ textAlign: 'center', marginTop: '24px' }}>
        <Link href="/" style={{ color: 'var(--baddi-sub)', textDecoration: 'none' }}>← Cancel and go back</Link>
      </div>
    </main>
  );
}
