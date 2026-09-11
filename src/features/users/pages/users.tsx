import { useState, useEffect, useMemo, type ChangeEvent } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Stack,
  Pagination,
  InputAdornment,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  CircularProgress,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Download as DownloadIcon,
  Person as PersonIcon,
  Delete as DeleteIcon,
  VerifiedUser as VerifiedUserIcon,
  Close as CloseIcon,
  OpenInNew as OpenInNewIcon,
} from '@mui/icons-material';
import { toast } from '../../../components/toast/ToastContainer';
import ConfirmDialog from '../../../components/ConfirmDialog';
import EmptyState from '../../../components/empty-state/EmptyState';
import { SkeletonTable, SkeletonPageHeader } from '../../../components/skeletons/LoadingSkeletons';
import {
  GlassPageHeader,
  GradientText,
  GlassCard,
} from '../../../components/glassmorphism/GlassComponents';
import { useErrorHandler } from '../../../hooks/useErrorHandler';
import { alpha } from '@mui/material/styles';
import { useAppTheme } from '../../../contexts/ThemeContext';
import {
  useGetCustomersQuery,
  useGetCustomerByIdQuery,
  useUpdateCustomerStatusMutation,
  useDeleteCustomerMutation,
} from '../../customers/api/customerApi';

// ─── Status configuration ────────────────────────────────────────────────────

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  ACTIVE:               { label: 'Active',       color: '#16a34a', bg: 'rgba(34,197,94,0.15)'   },
  VERIFIED:             { label: 'Verified',      color: '#4f46e5', bg: 'rgba(79,70,229,0.15)'   },
  PENDING_VERIFICATION: { label: 'Pending KYC',   color: '#d97706', bg: 'rgba(245,158,11,0.15)'  },
  REJECTED:             { label: 'Rejected',      color: '#dc2626', bg: 'rgba(239,68,68,0.15)'   },
  INACTIVE:             { label: 'Inactive',      color: '#6b7280', bg: 'rgba(107,114,128,0.15)' },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.INACTIVE;
  return (
    <Chip
      label={cfg.label}
      size="small"
      sx={{ background: cfg.bg, color: cfg.color, fontWeight: 700, borderRadius: 2, fontSize: '0.7rem' }}
    />
  );
}

// ─── Page component ──────────────────────────────────────────────────────────

export default function Users() {
  const PAGE_SIZE = 10;
  const { isDark } = useAppTheme();
  const { pathname } = useLocation();
  const isBuyerManagement = pathname === '/buyer-management';

  const [search, setSearch]                   = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filterStatus, setFilterStatus]       = useState<string>('ALL');
  const [page, setPage]                       = useState(0);
  const [showPhone, setShowPhone]             = useState<string | null>(null);
  const [viewBuyerId, setViewBuyerId]         = useState<string | null>(null);
  const [previewDoc, setPreviewDoc]           = useState<{ title: string; url: string } | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [statusDialog, setStatusDialog]       = useState<{ id: string; currentStatus: string } | null>(null);
  const [pendingStatus, setPendingStatus]     = useState('');
  const [loadTimedOut, setLoadTimedOut]       = useState(false);

  const { handleError } = useErrorHandler();

  const { data, isLoading, isFetching, isError, error, refetch } = useGetCustomersQuery({
    search: debouncedSearch,
    status: filterStatus === 'ALL' ? undefined : filterStatus,
    page,
    size: PAGE_SIZE,
  });

  const [updateStatus, { isLoading: isUpdating }] = useUpdateCustomerStatusMutation();
  const [deleteCustomer, { isLoading: isDeleting }] = useDeleteCustomerMutation();

  const { data: buyerDetails, isFetching: isBuyerDetailsLoading } = useGetCustomerByIdQuery(
    viewBuyerId ?? '',
    { skip: !viewBuyerId },
  );

  const customers   = data?.customers || [];
  const totalPages  = data?.totalPages || 1;
  const currentPage = data?.currentPage || 0;

  const filteredCustomers = useMemo(() => {
    const q = debouncedSearch.trim().toLowerCase();
    return customers.filter((customer) => {
      const matchesStatus = filterStatus === 'ALL' || customer.status === filterStatus;
      const matchesSearch =
        !q ||
        [customer.name, customer.phoneNumber, customer.email, customer.companyName, customer.gstin, customer.panCardNumber]
          .filter(Boolean)
          .some((v) => String(v).toLowerCase().includes(q));
      return matchesStatus && matchesSearch;
    });
  }, [customers, debouncedSearch, filterStatus]);

  const totalElements =
    filterStatus === 'ALL' && !debouncedSearch
      ? data?.totalElements || 0
      : filteredCustomers.length;

  // ── Side-effects ───────────────────────────────────────────────────────────

  useEffect(() => {
    if (isError && error) handleError(error);
  }, [isError, error, handleError]);

  useEffect(() => {
    if (!isLoading) { setLoadTimedOut(false); return; }
    const timeout = window.setTimeout(() => setLoadTimedOut(true), 8000);
    return () => window.clearTimeout(timeout);
  }, [isLoading]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 250);
    return () => clearTimeout(timer);
  }, [search]);

  // ── Handlers ───────────────────────────────────────────────────────────────

  const openStatusDialog = (id: string, currentStatus: string) => {
    setPendingStatus(currentStatus);
    setStatusDialog({ id, currentStatus });
  };

  const handleStatusChange = async () => {
    if (!statusDialog || !pendingStatus) return;
    try {
      await updateStatus({ id: statusDialog.id, status: pendingStatus }).unwrap();
      await refetch();
      toast.success(`Status updated to "${STATUS_CONFIG[pendingStatus]?.label ?? pendingStatus}"`);
      setStatusDialog(null);
    } catch (err: any) {
      toast.error(err.message || 'Failed to update status');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const result = await deleteCustomer(id).unwrap();
      if (!result?.success) throw new Error(result?.message || 'Buyer deletion was not completed');
      toast.success(result.message || 'Buyer deleted successfully');
      await refetch();
    } catch (err: any) {
      const message =
        err?.data?.message ?? err?.data?.error ?? err?.error ?? err?.message ?? 'Deletion failed';
      toast.error(String(message));
    } finally {
      setConfirmDeleteId(null);
    }
  };

  const downloadCSV = () => {
    const headers = ['ID', 'Name', 'Company', 'Phone', 'Email', 'Business Type', 'City', 'State', 'GSTIN', 'PAN', 'Status', 'Created At'];
    const rows = filteredCustomers.map((c) => [
      c.id, c.name || '—', c.companyName || '—', c.phoneNumber,
      c.email || '—', c.businessType || '—', c.city || '—', c.state || '—',
      c.gstin || '—', c.panCardNumber || '—', c.status || '—', c.createdAt?.slice(0, 10) || '',
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' + [headers, ...rows].map((r) => r.join(',')).join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `buyers_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('CSV downloaded successfully');
  };

  const maskPhone = (phone: string) => `${phone.slice(0, 5)}****${phone.slice(-2)}`;

  const formatDate = (iso: string) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  /**
   * Backend stores document URLs as S3 URIs (s3://bucket/key).
   * Convert them to addressable HTTPS URLs before use in <a href>.
   * Bucket is in ap-south-2; use the regional virtual-hosted endpoint.
   */
  const resolveDocUrl = (url: string | null | undefined): string | null => {
    if (!url) return null;
    // Already an HTTP(S) URL — nothing to do.
    if (/^https?:\/\//i.test(url)) return url;
    // S3 URI: s3://bucket-name/path/to/object
    const s3Match = url.match(/^s3:\/\/([^/]+)\/(.+)$/i);
    if (s3Match) {
      const [, bucket, key] = s3Match;
      // Use the region-specific endpoint to avoid IllegalLocationConstraintException.
      const region = import.meta.env.VITE_AWS_REGION || 'ap-south-2';
      return `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
    }
    // Relative path — prefix with the API base URL.
    const base = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') ?? '';
    return `${base}/${url.replace(/^\//, '')}`;
  };

  const buyer = buyerDetails || customers.find((c) => c.id === viewBuyerId);

  const handlePageChange = (_: ChangeEvent<unknown>, value: number) => setPage(value - 1);

  // ── Loading / error states ─────────────────────────────────────────────────

  if (isLoading && !loadTimedOut) {
    return (
      <Box sx={{ p: 4 }}>
        <SkeletonPageHeader />
        <SkeletonTable />
      </Box>
    );
  }

  if (isError && !customers.length) {
    return (
      <Box sx={{ p: 4 }}>
        <EmptyState
          type="error"
          title="Failed to load buyers"
          description="There was an error loading the buyer data. Please try again."
          secondaryActionLabel="Retry"
          onSecondaryAction={() => window.location.reload()}
        />
      </Box>
    );
  }

  if (loadTimedOut && !customers.length) {
    return (
      <Box sx={{ p: 4 }}>
        <EmptyState
          type="empty"
          title="Buyer data is not available"
          description="The buyer service did not respond. Check the API connection and try again."
          secondaryActionLabel="Retry"
          onSecondaryAction={() => window.location.reload()}
        />
      </Box>
    );
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>

      {/* ── Header ────────────────────────────────────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <GlassPageHeader>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                <GradientText>{isBuyerManagement ? 'Buyer Management' : 'User Management'}</GradientText>
              </Typography>
              <Typography color="text.secondary">
                {totalElements} buyers total · Page {currentPage + 1} of {totalPages}
              </Typography>
            </Box>
            <Stack direction="row" spacing={2} flexWrap="wrap">
              <Button variant="contained" startIcon={<DownloadIcon />} onClick={downloadCSV} sx={{ px: 2.5, py: 1.1 }}>
                Download CSV
              </Button>
            </Stack>
          </Box>
        </GlassPageHeader>
      </motion.div>

      {/* ── Filters ───────────────────────────────────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
        <Box
          sx={{
            display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3, p: 2.25,
            background: isDark
              ? 'linear-gradient(180deg, rgba(30,41,59,0.92) 0%, rgba(15,23,42,0.88) 100%)'
              : 'linear-gradient(135deg, rgba(255,255,255,0.96) 0%, rgba(238,242,255,0.92) 100%)',
            backdropFilter: 'blur(14px)',
            borderRadius: 4,
            border: `1px solid ${alpha('#4f46e5', isDark ? 0.24 : 0.12)}`,
            boxShadow: isDark ? '0 18px 36px rgba(2,8,23,0.24)' : '0 14px 28px rgba(79,70,229,0.08)',
          }}
        >
          <TextField
            placeholder="Search by name, phone, email, company, GSTIN, PAN..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start"><SearchIcon color="action" /></InputAdornment>
              ),
            }}
            sx={{
              flex: 1, minWidth: 250,
              '& .MuiOutlinedInput-root': {
                borderRadius: 999,
                background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.88)',
              },
            }}
          />
          <Select
            value={filterStatus}
            onChange={(e) => { setFilterStatus(e.target.value); setPage(0); }}
            sx={{ minWidth: 200, borderRadius: 999, background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.88)' }}
          >
            <MenuItem value="ALL">All Status</MenuItem>
            {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
              <MenuItem key={key} value={key}>{cfg.label}</MenuItem>
            ))}
          </Select>
        </Box>
      </motion.div>

      {/* ── Table ─────────────────────────────────────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
        <GlassCard sx={{ p: { xs: 1.25, md: 1.5 }, overflow: 'hidden' }}>
          <TableContainer
            component={Paper}
            sx={{
              boxShadow: 'none',
              background: 'transparent',
              overflowX: 'hidden',
              scrollbarWidth: 'none',
              '&::-webkit-scrollbar': { display: 'none' },
              msOverflowStyle: 'none',
            }}
          >
            <Table sx={{ width: '100%' }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Buyer</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Phone</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Location</TableCell>
                  <TableCell sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>Created</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700, whiteSpace: 'nowrap', width: 120 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isFetching ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                      <CircularProgress size={24} />
                    </TableCell>
                  </TableRow>
                ) : filteredCustomers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} sx={{ py: 4 }}>
                      <EmptyState
                        type={search ? 'not-found' : 'empty'}
                        title={search ? 'No buyers found' : 'No buyers yet'}
                        description={
                          search
                            ? `No results for "${search}". Try a different search term.`
                            : 'No buyers have registered yet.'
                        }
                      />
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCustomers.map((customer, index) => (
                    <TableRow
                      key={customer.id}
                      hover
                      component={motion.tr}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.04 }}
                    >
                      {/* Buyer name + company */}
                      <TableCell>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Avatar
                            sx={{
                              background:
                                customer.status === 'VERIFIED'
                                  ? 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)'
                                  : customer.isActive
                                  ? 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)'
                                  : 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)',
                              width: 38, height: 38, flexShrink: 0,
                            }}
                          >
                            <PersonIcon sx={{ fontSize: 18 }} />
                          </Avatar>
                          <Box sx={{ minWidth: 0 }}>
                            <Typography fontWeight={600} noWrap sx={{ maxWidth: 140 }}>
                              {customer.name || 'Unnamed'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" noWrap sx={{ maxWidth: 140, display: 'block' }}>
                              {customer.companyName || `#${customer.id.slice(0, 8)}`}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>

                      {/* Phone + email */}
                      <TableCell>
                        <Stack direction="row" spacing={0.5} alignItems="center">
                          <Typography fontFamily="monospace" variant="body2">
                            {showPhone === customer.id ? customer.phoneNumber : maskPhone(customer.phoneNumber)}
                          </Typography>
                          <IconButton size="small" onClick={() => setShowPhone(showPhone === customer.id ? null : customer.id)}>
                            {showPhone === customer.id ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                          </IconButton>
                        </Stack>
                        {customer.email && (
                          <Typography variant="caption" color="text.secondary" noWrap sx={{ maxWidth: 160, display: 'block' }}>
                            {customer.email}
                          </Typography>
                        )}
                      </TableCell>

                      {/* Location */}
                      <TableCell>
                        <Typography variant="body2">
                          {[customer.city, customer.state].filter(Boolean).join(', ') || (
                            <Typography component="span" color="text.disabled">—</Typography>
                          )}
                        </Typography>
                      </TableCell>

                      {/* Status */}
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>
                        <StatusBadge status={customer.status} />
                      </TableCell>

                      {/* Created */}
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>
                        <Typography color="text.secondary" variant="body2" noWrap>
                          {formatDate(customer.createdAt)}
                        </Typography>
                      </TableCell>

                      {/* Actions */}
                      <TableCell align="center" sx={{ whiteSpace: 'nowrap', width: 120 }}>
                        <Stack direction="row" spacing={0.25} justifyContent="center">
                          <Tooltip title="View full details">
                            <IconButton color="primary" size="small" onClick={() => setViewBuyerId(customer.id)}>
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Change status / Verify KYC">
                            <span>
                              <IconButton
                                color="warning" size="small"
                                onClick={() => openStatusDialog(customer.id, customer.status)}
                                disabled={isUpdating}
                              >
                                <VerifiedUserIcon fontSize="small" />
                              </IconButton>
                            </span>
                          </Tooltip>
                          <Tooltip title="Delete buyer">
                            <span>
                              <IconButton
                                color="error" size="small"
                                onClick={() => setConfirmDeleteId(customer.id)}
                                disabled={isDeleting}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </span>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, pb: 2 }}>
              <Pagination
                count={totalPages}
                page={currentPage + 1}
                onChange={handlePageChange}
                color="primary"
                shape="rounded"
              />
            </Box>
          )}
        </GlassCard>
      </motion.div>

      {/* ── Buyer Detail Dialog ────────────────────────────────────────────── */}
      <Dialog open={viewBuyerId !== null} onClose={() => setViewBuyerId(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Buyer details</DialogTitle>
        <DialogContent dividers>
          {isBuyerDetailsLoading && !buyer ? (
            <Box sx={{ display: 'grid', placeItems: 'center', py: 5 }}>
              <CircularProgress size={28} />
            </Box>
          ) : buyer ? (
            <Stack spacing={2}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: 'success.main', width: 52, height: 52 }}>
                  <PersonIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight={800}>{buyer.name || 'Unnamed buyer'}</Typography>
                  <Typography variant="body2" color="text.secondary">Buyer ID: #{buyer.id}</Typography>
                </Box>
              </Stack>
              <Divider />
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption" color="text.secondary">Full name</Typography>
                  <Typography fontWeight={600}>{buyer.name || '—'}</Typography>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption" color="text.secondary">Mobile number</Typography>
                  <Typography fontWeight={600}>{buyer.phoneNumber || '—'}</Typography>
                </Box>
              </Stack>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption" color="text.secondary">Email address</Typography>
                  <Typography fontWeight={600}>{buyer.email || '—'}</Typography>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption" color="text.secondary">Business name</Typography>
                  <Typography fontWeight={600}>{buyer.companyName || '—'}</Typography>
                </Box>
              </Stack>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption" color="text.secondary">Business type</Typography>
                  <Typography fontWeight={600}>{buyer.businessType?.replace(/_/g, ' ') || '—'}</Typography>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption" color="text.secondary">State</Typography>
                  <Typography fontWeight={600}>{buyer.state || '—'}</Typography>
                </Box>
              </Stack>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption" color="text.secondary">City</Typography>
                  <Typography fontWeight={600}>{buyer.city || '—'}</Typography>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption" color="text.secondary">GSTIN</Typography>
                  <Typography fontWeight={600} fontFamily="monospace">{buyer.gstin || '—'}</Typography>
                  {resolveDocUrl(buyer.gstinPhotoUrl) && (
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.75 }}>
                      <Box
                        component="img"
                        src={resolveDocUrl(buyer.gstinPhotoUrl)!}
                        alt="GST Doc"
                        onError={(e: any) => { e.currentTarget.style.display = 'none'; }}
                        onClick={() => {
                          const url = resolveDocUrl(buyer.gstinPhotoUrl);
                          if (url) setPreviewDoc({ title: `GST Document — ${buyer.name || buyer.companyName || 'Buyer'}`, url });
                        }}
                        sx={{
                          width: 38,
                          height: 38,
                          borderRadius: 1.5,
                          objectFit: 'cover',
                          border: '1px solid',
                          borderColor: 'divider',
                          cursor: 'pointer',
                          boxShadow: '0 2px 5px rgba(0,0,0,0.08)',
                          '&:hover': { transform: 'scale(1.05)', borderColor: 'primary.main' },
                          transition: 'transform 0.15s ease, border-color 0.15s ease',
                        }}
                      />
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => {
                          const url = resolveDocUrl(buyer.gstinPhotoUrl);
                          if (url) {
                            setPreviewDoc({
                              title: `GST Document — ${buyer.name || buyer.companyName || 'Buyer'}`,
                              url,
                            });
                          }
                        }}
                        startIcon={<VisibilityIcon fontSize="small" />}
                        sx={{ textTransform: 'none', borderRadius: 2, fontSize: '0.72rem', py: 0.35, px: 1 }}
                      >
                        View GST Doc
                      </Button>
                    </Stack>
                  )}
                </Box>
              </Stack>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption" color="text.secondary">PAN number</Typography>
                  <Typography fontWeight={600} fontFamily="monospace">{buyer.panCardNumber || '—'}</Typography>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption" color="text.secondary">PAN card image</Typography>
                  {resolveDocUrl(buyer.panCardImage) ? (
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.75 }}>
                      <Box
                        component="img"
                        src={resolveDocUrl(buyer.panCardImage)!}
                        alt="PAN Doc"
                        onError={(e: any) => { e.currentTarget.style.display = 'none'; }}
                        onClick={() => {
                          const url = resolveDocUrl(buyer.panCardImage);
                          if (url) setPreviewDoc({ title: `PAN Card Document — ${buyer.name || buyer.companyName || 'Buyer'}`, url });
                        }}
                        sx={{
                          width: 38,
                          height: 38,
                          borderRadius: 1.5,
                          objectFit: 'cover',
                          border: '1px solid',
                          borderColor: 'divider',
                          cursor: 'pointer',
                          boxShadow: '0 2px 5px rgba(0,0,0,0.08)',
                          '&:hover': { transform: 'scale(1.05)', borderColor: 'primary.main' },
                          transition: 'transform 0.15s ease, border-color 0.15s ease',
                        }}
                      />
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => {
                          const url = resolveDocUrl(buyer.panCardImage);
                          if (url) {
                            setPreviewDoc({
                              title: `PAN Card Document — ${buyer.name || buyer.companyName || 'Buyer'}`,
                              url,
                            });
                          }
                        }}
                        startIcon={<VisibilityIcon fontSize="small" />}
                        sx={{ textTransform: 'none', borderRadius: 2, fontSize: '0.72rem', py: 0.35, px: 1 }}
                      >
                        View PAN Doc
                      </Button>
                    </Stack>
                  ) : (
                    <Typography fontWeight={600}>—</Typography>
                  )}
                </Box>
              </Stack>
              <Box>
                <Typography variant="caption" color="text.secondary">Status</Typography>
                <Box sx={{ mt: 0.5 }}>
                  <StatusBadge status={buyer.status} />
                </Box>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Registered</Typography>
                <Typography fontWeight={600}>{formatDate(buyer.createdAt)}</Typography>
              </Box>
            </Stack>
          ) : (
            <Typography color="text.secondary">Buyer details are not available.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          {buyer && (
            <Button
              variant="outlined"
              color="warning"
              startIcon={<VerifiedUserIcon />}
              onClick={() => {
                setViewBuyerId(null);
                openStatusDialog(buyer.id, buyer.status);
              }}
            >
              Change Status
            </Button>
          )}
          <Button onClick={() => setViewBuyerId(null)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* ── In-App Document Preview Dialog ─────────────────────────────────── */}
      <Dialog
        open={previewDoc !== null}
        onClose={() => setPreviewDoc(null)}
        maxWidth="md"
        fullWidth
        sx={{ zIndex: 1400 }}
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: 'hidden',
            bgcolor: isDark ? 'rgba(15, 23, 42, 0.96)' : 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(20px)',
            border: `1px solid ${alpha('#4f46e5', isDark ? 0.3 : 0.15)}`,
            boxShadow: isDark ? '0 24px 48px rgba(0,0,0,0.5)' : '0 24px 48px rgba(79,70,229,0.18)',
          },
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            py: 1.75,
            px: 2.5,
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Typography variant="h6" fontWeight={700} noWrap sx={{ maxWidth: { xs: '65%', sm: '80%' } }}>
            {previewDoc?.title}
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            {previewDoc?.url && (
              <Tooltip title="Open in new tab">
                <IconButton
                  component="a"
                  href={previewDoc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="small"
                  color="primary"
                >
                  <OpenInNewIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            <IconButton onClick={() => setPreviewDoc(null)} size="small" aria-label="Close preview">
              <CloseIcon fontSize="small" />
            </IconButton>
          </Stack>
        </DialogTitle>

        <DialogContent
          sx={{
            p: 2.5,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 380,
            maxHeight: '75vh',
            bgcolor: isDark ? 'rgba(0, 0, 0, 0.35)' : 'rgba(241, 245, 249, 0.65)',
            overflow: 'auto',
          }}
        >
          {previewDoc?.url && (
            previewDoc.url.toLowerCase().includes('.pdf') ? (
              <Box
                component="iframe"
                src={previewDoc.url}
                title={previewDoc.title}
                sx={{
                  width: '100%',
                  height: '70vh',
                  border: 'none',
                  borderRadius: 2,
                  bgcolor: '#fff',
                }}
              />
            ) : (
              <Box
                component="img"
                src={previewDoc.url}
                alt={previewDoc.title}
                sx={{
                  maxWidth: '100%',
                  maxHeight: '70vh',
                  objectFit: 'contain',
                  borderRadius: 2,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
                }}
                onError={(e: any) => {
                  e.currentTarget.style.display = 'none';
                  const fallback = e.currentTarget.nextElementSibling;
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
            )
          )}
          <Box
            sx={{
              display: 'none',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              p: 4,
              gap: 2,
              textAlign: 'center',
            }}
          >
            <Typography variant="body1" fontWeight={600} color="text.secondary">
              Direct preview could not be loaded.
            </Typography>
            {previewDoc?.url && (
              <Button
                variant="contained"
                size="small"
                component="a"
                href={previewDoc.url}
                target="_blank"
                rel="noopener noreferrer"
                startIcon={<OpenInNewIcon />}
              >
                Open document in new tab
              </Button>
            )}
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 2.5, py: 1.5, borderTop: '1px solid', borderColor: 'divider' }}>
          {previewDoc?.url && (
            <Button
              component="a"
              href={previewDoc.url}
              target="_blank"
              rel="noopener noreferrer"
              startIcon={<OpenInNewIcon />}
              size="small"
              sx={{ textTransform: 'none', mr: 'auto' }}
            >
              Open in new tab
            </Button>
          )}
          <Button onClick={() => setPreviewDoc(null)} variant="outlined" size="small">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── KYC / Status Change Dialog ─────────────────────────────────────── */}
      <Dialog open={statusDialog !== null} onClose={() => setStatusDialog(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Update Buyer Status</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Current status:{' '}
            <strong>
              {STATUS_CONFIG[statusDialog?.currentStatus ?? '']?.label ?? statusDialog?.currentStatus}
            </strong>
          </Typography>
          <FormControl fullWidth>
            <InputLabel id="kyc-status-label">New Status</InputLabel>
            <Select
              labelId="kyc-status-label"
              value={pendingStatus}
              label="New Status"
              onChange={(e) => setPendingStatus(e.target.value)}
            >
              {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                <MenuItem key={key} value={key}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: cfg.color, flexShrink: 0 }} />
                    {cfg.label}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusDialog(null)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleStatusChange}
            disabled={isUpdating || !pendingStatus || pendingStatus === statusDialog?.currentStatus}
          >
            {isUpdating ? <CircularProgress size={18} sx={{ color: 'inherit' }} /> : 'Update Status'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Delete Confirm Dialog ──────────────────────────────────────────── */}
      <ConfirmDialog
        open={confirmDeleteId !== null}
        title="Delete Buyer"
        message="Are you sure you want to permanently delete this buyer? This action cannot be undone."
        onConfirm={() => confirmDeleteId && handleDelete(confirmDeleteId)}
        onCancel={() => setConfirmDeleteId(null)}
      />
    </Box>
  );
}
