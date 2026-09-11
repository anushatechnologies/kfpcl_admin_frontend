import { baseApiWithAuth, baseApi } from '@api/baseApi';

export interface Banner {
  id?: number;
  name: string;
  title?: string;
  imageUrl: string;
  videoUrl?: string;
  targetUrl?: string;
  actionType?: string;
  actionValue?: string;
  isActive: boolean;
  active?: boolean;
  displayOrder: number;
  targetApp?: 'CUSTOMER' | 'DELIVERY' | 'BOTH' | string;
  createdAt?: string;
  updatedAt?: string;
}

export interface BannerPayload {
  title: string;
  imageUrl: string;
  targetUrl?: string;
  position?: number;
  active?: boolean;
}

export const bannersApi = baseApiWithAuth.injectEndpoints({
  endpoints: (builder) => ({
    // Admin: Create Banner (supports JSON and FormData, with fallback to /api/banners)
    createBanner: builder.mutation<any, BannerPayload | FormData | any>({
      async queryFn(body, _api, _extraOptions, fetchWithBQ) {
        const adminRes = await fetchWithBQ({
          url: '/api/admin/banners',
          method: 'POST',
          body,
        });
        if (!adminRes.error) return { data: adminRes.data };

        if (adminRes.error.status === 404 || adminRes.error.status === 405) {
          const publicRes = await fetchWithBQ({
            url: '/api/banners',
            method: 'POST',
            body,
          });
          if (!publicRes.error) return { data: publicRes.data };
        }

        return { error: adminRes.error };
      },
      invalidatesTags: ['Banners' as any],
    }),
    
    // Admin: Get All Banners (with route fallback and dual array/.banners access)
    getAdminBanners: builder.query<any, void>({
      async queryFn(_arg, _api, _extraOptions, fetchWithBQ) {
        let res = await fetchWithBQ('/api/admin/banners');
        if (res.error && (res.error.status === 404 || res.error.status === 405)) {
          res = await fetchWithBQ('/api/banners');
        }
        if (res.error) return { error: res.error };
        const raw: any = res.data;
        const list = (Array.isArray(raw) ? raw : raw?.banners ?? raw?.data ?? raw?.content ?? []).map((banner: any) => {
          let img = banner.imageUrl ?? banner.image ?? banner.bannerImage ?? '';
          if (img && !/^https?:\/\//i.test(img)) {
            const base = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '');
            img = `${base}/${img.replace(/^\/+/, '')}`;
          }
          const isActive = banner.isActive ?? banner.active ?? true;
          return {
            ...banner,
            name: banner.name ?? banner.title ?? '',
            title: banner.title ?? banner.name ?? '',
            imageUrl: img,
            isActive,
            active: isActive,
            displayOrder: Number(banner.displayOrder ?? banner.position ?? banner.order ?? 0),
            targetUrl: banner.targetUrl ?? banner.link ?? '',
            targetApp: banner.targetApp ?? 'CUSTOMER',
          };
        });

        return { data: list };
      },
      providesTags: ['Banners' as any],
    }),
    
    // Admin: Update Banner (supports JSON and FormData, with fallback to /api/banners/{id})
    updateBanner: builder.mutation<any, { id: number; body: BannerPayload | FormData | any }>({
      async queryFn({ id, body }, _api, _extraOptions, fetchWithBQ) {
        const adminRes = await fetchWithBQ({
          url: `/api/admin/banners/${id}`,
          method: 'PUT',
          body,
        });
        if (!adminRes.error) return { data: adminRes.data };

        if (adminRes.error.status === 404 || adminRes.error.status === 405) {
          const publicRes = await fetchWithBQ({
            url: `/api/banners/${id}`,
            method: 'PUT',
            body,
          });
          if (!publicRes.error) return { data: publicRes.data };
        }

        return { error: adminRes.error };
      },
      invalidatesTags: ['Banners' as any],
    }),
    
    // Admin: Toggle Banner Status
    toggleBannerStatus: builder.mutation<any, { id: number; isActive: boolean }>({
      query: ({ id, isActive }) => ({
        url: `/api/admin/banners/${id}/status`,
        method: 'PATCH',
        body: { active: isActive },
      }),
      invalidatesTags: ['Banners' as any],
    }),
    
    // Admin: Delete Banner
    deleteBanner: builder.mutation<any, number>({
      query: (id) => ({
        url: `/api/admin/banners/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Banners' as any],
    }),
  }),
});

// Since customer endpoint is /api/customer/banners, we add it to baseApi (no auth) or baseApiWithAuth depending on requirements.
export const customerBannersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Customer: Get Active Banners
    getCustomerBanners: builder.query<any, void>({
      query: () => '/api/customer/banners',
      providesTags: ['Banners' as any],
    }),
  }),
});

export const {
  useCreateBannerMutation,
  useGetAdminBannersQuery,
  useUpdateBannerMutation,
  useToggleBannerStatusMutation,
  useDeleteBannerMutation,
} = bannersApi;

export const {
  useGetCustomerBannersQuery,
} = customerBannersApi;
