'use client';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { deleteLoan, editLoan } from '../../actions';

export default function LoanBreakdownItem({ loan, borrowerGroup }: { loan: any, borrowerGroup: string }) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    borrowerName: loan.borrowerName,
    principalAmount: loan.principalAmount,
    interestRate: loan.interestRate,
    interestAmountDisplay: loan.interestAmountDisplay,
    dueDateStr: loan.dueDateStr
  });

  const formatRupees = (amt: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amt);

  const handleDelete = async () => {
    if (window.confirm(`Delete ${loan.borrowerName} loan forever?`)) {
      const res = await deleteLoan(loan.id, borrowerGroup, `${formatRupees(loan.principalAmount)} under ${loan.borrowerName}`);
      if (res?.success) {
        toast.success('Loan wiped');
        router.refresh();
      }
    }
  };

  const handleSave = async () => {
    const res = await editLoan(loan.id, borrowerGroup, {
      ...form, 
      principalAmount: parseInt(form.principalAmount as any, 10),
      interestRate: parseFloat(form.interestRate as any),
      interestAmountDisplay: parseInt(form.interestAmountDisplay as any, 10),
    });
    if (res?.success) {
      toast.success('Loan updated');
      setIsEditing(false);
      router.refresh();
    }
  };

  if (isEditing) {
    return (
      <div style={{ padding: '16px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--baddi-sub)' }}>Sub-Borrower Name</label>
            <input type="text" value={form.borrowerName} onChange={e => setForm({...form, borrowerName: e.target.value})} className="baddi-input" style={{ width: '100%', padding: '6px 12px' }} />
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--baddi-sub)' }}>Principal</label>
              <input type="number" value={form.principalAmount} onChange={e => setForm({...form, principalAmount: e.target.value as any})} className="baddi-input" style={{ width: '100%', padding: '6px 12px' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--baddi-sub)' }}>Interest (₹)</label>
              <input type="number" value={form.interestAmountDisplay} onChange={e => setForm({...form, interestAmountDisplay: e.target.value as any})} className="baddi-input" style={{ width: '100%', padding: '6px 12px' }} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--baddi-sub)' }}>Rate (%)</label>
              <input type="number" step="0.1" value={form.interestRate} onChange={e => setForm({...form, interestRate: e.target.value as any})} className="baddi-input" style={{ width: '100%', padding: '6px 12px' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--baddi-sub)' }}>Due Date</label>
              <input type="text" value={form.dueDateStr} onChange={e => setForm({...form, dueDateStr: e.target.value})} className="baddi-input" style={{ width: '100%', padding: '6px 12px' }} />
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
          <button onClick={() => setIsEditing(false)} className="baddi-btn" style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'var(--baddi-sub)', width: 'auto', padding: '6px 16px' }}>Cancel</button>
          <button onClick={handleSave} className="baddi-btn" style={{ width: 'auto', padding: '6px 16px' }}>Save</button>
        </div>
      </div>
    );
  }

  return (
    <div className="loan-breakdown-row" style={{ display: 'flex', justifyContent: 'space-between', padding: '16px' }}>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--baddi-text)' }}>{loan.borrowerName}</div>
          <div style={{ display: 'flex', gap: '4px' }}>
             <button onClick={() => setIsEditing(true)} style={{ background: 'none', border: 'none', color: 'var(--baddi-sub)', padding: '0 4px', cursor: 'pointer', fontSize: '0.85rem' }}>✏️</button>
             <button onClick={handleDelete} style={{ background: 'none', border: 'none', color: 'var(--baddi-sub)', padding: '0 4px', cursor: 'pointer', fontSize: '0.85rem' }}>🗑️</button>
          </div>
        </div>
        <div style={{ fontSize: '0.8rem', color: 'var(--baddi-sub)', marginTop: '4px', lineHeight: 1.4 }}>
          {formatRupees(loan.principalAmount)} @ {loan.interestRate}% <br/>
          (Due: {loan.dueDateStr})
        </div>
      </div>
      <div style={{ color: 'var(--baddi-success)', fontWeight: 700, fontSize: '1.05rem', display: 'flex', alignItems: 'center' }}>
        +{formatRupees(loan.interestAmountDisplay || 0)}
      </div>
    </div>
  );
}
