'use client';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { deleteComment, editComment } from '../../actions';

import { useRouter } from 'next/navigation';

export default function CommentItem({ 
  comment, 
  borrowerName, 
  isOwner 
}: { 
  comment: any; 
  borrowerName: string;
  isOwner: boolean;
}) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(comment.content);

  let avatarUrl = `https://api.dicebear.com/8.x/micah/svg?seed=${comment.userName}&backgroundColor=transparent`;
  if (comment.userName === 'Sandy') avatarUrl = 'https://api.dicebear.com/8.x/micah/svg?seed=Felix&backgroundColor=transparent';
  if (comment.userName === 'Punith') avatarUrl = 'https://api.dicebear.com/8.x/micah/svg?seed=Leo&backgroundColor=transparent';
  if (comment.userName === 'Sangam') avatarUrl = 'https://api.dicebear.com/8.x/micah/svg?seed=Jude&backgroundColor=transparent';

  const handleDelete = async () => {
    if (window.confirm('Delete this message?')) {
      const res = await deleteComment(comment.id, borrowerName);
      if (res?.error) {
        toast.error(res.error);
      } else {
        toast.success('Deleted');
        router.refresh(); // Hard update the UI
      }
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      setIsEditing(false);
    } else {
      setContent(comment.content);
      setIsEditing(true);
    }
  };

  const handleSave = async () => {
    if (content !== comment.content && content.trim() !== '') {
      await editComment(comment.id, content, borrowerName);
      toast.success('Updated');
    }
    setIsEditing(false);
  };

  return (
    <div style={{ display: 'flex', gap: '12px' }}>
      <img src={avatarUrl} alt={comment.userName || ''} style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', padding: '2px' }} />
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--baddi-text)' }}>{comment.userName}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--baddi-sub)' }}>{comment.formattedDate}</span>
            {isOwner && (
              <div style={{ display: 'flex', gap: '6px' }}>
                <button onClick={handleEditToggle} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem', padding: '0 4px', opacity: 0.8 }}>✏️</button>
                <button onClick={handleDelete} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem', padding: '0 4px', opacity: 0.8 }}>🗑️</button>
              </div>
            )}
          </div>
        </div>
        {isEditing ? (
           <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
             <textarea 
               className="baddi-input" 
               value={content} 
               onChange={e => setContent(e.target.value)} 
               style={{ width: '100%', minHeight: '80px', padding: '12px', fontSize: '0.9rem', resize: 'vertical' }} 
             />
             <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
               <button onClick={handleEditToggle} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'var(--baddi-sub)', padding: '6px 16px', borderRadius: '16px', cursor: 'pointer' }}>Cancel</button>
               <button onClick={handleSave} className="baddi-btn" style={{ padding: '6px 16px', fontSize: '0.9rem', width: 'auto' }}>Save</button>
             </div>
           </div>
        ) : (
          <div style={{ marginTop: '4px', fontSize: '0.9rem', color: 'rgba(255,255,255,0.85)', lineHeight: 1.4 }}>
            {comment.content}
          </div>
        )}
      </div>
    </div>
  );
}
