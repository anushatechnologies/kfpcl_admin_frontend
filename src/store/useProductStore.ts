import { create } from 'zustand';
import { Product } from '../types';

interface FilterOptions {
  category: string | null;
  minPrice: number | null;
  maxPrice: number | null;
  moqMax: number | null;
  location: string | null;
  gstOnly: boolean;
  verifiedOnly: boolean;
  sortBy: 'relevance' | 'price_low' | 'price_high' | 'rating' | 'moq';
}

interface ProductState {
  products: Product[];
  setProducts: (products: Product[]) => void;
  searchQuery: string;
  filters: FilterOptions;
  wishlistIds: string[];
  selectedProduct: Product | null;
  
  setSearchQuery: (query: string) => void;
  setFilters: (newFilters: Partial<FilterOptions>) => void;
  resetFilters: () => void;
  toggleWishlist: (productId: string) => void;
  setSelectedProduct: (product: Product | null) => void;
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => string;
  updateProductStatus: (productId: string, status: Product['status']) => void;
  deleteProduct: (productId: string) => void;
  getFilteredProducts: () => Product[];
}

const DEFAULT_FILTERS: FilterOptions = {
  category: null,
  minPrice: null,
  maxPrice: null,
  moqMax: null,
  location: null,
  gstOnly: false,
  verifiedOnly: false,
  sortBy: 'relevance',
};

// Use a fresh API-backed namespace so legacy seeded browser data is never shown.
const PRODUCT_STORAGE_KEY = 'kfpl_api_products';

const normalizeProduct = (product: Product): Product => ({
  ...product,
  images: product.images || [],
  image: product.image || product.images?.[0],
  seller: product.seller || product.supplierName,
  price: product.price ?? product.tierPricing?.[0]?.pricePerUnit ?? 0,
});

const getInitialProducts = (): Product[] => {
  return [];
};

const persistProducts = (products: Product[]) => {
  localStorage.setItem(PRODUCT_STORAGE_KEY, JSON.stringify(products));
};

export const useProductStore = create<ProductState>((set, get) => ({
  products: getInitialProducts(),
  setProducts: (products) => set({ products }),
  searchQuery: '',
  filters: DEFAULT_FILTERS,
  wishlistIds: [],
  selectedProduct: null,

  setSearchQuery: (query) => set({ searchQuery: query }),

  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    })),

  resetFilters: () => set({ filters: DEFAULT_FILTERS, searchQuery: '' }),

  toggleWishlist: (id) =>
    set((state) => ({
      wishlistIds: state.wishlistIds.includes(id)
        ? state.wishlistIds.filter((item) => item !== id)
        : [...state.wishlistIds, id],
    })),

  setSelectedProduct: (product) => set({ selectedProduct: product }),

  addProduct: (newProdData) => {
    const newProduct: Product = {
      ...newProdData,
      id: `prod_${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      image: newProdData.images?.[0],
      seller: newProdData.supplierName,
      price: newProdData.tierPricing?.[0]?.pricePerUnit || 0,
    };
    set((state) => {
      const products = [newProduct, ...state.products];
      persistProducts(products);
      return { products };
    });
    return newProduct.id;
  },

  updateProductStatus: (id, status) => set((state) => {
    const products = state.products.map((product) => product.id === id ? { ...product, status } : product);
    persistProducts(products);
    return { products };
  }),

  deleteProduct: (id) =>
    set((state) => {
      const products = state.products.filter((p) => p.id !== id);
      persistProducts(products);
      return { products };
    }),

  getFilteredProducts: () => {
    const { products, searchQuery, filters } = get();
    return products.filter((p) => {
      if (p.status !== 'PUBLISHED') return false;
      // Fulltext search
      if (
        searchQuery &&
        !p.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !p.category.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !p.brand.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      // Category filter
      if (filters.category && p.category !== filters.category) return false;

      // GST filter
      if (filters.gstOnly && !p.isGstVerified) return false;

      // Verified supplier filter
      if (filters.verifiedOnly && !p.verifiedSupplier) return false;

      // MOQ filter
      if (filters.moqMax && p.moq > filters.moqMax) return false;

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'price_low') return a.tierPricing[0].pricePerUnit - b.tierPricing[0].pricePerUnit;
      if (filters.sortBy === 'price_high') return b.tierPricing[0].pricePerUnit - a.tierPricing[0].pricePerUnit;
      if (filters.sortBy === 'rating') return b.supplierRating - a.supplierRating;
      if (filters.sortBy === 'moq') return a.moq - b.moq;
      return 0;
    });
  },
}));
