import { baseApiWithAuth } from '@api/baseApi';
import { Category } from '../../types/index';
export type { Category };

export type CategoryRequest = Omit<Category, 'id' | 'createdAt' | 'updatedAt' | 'imageUrl'>;

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const normalizeImageUrl = (url?: string) =>
  url && !/^https?:\/\//i.test(url)
    ? `${API_BASE_URL}/${url.replace(/^\/+/, '')}`
    : url;

type CategoryListResponse =
  | Category[]
  | {
      data?: Category[];
      content?: Category[];
      categories?: Category[];
      items?: Category[];
    };

/** Normalize backend response to our Category shape.
 *  Backend uses `active` instead of `isActive` and may omit `displayOrder`.
 *  We also try `order` and `display_order` as alternative field names. */
const normalizeCategory = (category: any): Category => ({
  ...category,
  isActive: category.isActive ?? category.active ?? false,
  imageUrl: normalizeImageUrl(category.imageUrl ?? category.image),
  displayOrder: category.displayOrder ?? category.order ?? category.display_order ?? 0,
});

const normalizeCategoryList = (response: CategoryListResponse): Category[] => {
  const raw = Array.isArray(response)
    ? response
    : response?.data || response?.content || response?.categories || response?.items || [];

  // Guard against one extra level of wrapping
  if (!Array.isArray(raw) && raw) return normalizeCategoryList(raw as any);

  return (raw as any[]).map(normalizeCategory);
};

/** Build the multipart body that the backend accepts.
 *  We send every known field-name variant so the server picks up whatever it supports. */
const buildCategoryFormData = (data: CategoryRequest, image: File): FormData => {
  const order = data.displayOrder ?? 0;
  const fd = new FormData();
  fd.append('name', data.name);
  fd.append('description', data.description || '');
  // Display order — backend accepts either name
  fd.append('displayOrder', String(order));
  fd.append('order', String(order));
  fd.append('discount', String(data.discount ?? 0));
  // Active status — backend uses 'active', we also send isActive for safety
  fd.append('active', String(data.isActive));
  fd.append('isActive', String(data.isActive));
  // Image — backend accepts 'file', 'image', or 'categoryImage'
  fd.append('file', image);
  fd.append('image', image);
  fd.append('categoryImage', image);
  return fd;
};

/** Build a plain-JSON body that the backend accepts when no image is uploaded. */
const buildCategoryJsonBody = (data: CategoryRequest) => {
  const order = data.displayOrder ?? 0;
  return {
    name: data.name,
    description: data.description || '',
    displayOrder: order,
    order,
    discount: data.discount ?? 0,
    active: data.isActive,
    isActive: data.isActive,
  };
};

export const categoryApi = baseApiWithAuth.injectEndpoints({
  endpoints: (builder) => ({
    // 3.1 Get All Categories
    getCategories: builder.query<Category[], void>({
      query: () => ({ url: '/api/categories' }),
      transformResponse: normalizeCategoryList,
      providesTags: ['Category'],
    }),

    // 3.2 Get Category by ID
    getCategoryById: builder.query<Category, number>({
      query: (id) => `/api/admin/categories/${id}`,
      transformResponse: normalizeCategory,
      providesTags: (_result, _error, id) => [{ type: 'Category', id }],
    }),

    // 3.3 Create Category — multipart/form-data when image provided, JSON otherwise
    createCategory: builder.mutation<Category, { data: CategoryRequest; image?: File }>({
      query: ({ data, image }) => ({
        url: '/api/admin/categories',
        method: 'POST',
        body: image ? buildCategoryFormData(data, image) : buildCategoryJsonBody(data),
      }),
      transformResponse: normalizeCategory,
      invalidatesTags: ['Category'],
    }),

    // 3.4 Update Category
    updateCategory: builder.mutation<Category, { id: number; data: CategoryRequest; image?: File }>({
      query: ({ id, data, image }) => ({
        url: `/api/admin/categories/${id}`,
        method: 'PUT',
        body: image ? buildCategoryFormData(data, image) : buildCategoryJsonBody(data),
      }),
      transformResponse: normalizeCategory,
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Category', id }, 'Category'],
    }),

    // 3.5 Soft Delete
    deleteCategory: builder.mutation<void, number>({
      query: (id) => ({ url: `/api/admin/categories/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Category'],
    }),

    // 3.6 Hard Delete
    hardDeleteCategory: builder.mutation<void, number>({
      query: (id) => ({ url: `/api/admin/categories/${id}/hard`, method: 'DELETE' }),
      invalidatesTags: ['Category'],
    }),

    // 3.7 Search Categories
    searchCategories: builder.query<Category[], string>({
      query: (keyword) => `/api/categories/search?keyword=${encodeURIComponent(keyword)}`,
      transformResponse: normalizeCategoryList,
      providesTags: ['Category'],
    }),

    // 3.8 Filter by Discount
    filterByDiscount: builder.query<Category[], number>({
      query: (minDiscount) => `/api/categories/filter/discount?minDiscount=${minDiscount}`,
      transformResponse: normalizeCategoryList,
      providesTags: ['Category'],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetCategoryByIdQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useHardDeleteCategoryMutation,
  useSearchCategoriesQuery,
  useFilterByDiscountQuery,
} = categoryApi;
