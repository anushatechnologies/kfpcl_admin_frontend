import { baseApiWithAuth } from '@api/baseApi';
import { Product } from '../../category/types/index';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const normalizeImageUrl = (url?: string) =>
  url && !/^https?:\/\//i.test(url)
    ? `${API_BASE_URL}/${url.replace(/^\/+/, '')}`
    : url;

const parseBoolean = (...values: any[]): boolean => {
  for (const val of values) {
    if (val === true || val === 'true' || val === 1 || val === '1') return true;
    if (val === false || val === 'false' || val === 0 || val === '0') return false;
  }
  return false;
};

export interface ProductVariantRequest {
  name: string;
  sku: string;
  price: number;
  discountPrice?: number;
  stock: number;
  isActive: boolean;
  displayOrder: number;
}
export type VariantRequest = ProductVariantRequest;

export interface ProductRequest {
  name: string;
  title?: string;
  description: string;
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
  variants: ProductVariantRequest[];
}

export interface ProductGalleryImage {
  id: number;
  imageUrl: string;
  displayOrder: number;
}

/** Response shape from the catalog image upload endpoint */
export interface CatalogImageUploadResponse {
  success?: boolean;
  url?: string;
  imageUrl?: string;
  storageKey?: string;
  data?: { url?: string; storageKey?: string };
}

const normalizeProduct = (raw: any): Product => {
  const rawVariants = raw.variants || raw.productVariants || [];
  const syntheticVariants = rawVariants.length
    ? rawVariants.map((v: any, idx: number) => ({
        id: v.id ?? idx + 1,
        name: v.name || v.unit || 'Standard',
        sku: v.sku || `SKU-${raw.id}-${idx + 1}`,
        price: Number(v.price ?? raw.price ?? 0),
        discountPrice: Number(v.discountPrice ?? raw.originalPrice ?? v.price ?? raw.price ?? 0),
        stock: Number(v.stock ?? raw.stock ?? 0),
        isActive: parseBoolean(v.isActive, v.active, true),
        displayOrder: Number(v.displayOrder ?? v.order ?? idx + 1),
      }))
    : [
        {
          id: raw.id ?? 1,
          name: raw.unit || 'Standard',
          sku: raw.sku || `SKU-${raw.id || '1'}`,
          price: Number(raw.price ?? 0),
          discountPrice: Number(raw.originalPrice ?? raw.price ?? 0),
          stock: Number(raw.stock ?? 0),
          isActive: parseBoolean(raw.active, raw.isActive, true),
          displayOrder: 1,
        },
      ];

  const firstGalleryImage =
    Array.isArray(raw.images) && raw.images.length > 0
      ? typeof raw.images[0] === 'string'
        ? raw.images[0]
        : raw.images[0]?.imageUrl || raw.images[0]?.url
      : undefined;

  const resolvedImage =
    raw.imageUrl ||
    raw.image ||
    raw.mainImageUrl ||
    raw.thumbnail ||
    raw.productImage ||
    firstGalleryImage;

  const resolvedStoreId =
    raw.storeId ??
    raw.store_id ??
    raw.store?.id ??
    raw.storeTypeId ??
    raw.store_type_id ??
    raw.storeType?.id ??
    (typeof raw.store === 'number' ? raw.store : undefined);

  const resolvedStoreName =
    raw.storeName ||
    raw.store_name ||
    raw.store?.name ||
    raw.storeTypeName ||
    raw.storeType?.name ||
    '';

  const isBestSellerResolved = parseBoolean(
    raw.bestSeller,
    raw.isBestSeller,
    raw.is_best_seller,
    raw.best_seller,
    raw.bestseller,
    raw.isBestseller,
  );

  return {
    ...raw,
    name: raw.name || raw.title || '',
    categoryName: raw.categoryName || raw.category?.name || '',
    subCategoryName: raw.subCategoryName || raw.subcategoryName || raw.subCategory?.name || '',
    storeId: resolvedStoreId,
    storeTypeId: resolvedStoreId,
    storeName: resolvedStoreName,
    store: raw.store && typeof raw.store === 'object' ? raw.store : (resolvedStoreId ? { id: resolvedStoreId, name: resolvedStoreName } : undefined),
    isActive: parseBoolean(raw.isActive, raw.active, true),
    isTrending: parseBoolean(raw.isTrending, raw.trending),
    bestSeller: isBestSellerResolved,
    isBestSeller: isBestSellerResolved,
    imageUrl: normalizeImageUrl(resolvedImage),
    mainImageUrl: normalizeImageUrl(resolvedImage),
    categoryId:
      raw.categoryId ??
      raw.category_id ??
      raw.category_Id ??
      raw.category?.id ??
      0,
    subCategoryId:
      raw.subCategoryId ??
      raw.subcategoryId ??
      raw.sub_category_id ??
      raw.subCategory?.id ??
      raw.subcategory?.id ??
      0,
    displayOrder: raw.displayOrder ?? raw.order ?? 0,
    variants: syntheticVariants,
  };
};

const normalizeProductList = (response: any): Product[] => {
  const raw = Array.isArray(response)
    ? response
    : response?.data || response?.content || response?.products || response?.items || [];
  return (raw as any[]).map(normalizeProduct);
};

/** Build the multipart/form-data payload for create/update product.
 *  Matches: title/name, description, price, stock, unit, categoryId, subcategoryId,
 *  active, trending, bestSeller, file/image/mainImage, images[] (gallery).
 */
const buildProductFormData = (
  product: ProductRequest,
  imageFile?: File,
  galleryFiles?: File[],
): FormData => {
  const firstVariant = product.variants[0];
  const fd = new FormData();

  // Core product fields — send both 'title' and 'name' as backend accepts either
  fd.append('title', product.name.trim());
  fd.append('name', product.name.trim());
  fd.append('description', product.description.trim());

  // Pricing from first variant
  fd.append('price', String(firstVariant?.price ?? 0));
  fd.append('originalPrice', String(firstVariant?.discountPrice ?? firstVariant?.price ?? 0));
  fd.append('stock', String(firstVariant?.stock ?? 0));
  fd.append('unit', firstVariant?.name?.trim() || 'unit');

  // Category / SubCategory
  fd.append('categoryId', String(product.categoryId));
  fd.append('subcategoryId', String(product.subCategoryId));
  fd.append('subCategoryId', String(product.subCategoryId));

  // Status flags — send all possible field key naming conventions
  const activeVal = parseBoolean(product.isActive, product.active, true);
  const trendingVal = parseBoolean(product.isTrending, product.trending);
  const bestSellerVal = parseBoolean(
    product.bestSeller,
    product.isBestSeller,
    product.is_best_seller,
    product.best_seller,
    product.bestseller,
    product.isBestseller,
  );

  fd.append('active', String(activeVal));
  fd.append('isActive', String(activeVal));
  fd.append('trending', String(trendingVal));
  fd.append('isTrending', String(trendingVal));

  fd.append('bestSeller', String(bestSellerVal));
  fd.append('isBestSeller', String(bestSellerVal));
  fd.append('is_best_seller', String(bestSellerVal));
  fd.append('best_seller', String(bestSellerVal));
  fd.append('bestseller', String(bestSellerVal));
  fd.append('isBestseller', String(bestSellerVal));

  // Display order
  fd.append('displayOrder', String(product.displayOrder ?? 0));
  fd.append('order', String(product.displayOrder ?? 0));

  // Store (optional)
  if (product.storeId) {
    const sId = String(product.storeId);
    fd.append('storeId', sId);
    fd.append('store_id', sId);
    fd.append('storeTypeId', sId);
    fd.append('store.id', sId);
  }

  // Main image — send mainImageUrl and binary file without triggering product_images child mapping
  if (product.mainImageUrl?.trim()) {
    fd.append('mainImageUrl', product.mainImageUrl.trim());
  }
  if (imageFile) {
    fd.append('file', imageFile);
    fd.append('mainImage', imageFile);
  }

  // Gallery images — sent as 'images' array
  if (galleryFiles?.length) {
    galleryFiles.forEach((file) => fd.append('images', file));
  }

  return fd;
};

/** Build JSON body for when no files are included (update without image change). */
const buildProductJsonBody = (product: ProductRequest) => {
  const firstVariant = product.variants[0];
  const sId = product.storeId ? Number(product.storeId) : null;
  const activeVal = parseBoolean(product.isActive, product.active, true);
  const trendingVal = parseBoolean(product.isTrending, product.trending);
  const bestSellerVal = parseBoolean(
    product.bestSeller,
    product.isBestSeller,
    product.is_best_seller,
    product.best_seller,
    product.bestseller,
    product.isBestseller,
  );

  return {
    title: product.name.trim(),
    name: product.name.trim(),
    description: product.description.trim(),
    price: firstVariant?.price ?? 0,
    originalPrice: firstVariant?.discountPrice ?? firstVariant?.price ?? 0,
    stock: firstVariant?.stock ?? 0,
    unit: firstVariant?.name?.trim() || 'unit',
    categoryId: product.categoryId,
    subcategoryId: product.subCategoryId,
    subCategoryId: product.subCategoryId,
    active: activeVal,
    isActive: activeVal,
    trending: trendingVal,
    isTrending: trendingVal,
    bestSeller: bestSellerVal,
    isBestSeller: bestSellerVal,
    is_best_seller: bestSellerVal,
    best_seller: bestSellerVal,
    bestseller: bestSellerVal,
    isBestseller: bestSellerVal,
    displayOrder: product.displayOrder ?? 0,
    order: product.displayOrder ?? 0,
    storeId: sId,
    store_id: sId,
    storeTypeId: sId,
    store_type_id: sId,
    // The backend maps these fields to String values, not nested store objects.
    store: sId ? String(sId) : null,
    storeType: sId ? String(sId) : null,
    ...(product.mainImageUrl?.trim() ? { mainImageUrl: product.mainImageUrl.trim() } : {}),
  };
};

/** Resolve the image URL from a catalog upload response — tries all known response shapes. */
export const resolveCatalogImageUrl = (response: any): string => {
  const candidate =
    response?.imageUrl ||
    response?.url ||
    response?.data?.imageUrl ||
    response?.data?.url ||
    response?.storageKey ||
    response?.data?.storageKey ||
    '';
  return candidate ? normalizeImageUrl(candidate) || candidate : '';
};

export const productApi = baseApiWithAuth.injectEndpoints({
  endpoints: (builder) => ({
    // ─── Queries ────────────────────────────────────────────────────────────

    getProducts: builder.query<Product[], { storeId?: number } | void>({
      async queryFn(params, _api, _extraOptions, fetchWithBQ) {
        const queryParams =
          params && typeof params === 'object' && params.storeId !== undefined
            ? { storeId: params.storeId }
            : undefined;

        const endpoints = [
          '/api/admin/products',
          '/api/adminpanel/products',
          '/api/products',
          '/api/v1/admin/products',
          '/api/products/all',
        ];

        let lastError: any = null;
        for (const url of endpoints) {
          const res = await fetchWithBQ({
            url,
            ...(queryParams ? { params: queryParams } : {}),
          });

          if (!res.error && res.data) {
            return { data: normalizeProductList(res.data) };
          }
          if (res.error) {
            lastError = res.error;
          }
        }

        return { error: lastError || { status: 'CUSTOM_ERROR', error: 'Failed to fetch products' } };
      },
      providesTags: ['Product' as any],
    }),

    getProductById: builder.query<Product, number>({
      async queryFn(id, _api, _extraOptions, fetchWithBQ) {
        let res = await fetchWithBQ(`/api/admin/products/${id}`);
        if (res.error) {
          const altRes = await fetchWithBQ(`/api/adminpanel/products/${id}`);
          if (!altRes.error) {
            res = altRes;
          }
        }
        if (res.error) return { error: res.error };
        return { data: normalizeProduct(res.data) };
      },
      providesTags: (result, error, id) => [{ type: 'Product' as any, id }],
    }),

    searchProducts: builder.query<Product[], string>({
      async queryFn(keyword, _api, _extraOptions, fetchWithBQ) {
        let res = await fetchWithBQ(`/api/admin/products/search?keyword=${encodeURIComponent(keyword)}`);
        if (res.error) {
          const altRes = await fetchWithBQ(`/api/adminpanel/products/search?keyword=${encodeURIComponent(keyword)}`);
          if (!altRes.error) {
            res = altRes;
          }
        }
        if (res.error) return { error: res.error };
        return { data: normalizeProductList(res.data) };
      },
      providesTags: ['Product' as any],
    }),

    getTrendingProducts: builder.query<Product[], void>({
      async queryFn(_arg, _api, _extraOptions, fetchWithBQ) {
        let res = await fetchWithBQ('/api/admin/products/trending');
        if (res.error) {
          const altRes = await fetchWithBQ('/api/adminpanel/products/trending');
          if (!altRes.error) {
            res = altRes;
          }
        }
        if (res.error) return { error: res.error };
        return { data: normalizeProductList(res.data) };
      },
      providesTags: ['Product' as any],
    }),

    filterProducts: builder.query<
      Product[],
      {
        categoryId?: number;
        subCategoryId?: number;
        storeId?: number;
        minPrice?: number;
        maxPrice?: number;
        trending?: boolean;
        keyword?: string;
      }
    >({
      async queryFn(params, _api, _extraOptions, fetchWithBQ) {
        let res = await fetchWithBQ({
          url: '/api/admin/products/filter',
          params,
        });
        if (res.error) {
          const altRes = await fetchWithBQ({
            url: '/api/adminpanel/products/filter',
            params,
          });
          if (!altRes.error) {
            res = altRes;
          }
        }
        if (res.error) return { error: res.error };
        return { data: normalizeProductList(res.data) };
      },
      providesTags: ['Product' as any],
    }),

    // ─── Create Product ──────────────────────────────────────────────────────
    createProduct: builder.mutation<
      Product,
      { product: ProductRequest; image?: File; galleryFiles?: File[] }
    >({
      async queryFn({ product, image, galleryFiles }, _api, _extraOptions, fetchWithBQ) {
        const jsonBody = buildProductJsonBody(product);
        let res = await fetchWithBQ({
          url: '/api/admin/products',
          method: 'POST',
          body: jsonBody,
        });

        if (res.error) {
          const altRes = await fetchWithBQ({
            url: '/api/adminpanel/products',
            method: 'POST',
            body: jsonBody,
          });
          if (!altRes.error) {
            res = altRes;
          }
        }

        if (!res.error) {
          return { data: normalizeProduct(res.data) };
        }

        if (image || galleryFiles?.length) {
          const fd = buildProductFormData(product, image, galleryFiles);
          let fdRes = await fetchWithBQ({
            url: '/api/admin/products',
            method: 'POST',
            body: fd,
          });
          if (fdRes.error) {
            const altFdRes = await fetchWithBQ({
              url: '/api/adminpanel/products',
              method: 'POST',
              body: fd,
            });
            if (!altFdRes.error) {
              fdRes = altFdRes;
            }
          }
          if (!fdRes.error) {
            return { data: normalizeProduct(fdRes.data) };
          }
        }

        return { error: res.error };
      },
      invalidatesTags: ['Product' as any],
    }),

    // ─── Update Product ──────────────────────────────────────────────────────
    updateProduct: builder.mutation<
      Product,
      { id: number; product: ProductRequest; image?: File; galleryFiles?: File[] }
    >({
      async queryFn({ id, product, image, galleryFiles }, _api, _extraOptions, fetchWithBQ) {
        const jsonBody = buildProductJsonBody(product);
        let res = await fetchWithBQ({
          url: `/api/admin/products/${id}`,
          method: 'PUT',
          body: jsonBody,
        });

        if (res.error) {
          const altRes = await fetchWithBQ({
            url: `/api/adminpanel/products/${id}`,
            method: 'PUT',
            body: jsonBody,
          });
          if (!altRes.error) {
            res = altRes;
          }
        }

        if (!res.error) {
          return { data: normalizeProduct(res.data) };
        }

        if (image || galleryFiles?.length) {
          const fd = buildProductFormData(product, image, galleryFiles);
          let fdRes = await fetchWithBQ({
            url: `/api/admin/products/${id}`,
            method: 'PUT',
            body: fd,
          });
          if (fdRes.error) {
            const altFdRes = await fetchWithBQ({
              url: `/api/adminpanel/products/${id}`,
              method: 'PUT',
              body: fd,
            });
            if (!altFdRes.error) {
              fdRes = altFdRes;
            }
          }
          if (!fdRes.error) {
            return { data: normalizeProduct(fdRes.data) };
          }
        }

        return { error: res.error };
      },
      invalidatesTags: (result, error, { id }) => ['Product' as any, { type: 'Product' as any, id }],
    }),

    deleteProduct: builder.mutation<void, number>({
      async queryFn(id, _api, _extraOptions, fetchWithBQ) {
        let res = await fetchWithBQ({
          url: `/api/admin/products/${id}`,
          method: 'DELETE',
        });
        if (res.error) {
          const altRes = await fetchWithBQ({
            url: `/api/adminpanel/products/${id}`,
            method: 'DELETE',
          });
          if (!altRes.error) {
            res = altRes;
          }
        }
        if (res.error) return { error: res.error };
        return { data: undefined };
      },
      invalidatesTags: ['Product' as any],
    }),

    // ─── Catalog Image Upload ─────────────────────────────────────────────────
    // Tries the three known upload endpoints in sequence.
    // Returns a resolved image URL string.
    uploadCatalogImage: builder.mutation<
      CatalogImageUploadResponse,
      { file: File; type?: 'CATEGORY' | 'SUBCATEGORY' | 'PRODUCT' | 'BANNER' | 'STORE' | 'SECTION' }
    >({
      async queryFn({ file, type = 'PRODUCT' }, _api, _extraOptions, fetchWithBQ) {
        const endpoints = [
          '/api/v1/admin/catalog/images',
          '/api/admin/catalog/images',
          '/api/media/upload',
        ];

        for (const url of endpoints) {
          const fd = new FormData();
          fd.append('file', file);
          fd.append('image', file);
          fd.append('productImage', file);
          if (type) fd.append('type', type);

          const result = await fetchWithBQ({ url, method: 'POST', body: fd });
          if (!result.error && result.data) {
            return { data: result.data as CatalogImageUploadResponse };
          }
        }

        return {
          error: {
            status: 'CUSTOM_ERROR',
            error: 'Image upload failed on all known endpoints',
          } as any,
        };
      },
    }),

    // ─── Product Gallery ──────────────────────────────────────────────────────

    addProductGalleryImage: builder.mutation<
      any,
      { productId: number; imageUrl: string; isPrimary?: boolean }
    >({
      query: ({ productId, imageUrl, isPrimary = false }) => ({
        url: `/api/admin/products/${productId}/images`,
        method: 'POST',
        body: { imageUrl, isPrimary },
      }),
      invalidatesTags: ['Product' as any],
    }),

    updateProductGalleryImage: builder.mutation<
      any,
      { imageId: number; imageUrl?: string; isPrimary?: boolean }
    >({
      query: ({ imageId, imageUrl, isPrimary }) => ({
        url: `/api/admin/products/images/${imageId}`,
        method: 'PUT',
        body: {
          ...(imageUrl ? { imageUrl } : {}),
          ...(isPrimary !== undefined ? { isPrimary } : {}),
        },
      }),
      invalidatesTags: ['Product' as any],
    }),

    deleteProductGalleryImage: builder.mutation<void, number>({
      query: (imageId) => ({
        url: `/api/admin/products/images/${imageId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Product' as any],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useUploadCatalogImageMutation,
  useAddProductGalleryImageMutation,
  useUpdateProductGalleryImageMutation,
  useDeleteProductGalleryImageMutation,
  useSearchProductsQuery,
  useGetTrendingProductsQuery,
  useFilterProductsQuery,
} = productApi;
