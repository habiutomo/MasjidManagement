import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("user"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  role: true,
});

// Prayer times settings
export const prayerSettings = pgTable("prayer_settings", {
  id: serial("id").primaryKey(),
  latitude: text("latitude").notNull(),
  longitude: text("longitude").notNull(),
  timezone: text("timezone").notNull().default("Asia/Jakarta"),
  method: text("method").notNull().default("MWL"),
  adjustments: json("adjustments").notNull(),
  lastUpdated: timestamp("last_updated").notNull().defaultNow(),
});

export const insertPrayerSettingsSchema = createInsertSchema(prayerSettings).pick({
  latitude: true,
  longitude: true,
  timezone: true,
  method: true,
  adjustments: true,
});

// Events
export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  eventType: text("event_type").notNull(),
  date: text("date").notNull(),
  time: text("time"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertEventSchema = createInsertSchema(events).pick({
  title: true,
  description: true,
  eventType: true,
  date: true,
  time: true,
});

// Announcements
export const announcements = pgTable("announcements", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(),
  postedBy: text("posted_by").notNull(),
  displayUntil: text("display_until"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertAnnouncementSchema = createInsertSchema(announcements).pick({
  title: true,
  content: true,
  category: true,
  postedBy: true,
  displayUntil: true,
});

// Donation Campaigns
export const campaigns = pgTable("campaigns", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  target: integer("target").notNull(),
  collected: integer("collected").notNull().default(0),
  endDate: text("end_date"),
  status: text("status").notNull().default("active"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertCampaignSchema = createInsertSchema(campaigns).pick({
  title: true,
  description: true,
  target: true,
  collected: true,
  endDate: true,
  status: true,
});

// Donations
export const donations = pgTable("donations", {
  id: serial("id").primaryKey(),
  campaignId: integer("campaign_id").notNull(),
  donor: text("donor"),
  amount: integer("amount").notNull(),
  isAnonymous: boolean("is_anonymous").notNull().default(false),
  paymentMethod: text("payment_method").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertDonationSchema = createInsertSchema(donations).pick({
  campaignId: true,
  donor: true,
  amount: true,
  isAnonymous: true,
  paymentMethod: true,
});

// Export types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertPrayerSettings = z.infer<typeof insertPrayerSettingsSchema>;
export type PrayerSettings = typeof prayerSettings.$inferSelect;

export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Event = typeof events.$inferSelect;

export type InsertAnnouncement = z.infer<typeof insertAnnouncementSchema>;
export type Announcement = typeof announcements.$inferSelect;

export type InsertCampaign = z.infer<typeof insertCampaignSchema>;
export type Campaign = typeof campaigns.$inferSelect;

export type InsertDonation = z.infer<typeof insertDonationSchema>;
export type Donation = typeof donations.$inferSelect;
