'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { deleteBorrower } from '../../actions';

export default function DeleteBorrowerButton({ borrowerName }: { borrowerName: string }) {
  const router = useRouter();

  const handleNuke = async () => {
    if (window.confirm(`Are you sure you want to completely erase ${borrowerName} and CLOSE all of their active saalas?`)) {
      if (window.confirm(`THIS CANNOT BE UNDONE. Type OK in your mind and press OK to proceed.`)) {
        const res = await deleteBorrower(borrowerName);
        if (res?.success) {
          toast.success('Borrower wiped cleanly');
          router.push('/');
        }
      }
    }
  };

  return (
    <button onClick={handleNuke} style={{ background: 'rgba(255,59,48,0.1)', color: '#ff453a', border: '1px solid rgba(255,59,48,0.3)', padding: '6px 12px', borderRadius: '8px', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600 }}>
      Nuke
    </button>
  );
}
