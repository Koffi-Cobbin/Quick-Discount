import { db } from "./db";
import {
  products,
  categories,
  type Product,
  type InsertProduct,
  type Category,
  type InsertCategory,
  type ProductsQueryParams
} from "@shared/schema";
import { eq, like, and, desc } from "drizzle-orm";
import { authStorage, type IAuthStorage } from "./replit_integrations/auth/storage"; // Import auth storage

export interface IStorage extends IAuthStorage { // Extend IAuthStorage
  getProducts(params?: ProductsQueryParams): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  getCategories(): Promise<Category[]>;
  createCategory(category: InsertCategory): Promise<Category>;
  seedData(): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // Auth methods (delegated to authStorage)
  async getUser(id: string) {
    return authStorage.getUser(id);
  }
  async upsertUser(user: any) {
    return authStorage.upsertUser(user);
  }

  async getProducts(params?: ProductsQueryParams): Promise<Product[]> {
    const conditions = [];
    
    if (params?.categoryId) {
      conditions.push(eq(products.categoryId, params.categoryId));
    }
    
    if (params?.isFeatured) {
      conditions.push(eq(products.isFeatured, params.isFeatured));
    }

    if (params?.search) {
      conditions.push(like(products.title, `%${params.search}%`));
    }

    return await db.select()
      .from(products)
      .where(and(...conditions))
      .orderBy(desc(products.createdAt));
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db.insert(products).values(product).returning();
    return newProduct;
  }

  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories);
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const [newCategory] = await db.insert(categories).values(category).returning();
    return newCategory;
  }

  async seedData() {
    // Check if data exists
    const existingCats = await this.getCategories();
    if (existingCats.length > 0) return;

    // Seed Categories
    const cats = await db.insert(categories).values([
      { name: "Top Discounts", slug: "top-discounts", icon: "Tag" },
      { name: "Restaurants", slug: "restaurants", icon: "Utensils" },
      { name: "Fashion", slug: "fashion", icon: "Shirt" },
      { name: "Electronics", slug: "electronics", icon: "Monitor" },
      { name: "Hotels", slug: "hotels", icon: "Hotel" },
    ]).returning();

    // Seed Products
    // Top Discounts
    await db.insert(products).values([
      {
        title: "November Sale 20% OFF",
        description: "20% discount on all Furniture at Furniture City",
        price: "100.00",
        discountPrice: "80.00",
        discountPercentage: 20,
        imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        categoryId: cats[0].id,
        merchantName: "Furniture City",
        rating: "4.5",
        reviewCount: 12234,
        isFeatured: true
      },
      {
        title: "Hisense X'mas Promo",
        description: "Discounts on all Products at Hisense Showrooms",
        price: "500.00",
        discountPrice: "400.00",
        discountPercentage: 20,
        imageUrl: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        categoryId: cats[0].id,
        merchantName: "Hisense Showrooms",
        rating: "4.5",
        reviewCount: 16592,
        isFeatured: true
      },
      // Restaurants
      {
        title: "Seattle's Best Promo",
        description: "Buy 1 Get 1 for free at Seattle's Best (Osu)",
        price: "20.00",
        discountPrice: "10.00",
        discountPercentage: 50,
        imageUrl: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        categoryId: cats[1].id, // Restaurants
        merchantName: "Seattle's Best",
        rating: "4.0",
        reviewCount: 10541,
        isFeatured: false
      },
      {
        title: "Deals of the Month",
        description: "Up to 50% discount at Serenibites",
        price: "50.00",
        discountPrice: "25.00",
        discountPercentage: 50,
        imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        categoryId: cats[1].id,
        merchantName: "Serenibites",
        rating: "4.1",
        reviewCount: 17125,
        isFeatured: false
      },
      // Fashion
      {
        title: "End of Month Sale",
        description: "20% discount sale at Duke Unisex",
        price: "150.00",
        discountPrice: "120.00",
        discountPercentage: 20,
        imageUrl: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        categoryId: cats[2].id, // Fashion
        merchantName: "Duke Unisex",
        rating: "4.0",
        reviewCount: 8781,
        isFeatured: false
      },
      // Electronics
      {
        title: "Bajaj Iron Promo",
        description: "GHS 450 (Now GHS 238.5)",
        price: "450.00",
        discountPrice: "238.50",
        discountPercentage: 47,
        imageUrl: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        categoryId: cats[3].id, // Electronics
        merchantName: "Bajaj Retail Shop",
        rating: "4.0",
        reviewCount: 9972,
        isFeatured: false
      },
       // Hotels
      {
        title: "Labadi Beach Resort",
        description: "Book Now, Stay later",
        price: "2000.00",
        discountPrice: "1500.00",
        discountPercentage: 25,
        imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        categoryId: cats[4].id, // Hotels
        merchantName: "Labadi Beach Resort",
        rating: "4.5",
        reviewCount: 19892,
        isFeatured: false
      }
    ]);
  }
}

export const storage = new DatabaseStorage();
