'use client';

import { Toaster } from 'react-hot-toast';

export default function ToasterProvider() {
  return (
    <Toaster 
      position="top-center" 
      toastOptions={{ 
        style: { 
          background: 'var(--baddi-card)', 
          color: 'var(--baddi-text)', 
          border: '1px solid rgba(255,255,255,0.1)',
          backdropFilter: 'blur(10px)',
          fontWeight: 600,
        } 
      }} 
    />
  );
}
