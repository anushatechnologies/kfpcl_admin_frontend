import { baseApiWithAuth } from '@api/baseApi';

export interface RfqItem {
  id: number;
  rfqNumber?: string;
  title?: string;
  productName?: string;
  buyerName?: string;
  buyerId?: number | string;
  buyerPhone?: string;
  buyerEmail?: string;
  buyerCompany?: string;
  buyerAddress?: string;
  buyerCity?: string;
  buyerState?: string;
  buyerPincode?: string;
  deliveryLocation?: string;
  storeId?: number | string;
  storeName?: string;
  assignedStore?: string;
  supplierName?: string;
  status?: string;
  isAccepted?: boolean;
  isRejected?: boolean;
  quotation?: { status?: string; isAccepted?: boolean; isRejected?: boolean } | null;
  quantity?: number | string;
  targetPrice?: number;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface QuotePayload {
  unitPrice: number;
  quantity: number;
  deliveryDays: string;
  notes?: string;
  moq?: number;
  availability?: string;
  paymentTerms?: string;
}

export interface RfqResponse {
  rfqs: RfqItem[];
  content: RfqItem[];
  data: RfqItem[];
  totalElements: number;
  totalPages: number;
}

export const normalizeRfqItem = (item: any): RfqItem => {
  const buyerCompany =
    item.buyerCompany ??
    item.companyName ??
    item.company ??
    item.businessName ??
    item.storeName ??
    item.buyer?.companyName ??
    item.buyer?.company ??
    item.buyer?.businessName ??
    item.customer?.companyName ??
    item.customer?.company ??
    item.customer?.businessName ??
    item.user?.companyName ??
    item.user?.company ??
    item.user?.businessName ??
    '';

  const buyerAddress =
    item.buyerAddress ??
    item.address ??
    item.addressLine1 ??
    item.buyer?.address ??
    item.buyer?.addressLine1 ??
    item.customer?.address ??
    item.customer?.addressLine1 ??
    item.user?.address ??
    item.user?.addressLine1 ??
    item.deliveryAddress?.address ??
    item.deliveryAddress?.addressLine1 ??
    item.shippingAddress?.address ??
    item.shippingAddress?.addressLine1 ??
    (typeof item.deliveryAddress === 'string' ? item.deliveryAddress : '') ??
    (typeof item.shippingAddress === 'string' ? item.shippingAddress : '') ??
    '';

  const buyerCity =
    item.buyerCity ??
    item.city ??
    item.cityName ??
    item.district ??
    item.buyer?.city ??
    item.customer?.city ??
    item.user?.city ??
    item.deliveryAddress?.city ??
    item.shippingAddress?.city ??
    (typeof item.location === 'string' ? item.location : '') ??
    (typeof item.buyerLocation === 'string' ? item.buyerLocation : '') ??
    '';

  const buyerState =
    item.buyerState ??
    item.state ??
    item.stateName ??
    item.buyer?.state ??
    item.customer?.state ??
    item.user?.state ??
    item.deliveryAddress?.state ??
    item.shippingAddress?.state ??
    '';

  const buyerPincode =
    item.buyerPincode ??
    item.pincode ??
    item.postalCode ??
    item.zipCode ??
    item.buyer?.pincode ??
    item.buyer?.postalCode ??
    item.customer?.pincode ??
    item.user?.pincode ??
    item.deliveryAddress?.pincode ??
    item.shippingAddress?.pincode ??
    '';

  const rawDeliveryLocation = item.deliveryLocation ?? item.delivery_location;
  const deliveryLocation =
    typeof rawDeliveryLocation === 'string'
      ? rawDeliveryLocation
      : [
          rawDeliveryLocation?.address,
          rawDeliveryLocation?.city,
          rawDeliveryLocation?.state,
          rawDeliveryLocation?.pincode,
        ]
          .filter(Boolean)
          .join(', ');

  return {
    id: item.id ?? item.rfqId ?? 0,
    rfqNumber:
      item.rfqNumber ??
      item.rfqCode ??
      item.referenceNo ??
      item.rfqNo ??
      (item.id ? `RFQ-${item.id}` : ''),
    title:
      item.subject ??
      item.title ??
      item.productName ??
      item.product?.name ??
      item.product?.title ??
      item.requirement ??
      item.description ??
      'Buyer inquiry',
    productName:
      item.productName ??
      item.product?.name ??
      item.product?.title ??
      item.product?.productName ??
      item.requestedProduct ??
      item.requestedItem ??
      '',
    buyerName:
      item.buyerName ??
      item.buyer?.name ??
      item.buyer?.fullName ??
      item.customerName ??
      item.customer?.name ??
      item.userName ??
      item.user?.name ??
      item.user?.email ??
      'Buyer',
    buyerId: item.buyerId ?? item.buyer?.id ?? item.buyer?.userId ?? item.customerId ?? item.customer?.id ?? item.userId,
    buyerPhone:
      item.buyerPhone ??
      item.phoneNumber ??
      item.phone ??
      item.buyer?.phone ??
      item.buyer?.phoneNumber ??
      item.user?.phone ??
      item.user?.phoneNumber ??
      '',
    buyerEmail: item.buyerEmail ?? item.email ?? item.buyer?.email ?? item.user?.email ?? '',
    buyerCompany,
    buyerAddress,
    buyerCity,
    buyerState,
    buyerPincode,
    deliveryLocation,
    storeId: item.storeId ?? item.store?.id,
    storeName:
      item.storeName ??
      item.product?.storeName ??
      item.product?.store?.name ??
      item.store?.name ??
      '',
    assignedStore:
      typeof item.assignedStore === 'string'
        ? item.assignedStore
        : item.assignedStore?.name ?? item.assignedStore?.storeName ?? '',
    supplierName:
      item.supplierName ??
      (typeof item.supplier === 'string' ? item.supplier : item.supplier?.name) ??
      item.supplier?.name ??
      item.vendorName ??
      item.storeName ??
      item.store?.name ??
      'Awaiting response',
    status: item.status ?? item.rfqStatus ?? 'Pending',
    isAccepted: Boolean(item.isAccepted || item.status?.toUpperCase() === 'ACCEPTED'),
    isRejected: Boolean(item.isRejected || item.status?.toUpperCase() === 'REJECTED'),
    quotation: item.quotation ?? null,
    quantity:
      item.quantity ??
      item.requestedQuantity ??
      item.qty ??
      undefined,
    targetPrice: Number(item.targetPrice ?? item.expectedPrice ?? item.budget ?? 0) || undefined,
    notes: item.notes ?? item.message ?? item.comment ?? item.remarks ?? '',
    createdAt: item.createdAt ?? item.createdDate ?? item.date ?? new Date().toISOString(),
    updatedAt: item.updatedAt ?? item.updatedDate ?? undefined,
  };
};

// The RFQ endpoints have returned a few equivalent paginated shapes over time
// (for example `{ content: [] }`, `{ data: { items: [] } }`, and `{ results: [] }`).
// Keep the response parsing in one place so the count and table always use the
// same payload instead of silently rendering an empty table for a valid response.
const extractRfqList = (raw: any, depth = 0): any[] => {
  if (Array.isArray(raw)) return raw;
  if (!raw || typeof raw !== 'object' || depth > 3) return [];

  const listKeys = [
    'content',
    'rfqs',
    'items',
    'results',
    'records',
    'list',
    'rows',
    'rfqList',
    'rfqRequests',
    'rfqData',
    'rfq',
    'requests',
    'inquiries',
    'data',
  ];
  for (const key of listKeys) {
    const list = extractRfqList(raw[key], depth + 1);
    if (list.length > 0) return list;
  }

  // Last-resort support for a backend wrapper whose collection property has a
  // different name. Prefer arrays containing RFQ-like records so metadata
  // arrays are not accidentally rendered as table rows.
  for (const value of Object.values(raw)) {
    if (!Array.isArray(value)) continue;
    if (value.some((item) => item && typeof item === 'object' && ('id' in item || 'rfqId' in item))) {
      return value;
    }
  }

  for (const value of Object.values(raw)) {
    const list = extractRfqList(value, depth + 1);
    if (list.length > 0) return list;
  }

  return [];
};

const getNestedNumber = (raw: any, keys: string[]): number | undefined => {
  if (!raw || typeof raw !== 'object') return undefined;
  for (const key of keys) {
    const value = raw[key];
    const number = Number(value);
    if (value !== null && value !== undefined && Number.isFinite(number)) return number;
  }
  return undefined;
};

export const rfqApi = baseApiWithAuth.injectEndpoints({
  endpoints: (builder) => ({
    getRfqById: builder.query<RfqItem, number>({
      query: (rfqId) => `/api/admin/rfqs/${rfqId}`,
      transformResponse: (raw: any) => normalizeRfqItem(raw?.rfq ?? raw?.data ?? raw),
      providesTags: (_result, _error, rfqId) => [{ type: 'Orders', id: `RFQ-${rfqId}` }],
    }),
    getRfqs: builder.query<
      RfqResponse,
      { search?: string; status?: string; page?: number; size?: number }
    >({
      async queryFn({ search, status, page = 0, size = 20 }, _api, _extraOptions, fetchWithBQ) {
        const params: Record<string, any> = {
          ...(search ? { search } : {}),
          ...(status ? { status } : {}),
          page,
          size,
        };

        let res = await fetchWithBQ({
          url: '/api/admin/rfqs',
          params,
        });

        if (res.error && (res.error.status === 404 || res.error.status === 405)) {
          res = await fetchWithBQ({
            url: '/api/v1/admin/rfqs',
            params,
          });
        }

        if (res.error && (res.error.status === 404 || res.error.status === 405)) {
          res = await fetchWithBQ({
            url: '/api/rfqs',
            params,
          });
        }

        if (res.error) return { error: res.error };

        const raw: any = res.data;
        const rawList = extractRfqList(raw);
        console.log('[RFQ API] Raw RFQ items from backend:', rawList);
        const list = rawList.map(normalizeRfqItem);

        const totalElements = Number(
          getNestedNumber(raw, ['totalElements', 'total', 'count']) ??
            getNestedNumber(raw?.data, ['totalElements', 'total', 'count']) ??
            getNestedNumber(raw?.meta, ['totalElements', 'total', 'count']) ??
            getNestedNumber(raw?.pagination, ['totalElements', 'total', 'count']) ??
            getNestedNumber(raw?.pagination, ['totalItems', 'itemsCount']) ??
            list.length,
        );
        const totalPages = Math.max(
          1,
          Number(
            getNestedNumber(raw, ['totalPages', 'pages']) ??
              getNestedNumber(raw?.data, ['totalPages', 'pages']) ??
              getNestedNumber(raw?.meta, ['totalPages', 'pages']) ??
              getNestedNumber(raw?.pagination, ['totalPages', 'pages']) ??
              Math.ceil(totalElements / size),
          ),
        );

        return {
          data: {
            rfqs: list,
            content: list,
            data: list,
            totalElements,
            totalPages,
          },
        };
      },
      providesTags: [{ type: 'Orders', id: 'RFQ-LIST' }],
    }),

    sendRfqQuote: builder.mutation<any, { rfqId: number; quote: QuotePayload }>({
      async queryFn({ rfqId, quote }, _api, _extraOptions, fetchWithBQ) {
        const payload: Record<string, any> = {
          unitPrice: Number(quote.unitPrice),
          quantity: Number(quote.quantity),
          deliveryDays: quote.deliveryDays || '7 Business Days',
          ...(quote.notes ? { notes: quote.notes } : {}),
          ...(quote.moq ? { moq: Number(quote.moq) } : {}),
          ...(quote.availability ? { availability: quote.availability } : {}),
          ...(quote.paymentTerms ? { paymentTerms: quote.paymentTerms } : {}),
        };

        // Primary endpoint specified by backend
        let res = await fetchWithBQ({
          url: `/api/admin/rfqs/${rfqId}/quotation`,
          method: 'POST',
          body: payload,
        });

        if (!res.error) {
          return { data: res.data };
        }

        // Fallback to public route if admin prefix is not routed
        if (res.error.status === 404 || res.error.status === 405) {
          const publicRes = await fetchWithBQ({
            url: `/api/rfqs/${rfqId}/quotation`,
            method: 'POST',
            body: payload,
          });

          if (!publicRes.error) {
            return { data: publicRes.data };
          }
        }

        return { error: res.error };
      },
      invalidatesTags: [{ type: 'Orders', id: 'RFQ-LIST' }],
    }),
  }),
});

export const { useGetRfqByIdQuery, useGetRfqsQuery, useSendRfqQuoteMutation } = rfqApi;
