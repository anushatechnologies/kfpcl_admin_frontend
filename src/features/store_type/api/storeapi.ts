import { baseApiWithAuth } from '@api/baseApi';
import { getStoredAccessToken } from '@features/auth/authCookies';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_BASE_URL = `${BASE_URL}/api/admin/stores`;

export interface StoreType {
  id: number;
  name: string;
  label?: string;
  displayOrder: number;
  active: boolean;
  imageUrl?: string;
  address?: string;
  city?: string;
  pincode?: string;
  phoneNumber?: string;
  email?: string;
  priceRange?: string;
  timings?: string;
  announcement?: string;
  delivery?: string;
  packageCost?: string;
  rating?: number;
  preferredOrder?: number;
  latitude?: number;
  longitude?: number;
  createdAt?: string;
  updatedAt?: string;
  store1Id?: number;
}

export interface StoreRequest {
  name: string;
  label?: string;
  displayOrder?: number;
  active?: boolean;
  address?: string;
  city?: string;
  pincode?: string;
  phoneNumber?: string;
  email?: string;
  imageUrl?: string;
  priceRange?: string;
  timings?: string;
  announcement?: string;
  delivery?: string;
  packageCost?: string;
  rating?: number;
  preferredOrder?: number;
  latitude?: number;
  longitude?: number;
}

export const storeTypeApi = baseApiWithAuth.injectEndpoints({
  endpoints: (builder) => ({
    getStoreTypes: builder.query<
      { content: StoreType[]; totalPages: number; totalElements: number },
      { name?: string; page?: number; size?: number }
    >({
      async queryFn(args = {}, _api, _extraOptions, fetchWithBQ) {
        const { name, page = 0, size = 100 } = args;
        const endpoints = [
          '/api/adminpanel/stores',
          '/api/admin/stores',
          '/api/stores',
          '/api/v1/admin/stores',
          '/api/stores/all',
        ];

        const params: Record<string, any> = {
          ...(name ? { name, search: name } : {}),
          page,
          size,
        };

        let lastError: any = null;
        let successfulData: any = null;

        for (const url of endpoints) {
          // Attempt with pagination/search params
          let res = await fetchWithBQ({
            url,
            params,
          });

          if (!res.error && res.data) {
            successfulData = res.data;
            break;
          }

          // If params caused an issue, attempt without params
          if (res.error) {
            lastError = res.error;
            const resNoParams = await fetchWithBQ({ url });
            if (!resNoParams.error && resNoParams.data) {
              successfulData = resNoParams.data;
              break;
            }
          }
        }

        if (!successfulData) {
          return { error: lastError || { status: 'CUSTOM_ERROR', error: 'Failed to fetch stores' } };
        }

        const rawContent =
          Array.isArray(successfulData)
            ? successfulData
            : Array.isArray(successfulData?.content)
              ? successfulData.content
              : Array.isArray(successfulData?.data?.content)
                ? successfulData.data.content
                : Array.isArray(successfulData?.data?.stores)
                  ? successfulData.data.stores
                  : Array.isArray(successfulData?.data)
                    ? successfulData.data
                    : Array.isArray(successfulData?.stores)
                      ? successfulData.stores
                      : Array.isArray(successfulData?.items)
                        ? successfulData.items
                        : [];

        const content: StoreType[] = rawContent.map((store: any) => {
          let img = store.imageUrl ?? store.image ?? '';
          if (img && !/^https?:\/\//i.test(img)) {
            const base = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '');
            img = `${base}/${img.replace(/^\/+/, '')}`;
          }
          return {
            ...store,
            id: Number(store.id ?? store.storeId ?? 0),
            name: store.name || store.storeName || store.title || `Store #${store.id}`,
            imageUrl: img,
            city: store.city || store.location || store.address || '',
            phoneNumber: store.phoneNumber || store.phone || store.contactNumber || store.contact?.phone || '',
            active: store.active ?? store.isActive ?? true,
          };
        });

        return {
          data: {
            content,
            totalPages: successfulData?.totalPages ?? 1,
            totalElements: successfulData?.totalElements ?? content.length,
          },
        };
      },
      providesTags: ['StoreTypes', 'Stores'],
    }),
    getStoreTypeById: builder.query<StoreType, number>({
      async queryFn(id, _api, _extraOptions, fetchWithBQ) {
        const response = await fetchWithBQ({ url: `/api/admin/stores/${id}` });
        if (response.error) return { error: response.error };
        const raw: any = response.data;
        const store = raw?.data?.store ?? raw?.data ?? raw?.store ?? raw;
        return {
          data: {
            ...store,
            id: Number(store.id ?? store.storeId ?? id),
            name: store.name || store.storeName || store.title || `Store #${id}`,
            imageUrl: store.imageUrl ?? store.image ?? '',
            phoneNumber: store.phoneNumber ?? store.phone ?? store.contactNumber ?? '',
            active: store.active ?? store.isActive ?? true,
          },
        };
      },
      providesTags: (result, error, id) => [{ type: 'StoreTypes', id }],
    }),
    suggestStoreTypes: builder.query<StoreType[], string>({
      query: (query) => `/api/admin/stores?search=${encodeURIComponent(query)}`,
      providesTags: ['StoreTypes', 'Stores'],
    }),
    createStoreType: builder.mutation<StoreType, { data: StoreRequest; image?: File }>({
      query: ({ data, image }) => {
        if (image && !data.imageUrl) {
          const fd = toFormData(data, image);
          return {
            url: '/api/admin/stores',
            method: 'POST',
            body: fd,
          };
        }
        return {
          url: '/api/admin/stores',
          method: 'POST',
          body: toApiStorePayload(data),
        };
      },
      invalidatesTags: ['StoreTypes', 'Stores'],
    }),
    updateStoreType: builder.mutation<StoreType, { id: number; data: StoreRequest; image?: File }>({
      query: ({ id, data, image }) => {
        if (image && !data.imageUrl) {
          const fd = toFormData(data, image);
          return {
            url: `/api/admin/stores/${id}`,
            method: 'PUT',
            body: fd,
          };
        }
        return {
          url: `/api/admin/stores/${id}`,
          method: 'PUT',
          body: toApiStorePayload(data),
        };
      },
      invalidatesTags: ['StoreTypes', 'Stores'],
    }),
    deleteStoreType: builder.mutation<void, number>({
      query: (id) => ({
        url: `/api/admin/stores/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['StoreTypes', 'Stores'],
    }),
  }),
});

const toApiStorePayload = (data: StoreRequest) => ({
  name: data.name.trim(),
  ...(data.address ? { address: data.address } : {}),
  ...(data.city ? { city: data.city } : {}),
  ...(data.pincode ? { pincode: data.pincode } : {}),
  country: 'India',
  ...(data.phoneNumber ? { phone: data.phoneNumber, phoneNumber: data.phoneNumber } : {}),
  ...(data.email ? { email: data.email } : {}),
  ...(data.imageUrl ? { imageUrl: data.imageUrl, image: data.imageUrl } : {}),
  active: data.active ?? true,
  isActive: data.active ?? true,
});

const toFormData = (data: StoreRequest, image: File) => {
  const fd = new FormData();
  const payload = toApiStorePayload(data);
  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') fd.append(key, String(value));
  });
  fd.append('file', image);
  fd.append('image', image);
  fd.append('storeImage', image);
  return fd;
};

export const {
  useGetStoreTypesQuery,
  useGetStoreTypeByIdQuery,
  useSuggestStoreTypesQuery,
  useCreateStoreTypeMutation,
  useUpdateStoreTypeMutation,
  useDeleteStoreTypeMutation,
} = storeTypeApi;

const getAuthHeaders = (isFormData = false) => {
  const token = getStoredAccessToken();
  const headers: Record<string, string> = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  headers['Accept'] = 'application/json';
  if (!isFormData) headers['Content-Type'] = 'application/json';
  return headers;
};

export const fetchStores = async (
  name?: string,
  page = 0,
  size = 10,
  sort?: string,
): Promise<{ content: StoreType[]; totalPages: number; totalElements: number }> => {
  const params = new URLSearchParams();
  if (name) params.append('name', name);
  params.append('page', page.toString());
  params.append('size', size.toString());
  if (sort) params.append('sort', sort);
  const res = await fetch(`${API_BASE_URL}?${params}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch stores');
  return res.json();
};

export const fetchStoreById = async (id: number): Promise<StoreType> => {
  const res = await fetch(`${API_BASE_URL}/${id}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Store not found');
  return res.json();
};

export const suggestStores = async (query: string): Promise<StoreType[]> => {
  const res = await fetch(`${API_BASE_URL}/suggest?q=${encodeURIComponent(query)}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to suggest stores');
  return res.json();
};

export const createStore = async (storeData: StoreRequest, imageFile?: File): Promise<StoreType> => {
  const res = await fetch(API_BASE_URL, {
    method: 'POST',
    body: JSON.stringify(toApiStorePayload(storeData)),
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to create store');
  return res.json();
};

export const updateStore = async (
  id: number,
  storeData: StoreRequest,
  imageFile?: File,
): Promise<StoreType> => {
  const res = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(toApiStorePayload(storeData)),
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to update store');
  return res.json();
};

export const deleteStore = async (id: number): Promise<void> => {
  const res = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to delete store');
};
