import { baseApiWithAuth } from '@api/baseApi';

// ─── Status enum ─────────────────────────────────────────────────────────────
export type CustomerStatus =
  | 'ACTIVE'
  | 'VERIFIED'
  | 'PENDING_VERIFICATION'
  | 'REJECTED'
  | 'INACTIVE';

// ─── Customer model ───────────────────────────────────────────────────────────
export interface Customer {
  id: string;
  name: string | null;
  phoneNumber: string;
  email: string | null;
  /** Derived convenience flag: true when status is ACTIVE or VERIFIED */
  isActive: boolean;
  /** Raw status string from the backend */
  status: CustomerStatus | string;
  createdAt: string;
  updatedAt: string;
  companyName?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  pincode?: string | null;
  businessType?: string | null;
  gstin?: string | null;
  /** URL to the uploaded GST certificate image */
  gstinPhotoUrl?: string | null;
  panCardNumber?: string | null;
  /** URL to the uploaded PAN card image */
  panCardImage?: string | null;
}

export interface CustomerApiResponse {
  customers: Customer[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
}

export interface CustomerQueryParams {
  search?: string;
  /** Status filter: 'ALL' means no filter is sent to the backend */
  status?: string;
  page?: number;
  size?: number;
}

const extractUsers = (raw: any, depth = 0): any[] => {
  if (Array.isArray(raw)) return raw;
  if (!raw || typeof raw !== 'object' || depth > 4) return [];

  // `content` is first — Spring Page objects use this key
  const keys = [
    'content',
    'buyers',
    'customers',
    'users',
    'customerList',
    'userList',
    'items',
    'results',
    'records',
    'list',
    'rows',
    'data',
  ];
  for (const key of keys) {
    const list = extractUsers(raw[key], depth + 1);
    if (list.length) return list;
  }

  for (const value of Object.values(raw)) {
    if (Array.isArray(value) && value.some((item: any) => item && typeof item === 'object' && ('id' in item || 'userId' in item))) {
      return value;
    }
    const nested = extractUsers(value, depth + 1);
    if (nested.length) return nested;
  }

  return [];
};

const ACTIVE_STATUSES = new Set<string>(['ACTIVE', 'VERIFIED']);

/** Normalise a raw backend user object into the canonical Customer shape. */
const toCustomer = (user: any): Customer => {
  const rawStatus = String(user.status ?? '').toUpperCase();
  const isActive =
    ACTIVE_STATUSES.has(rawStatus) ||
    user.isActive === true ||
    user.active === true ||
    user.enabled === true;

  return {
    id: String(user.id ?? user.userId ?? user.customerId ?? ''),
    // Backend sends `fullName`; keep `name` / other aliases as fallbacks.
    name:
      user.fullName ??
      user.name ??
      user.customerName ??
      user.displayName ??
      user.username ??
      null,
    phoneNumber:
      user.phoneNumber ?? user.phone ?? user.mobile ?? user.mobileNumber ?? '',
    email: user.email ?? user.emailAddress ?? null,
    status: rawStatus || (isActive ? 'ACTIVE' : 'INACTIVE'),
    isActive,
    createdAt:
      user.createdAt ??
      user.createdDate ??
      user.registeredAt ??
      user.registeredDate ??
      '',
    updatedAt: user.updatedAt ?? user.updatedDate ?? '',
    companyName: user.companyName ?? user.company ?? user.businessName ?? null,
    address: user.address ?? user.addressLine1 ?? null,
    city: user.city ?? null,
    state: user.state ?? null,
    pincode: user.pincode ?? user.postalCode ?? user.zipCode ?? null,
    businessType:
      user.businessType ?? user.business_type ?? user.typeOfBusiness ?? null,
    gstin: user.gstin ?? user.GSTIN ?? user.gstNumber ?? user.gstNo ?? null,
    // Backend field: `gstinPhotoUrl`
    gstinPhotoUrl:
      user.gstinPhotoUrl ??
      user.gstinPhoto ??
      user.gstPhoto ??
      user.gstDocumentUrl ??
      null,
    // Backend field: `panNumber`
    panCardNumber:
      user.panNumber ??
      user.panCardNumber ??
      user.pancardNumber ??
      user.panNo ??
      null,
    // Backend field: `panCardUrl`
    panCardImage:
      user.panCardUrl ??
      user.panCardImage ??
      user.pancardImage ??
      user.panImage ??
      user.panDocumentUrl ??
      null,
  };
};

const numberFrom = (raw: any, keys: string[]) => {
  for (const key of keys) {
    const value = Number(raw?.[key]);
    if (raw?.[key] !== undefined && Number.isFinite(value)) return value;
  }
  return undefined;
};

export const customerApi = baseApiWithAuth.injectEndpoints({
  // ─── Endpoints ──────────────────────────────────────────────────────────────
  endpoints: (builder) => ({
    getCustomers: builder.query<CustomerApiResponse, CustomerQueryParams>({
      async queryFn(params, _api, _extraOptions, fetchWithBQ) {
        const pageSize = params.size || 20;
        const queryParams: Record<string, string | number> = {
          page: params.page || 0,
          size: pageSize,
        };
        if (params.search) queryParams.search = params.search;
        if (params.status && params.status !== 'ALL') {
          queryParams.status = params.status;
        }

        // Try dedicated buyers endpoint first; fall back to customers.
        let response = await fetchWithBQ({ url: '/api/admin/buyers', params: queryParams });
        if (response.error) {
          response = await fetchWithBQ({ url: '/api/admin/customers', params: queryParams });
        }
        if (response.error) return { error: response.error };

        const raw: any = response.data;
        const users = extractUsers(raw).map(toCustomer);
        const totalElements =
          numberFrom(raw, ['totalElements', 'totalCount', 'totalRecords', 'totalItems', 'total', 'count']) ??
          numberFrom(raw?.data, ['totalElements', 'totalCount', 'totalRecords', 'totalItems', 'total', 'count']) ??
          numberFrom(raw?.meta, ['totalElements', 'totalCount', 'totalRecords', 'totalItems', 'total', 'count']) ??
          numberFrom(raw?.pagination, ['totalElements', 'totalCount', 'totalRecords', 'totalItems', 'total', 'count']) ??
          users.length;

        const totalPages =
          numberFrom(raw, ['totalPages', 'pageCount', 'pages']) ??
          numberFrom(raw?.data, ['totalPages', 'pageCount', 'pages']) ??
          numberFrom(raw?.meta, ['totalPages', 'pageCount', 'pages']) ??
          numberFrom(raw?.pagination, ['totalPages', 'pageCount', 'pages']) ??
          Math.max(1, Math.ceil(totalElements / pageSize));
        const currentPage =
          numberFrom(raw, ['currentPage', 'page', 'number']) ??
          numberFrom(raw?.data, ['currentPage', 'page', 'number']) ??
          numberFrom(raw?.meta, ['currentPage', 'page', 'number']) ??
          (params.page || 0);

        return { data: { customers: users, totalElements, totalPages, currentPage } };
      },
      providesTags: (result) =>
        result
          ? [
            ...result.customers.map(({ id }) => ({ type: 'User' as const, id })),
            { type: 'User', id: 'PARTIAL-LIST' },
          ]
          : [{ type: 'User', id: 'PARTIAL-LIST' }],
    }),

    // ── Single buyer ───────────────────────────────────────────────────────────
    getCustomerById: builder.query<Customer, string>({
      async queryFn(id, _api, _extraOptions, fetchWithBQ) {
        // Try new buyers endpoint first; fall back to customers.
        let response = await fetchWithBQ({ url: `/api/admin/buyers/${id}` });
        if (response.error) {
          response = await fetchWithBQ({ url: `/api/admin/customers/${id}` });
        }
        if (response.error) return { error: response.error };

        const raw: any = response.data;
        const customer =
          raw?.data?.buyer ??
          raw?.data?.customer ??
          raw?.buyer ??
          raw?.data ??
          raw?.customer ??
          raw;
        return { data: toCustomer(customer) };
      },
      providesTags: (_result, _error, id) => [{ type: 'User', id }],
    }),

    // ── Update buyer status (PATCH /api/admin/buyers/{id}/status) ──────────────────
    updateCustomerStatus: builder.mutation<
      { success: boolean },
      { id: string; status: string }
    >({
      async queryFn({ id, status }, _api, _extraOptions, fetchWithBQ) {
        const body = { status };
        const primaryUrl = `/api/admin/buyers/${id}/status`;
        console.info('[Customer API] PATCH status request', { primaryUrl, customerId: id, body });

        let response = await fetchWithBQ({ url: primaryUrl, method: 'PATCH', body });
        // Fallback: old customers endpoint with both enum and boolean aliases.
        if (response.error) {
          const fallbackUrl = `/api/admin/customers/${id}/status`;
          const isActiveValue = ACTIVE_STATUSES.has(status);
          response = await fetchWithBQ({
            url: fallbackUrl,
            method: 'PATCH',
            body: { status, active: isActiveValue, isActive: isActiveValue },
          });
        }

        if (response.error) {
          console.error('[Customer API] PATCH status failed', { id, error: response.error });
          return { error: response.error };
        }

        console.info('[Customer API] PATCH status success', { id, status });
        return { data: (response.data as { success: boolean }) ?? { success: true } };
      },
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'User', id },
        { type: 'User', id: 'PARTIAL-LIST' },
      ],
    }),

    // ── Delete buyer ───────────────────────────────────────────────────────────
    deleteCustomer: builder.mutation<{ message: string; success: boolean }, string>({
      async queryFn(id, _api, _extraOptions, fetchWithBQ) {
        const primaryUrl = `/api/admin/buyers/${id}`;
        console.info('[Customer API] DELETE request', { url: primaryUrl, customerId: id });

        let response = await fetchWithBQ({ url: primaryUrl, method: 'DELETE' });
        if (response.error) {
          const fallbackUrl = `/api/admin/customers/${id}`;
          response = await fetchWithBQ({ url: fallbackUrl, method: 'DELETE' });
        }

        if (response.error) {
          console.error('[Customer API] DELETE failed', { id, error: response.error });
          return { error: response.error };
        }

        console.info('[Customer API] DELETE success', { id });
        return { data: response.data as { message: string; success: boolean } };
      },
      invalidatesTags: [{ type: 'User', id: 'PARTIAL-LIST' }],
    }),
  }),
});

export const {
  useGetCustomersQuery,
  useGetCustomerByIdQuery,
  useUpdateCustomerStatusMutation,
  useDeleteCustomerMutation,
} = customerApi;
