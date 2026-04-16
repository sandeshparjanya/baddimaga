import { pgTable, text, timestamp, integer, uuid } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  pinCode: text("pin_code").notNull().default("2626"),
});

export const loans = pgTable("loans", {
  id: uuid("id").defaultRandom().primaryKey(),
  borrowerName: text("borrower_name").notNull(),
  principalAmount: integer("principal_amount").notNull(),
  interestRate: integer("interest_rate").notNull(),
  interestAmountDisplay: integer("interest_amount_display"), // e.g. 10000 
  dueDateStr: text("due_date_str"), // e.g. "15th" or "End of month"
  disbursedDate: timestamp("disbursed_date").notNull().defaultNow(),
  status: text("status").notNull().default("active"), // 'active', 'pending_deployment', 'closed'
});

export const payments = pgTable("payments", {
  id: uuid("id").defaultRandom().primaryKey(),
  loanId: uuid("loan_id").references(() => loans.id).notNull(),
  amount: integer("amount").notNull(),
  paymentDate: timestamp("payment_date").notNull().defaultNow(),
  paymentType: text("payment_type").notNull(), // 'interest' | 'principal'
  loggedBy: uuid("logged_by").references(() => users.id).notNull(),
  notes: text("notes"),
});

export const comments = pgTable("comments", {
  id: uuid("id").defaultRandom().primaryKey(),
  borrowerName: text("borrower_name").notNull(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
