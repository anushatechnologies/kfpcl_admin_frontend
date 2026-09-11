import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Cancel,
  CheckCircle,
  Inventory2,
  LocalOffer,
  PendingActions,
  People,
  RequestQuote,
  ShoppingBag,
  Receipt,
  WarningAmber,
} from '@mui/icons-material';
import {
  Box,
  Chip,
  Grid,
  LinearProgress,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import dayjs from 'dayjs';
import { useAppTheme } from '../../../contexts/ThemeContext';
import { useGetDashboardSummaryQuery } from '../api/dashboardApi';
import { useGetRfqsQuery } from '../../rfq/api/rfqApi';
import { useGetProductsQuery } from '../../products/api/productApi';
import { useGetCustomersQuery } from '../../customers/api/customerApi';

const fields = [
  { label: 'Total Products', helper: 'Catalogue items', color: '#6366f1', icon: ShoppingBag },
  { label: 'Total Quotations', helper: 'Approved responses', color: '#10b981', icon: Receipt },
  { label: 'Total Buyers', helper: 'Registered accounts', color: '#3b82f6', icon: People },
  { label: 'Total RFQs', helper: 'Buyer requests', color: '#f59e0b', icon: RequestQuote },
];

const panelSx = {
  border: '1px solid var(--color-border)',
  borderRadius: 4,
  background: 'var(--color-card-elevated)',
  boxShadow: '0 14px 36px rgba(15, 23, 42, 0.06)',
};

const getRfqStatus = (rfq: any, hasLocalQuote: boolean) => {
  const status = String(rfq.status || '').toUpperCase();
  const quotationStatus = String(rfq.quotation?.status || '').toUpperCase();
  if (rfq.isAccepted || rfq.quotation?.isAccepted || status === 'ACCEPTED' || quotationStatus === 'ACCEPTED') return 'Accepted';
  if (rfq.isRejected || rfq.quotation?.isRejected || status === 'REJECTED' || quotationStatus === 'REJECTED') return 'Rejected';
  if (hasLocalQuote || rfq.quotation || status === 'QUOTED' || status === 'RESPONDED') return 'Quoted';
  return 'Pending';
};

export default function AdminDashboard() {
  const { isDark } = useAppTheme();

  // Queries
  const { data: summary, isLoading: isSummaryLoading } = useGetDashboardSummaryQuery();
  const { data: rfqData, isLoading: isRfqsLoading } = useGetRfqsQuery({ page: 0, size: 100 });
  const { data: productsData, isLoading: isProductsLoading } = useGetProductsQuery({});
  const { data: customersData, isLoading: isCustomersLoading } = useGetCustomersQuery({ page: 0, size: 100 });

  // 1. Total Products Count
  const totalProducts = summary?.totalProducts ?? productsData?.length ?? 0;

  // 2. RFQ List & Total RFQs Count
  const rfqList = useMemo(() => rfqData?.rfqs || rfqData?.content || [], [rfqData]);
  const totalRfqs = rfqList.length;

  // 3. Stored Quotes count from localStorage
  const localQuotesCount = useMemo(() => {
    if (typeof window === 'undefined') return 0;
    try {
      const q1 = JSON.parse(localStorage.getItem('kfpcl_admin_rfq_quotes') || '{}');
      const q2 = JSON.parse(localStorage.getItem('anusha_admin_rfq_quotes') || '{}');
      const keys = new Set([...Object.keys(q1), ...Object.keys(q2)]);
      return keys.size;
    } catch {
      return 0;
    }
  }, []);

  // 4. Total Quotations Count
  const totalQuotations = useMemo(() => {
    const quotedItems = rfqList.filter((item: any) => {
      const status = getRfqStatus(item, false);
      return status === 'Quoted' || status === 'Accepted';
    });
    return Math.max(quotedItems.length, localQuotesCount);
  }, [rfqList, localQuotesCount]);

  // 5. Total Buyers Count
  const totalBuyers = customersData?.customers?.length ?? 0;

  const dashboardFields = fields.map((field) => {
    let value: number | string = 0;
    let loading = isSummaryLoading;

    if (field.label === 'Total Products') {
      value = totalProducts;
      loading = isSummaryLoading && isProductsLoading;
    } else if (field.label === 'Total Quotations') {
      value = totalQuotations;
      loading = isSummaryLoading && isRfqsLoading;
    } else if (field.label === 'Total Buyers') {
      value = totalBuyers;
      loading = isSummaryLoading && isCustomersLoading;
    } else if (field.label === 'Total RFQs') {
      value = totalRfqs;
      loading = isSummaryLoading && isRfqsLoading;
    }

    return { ...field, value, loading };
  });

  const productStatuses = useMemo(() => {
    const products = Array.isArray(productsData) ? productsData : [];
    const getStock = (product: any) =>
      (product.variants ?? []).reduce((total: number, variant: any) => total + (Number(variant.stock) || 0), 0);

    return [
      {
        label: 'Active',
        value: products.filter((product: any) => product.isActive !== false && product.active !== false).length,
        color: '#10b981',
        icon: CheckCircle,
      },
      {
        label: 'Inactive',
        value: products.filter((product: any) => product.isActive === false || product.active === false).length,
        color: '#64748b',
        icon: Cancel,
      },
      {
        label: 'Low stock',
        value: products.filter((product: any) => {
          const stock = getStock(product);
          return stock > 0 && stock <= 10;
        }).length,
        color: '#f59e0b',
        icon: WarningAmber,
      },
      {
        label: 'Out of stock',
        value: products.filter((product: any) => getStock(product) === 0).length,
        color: '#ef4444',
        icon: Inventory2,
      },
    ];
  }, [productsData]);

  const rfqStatuses = useMemo(() => {
    const counts = { Pending: 0, Quoted: 0, Accepted: 0, Rejected: 0 };
    rfqList.forEach((rfq: any) => {
      const status = getRfqStatus(rfq, false);
      if (status === 'Accepted') counts.Accepted += 1;
      else if (status === 'Rejected') counts.Rejected += 1;
      else if (status === 'Quoted') counts.Quoted += 1;
      else counts.Pending += 1;
    });

    return [
      { label: 'Pending', value: counts.Pending, color: '#f59e0b', icon: PendingActions },
      { label: 'Quoted', value: counts.Quoted, color: '#3b82f6', icon: LocalOffer },
      { label: 'Accepted', value: counts.Accepted, color: '#10b981', icon: CheckCircle },
      { label: 'Rejected', value: counts.Rejected, color: '#ef4444', icon: Cancel },
    ];
  }, [rfqList]);

  const statusCard = (title: string, subtitle: string, total: number, loading: boolean, items: Array<{ label: string; value: number; color: string; icon: any }>) => (
    <Paper sx={{ ...panelSx, p: { xs: 2, md: 2.5 }, height: '100%' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
        <Box>
          <Typography variant="h6" fontWeight={900}>{title}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.35 }}>{subtitle}</Typography>
        </Box>
        <Chip
          label={loading ? 'Loading' : `${total} total`}
          size="small"
          sx={{ fontWeight: 800, bgcolor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(79,70,229,0.08)' }}
        />
      </Stack>
      <Stack spacing={1.5}>
        {items.map((item) => {
          const Icon = item.icon;
          const percent = total > 0 ? (item.value / total) * 100 : 0;
          return (
            <Box key={item.label}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.65 }}>
                <Box sx={{ width: 30, height: 30, display: 'grid', placeItems: 'center', borderRadius: 2, color: item.color, bgcolor: alpha(item.color, isDark ? 0.18 : 0.1) }}>
                  <Icon sx={{ fontSize: 17 }} />
                </Box>
                <Typography variant="body2" fontWeight={700} sx={{ flex: 1 }}>{item.label}</Typography>
                <Typography variant="body2" fontWeight={900}>{loading ? '—' : item.value}</Typography>
              </Stack>
              <LinearProgress
                variant="determinate"
                value={loading ? 0 : percent}
                sx={{ height: 6, borderRadius: 99, bgcolor: alpha(item.color, isDark ? 0.12 : 0.08), '& .MuiLinearProgress-bar': { borderRadius: 99, bgcolor: item.color } }}
              />
            </Box>
          );
        })}
      </Stack>
    </Paper>
  );

  return (
    <Box sx={{ width: '100%', minWidth: 0, display: 'grid', gap: { xs: 2, md: 3 } }}>

      {/* Header */}
      <Paper sx={{ ...panelSx, p: { xs: 2, md: 2.5 } }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ justifyContent: 'space-between', alignItems: { sm: 'center' } }}>
          <Box>
            <Typography variant="h5" fontWeight={900} sx={{ letterSpacing: '-.035em' }}>Admin Dashboard</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: .5 }}>
              {dayjs().format('dddd, DD MMMM YYYY')} · Operational overview
            </Typography>
          </Box>
        </Stack>
      </Paper>

      {/* Platform Overview */}
      <Box>
        <Typography variant="overline" color="text.secondary" fontWeight={800} letterSpacing={1}>Platform Overview</Typography>
        <Grid container spacing={2} sx={{ mt: .25, alignItems: 'stretch' }}>
          {dashboardFields.map((field, index) => {
            const Icon = field.icon;
            return (
              <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={field.label}>
                <Paper
                  component={motion.div}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * .06 }}
                  sx={{
                    ...panelSx,
                    height: '100%',
                    minHeight: 174,
                    p: { xs: 2.25, md: 2.5 },
                    borderTop: `3px solid ${field.color}`,
                    transition: 'transform .2s ease, box-shadow .2s ease',
                    '&:hover': {
                      transform: 'translateY(-3px)',
                      boxShadow: `0 18px 40px ${alpha(field.color, isDark ? .2 : .12)}`
                    }
                  }}
                >
                  <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Typography variant="overline" color="text.secondary" fontWeight={800} letterSpacing={.7}>
                      {field.label}
                    </Typography>
                    <Box sx={{ width: 40, height: 40, display: 'grid', placeItems: 'center', borderRadius: 2.5, color: field.color, bgcolor: alpha(field.color, isDark ? .18 : .1) }}>
                      <Icon fontSize="small" />
                    </Box>
                  </Stack>
                  <Typography variant="h3" fontWeight={900} sx={{ mt: 3, letterSpacing: '-.05em', color: 'text.primary' }}>
                    {field.loading ? '…' : field.value}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: .5, display: 'block' }}>
                    {field.helper}
                  </Typography>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      </Box>

      {/* Operations Status */}
      <Box>
        <Typography variant="overline" color="text.secondary" fontWeight={800} letterSpacing={1}>Operations Status</Typography>
        <Grid container spacing={2} sx={{ mt: 0.25, alignItems: 'stretch' }}>
          <Grid size={{ xs: 12, lg: 6 }}>
            {statusCard('Product Status', 'Catalogue health at a glance', productsData?.length ?? 0, isProductsLoading, productStatuses)}
          </Grid>
          <Grid size={{ xs: 12, lg: 6 }}>
            {statusCard('RFQ Status', 'Buyer request pipeline', rfqList.length, isRfqsLoading, rfqStatuses)}
          </Grid>
        </Grid>
      </Box>

    </Box>
  );
}
