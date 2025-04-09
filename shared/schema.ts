import { pgTable, serial, text, varchar, timestamp, integer } from 'drizzle-orm/pg-core';
import { InferModel, relations } from 'drizzle-orm';

// Create URLs table schema
export const urls = pgTable('urls', {
  id: serial('id').primaryKey(),
  originalUrl: text('original_url').notNull(),
  hash: varchar('hash', { length: 10 }).notNull().unique(),
  createdAt: timestamp('created_at').defaultNow(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'set null' })
});

// Create Users table schema for possible future feature
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 50 }).notNull().unique(),
  email: varchar('email', { length: 100 }).notNull().unique(),
  password: varchar('password', { length: 100 }).notNull(),
  createdAt: timestamp('created_at').defaultNow()
});

// Define relations between tables
export const usersRelations = relations(users, ({ many }) => ({
  urls: many(urls)
}));

export const urlsRelations = relations(urls, ({ one }) => ({
  user: one(users, {
    fields: [urls.userId],
    references: [users.id]
  })
}));

// Define TypeScript types based on the schemas
export type Url = InferModel<typeof urls>;
export type InsertUrl = InferModel<typeof urls, 'insert'>;

export type User = InferModel<typeof users>;
export type InsertUser = InferModel<typeof users, 'insert'>;