import { config } from 'dotenv';
config({ path: '.env.local' });

async function main() {
  const { db } = await import('./src/db/index');
  const { users } = await import('./src/db/schema');
  await db.update(users).set({ pinCode: '2626' });
  console.log('Successfully updated pins to 2626');
  process.exit(0);
}

main();
