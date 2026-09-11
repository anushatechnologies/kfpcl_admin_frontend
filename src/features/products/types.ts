export interface Category {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
  displayOrder: number;
  discount: number;
  imageUrl?: string;
  videoUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SubCategory {
  id: number;
  name: string;
  description?: string;
  isActive: boolean;
  displayOrder: number;
  discount: number;
  categoryId: number;
  categoryName?: string;
  imageUrl?: string;
  videoUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Variant {
  id: number;
  name: string;
  sku: string;
  price: number;
  discountPrice?: number;
  stock: number;
  isActive: boolean;
  displayOrder: number;
}

export interface ProductImage {
  id: number;
  imageUrl: string;
  displayOrder: number;
}

export interface VariantRequest {
  name: string;
  sku: string;
  price: number;
  discountPrice?: number;
  stock: number;
  isActive: boolean;
  displayOrder: number;
}

export interface Store {
  id: number;
  name: string;
}

export interface Product {
  id: number;
  name: string;
  title?: string;
  description: string;
  isActive: boolean;
  active?: boolean;
  isTrending: boolean;
  trending?: boolean;
  bestSeller: boolean;
  isBestSeller?: boolean;
  is_best_seller?: boolean;
  best_seller?: boolean;
  bestseller?: boolean;
  isBestseller?: boolean;
  displayOrder: number;
  price?: number;
  discountPrice?: number;
  imageUrl?: string;
  videoUrl?: string;
  categoryId: number;
  categoryName?: string;
  subCategoryId: number;
  subCategoryName?: string;
  storeId?: number | null;
  storeTypeId?: number | null;
  storeName?: string | null;
  store?: {
    id: number;
    name: string;
    city?: string;
    state?: string;
    country?: string;
  } | null;
  variants: Variant[];
  images?: ProductImage[];
  galleryImages?: ProductImage[];
  minPrice?: number;
  maxPrice?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductRequest {
  name: string;
  title?: string;
  description: string;
  price?: number;
  isActive: boolean;
  active?: boolean;
  isTrending?: boolean;
  trending?: boolean;
  bestSeller?: boolean;
  isBestSeller?: boolean;
  is_best_seller?: boolean;
  best_seller?: boolean;
  bestseller?: boolean;
  isBestseller?: boolean;
  displayOrder: number;
  categoryId: number;
  subCategoryId: number;
  storeId?: number | null;
  mainImageUrl?: string;
  variants: VariantRequest[];
}
