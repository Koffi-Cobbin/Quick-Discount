import { pgTable, text, serial, integer, boolean, timestamp, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { users } from "./models/auth"; // Export auth models

export * from "./models/auth"; // Re-export auth models

// === TABLE DEFINITIONS ===
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  icon: text("icon").notNull(), // Lucide icon name or image URL
  isActive: boolean("is_active").default(true),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  price: numeric("price", { precision: 10, scale: 2 }), // Original price
  discountPrice: numeric("discount_price", { precision: 10, scale: 2 }), // Discounted price
  discountPercentage: integer("discount_percentage"),
  imageUrl: text("image_url").notNull(),
  categoryId: integer("category_id").references(() => categories.id),
  merchantName: text("merchant_name").notNull(),
  validFrom: timestamp("valid_from"),
  validUntil: timestamp("valid_until"),
  rating: numeric("rating", { precision: 3, scale: 1 }).default("0"),
  reviewCount: integer("review_count").default(0),
  isFeatured: boolean("is_featured").default(false),
  type: text("type").default("product"), // 'product', 'deal', 'coupon'
  createdAt: timestamp("created_at").defaultNow(),
});

// === BASE SCHEMAS ===
export const insertCategorySchema = createInsertSchema(categories).omit({ id: true });
export const insertProductSchema = createInsertSchema(products).omit({ id: true, createdAt: true });

// === EXPLICIT API CONTRACT TYPES ===
export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;

export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;

// Request types
export type CreateProductRequest = InsertProduct;
export type UpdateProductRequest = Partial<InsertProduct>;

// Response types
export type ProductResponse = Product;
export type CategoryResponse = Category;
export type ProductsListResponse = Product[];
export type CategoriesListResponse = Category[];

// Query types
export interface ProductsQueryParams {
  categoryId?: number;
  isFeatured?: boolean;
  search?: string;
}
