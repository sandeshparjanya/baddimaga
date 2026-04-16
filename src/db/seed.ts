import { db } from "./index";
import { users, loans } from "./schema";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function seed() {
  console.log("Seeding database...");

  // Seed Users
  const insertedUsers = await db.insert(users).values([
    { name: "Sandy" },
    { name: "Punith" },
    { name: "Sangam" },
  ]).returning();
  console.log("Inserted users:", insertedUsers);

  // Seed Loans
  const insertedLoans = await db.insert(loans).values([
    {
      borrowerName: "Sandy Uncle",
      principalAmount: 500000,
      interestRate: 2,
      interestAmountDisplay: 10000,
      dueDateStr: "15th of month",
      status: "active",
    },
    {
      borrowerName: "Sandy Aunty",
      principalAmount: 200000,
      interestRate: 2,
      interestAmountDisplay: 4000,
      dueDateStr: "5th of month",
      status: "active",
    },
    {
      borrowerName: "Sandy Friend (Returning)",
      principalAmount: 200000,
      interestRate: 2,
      interestAmountDisplay: 4000,
      dueDateStr: "5th of month",
      status: "active",
    },
    {
      borrowerName: "Sangam Friend",
      principalAmount: 100000,
      interestRate: 1, // "1k interest" -> 1%
      interestAmountDisplay: 1000,
      dueDateStr: "End of month",
      status: "active",
    },
    {
      borrowerName: "Sandy Uncle (Apr 11th)",
      principalAmount: 100000,
      interestRate: 2,
      interestAmountDisplay: 2000,
      dueDateStr: "10th of month",
      status: "active",
    },
    {
      borrowerName: "Sandy Uncle (More)",
      principalAmount: 150000,
      interestRate: 2,
      interestAmountDisplay: 3000,
      dueDateStr: "Pending setup",
      status: "pending_deployment",
    },
    {
      borrowerName: "Sangam Friend (Bajaj)",
      principalAmount: 50000,
      interestRate: 2, // Assuming 2% unless specified otherwise
      interestAmountDisplay: 1000, 
      dueDateStr: "Pending details",
      status: "active",
    },
  ]).returning();
  console.log("Inserted loans:", insertedLoans);

  console.log("Seeding complete!");
  process.exit(0);
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
