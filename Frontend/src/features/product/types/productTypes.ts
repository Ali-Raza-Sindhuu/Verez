/**
 * Product domain types for the Products module.
 *
 * These describe the shape of data the UI consumes. Mock data
 * (productMockData.ts) conforms to these types now; a future
 * productApi.ts can return the same shapes so pages don't change when
 * the mock service is swapped for real API calls.
 */

export type ProductStatus = "active" | "draft" | "archived";

export type StockStatus = "in-stock" | "low-stock" | "out-of-stock";

export interface ProductVariant {
  id: string;
  name: string;
  /** e.g. { Color: "Black", Storage: "256GB" } */
  options: Record<string, string>;
  sku: string;
  price: number;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  barcode?: string;
  category: string;
  subcategory?: string;
  brand?: string;
  vendor: string;
  branch: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  lowStockThreshold: number;
  status: ProductStatus;
  image?: string;
  rating?: number;
  shortDescription?: string;
  description?: string;
  variants?: ProductVariant[];
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  parentId?: string;
  status: ProductStatus;
  productCount: number;
  createdAt: string;
}

export interface Subcategory {
  id: string;
  name: string;
  categoryId: string;
  categoryName: string;
  status: ProductStatus;
  productCount: number;
  createdAt: string;
}

/**
 * Derives stock status from quantity + threshold rather than storing it
 * redundantly on the product. Keeps a single source of truth (stock,
 * lowStockThreshold) so the badge can never drift out of sync.
 */
export function getStockStatus(stock: number, lowStockThreshold: number): StockStatus {
  if (stock <= 0) return "out-of-stock";
  if (stock <= lowStockThreshold) return "low-stock";
  return "in-stock";
}