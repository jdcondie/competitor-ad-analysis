import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Reports table — stores each generated competitor analysis report per user
export const reports = mysqlTable("reports", {
  id: int("id").autoincrement().primaryKey(),
  /** FK to users.id — the user who generated this report */
  userId: int("userId").notNull(),
  /** Brand name the report was generated for */
  brandName: varchar("brandName", { length: 255 }).notNull(),
  /** Product/service category */
  category: varchar("category", { length: 255 }).notNull().default(""),
  /** Full ReportConfig JSON blob */
  config: text("config").notNull(),
  /** Whether the report was generated with real Meta Ads data or AI-only */
  isAiOnly: int("isAiOnly").notNull().default(0),
  /** Number of real ads analyzed (0 for AI-only reports) */
  totalAdsAnalyzed: int("totalAdsAnalyzed").notNull().default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Report = typeof reports.$inferSelect;
export type InsertReport = typeof reports.$inferInsert;