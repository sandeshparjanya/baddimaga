import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { cookies } from 'next/headers';
import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import { logout } from './actions';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Baddimaga Syndicate",
  description: "The EMI Syndicate",
};

import ToasterProvider from "./ToasterProvider";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const userId = cookieStore.get('baddi_user_id')?.value;
  let currentUser = null;
  let avatarUrl = '';
  
  if (userId) {
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    if (user) {
      currentUser = user;
      avatarUrl = `https://api.dicebear.com/8.x/micah/svg?seed=${user.name}&backgroundColor=transparent`;
      if (user.name === 'Sandy') avatarUrl = 'https://api.dicebear.com/8.x/micah/svg?seed=Felix&backgroundColor=transparent';
      if (user.name === 'Punith') avatarUrl = 'https://api.dicebear.com/8.x/micah/svg?seed=Leo&backgroundColor=transparent';
      if (user.name === 'Sangam') avatarUrl = 'https://api.dicebear.com/8.x/micah/svg?seed=Jude&backgroundColor=transparent';
    }
  }

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <ToasterProvider />
        <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 1 }}>{children}</div>
          
          <div className="baddi-container" style={{ paddingBottom: '32px' }}>
            {currentUser && (
              <div className="baddi-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img src={avatarUrl} alt={currentUser.name} style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'rgba(0,0,0,0.2)', padding: '2px' }} />
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--baddi-sub)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Logged in</div>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{currentUser.name}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <a href="/" title="Dashboard" style={{ color: 'var(--baddi-text)', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', opacity: 0.9 }}>
                    <span style={{ fontSize: '1.2rem' }}>🏠</span> Home
                  </a>
                  <form action={logout} style={{ margin: 0, display: 'flex', alignItems: 'center' }}>
                    <button type="submit" title="Sign Out" style={{ background: 'none', border: 'none', color: '#ff453a', cursor: 'pointer', padding: 0, opacity: 0.9, display: 'flex' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                    </button>
                  </form>
                </div>
              </div>
            )}
            
            <div className="easter-egg">
              Built with ❤️ and ☕ for Sandy, Punith (US party), & Sangamesh.
              <br />Keep hustling.
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
