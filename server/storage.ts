import { urls, users, type Url, type InsertUrl, type User, type InsertUser } from "../shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

// Interface for the storage functionality
export interface IStorage {
  // URL methods
  storeUrl(originalUrl: string, hash: string, userId?: number): Promise<Url>;
  getUrlByHash(hash: string): Promise<Url | undefined>;
  checkUrlExists(originalUrl: string): Promise<Url | undefined>;
  getUserUrls(userId: number): Promise<Url[]>;
  
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(insertUser: InsertUser): Promise<User>;
}

// Database implementation using Drizzle ORM
export class DatabaseStorage implements IStorage {
  // URL methods
  async storeUrl(originalUrl: string, hash: string, userId?: number): Promise<Url> {
    const [url] = await db
      .insert(urls)
      .values({ originalUrl, hash, userId })
      .returning();
    return url;
  }

  async getUrlByHash(hash: string): Promise<Url | undefined> {
    const [url] = await db
      .select()
      .from(urls)
      .where(eq(urls.hash, hash));
    return url;
  }

  async checkUrlExists(originalUrl: string): Promise<Url | undefined> {
    const [url] = await db
      .select()
      .from(urls)
      .where(eq(urls.originalUrl, originalUrl));
    return url;
  }
  
  async getUserUrls(userId: number): Promise<Url[]> {
    return await db
      .select()
      .from(urls)
      .where(eq(urls.userId, userId));
  }
  
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }
}

// Export a singleton instance of the storage implementation
export const storage = new DatabaseStorage();