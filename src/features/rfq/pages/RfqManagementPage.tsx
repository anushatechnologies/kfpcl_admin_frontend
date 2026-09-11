import { useEffect, useMemo, useState, type ChangeEvent } from 'react';
import { motion } from 'framer-motion';
import {
  Autorenew,
  Close,
  Delete,
  Description,
  Edit,
  LocalOffer,
  Search,
  Send,
  Visibility,
  Phone,
  Email,
  Business,
  LocationOn,
  Person,
  ContentCopy,
  Storefront,
  CurrencyRupee,
  Inventory2,
  CheckCircle,
  ChatBubbleOutlineOutlined,
  RequestQuote,
  OpenInNew,
} from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  InputAdornment,
  IconButton,
  MenuItem,
  Pagination,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { GlassCard, GlassPageHeader, GradientText } from '@components/glassmorphism/GlassComponents';
import { SkeletonPageHeader, SkeletonTable } from '@components/skeletons/LoadingSkeletons';
import { toast } from '@components/toast/ToastContainer';
import { useGetRfqByIdQuery, useGetRfqsQuery, useSendRfqQuoteMutation, type RfqItem } from '../api/rfqApi';
import { useGetCustomerByIdQuery } from '../../customers/api/customerApi';
import { useAppTheme } from '@contexts/ThemeContext';

const statusColor = (value = '') => {
  const v = value.toLowerCase();
  if (v === 'accepted' || v === 'approved' || v === 'closed') return 'success';
  if (v === 'rejected' || v === 'cancelled') return 'error';
  if (v === 'quoted' || v === 'responded') return 'info';
  return 'warning';
};

const apiStatusFor = (value: string) => {
  if (value === 'all') return 'ALL';
  if (value === 'accepted' || value === 'approved') return 'ACCEPTED';
  if (value === 'quoted') return 'QUOTED';
  if (value === 'open' || value === 'pending') return 'PENDING';
  return value.toUpperCase();
};

const displayStatusFor = (rfq: RfqItem, hasLocalQuote: boolean) => {
  const status = rfq.status?.toUpperCase();
  const quotationStatus = rfq.quotation?.status?.toUpperCase();
  if (rfq.isAccepted || rfq.quotation?.isAccepted || status === 'ACCEPTED' || quotationStatus === 'ACCEPTED') {
    return 'Accepted';
  }
  if (rfq.isRejected || rfq.quotation?.isRejected || status === 'REJECTED' || quotationStatus === 'REJECTED') {
    return 'Rejected';
  }
  if (hasLocalQuote || rfq.quotation || status === 'QUOTED' || status === 'RESPONDED') return 'Quoted';
  return 'Pending';
};

type QuoteForm = {
  unitPrice: string;
  quantity: string;
  moq: string;
  availability: string;
  deliveryDays: string;
  paymentTerms: string;
  notes: string;
};

const emptyQuote: QuoteForm = {
  unitPrice: '',
  quantity: '',
  moq: '',
  availability: 'Ready stock',
  deliveryDays: '7 days',
  paymentTerms: '100% advance',
  notes: '',
};

const RFQ_QUOTES_STORAGE_KEY = 'anusha_admin_rfq_quotes';

const getStoredQuotes = (): Record<number, QuoteForm> => {
  if (typeof window === 'undefined') return {};
  try {
    const data = localStorage.getItem(RFQ_QUOTES_STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch (e) {
    console.error('Failed to load quotes from localStorage', e);
    return {};
  }
};

const saveStoredQuotes = (quotes: Record<number, QuoteForm>) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(RFQ_QUOTES_STORAGE_KEY, JSON.stringify(quotes));
  } catch (e) {
    console.error('Failed to save quotes to localStorage', e);
  }
};

export default function RfqManagementPage() {
  const { isDark } = useAppTheme();
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(0);
  const [quoteRfq, setQuoteRfq] = useState<RfqItem | null>(null);
  const [quoteForm, setQuoteForm] = useState<QuoteForm>(emptyQuote);
  const [sentQuotes, setSentQuotes] = useState<Record<number, QuoteForm>>(getStoredQuotes);
  const [viewRfq, setViewRfq] = useState<RfqItem | null>(null);
  const { data: rfqDetails } = useGetRfqByIdQuery(viewRfq?.id ?? 0, { skip: !viewRfq?.id });
  const assignedStore = rfqDetails?.assignedStore || rfqDetails?.storeName || viewRfq?.assignedStore || viewRfq?.storeName || 'Not assigned';

  const buyerIdStr = viewRfq?.buyerId ? String(viewRfq.buyerId).replace(/^#/, '') : '';
  const { data: buyerProfile, isFetching: isBuyerProfileLoading } = useGetCustomerByIdQuery(
    buyerIdStr,
    { skip: !buyerIdStr },
  );

  const resolvedCompany = viewRfq?.buyerCompany || buyerProfile?.companyName || '';
  const resolvedCity = viewRfq?.buyerCity || buyerProfile?.city || '';
  const resolvedState = viewRfq?.buyerState || buyerProfile?.state || '';
  const resolvedPincode = viewRfq?.buyerPincode || buyerProfile?.pincode || '';
  const resolvedLocation = [resolvedCity, resolvedState, resolvedPincode].filter(Boolean).join(', ');

  const updateSentQuote = (rfqId: number, form: QuoteForm) => {
    setSentQuotes((current) => {
      const next = { ...current, [rfqId]: form };
      saveStoredQuotes(next);
      return next;
    });
  };

  const removeSentQuote = (rfqId: number) => {
    setSentQuotes((current) => {
      const next = { ...current };
      delete next[rfqId];
      saveStoredQuotes(next);
      return next;
    });
  };

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search), 250);
    return () => window.clearTimeout(timer);
  }, [search]);

  const query = useGetRfqsQuery({
    search: debouncedSearch,
    status: apiStatusFor(status),
    page,
    size: 20,
  });
  const [sendRfqQuoteMutation, { isLoading: isSendingQuote }] = useSendRfqQuoteMutation();

  const apiRfqs = useMemo(() => {
    const raw = query.data;
    if (Array.isArray(raw)) return raw;
    if (Array.isArray(raw?.rfqs)) return raw.rfqs;
    if (Array.isArray(raw?.content)) return raw.content;
    if (Array.isArray(raw?.data)) return raw.data;
    return [];
  }, [query.data]);

  const rfqs = useMemo(() => apiRfqs, [apiRfqs]);

  const total = query.data?.totalElements ?? rfqs.length;
  const pages = Math.max(query.data?.totalPages ?? Math.ceil(total / 20), 1);

  const date = (value?: string) =>
    value ? new Date(value).toLocaleDateString('en-IN', { dateStyle: 'medium' }) : '—';

  const openQuote = (rfq: RfqItem, readOnly = false) => {
    if (readOnly) {
      setViewRfq(rfq);
      return;
    }
    setQuoteRfq(rfq);
    setQuoteForm(
      sentQuotes[rfq.id] || {
        ...emptyQuote,
        quantity: rfq.quantity ? String(rfq.quantity) : '',
        unitPrice: rfq.targetPrice ? String(rfq.targetPrice) : '',
      },
    );
  };

  const closeQuote = () => {
    setQuoteRfq(null);
    setQuoteForm(emptyQuote);
  };

  const totalQuote = (Number(quoteForm.unitPrice) || 0) * (Number(quoteForm.quantity) || 0);

  const sendQuote = async () => {
    if (
      !quoteRfq ||
      !quoteForm.unitPrice ||
      !quoteForm.quantity ||
      !quoteForm.moq ||
      !quoteForm.availability ||
      !quoteForm.deliveryDays ||
      !quoteForm.paymentTerms
    ) {
      toast.error('Please fill in all required quotation fields');
      return;
    }

    try {
      const res = await sendRfqQuoteMutation({
        rfqId: quoteRfq.id,
        quote: {
          unitPrice: Number(quoteForm.unitPrice),
          quantity: Number(quoteForm.quantity),
          deliveryDays: quoteForm.deliveryDays,
          notes: quoteForm.notes || undefined,
          moq: quoteForm.moq ? Number(quoteForm.moq) : undefined,
          availability: quoteForm.availability || undefined,
          paymentTerms: quoteForm.paymentTerms || undefined,
        },
      }).unwrap();
      toast.success(res?.message || 'Quotation successfully created and sent to buyer');
      updateSentQuote(quoteRfq.id, quoteForm);
      closeQuote();
    } catch (err: any) {
      console.error('Failed to submit quotation to backend', err);
      const errMsg = err?.data?.message || err?.data?.error || err?.message || 'Failed to submit quotation';
      toast.error(errMsg);
    }
  };

  const deleteQuote = (rfq: RfqItem) => {
    if (!sentQuotes[rfq.id] && rfq.status?.toLowerCase() !== 'quoted') return;
    if (!window.confirm('Delete this quote?')) return;
    removeSentQuote(rfq.id);
    toast.success('Quotation deleted');
  };

  if (query.isLoading) {
    return (
      <Box sx={{ p: 2 }}>
        <SkeletonPageHeader />
        <SkeletonTable />
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', minWidth: 0, p: { xs: 1.5, sm: 2, md: 3 } }}>
      {/* Details Dialog */}
      <Dialog
        open={Boolean(viewRfq)}
        onClose={() => setViewRfq(null)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3.5,
            bgcolor: isDark ? '#0f172a' : '#ffffff',
            backgroundImage: isDark
              ? 'radial-gradient(ellipse at top, rgba(79, 70, 229, 0.14) 0%, transparent 70%)'
              : 'radial-gradient(ellipse at top, rgba(79, 70, 229, 0.05) 0%, transparent 70%)',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
            boxShadow: isDark
              ? '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255,255,255,0.05)'
              : '0 25px 50px -12px rgba(15, 23, 42, 0.15), 0 4px 12px rgba(0,0,0,0.04)',
            overflow: 'hidden',
          },
        }}
      >
        <DialogTitle sx={{ position: 'relative', p: { xs: 2, sm: 3 }, pb: 2, borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}` }}>
          <Stack direction="row" alignItems="center" sx={{ width: '100%', pr: 7 }}>
            <Stack direction="row" spacing={1.75} alignItems="center">
              <Avatar
                sx={{
                  bgcolor: alpha('#4f46e5', isDark ? 0.25 : 0.12),
                  color: '#4f46e5',
                  width: 44,
                  height: 44,
                  borderRadius: 2.5,
                }}
              >
                <RequestQuote sx={{ fontSize: 24 }} />
              </Avatar>
              <Box>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="h6" fontWeight={800} sx={{ letterSpacing: -0.2 }}>
                    RFQ Details
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mt: 0.5 }}>
                  <Box
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 0.5,
                      fontFamily: 'monospace',
                      fontWeight: 700,
                      fontSize: '0.78rem',
                      color: isDark ? '#c7d2fe' : '#4338ca',
                      bgcolor: isDark ? 'rgba(79,70,229,0.2)' : 'rgba(79,70,229,0.08)',
                      px: 1,
                      py: 0.25,
                      borderRadius: 1,
                      cursor: 'pointer',
                      '&:hover': { bgcolor: isDark ? 'rgba(79,70,229,0.3)' : 'rgba(79,70,229,0.15)' },
                    }}
                    onClick={() => {
                      const code = viewRfq?.rfqNumber || `RFQ #${viewRfq?.id}`;
                      navigator.clipboard.writeText(code);
                      toast.success(`Copied ${code}`);
                    }}
                    title="Click to copy RFQ Number"
                  >
                    <span>{viewRfq?.rfqNumber || `RFQ #${viewRfq?.id}`}</span>
                    <ContentCopy sx={{ fontSize: 13, opacity: 0.7 }} />
                  </Box>
                </Stack>
              </Box>
            </Stack>

            <IconButton
              onClick={() => setViewRfq(null)}
              size="small"
              sx={{
                position: 'absolute',
                top: { xs: 16, sm: 22 },
                right: { xs: 16, sm: 22 },
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)'}`,
                borderRadius: 2,
                color: 'text.secondary',
                '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)', color: 'text.primary' },
              }}
            >
              <Close fontSize="small" />
            </IconButton>
          </Stack>
        </DialogTitle>

        <DialogContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Stack spacing={2.5}>
            {/* ── 1. Requirement & Key Metrics Banner ── */}
            <Box
              sx={{
                p: { xs: 2, sm: 2.5 },
                borderRadius: 3,
                background: isDark
                  ? 'linear-gradient(135deg, rgba(79,70,229,0.15) 0%, rgba(30,41,59,0.6) 100%)'
                  : 'linear-gradient(135deg, rgba(79,70,229,0.06) 0%, rgba(241,245,249,0.9) 100%)',
                border: `1px solid ${isDark ? 'rgba(99,102,241,0.25)' : 'rgba(79,70,229,0.15)'}`,
              }}
            >
              <Typography variant="caption" sx={{ textTransform: 'uppercase', letterSpacing: 0.7, fontWeight: 800, color: 'primary.main' }}>
                Requested Product / Inquiry Subject
              </Typography>
              <Typography variant="h6" fontWeight={800} sx={{ mt: 0.5, mb: 2, color: 'text.primary' }}>
                {viewRfq?.title || 'Buyer inquiry'}
              </Typography>

              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(4, 1fr)' }, gap: 1.5 }}>
                <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: isDark ? 'rgba(15,23,42,0.6)' : '#ffffff', border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}` }}>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                    <Inventory2 sx={{ fontSize: 16, color: 'primary.main' }} />
                    <Typography variant="caption" color="text.secondary" fontWeight={600}>Quantity</Typography>
                  </Stack>
                  <Typography variant="body1" fontWeight={800} color="text.primary">
                    {viewRfq?.quantity ? `${viewRfq.quantity} units` : 'Not specified'}
                  </Typography>
                </Box>

                <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: isDark ? 'rgba(15,23,42,0.6)' : '#ffffff', border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}` }}>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                    <CurrencyRupee sx={{ fontSize: 16, color: 'success.main' }} />
                    <Typography variant="caption" color="text.secondary" fontWeight={600}>Target Price</Typography>
                  </Stack>
                  <Typography variant="body1" fontWeight={800} color="success.main">
                    {viewRfq?.targetPrice ? `₹${viewRfq.targetPrice}` : 'Open to quote'}
                  </Typography>
                </Box>

                <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: isDark ? 'rgba(15,23,42,0.6)' : '#ffffff', border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}` }}>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                    <Storefront sx={{ fontSize: 16, color: 'info.main' }} />
                    <Typography variant="caption" color="text.secondary" fontWeight={600}>Assigned Store</Typography>
                  </Stack>
                  <Typography
                    variant="body2"
                    fontWeight={800}
                    color="text.primary"
                    noWrap
                    title={assignedStore}
                  >
                    {assignedStore}
                  </Typography>
                </Box>

                <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: isDark ? 'rgba(15,23,42,0.6)' : '#ffffff', border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}` }}>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                    <CheckCircle sx={{ fontSize: 16, color: 'warning.main' }} />
                    <Typography variant="caption" color="text.secondary" fontWeight={600}>Status</Typography>
                  </Stack>
                  <Typography variant="body2" fontWeight={800} color="text.primary">
                    {viewRfq?.status || 'Pending'}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* ── 2. Buyer Profile & Company Details in 2 Modern Cards ── */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
              {/* Buyer Contact Card */}
              <Box
                sx={{
                  p: 2.25,
                  borderRadius: 3,
                  bgcolor: isDark ? 'rgba(30,41,59,0.5)' : '#ffffff',
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
                  boxShadow: isDark ? 'none' : '0 2px 8px rgba(0,0,0,0.03)',
                }}
              >
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
                  <Avatar
                    sx={{
                      width: 42,
                      height: 42,
                      bgcolor: 'primary.main',
                      background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                      fontWeight: 800,
                      fontSize: '1.05rem',
                      color: '#fff',
                    }}
                  >
                    {(viewRfq?.buyerName || buyerProfile?.name || 'B').charAt(0).toUpperCase()}
                  </Avatar>
                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Typography variant="subtitle1" fontWeight={800} noWrap color="text.primary">
                      {viewRfq?.buyerName || buyerProfile?.name || 'Buyer'}
                    </Typography>
                  </Box>
                </Stack>

                <Stack spacing={1.25}>
                  {/* Phone */}
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1, borderRadius: 2, bgcolor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Phone sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="body2" fontWeight={600} fontFamily="monospace" color="text.primary">
                        {viewRfq?.buyerPhone || buyerProfile?.phoneNumber || 'No phone'}
                      </Typography>
                    </Stack>
                    {(viewRfq?.buyerPhone || buyerProfile?.phoneNumber) && (
                      <IconButton
                        size="small"
                        onClick={() => {
                          const phone = viewRfq?.buyerPhone || buyerProfile?.phoneNumber || '';
                          navigator.clipboard.writeText(phone);
                          toast.success('Phone copied');
                        }}
                        title="Copy phone"
                        sx={{ p: 0.5 }}
                      >
                        <ContentCopy sx={{ fontSize: 14 }} />
                      </IconButton>
                    )}
                  </Box>

                  {/* Email */}
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1, borderRadius: 2, bgcolor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 0, flex: 1, mr: 1 }}>
                      <Email sx={{ fontSize: 16, color: 'text.secondary', flexShrink: 0 }} />
                      <Typography variant="body2" fontWeight={600} color="text.primary" noWrap title={viewRfq?.buyerEmail || buyerProfile?.email || ''}>
                        {viewRfq?.buyerEmail || buyerProfile?.email || 'No email'}
                      </Typography>
                    </Stack>
                    {(viewRfq?.buyerEmail || buyerProfile?.email) && (
                      <IconButton
                        size="small"
                        onClick={() => {
                          const email = viewRfq?.buyerEmail || buyerProfile?.email || '';
                          navigator.clipboard.writeText(email);
                          toast.success('Email copied');
                        }}
                        title="Copy email"
                        sx={{ p: 0.5 }}
                      >
                        <ContentCopy sx={{ fontSize: 14 }} />
                      </IconButton>
                    )}
                  </Box>

                  {/* Buyer ID */}
                  {viewRfq?.buyerId && (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1, borderRadius: 2, bgcolor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}>
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 0, flex: 1, mr: 1 }}>
                        <Person sx={{ fontSize: 16, color: 'text.secondary', flexShrink: 0 }} />
                        <Typography variant="caption" fontFamily="monospace" color="text.secondary" noWrap title={String(viewRfq.buyerId)}>
                          Buyer ID: #{String(viewRfq.buyerId).slice(0, 16)}...
                        </Typography>
                      </Stack>
                      <IconButton
                        size="small"
                        onClick={() => {
                          navigator.clipboard.writeText(String(viewRfq.buyerId));
                          toast.success('Buyer ID copied');
                        }}
                        title="Copy full Buyer ID"
                        sx={{ p: 0.5 }}
                      >
                        <ContentCopy sx={{ fontSize: 14 }} />
                      </IconButton>
                    </Box>
                  )}

                </Stack>
              </Box>

              {/* Company & Location Card */}
              <Box
                sx={{
                  p: 2.25,
                  borderRadius: 3,
                  bgcolor: isDark ? 'rgba(30,41,59,0.5)' : '#ffffff',
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
                  boxShadow: isDark ? 'none' : '0 2px 8px rgba(0,0,0,0.03)',
                }}
              >
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                  <Business sx={{ color: 'primary.main', fontSize: 22 }} />
                  <Typography variant="subtitle2" fontWeight={800} color="text.primary">
                    Company & Location
                  </Typography>
                </Stack>

                <Stack spacing={1.75}>
                  {/* Company & Type */}
                  <Box>
                    <Typography variant="caption" color="text.secondary" fontWeight={600}>Company Name</Typography>
                    {resolvedCompany ? (
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.25 }}>
                        <Typography variant="body2" fontWeight={800} color="text.primary">
                          {resolvedCompany}
                        </Typography>
                        {buyerProfile?.businessType && (
                          <Chip
                            size="small"
                            label={buyerProfile.businessType.replace(/_/g, ' ')}
                            sx={{ height: 20, fontSize: '0.65rem', fontWeight: 700, borderRadius: 1 }}
                            color="secondary"
                            variant="outlined"
                          />
                        )}
                      </Stack>
                    ) : (
                      <Typography variant="body2" color="text.disabled" sx={{ fontStyle: 'italic', mt: 0.25 }}>
                        {isBuyerProfileLoading ? 'Loading profile...' : 'Not provided by buyer'}
                      </Typography>
                    )}
                  </Box>

                  {/* Location */}
                  <Box>
                    <Typography variant="caption" color="text.secondary" fontWeight={600}>Location</Typography>
                    {resolvedLocation ? (
                      <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 0.25 }}>
                        <LocationOn sx={{ fontSize: 16, color: 'error.main', flexShrink: 0 }} />
                        <Typography variant="body2" fontWeight={700} color="text.primary">
                          {resolvedLocation}
                        </Typography>
                      </Stack>
                    ) : (
                      <Typography variant="body2" color="text.disabled" sx={{ fontStyle: 'italic', mt: 0.25 }}>
                        {isBuyerProfileLoading ? 'Loading profile...' : 'Not provided by buyer'}
                      </Typography>
                    )}
                  </Box>

                  <Box>
                    <Typography variant="caption" color="text.secondary" fontWeight={600}>Submitted</Typography>
                    <Typography variant="body2" fontWeight={600} color="text.primary" sx={{ mt: 0.25 }}>
                      {date(viewRfq?.createdAt)}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            </Box>

            {/* ── 3. Buyer Notes / Requirements (if present) ── */}
            {viewRfq?.notes && (
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2.5,
                  bgcolor: isDark ? 'rgba(79,70,229,0.08)' : 'rgba(79,70,229,0.04)',
                  border: `1px solid ${isDark ? 'rgba(79,70,229,0.2)' : 'rgba(79,70,229,0.12)'}`,
                }}
              >
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.75 }}>
                  <ChatBubbleOutlineOutlined sx={{ fontSize: 16, color: 'primary.main' }} />
                  <Typography variant="caption" fontWeight={800} color="primary.main" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    Buyer Notes & Special Instructions
                  </Typography>
                </Stack>
                <Typography variant="body2" sx={{ color: 'text.primary', whiteSpace: 'pre-line', lineHeight: 1.6 }}>
                  {viewRfq.notes}
                </Typography>
              </Box>
            )}

            {/* ── 4. Quotation Sent Details (if already quoted) ── */}
            {viewRfq && sentQuotes[viewRfq.id] && (
              <Box
                sx={{
                  p: 2.5,
                  borderRadius: 3,
                  bgcolor: isDark ? 'rgba(16, 185, 129, 0.08)' : 'rgba(16, 185, 129, 0.04)',
                  border: `1px solid ${isDark ? 'rgba(16, 185, 129, 0.3)' : 'rgba(16, 185, 129, 0.2)'}`,
                }}
              >
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <CheckCircle sx={{ color: 'success.main', fontSize: 20 }} />
                    <Typography variant="subtitle2" fontWeight={800} color="success.main">
                      Submitted Supplier Quotation
                    </Typography>
                  </Stack>
                  <Chip size="small" label="Quoted" color="success" sx={{ fontWeight: 700, height: 22 }} />
                </Stack>

                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(4, 1fr)' }, gap: 1.5 }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Offered Unit Price</Typography>
                    <Typography variant="body2" fontWeight={800} color="text.primary">₹{sentQuotes[viewRfq.id].unitPrice}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Quoted Quantity</Typography>
                    <Typography variant="body2" fontWeight={800} color="text.primary">{sentQuotes[viewRfq.id].quantity} units</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Total Quotation Value</Typography>
                    <Typography variant="body2" fontWeight={900} color="success.main">
                      ₹{((Number(sentQuotes[viewRfq.id].unitPrice) || 0) * (Number(sentQuotes[viewRfq.id].quantity) || 0)).toLocaleString('en-IN')}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Delivery Timeline</Typography>
                    <Typography variant="body2" fontWeight={800} color="text.primary">{sentQuotes[viewRfq.id].deliveryDays}</Typography>
                  </Box>
                </Box>
              </Box>
            )}
          </Stack>
        </DialogContent>

        <Divider sx={{ borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }} />

        <DialogActions sx={{ p: { xs: 2, sm: 2.5 }, justifyContent: 'space-between' }}>
          <Button
            size="medium"
            variant="text"
            color="inherit"
            startIcon={<OpenInNew />}
            onClick={() => window.open('/buyer-management', '_blank')}
            sx={{ textTransform: 'none', color: 'text.secondary', fontWeight: 600, fontSize: '0.85rem' }}
          >
            Buyer Management
          </Button>

          <Stack direction="row" spacing={1.5}>
            {viewRfq && (
              <Button
                variant="contained"
                size="medium"
                startIcon={<LocalOffer />}
                onClick={() => {
                  const targetRfq = viewRfq;
                  setViewRfq(null);
                  openQuote(targetRfq);
                }}
                sx={{
                  textTransform: 'none',
                  fontWeight: 700,
                  borderRadius: 2.5,
                  px: 3,
                  background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                  boxShadow: '0 4px 14px rgba(79, 70, 229, 0.35)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #4338ca 0%, #6d28d9 100%)',
                    boxShadow: '0 6px 20px rgba(79, 70, 229, 0.45)',
                  },
                }}
              >
                {sentQuotes[viewRfq.id] || viewRfq.status?.toLowerCase() === 'quoted' ? 'Edit Quote' : 'Send Quotation'}
              </Button>
            )}
          </Stack>
        </DialogActions>
      </Dialog>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
        <GlassPageHeader>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            justifyContent="space-between"
            alignItems={{ xs: 'flex-start', md: 'center' }}
            gap={2}
          >
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800 }}>
                <GradientText>RFQ Management</GradientText>
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                {total} inquiries · Review buyer quotations and submit pricing.
              </Typography>
            </Box>
            <Chip
              icon={<Autorenew />}
              label={query.isFetching ? 'Refreshing…' : 'Refresh'}
              clickable
              onClick={() => void query.refetch()}
            />
          </Stack>
        </GlassPageHeader>
      </motion.div>

      {/* Filter and Table Card */}
      <GlassCard sx={{ mt: 2, p: { xs: 1.5, sm: 2 } }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mb: 2 }}>
          <TextField
            fullWidth
            size="small"
            value={search}
            placeholder="Search RFQ or buyer name..."
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(0);
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
          <Select
            size="small"
            value={status}
            onChange={(event) => {
              setStatus(event.target.value);
              setPage(0);
            }}
            sx={{ minWidth: { sm: 160 } }}
          >
            <MenuItem value="all">All statuses</MenuItem>
            <MenuItem value="open">Open</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="accepted">Accepted</MenuItem>
            <MenuItem value="quoted">Quoted</MenuItem>
            <MenuItem value="rejected">Rejected</MenuItem>
            <MenuItem value="closed">Closed</MenuItem>
          </Select>
        </Stack>

        <TableContainer sx={{ overflowX: 'auto' }}>
          <Table sx={{ minWidth: 860 }}>
            <TableHead>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell>Buyer</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rfqs.map((rfq: RfqItem) => {
                const quoted =
                  Boolean(sentQuotes[rfq.id]) ||
                  Boolean(rfq.quotation) ||
                  ['quoted', 'responded'].includes(rfq.status?.toLowerCase() || '');
                const displayStatus = displayStatusFor(rfq, Boolean(sentQuotes[rfq.id]));
                return (
                  <TableRow hover key={rfq.id}>
                    <TableCell>
                      <Stack direction="row" spacing={1.25} alignItems="center">
                        <Description color="primary" fontSize="small" />
                        <Box>
                          <Typography fontWeight={700}>
                            {rfq.productName || rfq.title || rfq.rfqNumber || `RFQ #${rfq.id}`}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {rfq.rfqNumber || `ID ${rfq.id}`}
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Typography fontWeight={600}>{rfq.buyerName || '—'}</Typography>
                      {rfq.buyerCompany && (
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 600 }}>
                          {rfq.buyerCompany}
                        </Typography>
                      )}
                      {rfq.buyerPhone && (
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                          {rfq.buyerPhone}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      {rfq.deliveryLocation || rfq.buyerCity || rfq.buyerState || rfq.buyerAddress || '—'}
                    </TableCell>
                    <TableCell>{rfq.quantity ?? '—'}</TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={displayStatus}
                        color={statusColor(displayStatus) as any}
                      />
                    </TableCell>
                    <TableCell>{date(rfq.createdAt)}</TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={0.75} justifyContent="flex-end">
                        <IconButton
                          size="small"
                          color="primary"
                          aria-label="View RFQ and buyer details"
                          title="View buyer details"
                          onClick={() => openQuote(rfq, true)}
                        >
                          <Visibility />
                        </IconButton>
                        {quoted ? (
                          <>
                            <Button
                              size="small"
                              variant="outlined"
                              startIcon={<Edit />}
                              onClick={() => openQuote(rfq)}
                              sx={{ whiteSpace: 'nowrap', textTransform: 'none' }}
                            >
                              Edit quote
                            </Button>
                            <Button
                              size="small"
                              color="error"
                              variant="outlined"
                              startIcon={<Delete />}
                              onClick={() => deleteQuote(rfq)}
                              sx={{ whiteSpace: 'nowrap', textTransform: 'none' }}
                            >
                              Delete quote
                            </Button>
                          </>
                        ) : (
                          <Button
                            size="small"
                            variant="contained"
                            startIcon={<LocalOffer />}
                            onClick={() => openQuote(rfq)}
                            sx={{ whiteSpace: 'nowrap', textTransform: 'none' }}
                          >
                            Send quote
                          </Button>
                        )}
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })}
              {!rfqs.length && (
                <TableRow>
                  <TableCell colSpan={7}>
                    <Typography align="center" color="text.secondary" sx={{ py: 6 }}>
                      No RFQs found. Buyer inquiries submitted via the buyer app will appear here.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Stack alignItems={{ xs: 'stretch', sm: 'flex-end' }} sx={{ mt: 2 }}>
          <Pagination
            page={page + 1}
            count={pages}
            onChange={(_: ChangeEvent<unknown>, value) => setPage(value - 1)}
            color="primary"
          />
        </Stack>
      </GlassCard>

      {/* Quote Dialog */}
      <Dialog
        open={Boolean(quoteRfq)}
        onClose={closeQuote}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3.5,
            bgcolor: isDark ? '#0f172a' : '#ffffff',
            backgroundImage: isDark
              ? 'radial-gradient(ellipse at top, rgba(79, 70, 229, 0.14) 0%, transparent 70%)'
              : 'radial-gradient(ellipse at top, rgba(79, 70, 229, 0.05) 0%, transparent 70%)',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
            boxShadow: isDark
              ? '0 25px 50px -12px rgba(0, 0, 0, 0.7)'
              : '0 25px 50px -12px rgba(15, 23, 42, 0.15)',
            overflow: 'hidden',
          },
        }}
      >
        <DialogTitle sx={{ p: { xs: 2, sm: 2.5 }, pb: 2, borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}` }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Avatar
                sx={{
                  bgcolor: alpha('#4f46e5', isDark ? 0.25 : 0.12),
                  color: '#4f46e5',
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                }}
              >
                <LocalOffer sx={{ fontSize: 22 }} />
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight={800} sx={{ letterSpacing: -0.2 }}>
                  Send Formal Quotation
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.25, display: 'block' }}>
                  {quoteRfq?.rfqNumber || `RFQ #${quoteRfq?.id}`} · {quoteRfq?.buyerName || 'Buyer'}
                </Typography>
              </Box>
            </Stack>
            <IconButton
              onClick={closeQuote}
              size="small"
              sx={{
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)'}`,
                borderRadius: 2,
                color: 'text.secondary',
              }}
            >
              <Close fontSize="small" />
            </IconButton>
          </Stack>
        </DialogTitle>

        <DialogContent sx={{ p: { xs: 2, sm: 2.5 } }}>
          <Stack spacing={2.25} sx={{ pt: 0.5 }}>
            <Box
              sx={{
                p: 2,
                borderRadius: 2.5,
                background: isDark
                  ? 'linear-gradient(135deg, rgba(79,70,229,0.12) 0%, rgba(30,41,59,0.5) 100%)'
                  : 'linear-gradient(135deg, rgba(79,70,229,0.05) 0%, rgba(241,245,249,0.8) 100%)',
                border: `1px solid ${isDark ? 'rgba(79,70,229,0.2)' : 'rgba(79,70,229,0.12)'}`,
              }}
            >
              <Typography variant="caption" sx={{ textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 800, color: 'primary.main' }}>
                Buyer Requirement
              </Typography>
              <Typography variant="subtitle1" fontWeight={800} sx={{ mt: 0.25 }}>
                {quoteRfq?.title || 'Buyer inquiry'}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.25 }}>
                Requested quantity: <strong>{quoteRfq?.quantity ?? 'Not specified'} units</strong>
                {quoteRfq?.targetPrice ? ` · Target Price: ₹${quoteRfq.targetPrice}` : ''}
              </Typography>
            </Box>

            <Typography variant="subtitle2" fontWeight={800} color="text.primary">
              Offer & Pricing Details
            </Typography>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                fullWidth
                required
                label="Unit price (₹)"
                type="number"
                value={quoteForm.unitPrice}
                onChange={(e) => setQuoteForm({ ...quoteForm, unitPrice: e.target.value })}
                InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
                inputProps={{ min: 0 }}
              />
              <TextField
                fullWidth
                required
                label="Quoted quantity"
                type="number"
                value={quoteForm.quantity}
                onChange={(e) => setQuoteForm({ ...quoteForm, quantity: e.target.value })}
                inputProps={{ min: 1 }}
              />
            </Stack>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                fullWidth
                required
                label="Minimum order quantity (MOQ)"
                type="number"
                value={quoteForm.moq}
                onChange={(e) => setQuoteForm({ ...quoteForm, moq: e.target.value })}
                inputProps={{ min: 1 }}
              />
              <TextField
                fullWidth
                required
                select
                label="Product availability"
                value={quoteForm.availability}
                onChange={(e) => setQuoteForm({ ...quoteForm, availability: e.target.value })}
              >
                <MenuItem value="Ready stock">Ready stock</MenuItem>
                <MenuItem value="Made to order">Made to order</MenuItem>
                <MenuItem value="Limited stock">Limited stock</MenuItem>
              </TextField>
            </Stack>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                fullWidth
                required
                label="Delivery timeline"
                placeholder="e.g. 7 days"
                value={quoteForm.deliveryDays}
                onChange={(e) => setQuoteForm({ ...quoteForm, deliveryDays: e.target.value })}
              />
              <TextField
                fullWidth
                required
                select
                label="Payment terms"
                value={quoteForm.paymentTerms}
                onChange={(e) => setQuoteForm({ ...quoteForm, paymentTerms: e.target.value })}
              >
                <MenuItem value="100% advance">100% advance</MenuItem>
                <MenuItem value="50% advance">50% advance</MenuItem>
                <MenuItem value="Net 15 days">Net 15 days</MenuItem>
                <MenuItem value="Negotiable">Negotiable</MenuItem>
              </TextField>
            </Stack>

            <TextField
              fullWidth
              multiline
              minRows={3}
              label="Message to buyer"
              placeholder="Add product specs, packaging, validity or terms..."
              value={quoteForm.notes}
              onChange={(e) => setQuoteForm({ ...quoteForm, notes: e.target.value })}
            />

            <Box
              sx={{
                p: 2,
                borderRadius: 2.5,
                bgcolor: isDark ? 'rgba(79,70,229,0.1)' : 'rgba(79,70,229,0.05)',
                border: `1px solid ${isDark ? 'rgba(79,70,229,0.25)' : 'rgba(79,70,229,0.15)'}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography variant="body2" color="text.secondary" fontWeight={600}>Total Quotation Value</Typography>
              <Typography variant="h5" fontWeight={900} color="primary.main">
                ₹{totalQuote.toLocaleString('en-IN')}
              </Typography>
            </Box>
          </Stack>
        </DialogContent>

        <Divider sx={{ borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }} />

        <DialogActions sx={{ p: { xs: 2, sm: 2.5 } }}>
          <Button
            onClick={closeQuote}
            variant="outlined"
            sx={{
              textTransform: 'none',
              fontWeight: 700,
              borderRadius: 2.5,
              px: 3,
              borderColor: isDark ? 'rgba(255,255,255,0.16)' : 'rgba(0,0,0,0.18)',
              color: 'text.primary',
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            startIcon={<Send />}
            onClick={sendQuote}
            disabled={
              isSendingQuote ||
              !quoteForm.unitPrice ||
              !quoteForm.quantity ||
              !quoteForm.moq ||
              !quoteForm.availability ||
              !quoteForm.deliveryDays ||
              !quoteForm.paymentTerms
            }
            sx={{
              textTransform: 'none',
              fontWeight: 700,
              borderRadius: 2.5,
              px: 3.5,
              background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
              boxShadow: '0 4px 14px rgba(79, 70, 229, 0.35)',
              '&:hover': {
                background: 'linear-gradient(135deg, #4338ca 0%, #6d28d9 100%)',
                boxShadow: '0 6px 20px rgba(79, 70, 229, 0.45)',
              },
            }}
          >
            {isSendingQuote ? 'Sending...' : 'Send quotation'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
