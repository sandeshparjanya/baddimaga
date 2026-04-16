'use client';

import React, { useState } from 'react';
import { loginWithPin } from '../actions';
import toast from 'react-hot-toast';

interface User {
  id: string;
  name: string;
}

export default function LoginForm({ users }: { users: User[] }) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || pin.length !== 4) return;
    
    setError('');
    const res = await loginWithPin(selectedUser.id, pin);
    if (res?.error) {
      setError(res.error);
      setPin('');
    } else {
      window.location.href = '/';
    }
  };

  if (!selectedUser) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '20px', justifyContent: 'center' }}>
        {users.map(u => {
          let avatarUrl = `https://api.dicebear.com/8.x/micah/svg?seed=${u.name}&backgroundColor=transparent`;
          
          if (u.name === 'Sandy') {
            avatarUrl = 'https://api.dicebear.com/8.x/micah/svg?seed=Felix&backgroundColor=transparent';
          } else if (u.name === 'Punith') {
            avatarUrl = 'https://api.dicebear.com/8.x/micah/svg?seed=Leo&backgroundColor=transparent'; 
          } else if (u.name === 'Sangam') {
            avatarUrl = 'https://api.dicebear.com/8.x/micah/svg?seed=Jude&backgroundColor=transparent'; 
          }
          
          return (
            <button 
              key={u.id}
              onClick={() => setSelectedUser(u)}
              style={{
                background: 'var(--baddi-card)',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: 'var(--radius)',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
              }}
              onMouseOver={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.borderColor = 'var(--baddi-primary)'; }}
              onMouseOut={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'; }}
            >
              <img src={avatarUrl} alt={u.name} style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.05)', padding: '4px' }} />
              <div style={{ color: 'var(--baddi-text)', fontWeight: 600, fontSize: '1.1rem' }}>{u.name}</div>
            </button>
          );
        })}
        
        {/* Placeholder for Ambu the AI Agent */}
        <button 
          type="button"
          onClick={(e) => {
            e.preventDefault();
            toast.success("Beep boop! Sandy's pet AI agent 'Ambu' is still learning math. 🤖 Coming soon!", { icon: '🐶', duration: 4000 });
          }}
          style={{
            background: 'var(--baddi-card)',
            border: '2px dashed rgba(255,255,255,0.1)',
            borderRadius: 'var(--radius)',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseOver={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.borderColor = 'var(--baddi-primary)'; }}
          onMouseOut={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
        >
          <img src="https://api.dicebear.com/8.x/bottts/svg?seed=Ambu&backgroundColor=transparent" alt="Ambu" style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(0, 0, 0, 0.2)', padding: '4px' }} />
          <div style={{ color: 'var(--baddi-sub)', fontWeight: 600, fontSize: '1.1rem' }}>Ambu (AI)</div>
        </button>

      </div>
    );
  }

  return (
    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Welcome back, {selectedUser.name}!</h3>
        <p style={{ color: 'var(--baddi-sub)', fontSize: '0.9rem' }}>Enter your 4-digit PIN</p>
      </div>
      
      <input 
        type="password" 
        value={pin}
        onChange={(e) => setPin(e.target.value)}
        maxLength={4}
        pattern="[0-9]*"
        inputMode="numeric"
        required 
        autoFocus
        className="baddi-input" 
        style={{ fontSize: '2rem', textAlign: 'center', letterSpacing: '8px' }}
      />
      
      {error && <div style={{ color: 'var(--baddi-error)', textAlign: 'center', fontSize: '0.9rem' }}>{error}</div>}

      <div style={{ marginTop: '16px', display: 'flex', gap: '12px' }}>
        <button type="button" onClick={() => setSelectedUser(null)} className="baddi-btn" style={{ background: 'transparent', border: '1px solid var(--baddi-sub)', color: 'var(--baddi-sub)', flex: 1 }}>Back</button>
        <button type="submit" className="baddi-btn" style={{ flex: 2 }}>Unlock</button>
      </div>
    </form>
  );
}
