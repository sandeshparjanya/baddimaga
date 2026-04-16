'use server';

import { db } from '../db';
import { payments, loans, users } from '../db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export async function loginWithPin(userId: string, pinCode: string) {
  const [user] = await db.select().from(users).where(eq(users.id, userId));
  if (!user || user.pinCode !== pinCode) {
    return { error: 'Incorrect PIN. Have you tried 2626?' };
  }
  
  const cookieStore = await cookies();
  cookieStore.set('baddi_user_id', user.id, { 
    httpOnly: true, 
    secure: process.env.NODE_ENV === 'production', 
    maxAge: 60 * 60 * 24 * 30 // 30 days
  });
  
  return { success: true };
}

export async function submitPayment(formData: FormData) {
  const loanId = formData.get('loanId') as string;
  const paymentType = formData.get('paymentType') as string;
  const amountStr = formData.get('amount') as string;
  
  if (!loanId || !paymentType || !amountStr) return;
  
  const amount = parseInt(amountStr, 10);

  const cookieStore = await cookies();
  const userId = cookieStore.get('baddi_user_id')?.value;
  if (!userId) return { error: 'Not Logged in' };

  // Insert payment
  await db.insert(payments).values({
    loanId,
    amount,
    paymentType,
    loggedBy: userId,
  });

  // If principal is returned, dynamically reduce their total loan exposure
  if (paymentType === 'principal') {
    const [loanRecord] = await db.select().from(loans).where(eq(loans.id, loanId));
    if (loanRecord) {
      const newPrincipal = loanRecord.principalAmount - amount;
      if (newPrincipal <= 0) {
        // Loan fully settled!
        await db.update(loans).set({ principalAmount: 0, status: 'closed' }).where(eq(loans.id, loanId));
      } else {
        await db.update(loans).set({ principalAmount: newPrincipal }).where(eq(loans.id, loanId));
      }
    }
  }

  // Refresh dashboard and return home
  revalidatePath('/');
  return { success: true };
}

export async function createLoan(formData: FormData) {
  const borrowerName = formData.get('borrowerName') as string;
  const principalAmountStr = formData.get('principalAmount') as string;
  const interestRateStr = formData.get('interestRate') as string;
  const interestAmountDisplayStr = formData.get('interestAmountDisplay') as string;
  const dueDateStr = formData.get('dueDateStr') as string;
  
  if (!borrowerName || !principalAmountStr || !interestRateStr) return;
  
  await db.insert(loans).values({
    borrowerName,
    principalAmount: parseInt(principalAmountStr, 10),
    interestRate: parseFloat(interestRateStr),
    interestAmountDisplay: parseInt(interestAmountDisplayStr, 10),
    dueDateStr,
    status: 'active',
  });

  revalidatePath('/');
  return { success: true };
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('baddi_user_id');
  redirect('/login');
}

export async function addComment(formData: FormData) {
  const loanId = formData.get('loanId') as string;
  const content = formData.get('content') as string;
  if (!loanId || !content) return { error: 'Missing data' };

  const cookieStore = await cookies();
  const userId = cookieStore.get('baddi_user_id')?.value;
  if (!userId) return { error: 'Not Logged in' };

  await db.insert(comments).values({
    loanId,
    userId,
    content,
  });

  revalidatePath(`/saala/${loanId}`);
  return { success: true };
}
