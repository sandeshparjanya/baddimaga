import React from 'react';
import { db } from '../../db';
import { users } from '../../db/schema';
import LoginForm from './LoginForm';

export default async function LoginPage() {
  const allUsers = await db.select().from(users);

  return (
    <main className="baddi-container" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <header className="baddi-header" style={{ marginBottom: '40px' }}>
        <h1 className="baddi-title" style={{ fontSize: '3rem' }}>Baddimaga</h1>
        <p className="baddi-subtitle" style={{ fontSize: '1.2rem', marginTop: '12px' }}>Who is logging in?</p>
      </header>

      <div className="baddi-card">
        <LoginForm users={allUsers} />
      </div>
    </main>
  );
}
