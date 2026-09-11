import { baseApiWithAuth } from '@api/baseApi';
import { SubCategory } from '../../types/index';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const normalizeImageUrl = (url?: string) =>
  url && !/^https?:\/\//i.test(url)
    ? `${API_BASE_URL}/${url.replace(/^\/+/, '')}`
    : url;

// Older subcategory records were saved with categoryId=0. Keep those records
// filterable until the backend data is migrated to store the real categoryId.
const legacySubCategoryCategoryIds: Record<string, number> = {
  'makeup & cosmetics': 17,
  'personal hygiene': 17,
  atta: 19,
  'dals & pulses': 19,
  millets: 19,
  oil: 19,
  'powder & spices': 20,
  'briyani leaves': 20,
  'instant coffee': 21,
  'sauces & spreads': 21,
  'namkeen & chips': 21,
  'soft drinks': 21,
  'rava / sooji': 22,
  rice: 22,
  almonds: 23,
  'raisins & sultanas': 23,
  dates: 23,
  'instant noodles & pasta': 24,
  'soup & instant soup mixes': 24,
  'cooking pastes & purees': 24,
};

type SubCategoryListResponse =
  | SubCategory[]
  | {
      data?: SubCategory[];
      content?: SubCategory[];
      subcategories?: SubCategory[];
      subCategories?: SubCategory[];
    };

/** Normalize backend response — backend uses `active`, may omit `displayOrder`. */
const normalizeSubCategory = (item: any): SubCategory => {
  const normalizedName = String(item.name || item.title || '').trim().toLowerCase();
  const resolvedCategoryId =
    item.categoryId ??
    item.category_id ??
    item.category_Id ??
    item.subCategoryCategoryId ??
    (typeof item.category === 'object' ? item.category?.id : typeof item.category === 'number' ? item.category : 0);
  const categoryId = Number(resolvedCategoryId || legacySubCategoryCategoryIds[normalizedName] || 0);

  return {
    ...item,
    name: item.name || item.title || '',
    categoryName:
      item.categoryName || item.category_name || item.category?.name || '',
    isActive: item.isActive ?? item.active ?? false,
    imageUrl: normalizeImageUrl(item.imageUrl ?? item.image),
    displayOrder: item.displayOrder ?? item.order ?? item.display_order ?? 0,
    categoryId,
  };
};

const normalizeSubCategoryList = (response: SubCategoryListResponse): SubCategory[] => {
  const raw = Array.isArray(response)
    ? response
    : response?.data || response?.content || response?.subcategories || response?.subCategories || [];

  if (!Array.isArray(raw) && raw) return normalizeSubCategoryList(raw as any);

  return (raw as any[]).map(normalizeSubCategory);
};

export interface SubCategoryRequest {
  name: string;
  description: string;
  isActive: boolean;
  displayOrder: number;
  discount: number;
  categoryId: number;
}

/** Build the canonical multipart payload expected by the subcategory API. */
const buildSubCategoryFormData = (subCategory: SubCategoryRequest, image: File): FormData => {
  const order = subCategory.displayOrder ?? 0;
  const fd = new FormData();
  fd.append('name', subCategory.name);
  fd.append('description', subCategory.description || '');
  fd.append('categoryId', String(subCategory.categoryId));
  // Order — backend accepts either name
  fd.append('displayOrder', String(order));
  fd.append('discount', String(subCategory.discount ?? 0));
  // Status — backend uses 'active'
  fd.append('isActive', String(subCategory.isActive));
  // Image — try all known field names
  fd.append('image', image);
  return fd;
};

/** Build plain-JSON body when no image is uploaded. */
const buildSubCategoryJsonBody = (subCategory: SubCategoryRequest) => {
  const order = subCategory.displayOrder ?? 0;
  return {
    name: subCategory.name,
    description: subCategory.description || '',
    categoryId: subCategory.categoryId,
    displayOrder: order,
    order,
    discount: subCategory.discount ?? 0,
    active: subCategory.isActive,
    isActive: subCategory.isActive,
  };
};

export const subCategoryApi = baseApiWithAuth.injectEndpoints({
  endpoints: (builder) => ({
    // 4.1 Get Subcategories by Category
    getSubCategoriesByCategory: builder.query<SubCategory[], number>({
      async queryFn(categoryId, _api, _extraOptions, fetchWithBQ) {
        const urls = [
          `/api/admin/subcategories/category/${categoryId}`,
          `/api/admin/subcategories?categoryId=${categoryId}`,
          `/api/admin/subcategories/${categoryId}`,
          `/api/adminpanel/subcategories/${categoryId}`,
          `/api/subcategories/category/${categoryId}`,
        ];

        let lastError: any = null;
        for (const url of urls) {
          const res = await fetchWithBQ(url);
          if (!res.error && res.data) {
            return { data: normalizeSubCategoryList(res.data as any) };
          }
          if (res.error) lastError = res.error;
        }
        return { error: lastError || { status: 'CUSTOM_ERROR', error: 'Failed to fetch subcategories by category' } };
      },
      providesTags: (result, error, categoryId) => [
        { type: 'SubCategory' as any, id: `cat-${categoryId}` },
      ],
    }),

    // 4.2 Get Subcategory by ID
    getSubCategoryById: builder.query<SubCategory, number>({
      query: (id) => ({ url: `/api/admin/subcategories/detail/${id}` }),
      transformResponse: normalizeSubCategory,
      providesTags: (result, error, id) => [{ type: 'SubCategory' as any, id }],
    }),

    // 4.3 Get All Subcategories
    getAllSubCategories: builder.query<SubCategory[], void>({
      query: () => ({ url: '/api/admin/subcategories' }),
      transformResponse: normalizeSubCategoryList,
      providesTags: ['SubCategory' as any],
    }),

    // 4.4 Create Subcategory — multipart when image provided, JSON otherwise
    createSubCategory: builder.mutation<
      SubCategory,
      { subCategory: SubCategoryRequest; image?: File }
    >({
      query: ({ subCategory, image }) => ({
        url: '/api/admin/subcategories',
        method: 'POST',
        body: image
          ? buildSubCategoryFormData(subCategory, image)
          : buildSubCategoryJsonBody(subCategory),
      }),
      transformResponse: normalizeSubCategory,
      invalidatesTags: ['SubCategory' as any],
    }),

    // 4.5 Update Subcategory — multipart when image provided, JSON otherwise
    updateSubCategory: builder.mutation<
      SubCategory,
      { id: number; subCategory: SubCategoryRequest; image?: File }
    >({
      query: ({ id, subCategory, image }) => ({
        url: `/api/admin/subcategories/${id}`,
        method: 'PUT',
        body: image
          ? buildSubCategoryFormData(subCategory, image)
          : buildSubCategoryJsonBody(subCategory),
      }),
      transformResponse: normalizeSubCategory,
      invalidatesTags: (result, error, { id }) => [
        'SubCategory' as any,
        { type: 'SubCategory' as any, id },
      ],
    }),

    // 4.6 Soft Delete
    deleteSubCategory: builder.mutation<void, number>({
      query: (id) => ({ url: `/api/admin/subcategories/${id}`, method: 'DELETE' }),
      invalidatesTags: ['SubCategory' as any],
    }),

    // 4.7 Hard Delete
    hardDeleteSubCategory: builder.mutation<void, number>({
      query: (id) => ({ url: `/api/admin/subcategories/${id}/hard`, method: 'DELETE' }),
      invalidatesTags: ['SubCategory' as any],
    }),
  }),
});

export const {
  useGetSubCategoriesByCategoryQuery,
  useGetSubCategoryByIdQuery,
  useGetAllSubCategoriesQuery,
  useCreateSubCategoryMutation,
  useUpdateSubCategoryMutation,
  useDeleteSubCategoryMutation,
  useHardDeleteSubCategoryMutation,
} = subCategoryApi;
