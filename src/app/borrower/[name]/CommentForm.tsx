'use client';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { addComment } from '../../actions';

export default function CommentForm({ borrowerName }: { borrowerName: string }) {
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('borrowerName', borrowerName);
      formData.append('content', content);
      
      const res = await addComment(formData);
      if (res?.error) {
        toast.error(res.error);
      } else {
        setContent('');
        toast.success('Message sent!');
      }
    } catch (err) {
      toast.error('Failed to post message.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
      <input 
        type="text" 
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder={`Add a note for ${borrowerName}...`} 
        className="baddi-input"
        style={{ flex: 1, borderRadius: '24px' }}
        required
      />
      <button 
        type="submit" 
        disabled={loading || !content.trim()} 
        className="baddi-btn"
        style={{ width: 'auto', padding: '0 24px', opacity: (loading || !content.trim()) ? 0.5 : 1, borderRadius: '24px' }}
      >
        Send
      </button>
    </form>
  );
}
