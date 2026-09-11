import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Box, Chip, InputAdornment, MenuItem, Select, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import { Inventory2, Search, WarningAmber } from '@mui/icons-material';
import { GlassCard, GlassPageHeader, GradientText } from '@components/glassmorphism/GlassComponents';
import { mockInventory } from '../mockData';
import { useGetProductsQuery } from '@features/products/api/productApi';

export default function InventoryManagementPage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const { data: apiProducts, isError, isLoading } = useGetProductsQuery({});
  const inventory = apiProducts?.length
    ? apiProducts.map((product) => ({
        id: product.id,
        name: product.name,
        sku: product.variants?.[0]?.sku || `PRODUCT-${product.id}`,
        category: product.categoryName || 'Uncategorized',
        stock: Number(product.stock ?? product.variants?.reduce((sum, variant) => sum + Number(variant.stock || 0), 0) ?? 0),
        reorderAt: 10,
        value: Number(product.price || 0) * Number(product.stock || 0),
        status: Number(product.stock || 0) === 0 ? 'Out of stock' : Number(product.stock || 0) <= 10 ? 'Low stock' : 'Healthy',
      }))
    : isError ? mockInventory : [];
  const products = useMemo(() => inventory.filter((item) => `${item.name} ${item.sku} ${item.category}`.toLowerCase().includes(search.toLowerCase()) && (status === 'all' || item.status === status)), [inventory, search, status]);
  const totalValue = inventory.reduce((sum, item) => sum + item.value, 0);
  const statusColor = (value: string) => value === 'Healthy' ? 'success' : value === 'Low stock' ? 'warning' : 'error';
  if (isLoading) return <Box sx={{ p: 3 }}>Loading inventory…</Box>;
  return <Box sx={{ width: '100%', minWidth: 0 }}>
    <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}><GlassPageHeader><Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} gap={2}><Box><Typography variant="h4" sx={{ fontWeight: 800 }}><GradientText>Inventory Management</GradientText></Typography><Typography color="text.secondary" sx={{ mt: .5 }}>Monitor stock health, product value, and replenishment priorities.</Typography></Box><Chip icon={<Inventory2 />} label={`${inventory.length} SKUs tracked`} color="primary" variant="outlined" /></Stack></GlassPageHeader></motion.div>
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 2, mt: 2 }}><GlassCard sx={{ p: 2.5 }}><Typography color="text.secondary" variant="body2">Inventory value</Typography><Typography variant="h5" fontWeight={800} sx={{ mt: .5 }}>₹{(totalValue / 100000).toFixed(2)}L</Typography></GlassCard><GlassCard sx={{ p: 2.5 }}><Typography color="text.secondary" variant="body2">Low stock items</Typography><Typography variant="h5" fontWeight={800} sx={{ mt: .5, color: 'warning.main' }}>{inventory.filter((item) => item.status === 'Low stock').length}</Typography></GlassCard><GlassCard sx={{ p: 2.5 }}><Typography color="text.secondary" variant="body2">Out of stock</Typography><Typography variant="h5" fontWeight={800} sx={{ mt: .5, color: 'error.main' }}>{inventory.filter((item) => item.status === 'Out of stock').length}</Typography></GlassCard></Box>
    <GlassCard sx={{ mt: 2, p: { xs: 1.5, sm: 2 }, overflow: 'hidden' }}><Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mb: 2 }}><TextField fullWidth size="small" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search product, SKU, or category" InputProps={{ startAdornment: <InputAdornment position="start"><Search fontSize="small" /></InputAdornment> }} /><Select size="small" value={status} onChange={(event) => setStatus(event.target.value)} sx={{ minWidth: { sm: 160 } }}><MenuItem value="all">All stock status</MenuItem><MenuItem value="Healthy">Healthy</MenuItem><MenuItem value="Low stock">Low stock</MenuItem><MenuItem value="Out of stock">Out of stock</MenuItem></Select></Stack><TableContainer sx={{ overflowX: 'auto' }}><Table sx={{ minWidth: 680 }}><TableHead><TableRow><TableCell>Product</TableCell><TableCell>Category</TableCell><TableCell>Available</TableCell><TableCell>Reorder at</TableCell><TableCell>Stock value</TableCell><TableCell>Status</TableCell></TableRow></TableHead><TableBody>{products.map((item) => <TableRow hover key={item.id}><TableCell><Typography fontWeight={700}>{item.name}</Typography><Typography variant="caption" color="text.secondary">{item.sku}</Typography></TableCell><TableCell>{item.category}</TableCell><TableCell fontWeight={700}>{item.stock} units</TableCell><TableCell>{item.reorderAt} units</TableCell><TableCell>₹{item.value.toLocaleString('en-IN')}</TableCell><TableCell><Chip size="small" icon={item.status !== 'Healthy' ? <WarningAmber /> : undefined} label={item.status} color={statusColor(item.status) as any} /></TableCell></TableRow>)}</TableBody></Table></TableContainer></GlassCard>
  </Box>;
}
