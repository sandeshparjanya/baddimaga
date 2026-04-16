'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { createLoan } from '../actions';

export default function NewLoanForm() {
  const [principal, setPrincipal] = useState<string>('');
  const [rate, setRate] = useState<string>('2');
  const [expectedInterest, setExpectedInterest] = useState<string>('');
  
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData(e.currentTarget);
      await createLoan(formData);
      toast.success('New Saala successfully deployed! 🚀');
      router.push('/');
    } catch (err) {
      toast.error('Failed to deploy capital.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (principal && rate) {
      const p = parseFloat(principal);
      const r = parseFloat(rate);
      if (!isNaN(p) && !isNaN(r)) {
        setExpectedInterest(Math.round((p * r) / 100).toString());
      }
    } else {
      setExpectedInterest('');
    }
  }, [principal, rate]);

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      <div className="input-group">
        <label className="metric-label" style={{ display: 'block', marginBottom: '8px' }}>Borrower Name</label>
        <input 
          type="text" 
          name="borrowerName" 
          required 
          className="baddi-input" 
          placeholder="e.g. Sandy Uncle (More)" 
        />
      </div>

      <div className="input-group">
        <label className="metric-label" style={{ display: 'block', marginBottom: '8px' }}>Principal Amount (₹)</label>
        <input 
          type="number" 
          name="principalAmount" 
          value={principal}
          onChange={(e) => setPrincipal(e.target.value)}
          required 
          min="1" 
          className="baddi-input" 
          placeholder="e.g. 150000" 
        />
      </div>

      <div className="input-group">
        <label className="metric-label" style={{ display: 'block', marginBottom: '8px' }}>Interest Rate (%)</label>
        <input 
          type="number" 
          name="interestRate" 
          value={rate}
          onChange={(e) => setRate(e.target.value)}
          required 
          step="0.1"
          min="0.1" 
          className="baddi-input" 
        />
      </div>

      <div className="input-group">
        <label className="metric-label" style={{ display: 'block', marginBottom: '8px' }}>Monthly Interest (₹)</label>
        <input 
          type="number" 
          name="interestAmountDisplay" 
          value={expectedInterest}
          onChange={(e) => setExpectedInterest(e.target.value)}
          required 
          className="baddi-input" 
        />
        <div style={{ fontSize: '0.75rem', color: 'var(--baddi-success)', marginTop: '6px' }}>
          ✓ Auto-calculated for laziness, adjust if needed!
        </div>
      </div>

      <div className="input-group">
        <label className="metric-label" style={{ display: 'block', marginBottom: '8px' }}>Due Date Rule</label>
        <input 
          type="text" 
          name="dueDateStr" 
          required 
          className="baddi-input" 
          placeholder="e.g. 15th of month" 
        />
      </div>

      <div style={{ marginTop: '16px' }}>
        <button type="submit" disabled={loading} className="baddi-btn" style={{ background: 'linear-gradient(135deg, var(--baddi-success), #10b981)', color: '#fff', opacity: loading ? 0.7 : 1 }}>
          {loading ? 'Deploying...' : 'Deploy Money (Add Saala)'}
        </button>
      </div>
    </form>
  );
}
