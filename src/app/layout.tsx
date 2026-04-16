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
                  <img src={avatarUrl} alt={currentUser.name} style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(0,0,0,0.2)', padding: '2px' }} />
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--baddi-sub)' }}>Logged in as</div>
                    <div style={{ fontWeight: 600 }}>{currentUser.name}</div>
                  </div>
                </div>
                <form action={logout} style={{ margin: 0 }}>
                  <button type="submit" className="baddi-btn" style={{ padding: '8px 16px', fontSize: '0.85rem', background: 'rgba(255,59,48,0.1)', color: '#ff453a', border: '1px solid rgba(255,59,48,0.2)' }}>
                    Sign Out
                  </button>
                </form>
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
