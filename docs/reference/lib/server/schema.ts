import { pgTable, uuid, varchar, text, integer, boolean, timestamp, jsonb, uniqueIndex, index, pgEnum, check } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const platformRoleEnum = pgEnum('platform_role', ['user', 'platform_admin']);
export const publicationStatusEnum = pgEnum('publication_status', ['draft', 'published']);
export const bookingStatusEnum = pgEnum('booking_status', ['confirmed', 'cancelled']);
export const bookingSourceEnum = pgEnum('booking_source', ['online', 'manual']);
export const otpPurposeEnum = pgEnum('otp_purpose', ['owner_login', 'customer_login', 'owner_register']);
export const categoryEnum = pgEnum('category', ['nail', 'beauty', 'consulting', 'education', 'fitness', 'other']);

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  phoneNormalized: varchar('phone_normalized', { length: 20 }).notNull().unique(),
  platformRole: platformRoleEnum('platform_role').notNull().default('user'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  phoneIdx: uniqueIndex('users_phone_normalized_idx').on(table.phoneNormalized),
}));

export const sessions = pgTable('sessions', {
  tokenHash: varchar('token_hash', { length: 64 }).primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
}, (table) => ({
  userIdx: index('sessions_user_id_idx').on(table.userId),
  expiresIdx: index('sessions_expires_at_idx').on(table.expiresAt),
}));

export const otpChallenges = pgTable('otp_challenges', {
  id: uuid('id').primaryKey().defaultRandom(),
  phoneNormalized: varchar('phone_normalized', { length: 20 }).notNull(),
  purpose: otpPurposeEnum('purpose').notNull(),
  codeHash: varchar('code_hash', { length: 64 }).notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  attemptCount: integer('attempt_count').notNull().default(0),
  consumedAt: timestamp('consumed_at', { withTimezone: true }),
  resendAfter: timestamp('resend_after', { withTimezone: true }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  phonePurposeIdx: index('otp_challenges_phone_purpose_idx').on(table.phoneNormalized, table.purpose),
  expiresIdx: index('otp_challenges_expires_at_idx').on(table.expiresAt),
}));

export const businesses = pgTable('businesses', {
  id: uuid('id').primaryKey().defaultRandom(),
  ownerId: uuid('owner_id').notNull().unique().references(() => users.id, { onDelete: 'cascade' }),
  slug: varchar('slug', { length: 40 }).notNull(),
  name: varchar('name', { length: 60 }).notNull(),
  category: categoryEnum('category').notNull(),
  categoryLabel: varchar('category_label', { length: 40 }),
  description: text('description'),
  publicPhone: varchar('public_phone', { length: 20 }).notNull(),
  address: text('address'),
  imageKey: varchar('image_key', { length: 256 }),
  galleryKeys: jsonb('gallery_keys').$type<string[]>().default([]).notNull(),
  themePreset: varchar('theme_preset', { length: 20 }).notNull().default('rose'),
  timezone: varchar('timezone', { length: 40 }).notNull().default('Asia/Tehran'),
  publicationStatus: publicationStatusEnum('publication_status').notNull().default('draft'),
  suspendedAt: timestamp('suspended_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  slugIdx: uniqueIndex('businesses_slug_idx').on(sql`LOWER(${table.slug})`),
  ownerIdx: uniqueIndex('businesses_owner_id_idx').on(table.ownerId),
  statusIdx: index('businesses_publication_status_idx').on(table.publicationStatus),
}));

export const services = pgTable('services', {
  id: uuid('id').primaryKey().defaultRandom(),
  businessId: uuid('business_id').notNull().references(() => businesses.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 60 }).notNull(),
  durationMinutes: integer('duration_minutes').notNull(),
  priceToman: integer('price_toman').notNull(),
  active: boolean('active').notNull().default(true),
  description: text('description'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  businessIdx: index('services_business_id_idx').on(table.businessId),
  activeIdx: index('services_active_idx').on(table.businessId, table.active),
  durationCheck: check('services_duration_check', sql`${table.durationMinutes} >= 15 AND ${table.durationMinutes} <= 540 AND ${table.durationMinutes} % 15 = 0`),
  priceCheck: check('services_price_check', sql`${table.priceToman} >= 0`),
}));

export const workingHours = pgTable('working_hours', {
  businessId: uuid('business_id').notNull().references(() => businesses.id, { onDelete: 'cascade' }),
  weekday: integer('weekday').notNull(), // 1=Mon ... 7=Sun (ISO)
  startMinute: integer('start_minute').notNull(), // minutes from midnight Tehran time
  endMinute: integer('end_minute').notNull(),
  breakStart: integer('break_start'),
  breakEnd: integer('break_end'),
}, (table) => ({
  pk: uniqueIndex('working_hours_pk').on(table.businessId, table.weekday),
  timeCheck: check('working_hours_time_check', sql`${table.startMinute} >= 0 AND ${table.startMinute} < 1440 AND ${table.endMinute} > 0 AND ${table.endMinute} <= 1440 AND ${table.startMinute} < ${table.endMinute}`),
  breakCheck: check('working_hours_break_check', sql`(${table.breakStart} IS NULL AND ${table.breakEnd} IS NULL) OR (${table.breakStart} IS NOT NULL AND ${table.breakEnd} IS NOT NULL AND ${table.breakStart} >= ${table.startMinute} AND ${table.breakEnd} <= ${table.endMinute} AND ${table.breakStart} < ${table.breakEnd})`),
}));

export const closures = pgTable('closures', {
  businessId: uuid('business_id').notNull().references(() => businesses.id, { onDelete: 'cascade' }),
  localDate: varchar('local_date', { length: 10 }).notNull(), // YYYY-MM-DD in Asia/Tehran
}, (table) => ({
  pk: uniqueIndex('closures_pk').on(table.businessId, table.localDate),
}));

export const bookings = pgTable('bookings', {
  id: uuid('id').primaryKey().defaultRandom(),
  businessId: uuid('business_id').notNull().references(() => businesses.id, { onDelete: 'cascade' }),
  serviceId: uuid('service_id').notNull().references(() => services.id, { onDelete: 'restrict' }),
  customerUserId: uuid('customer_user_id').references(() => users.id, { onDelete: 'set null' }),
  name: varchar('name', { length: 60 }).notNull(),
  phoneSnapshot: varchar('phone_snapshot', { length: 20 }).notNull(),
  startsAt: timestamp('starts_at', { withTimezone: true }).notNull(),
  endsAt: timestamp('ends_at', { withTimezone: true }).notNull(),
  serviceName: varchar('service_name', { length: 60 }).notNull(),
  durationMinutes: integer('duration_minutes').notNull(),
  priceToman: integer('price_toman').notNull(),
  status: bookingStatusEnum('status').notNull().default('confirmed'),
  source: bookingSourceEnum('source').notNull().default('online'),
  idempotencyKey: varchar('idempotency_key', { length: 64 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  cancelledAt: timestamp('cancelled_at', { withTimezone: true }),
}, (table) => ({
  businessTimeIdx: index('bookings_business_time_idx').on(table.businessId, table.startsAt, table.endsAt),
  customerIdx: index('bookings_customer_user_id_idx').on(table.customerUserId),
  idempotencyIdx: uniqueIndex('bookings_idempotency_key_idx').on(table.idempotencyKey),
  statusIdx: index('bookings_status_idx').on(table.status),
  overlapExclude: sql`EXCLUDE USING GIST (
    business_id WITH =,
    tsrange(starts_at, ends_at) WITH &&
  ) WHERE (status = 'confirmed')`,
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;
export type OtpChallenge = typeof otpChallenges.$inferSelect;
export type NewOtpChallenge = typeof otpChallenges.$inferInsert;
export type Business = typeof businesses.$inferSelect;
export type NewBusiness = typeof businesses.$inferInsert;
export type Service = typeof services.$inferSelect;
export type NewService = typeof services.$inferInsert;
export type WorkingHours = typeof workingHours.$inferSelect;
export type NewWorkingHours = typeof workingHours.$inferInsert;
export type Closure = typeof closures.$inferSelect;
export type NewClosure = typeof closures.$inferInsert;
export type Booking = typeof bookings.$inferSelect;
export type NewBooking = typeof bookings.$inferInsert;