export type AdminSubcategoryPayload = {
  categoryId: string;
  name: string;
  imageUrl?: string;
  description?: string;
  displayOrder?: number;
  discount?: number;
  isActive?: boolean;
  status?: 'ACTIVE' | 'INACTIVE';
};

export type AdminCategoryPayload = {
  name: string;
  imageUrl?: string;
  description?: string;
  displayOrder?: number;
  discount?: number;
  isActive?: boolean;
  status?: 'ACTIVE' | 'INACTIVE';
};

export type AdminProductPayload = {
  productName: string;
  categoryId: string;
  subcategoryId?: string;
  brand?: string;
  price: number;
  mrp?: number;
  discount?: number;
  quantity?: number;
  unit: string;
  stockQuantity: number;
  sku?: string;
  description?: string;
  imageUrl?: string;
  status?: string;
};

const API_BASE_URL = (((import.meta as ImportMeta & { env?: { VITE_API_BASE_URL?: string } }).env?.VITE_API_BASE_URL) || '').replace(/\/$/, '');

export const getArray = async <T>(path: string, signal?: AbortSignal): Promise<T[]> => {
  const response = await fetch(`${API_BASE_URL}${path}`, { method: 'GET', signal, headers: { Accept: 'application/json' } });
  if (!response.ok) throw new Error(`GET ${path} failed (${response.status})`);
  const payload = await response.json();
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.data?.content)) return payload.data.content;
  if (Array.isArray(payload?.content)) return payload.content;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.results)) return payload.results;
  return [];
};

export const getAllPages = async <T>(path: string, signal?: AbortSignal): Promise<T[]> => {
  const records: T[] = [];
  let page = 0;
  let totalPages = 1;

  do {
    const pagePath = `${path}${path.includes('?') ? '&' : '?'}page=${page}&size=100`;
    const response = await fetch(`${API_BASE_URL}${pagePath}`, {
      method: 'GET',
      signal,
      headers: { Accept: 'application/json' },
    });
    if (!response.ok) throw new Error(`GET ${path} failed (${response.status})`);
    const payload = await response.json();
    if (Array.isArray(payload)) return page === 0 ? payload : records.concat(payload);

    const pageData = payload?.data ?? payload;
    const content = Array.isArray(pageData?.content)
      ? pageData.content
      : Array.isArray(pageData) ? pageData : [];
    records.push(...content);

    const reportedPages = Number(pageData?.totalPages ?? payload?.totalPages);
    const totalElements = Number(pageData?.totalElements ?? payload?.totalElements);
    const reportedSize = Number(pageData?.size ?? payload?.size) || 100;
    totalPages = Number.isFinite(reportedPages) && reportedPages > 0
      ? reportedPages
      : totalElements > 0 ? Math.ceil(totalElements / reportedSize) : 1;
    page += 1;
    if (!content.length) break;
  } while (page < totalPages);

  return records;
};

const sendJson = async <T>(path: string, method: 'POST' | 'PATCH', body: unknown): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    let detail = '';
    try {
      const errorPayload = await response.json();
      detail = errorPayload?.message ? `: ${errorPayload.message}` : '';
    } catch {
      // Keep the HTTP error useful even when the server returns no JSON body.
    }
    throw new Error(`${method} ${path} failed (${response.status})${detail}`);
  }
  const payload = await response.json();
  return (payload?.data ?? payload) as T;
};

export const deleteAdminCategory = async (id: string): Promise<void> => {
  const path = `/api/v1/admin/catalog/categories/${encodeURIComponent(id)}`;
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'DELETE',
    headers: { Accept: 'application/json' },
  });
  if (!response.ok) {
    let detail = '';
    try {
      const errorPayload = await response.json();
      detail = errorPayload?.message ? `: ${errorPayload.message}` : '';
    } catch {
      // Keep the HTTP error useful even when the server returns no JSON body.
    }
    throw new Error(`DELETE ${path} failed (${response.status})${detail}`);
  }
};

export const deleteAdminProduct = async (id: string): Promise<void> => {
  const path = `/api/v1/admin/catalog/products/${encodeURIComponent(id)}`;
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'DELETE',
    headers: { Accept: 'application/json' },
  });
  if (!response.ok) {
    let detail = '';
    try {
      const errorPayload = await response.json();
      detail = errorPayload?.message ? `: ${errorPayload.message}` : '';
    } catch {
      // Keep the HTTP error useful even when the server returns no JSON body.
    }
    throw new Error(`DELETE ${path} failed (${response.status})${detail}`);
  }
};

export const fetchAdminSubcategories = (signal?: AbortSignal) =>
  getAllPages<unknown>('/api/v1/admin/catalog/subcategories', signal);

export const fetchAdminCategories = (signal?: AbortSignal) =>
  getArray<unknown>('/api/v1/admin/catalog/categories', signal);

export const fetchAdminProducts = (signal?: AbortSignal) =>
  getAllPages<unknown>('/api/v1/admin/catalog/products', signal);

export const createAdminSubcategory = (body: AdminSubcategoryPayload) =>
  sendJson<unknown>('/api/v1/admin/catalog/subcategories', 'POST', body);

export const createAdminCategory = (body: AdminCategoryPayload) =>
  sendJson<unknown>('/api/v1/admin/catalog/categories', 'POST', body);

export const createAdminProduct = (body: AdminProductPayload) =>
  sendJson<unknown>('/api/v1/admin/catalog/products', 'POST', body);

export const updateAdminCategory = (id: string, body: Partial<AdminCategoryPayload>) =>
  sendJson<unknown>(`/api/v1/admin/catalog/categories/${encodeURIComponent(id)}`, 'PATCH', body);

export const updateAdminSubcategory = (id: string, body: Partial<AdminSubcategoryPayload>) =>
  sendJson<unknown>(`/api/v1/admin/catalog/subcategories/${encodeURIComponent(id)}`, 'PATCH', body);

export const mapApiProductToProduct = (raw: any, categoriesList: any[] = [], subcategoriesList: any[] = []): any => {
  const rawCatId = raw.categoryId || raw.category_id || raw.category?.id;
  const rawSubId = raw.subcategoryId || raw.subcategory_id || raw.subcategory?.id;
  const catObj = categoriesList.find((c) => (c.id && rawCatId && c.id === rawCatId) || c.name === raw.categoryName || c.name === raw.category);
  const subObj = subcategoriesList.find((s) => (s.id && rawSubId && s.id === rawSubId) || s.name === raw.subcategoryName || s.name === raw.subcategory);

  const categoryName = raw.categoryName || raw.category?.name || catObj?.name || (typeof raw.category === 'string' ? raw.category : '') || rawCatId || 'General';
  const subcategoryName = raw.subcategoryName || raw.subcategory?.name || subObj?.name || (typeof raw.subcategory === 'string' ? raw.subcategory : '') || rawSubId || '';

  const imageUrl = raw.imageUrl || raw.image || (Array.isArray(raw.images) && raw.images[0]) || '';
  const images = Array.isArray(raw.images) && raw.images.length > 0 ? raw.images : (imageUrl ? [imageUrl] : []);

  const priceNum = typeof raw.price === 'number' ? raw.price : (Number(raw.price) || 0);
  const stockNum = typeof raw.stockQuantity === 'number' ? raw.stockQuantity : (typeof raw.stock === 'number' ? raw.stock : (Number(raw.stockQuantity || raw.stock) || 0));
  const moqNum = typeof raw.quantity === 'number' ? raw.quantity : (typeof raw.moq === 'number' ? raw.moq : (Number(raw.quantity || raw.moq) || 1));

  return {
    id: raw.id ? String(raw.id) : `prod_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    title: raw.productName || raw.name || raw.title || 'Untitled Product',
    category: categoryName,
    subcategory: subcategoryName,
    brand: raw.brand || 'KFPCL',
    images,
    image: imageUrl,
    description: raw.description || '',
    moq: moqNum,
    unit: raw.unit || 'kg',
    price: priceNum,
    tierPricing: Array.isArray(raw.tierPricing) && raw.tierPricing.length > 0
      ? raw.tierPricing
      : [{ minQty: moqNum, maxQty: null, pricePerUnit: priceNum }],
    supplierId: raw.supplierId || 'admin_catalog',
    supplierName: raw.supplierName || raw.seller || raw.brand || 'KFPL Catalog',
    supplierLocation: raw.supplierLocation || 'India',
    supplierRating: typeof raw.supplierRating === 'number' ? raw.supplierRating : 5,
    isGstVerified: raw.isGstVerified ?? true,
    verifiedSupplier: raw.verifiedSupplier ?? true,
    specifications: raw.specifications || {
      MRP: String(raw.mrp ?? '-'),
      SKU: raw.sku || '-',
    },
    stock: stockNum,
    status: (raw.status === 'ACTIVE' || raw.status === 'PUBLISHED' || !raw.status) ? 'PUBLISHED' : (raw.status === 'DRAFT' ? 'DRAFT' : raw.status),
    createdAt: raw.createdAt || new Date().toISOString().split('T')[0],
  };
};

export const fetchAdminCatalog = async (signal?: AbortSignal) => {
  const [products, categories, subcategories, brands] = await Promise.all([
    getAllPages<unknown>('/api/v1/admin/catalog/products', signal).catch(() => getArray<unknown>('/api/v1/admin/catalog/products', signal)),
    getArray<unknown>('/api/v1/admin/catalog/categories', signal),
    getAllPages<unknown>('/api/v1/admin/catalog/subcategories', signal).catch(() => getArray<unknown>('/api/v1/admin/catalog/subcategories', signal)),
    getArray<unknown>('/api/v1/admin/catalog/brands', signal).catch(() => []),
  ]);
  return { products, categories, subcategories, brands };
};

