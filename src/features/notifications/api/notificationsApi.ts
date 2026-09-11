import { baseApiWithAuth } from '@api/baseApi';

export interface SendNotificationRequest { title: string; message: string; recipientType?: string; targetUrl?: string; phoneNumber?: string; }
export interface BroadcastNotificationRequest { title: string; message: string; }
export interface SendNotificationResponse { success: boolean; message: string; [key: string]: unknown; }
export interface SaveTokenRequest { token: string; userType: string; }
export interface SaveTokenResponse { success: boolean; message: string; }

export const notificationsApi = baseApiWithAuth.injectEndpoints({
  endpoints: (builder) => ({
    sendNotification: builder.mutation<SendNotificationResponse, SendNotificationRequest>({
      query: (body) => ({ url: '/api/admin/notifications/send', method: 'POST', body }),
      async onQueryStarted(arg, { queryFulfilled }) {
        console.log('[notificationsApi] POST /api/admin/notifications/send initiated with payload:', arg);
        try {
          const { data } = await queryFulfilled;
          console.log('✅ [notificationsApi] POST /api/admin/notifications/send confirmation:', data);
        } catch (error) {
          console.error('❌ [notificationsApi] POST /api/admin/notifications/send error:', error);
        }
      },
    }),
    broadcastToCustomers: builder.mutation<SendNotificationResponse, BroadcastNotificationRequest>({
      query: (body) => ({ url: '/api/admin/notifications/send-to-customers', method: 'POST', body }),
      async onQueryStarted(arg, { queryFulfilled }) {
        console.log('[notificationsApi] POST /api/admin/notifications/send-to-customers initiated with payload:', arg);
        try {
          const { data } = await queryFulfilled;
          console.log('✅ [notificationsApi] POST /api/admin/notifications/send-to-customers confirmation:', data);
        } catch (error) {
          console.error('❌ [notificationsApi] POST /api/admin/notifications/send-to-customers error:', error);
        }
      },
    }),
    broadcastToDelivery: builder.mutation<SendNotificationResponse, BroadcastNotificationRequest>({
      query: (body) => ({ url: '/api/admin/notifications/send-to-delivery', method: 'POST', body }),
      async onQueryStarted(arg, { queryFulfilled }) {
        console.log('[notificationsApi] POST /api/admin/notifications/send-to-delivery initiated with payload:', arg);
        try {
          const { data } = await queryFulfilled;
          console.log('✅ [notificationsApi] POST /api/admin/notifications/send-to-delivery confirmation:', data);
        } catch (error) {
          console.error('❌ [notificationsApi] POST /api/admin/notifications/send-to-delivery error:', error);
        }
      },
    }),
    saveToken: builder.mutation<SaveTokenResponse, SaveTokenRequest>({
      query: (body) => ({ url: '/api/admin/save-token', method: 'POST', body }),
      async onQueryStarted(arg, { queryFulfilled }) {
        console.log('[notificationsApi] POST /api/admin/save-token initiated with payload:', arg);
        try {
          const { data } = await queryFulfilled;
          console.log('✅ [notificationsApi] POST /api/admin/save-token confirmation:', data);
        } catch (error) {
          console.error('❌ [notificationsApi] POST /api/admin/save-token error:', error);
        }
      },
    }),
  }),
});

export const { useSendNotificationMutation, useBroadcastToCustomersMutation, useBroadcastToDeliveryMutation, useSaveTokenMutation } = notificationsApi;

export const sendNotificationToUser = async (data: SendNotificationRequest) => {
  console.log('[notificationsApi] Calling sendNotificationToUser API:', data);
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/notifications/send`, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(data) });
  if (!response.ok) {
    console.error('❌ [notificationsApi] sendNotificationToUser failed with status:', response.status);
    throw new Error('Failed to send notification');
  }
  const result = await response.json() as SendNotificationResponse;
  console.log('✅ [notificationsApi] sendNotificationToUser response confirmed:', result);
  return result;
};
export const broadcastToCustomers = async (data: BroadcastNotificationRequest) => {
  console.log('[notificationsApi] Calling broadcastToCustomers API:', data);
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/notifications/send-to-customers`, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(data) });
  if (!response.ok) {
    console.error('❌ [notificationsApi] broadcastToCustomers failed with status:', response.status);
    throw new Error('Failed to broadcast to customers');
  }
  const result = await response.json() as SendNotificationResponse;
  console.log('✅ [notificationsApi] broadcastToCustomers response confirmed:', result);
  return result;
};
export const broadcastToDelivery = async (data: BroadcastNotificationRequest) => {
  console.log('[notificationsApi] Calling broadcastToDelivery API:', data);
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/notifications/send-to-delivery`, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(data) });
  if (!response.ok) {
    console.error('❌ [notificationsApi] broadcastToDelivery failed with status:', response.status);
    throw new Error('Failed to broadcast to delivery personnel');
  }
  const result = await response.json() as SendNotificationResponse;
  console.log('✅ [notificationsApi] broadcastToDelivery response confirmed:', result);
  return result;
};
