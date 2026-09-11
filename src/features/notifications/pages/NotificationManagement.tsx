import { useState } from 'react';
import { Alert, Box, Button, MenuItem, Paper, Stack, TextField, Typography } from '@mui/material';
import { Send } from '@mui/icons-material';
import { useBroadcastToCustomersMutation, useBroadcastToDeliveryMutation, useSendNotificationMutation } from '../api/notificationsApi';

type Target = 'GENERAL' | 'ALL_CUSTOMERS' | 'ALL_DELIVERY';

export default function NotificationManagement() {
  const [target, setTarget] = useState<Target>('GENERAL');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [recipientType, setRecipientType] = useState('ALL_CUSTOMERS');
  const [targetUrl, setTargetUrl] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [sendNotification, sendState] = useSendNotificationMutation();
  const [broadcastCustomers, customerState] = useBroadcastToCustomersMutation();
  const [broadcastDelivery, deliveryState] = useBroadcastToDeliveryMutation();

  const isSending = sendState.isLoading || customerState.isLoading || deliveryState.isLoading;

  const submit = async () => {
    if (!title.trim() || !message.trim()) return;
    setFeedback(null);
    try {
      let response;
      if (target === 'ALL_CUSTOMERS') {
        const payload = { title: title.trim(), message: message.trim() };
        console.log('[Notification Page] Sending API call (Broadcast to Customers):', payload);
        response = await broadcastCustomers(payload).unwrap();
      } else if (target === 'ALL_DELIVERY') {
        const payload = { title: title.trim(), message: message.trim() };
        console.log('[Notification Page] Sending API call (Broadcast to Delivery):', payload);
        response = await broadcastDelivery(payload).unwrap();
      } else {
        const payload = {
          title: title.trim(),
          message: message.trim(),
          recipientType,
          targetUrl: targetUrl.trim() || undefined,
        };
        console.log('[Notification Page] Sending API call (Send Notification):', payload);
        response = await sendNotification(payload as any).unwrap();
      }
      console.log('✅ [Notification Page] API Call Confirmed - Response:', response);
      setFeedback('Notification sent successfully.');
      setTitle('');
      setMessage('');
      setTargetUrl('');
    } catch (error: any) {
      console.error('❌ [Notification Page] API Call Failed:', error);
      setFeedback(error?.data?.message || error?.message || 'Unable to send notification.');
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1100, mx: 'auto' }}>
      <Box sx={{ mb: 3 }}><Typography variant="h4" fontWeight={800}>Notifications</Typography><Typography color="text.secondary" sx={{ mt: 0.75 }}>Send important updates to customers and delivery personnel.</Typography></Box>
      {feedback && <Alert severity={feedback.includes('successfully') ? 'success' : 'error'} sx={{ mb: 2 }}>{feedback}</Alert>}
      <Paper sx={{ p: { xs: 2, md: 4 }, borderRadius: 3 }}>
        <Stack spacing={2.5}>
          <TextField select label="Audience" value={target} onChange={(event) => setTarget(event.target.value as Target)}><MenuItem value="GENERAL">Specific audience type</MenuItem><MenuItem value="ALL_CUSTOMERS">All customers</MenuItem><MenuItem value="ALL_DELIVERY">All delivery personnel</MenuItem></TextField>
          {target === 'GENERAL' && <TextField select label="Recipient type" value={recipientType} onChange={(event) => setRecipientType(event.target.value)}><MenuItem value="ALL_CUSTOMERS">All customers</MenuItem><MenuItem value="CUSTOMER">Customer</MenuItem></TextField>}
          <TextField required label="Title" value={title} onChange={(event) => setTitle(event.target.value)} inputProps={{ maxLength: 120 }} />
          <TextField required multiline minRows={5} label="Message" value={message} onChange={(event) => setMessage(event.target.value)} inputProps={{ maxLength: 1000 }} />
          {target === 'GENERAL' && <TextField label="Target URL (optional)" placeholder="/sales" value={targetUrl} onChange={(event) => setTargetUrl(event.target.value)} />}
          <Button variant="contained" size="large" startIcon={<Send />} onClick={submit} disabled={isSending || !title.trim() || !message.trim()}>{isSending ? 'Sending…' : 'Send notification'}</Button>
        </Stack>
      </Paper>
    </Box>
  );
}
