'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { submitPayment } from '../actions';

interface Loan {
  id: string;
  borrowerName: string;
  dueDateStr: string | null;
  interestAmountDisplay: number | null;
  principalAmount: number;
}

export default function PaymentForm({ loans }: { loans: Loan[] }) {
  const [loanId, setLoanId] = useState('');
  const [paymentType, setPaymentType] = useState('interest');
  const [amount, setAmount] = useState('');

  const [pin, setPin] = useState('');
  
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData(e.currentTarget);
      const res = await submitPayment(formData);
      if (res?.error) {
        toast.error(res.error);
      } else {
        toast.success(paymentType === 'interest' ? 'Kassu Logged Successfully! 🤑' : 'Principal Logged! 💰');
        router.push('/');
      }
    } catch (err) {
      toast.error('Failed to log payment.');
    } finally {
      setLoading(false);
    }
  };

  // Auto-fill amount based on selection
  useEffect(() => {
    if (!loanId) {
      setAmount('');
      return;
    }
    const selected = loans.find(l => l.id === loanId);
    if (!selected) return;

    if (paymentType === 'interest') {
      setAmount((selected.interestAmountDisplay || 0).toString());
    } else {
      setAmount(selected.principalAmount.toString());
    }
  }, [loanId, paymentType, loans]);

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      <div className="input-group">
        <label className="metric-label" style={{ display: 'block', marginBottom: '8px' }}>Who Paid?</label>
        <select 
          name="loanId" 
          value={loanId}
          onChange={(e) => setLoanId(e.target.value)}
          required 
          className="baddi-input"
        >
          <option value="">-- Select Borrower Option --</option>
          {loans.map(loan => (
            <option key={loan.id} value={loan.id}>
              {loan.borrowerName} (Due: {loan.dueDateStr})
            </option>
          ))}
        </select>
      </div>

      <div className="input-group">
        <label className="metric-label" style={{ display: 'block', marginBottom: '8px' }}>What did they pay?</label>
        <div style={{ display: 'flex', gap: '12px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input 
              type="radio" 
              name="paymentType" 
              value="interest" 
              checked={paymentType === 'interest'}
              onChange={() => setPaymentType('interest')}
              required 
            />
            <span>Interest</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input 
              type="radio" 
              name="paymentType" 
              value="principal"
              checked={paymentType === 'principal'}
              onChange={() => setPaymentType('principal')} 
              required 
            />
            <span>Principal Return</span>
          </label>
        </div>
      </div>

      <div className="input-group">
        <label className="metric-label" style={{ display: 'block', marginBottom: '8px' }}>Amount (₹)</label>
        <input 
          type="number" 
          name="amount" 
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required 
          min="1" 
          className="baddi-input" 
          placeholder="e.g. 10000" 
        />
        <div style={{ fontSize: '0.75rem', color: 'var(--baddi-success)', marginTop: '6px' }}>
          ✓ Amount auto-filled for laziness, but you can edit it.
        </div>
      </div>

      <div style={{ marginTop: '16px' }}>
        <button type="submit" disabled={loading} className="baddi-btn" style={{ opacity: loading ? 0.7 : 1 }}>
          {loading ? 'Processing...' : 'Submit Payment'}
        </button>
      </div>
    </form>
  );
}
