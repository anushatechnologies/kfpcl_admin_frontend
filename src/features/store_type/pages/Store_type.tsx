import { useEffect, useMemo, useState } from 'react';
import { Add, Delete, Edit, ImageNotSupported, Search, Visibility, Close } from '@mui/icons-material';
import { Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, InputAdornment, MenuItem, Paper, Select, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { toast } from '../../../components/toast/ToastContainer';
import AddForm from './add_store';
import { useGetStoreTypesQuery, useGetStoreTypeByIdQuery, useCreateStoreTypeMutation, useUpdateStoreTypeMutation, useDeleteStoreTypeMutation, StoreRequest as StoreTypeRequest, StoreType } from '../api/storeapi';
import { useUploadCatalogImageMutation, resolveCatalogImageUrl } from '@features/products/api/productApi';
import ConfirmDialog from '../../../components/ConfirmDialog';
import { GlassPageHeader, GradientText, GlassCard } from '../../../components/glassmorphism/GlassComponents';
import { SkeletonPageHeader, SkeletonTable } from '../../../components/skeletons/LoadingSkeletons';
import { useAppTheme } from '@contexts/ThemeContext';

const ITEMS_PER_PAGE = 5;

export default function StoreTypePage() {
  const { currentTheme, isDark } = useAppTheme();
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState<StoreType | null>(null);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewStoreId, setViewStoreId] = useState<number | null>(null);
  useEffect(() => { const timer = setTimeout(() => setDebouncedSearch(search), 250); return () => clearTimeout(timer); }, [search]);
  const { data, isLoading: loading, error } = useGetStoreTypesQuery({ name: debouncedSearch || undefined, page: currentPage - 1, size: ITEMS_PER_PAGE });
  const { data: storeDetails } = useGetStoreTypeByIdQuery(viewStoreId ?? 0, { skip: viewStoreId === null });
  const [createStoreType, { isLoading: isCreating }] = useCreateStoreTypeMutation();
  const [updateStoreType, { isLoading: isUpdating }] = useUpdateStoreTypeMutation();
  const [deleteStoreType, { isLoading: isDeleting }] = useDeleteStoreTypeMutation();
  const [uploadCatalogImage] = useUploadCatalogImageMutation();
  useEffect(() => { if (error) toast.error('Failed to load store types'); }, [error]);
  const stores = useMemo(() => ((data as any)?.content || data || []) as StoreType[], [data]);
  const filteredStores = useMemo(() => {
    const query = debouncedSearch.trim().toLowerCase();
    if (!query) return stores;
    return stores.filter((store) =>
      [store.name, store.label, store.phoneNumber, store.email, store.address, store.city]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query)),
    );
  }, [stores, debouncedSearch]);
  const visibleStores = useMemo(() => filteredStores.filter((store) =>
    statusFilter === 'all' || store.active === (statusFilter === 'active'),
  ), [filteredStores, statusFilter]);
  const totalEntries = debouncedSearch || statusFilter !== 'all' ? visibleStores.length : (data as any)?.totalElements ?? stores.length;
  const totalPages = (data as any)?.totalPages || Math.max(1, Math.ceil(totalEntries / ITEMS_PER_PAGE));

  const handleCreate = async (storeData: StoreTypeRequest, imageFile?: File) => {
    let finalImageUrl = storeData.imageUrl?.trim() || '';

    if (imageFile) {
      try {
        const uploadRes = await uploadCatalogImage({ file: imageFile, type: 'STORE' }).unwrap();
        const uploadedUrl = resolveCatalogImageUrl(uploadRes);
        if (uploadedUrl) finalImageUrl = uploadedUrl;
      } catch (uploadErr) {
        console.warn('Catalog upload failed for store type', uploadErr);
      }
    }

    if (!finalImageUrl && !imageFile) {
      return toast.error('Please upload a store image or provide an image URL');
    }

    try {
      await createStoreType({
        data: { ...storeData, imageUrl: finalImageUrl || undefined },
        image: imageFile,
      }).unwrap();
      setShowModal(false);
      toast.success('Store created successfully');
    } catch (e: any) {
      toast.error(e?.data?.message || e?.data?.error || e?.message || 'Failed to create store');
    }
  };

  const handleUpdate = async (id: number, storeData: StoreTypeRequest, imageFile?: File) => {
    let finalImageUrl = storeData.imageUrl?.trim() || '';

    if (imageFile) {
      try {
        const uploadRes = await uploadCatalogImage({ file: imageFile, type: 'STORE' }).unwrap();
        const uploadedUrl = resolveCatalogImageUrl(uploadRes);
        if (uploadedUrl) finalImageUrl = uploadedUrl;
      } catch (uploadErr) {
        console.warn('Catalog upload failed for store type', uploadErr);
      }
    }

    try {
      await updateStoreType({
        id,
        data: { ...storeData, imageUrl: finalImageUrl || storeData.imageUrl },
        image: imageFile,
      }).unwrap();
      setShowModal(false);
      setEditData(null);
      toast.success('Store updated successfully');
    } catch (e: any) {
      toast.error(e?.data?.message || e?.data?.error || e?.message || 'Failed to update store');
    }
  };

  const handleDelete = async (id: number) => { try { await deleteStoreType(id).unwrap(); setConfirmId(null); toast.success('Store deleted successfully'); } catch (e: any) { toast.error(e?.data?.message || e.message || 'Failed to delete store'); } };
  const headSx = { py: 1.5, px: 2, fontSize: 12, fontWeight: 800, color: 'text.secondary', background: isDark ? alpha('#64748b', .18) : '#f1f5f9', whiteSpace: 'nowrap' };
  const cellSx = { py: 1.5, px: 2, borderColor: 'divider', verticalAlign: 'middle' };
  if (loading && !stores.length) return <Box><SkeletonPageHeader /><SkeletonTable /></Box>;
  return <Box sx={{ width: '100%', minWidth: 0, display: 'grid', gap: 2.5 }}>
    <GlassPageHeader><Stack direction={{ xs: 'column', md: 'row' }} spacing={2.5} sx={{ justifyContent: 'space-between', alignItems: { md: 'center' } }}><Box><Typography variant="overline" color="text.secondary" fontWeight={800} letterSpacing={2}>Store setup</Typography><Typography variant="h4" fontWeight={900} sx={{ mt: .25 }}><GradientText>Store List</GradientText></Typography><Typography color="text.secondary" sx={{ mt: .75 }}>Manage the storefronts shown to customers.</Typography></Box><Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.25} sx={{ width: { xs: '100%', md: 'auto' } }}><TextField size="small" value={search} placeholder="Search stores..." onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} sx={{ minWidth: { sm: 250 }, '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }} InputProps={{ startAdornment: <InputAdornment position="start"><Search fontSize="small" /></InputAdornment> }} /><Select size="small" value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }} sx={{ minWidth: 130, borderRadius: 2.5 }}><MenuItem value="all">All status</MenuItem><MenuItem value="active">Active</MenuItem><MenuItem value="inactive">Inactive</MenuItem></Select><Button variant="contained" startIcon={<Add />} onClick={() => { setEditData(null); setShowModal(true); }} sx={{ minHeight: 40, borderRadius: 2.5, textTransform: 'none', fontWeight: 800, px: 2.25, background: currentTheme.accentGradient }}>Add Store</Button></Stack></Stack></GlassPageHeader>
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 1.5 }}>
      {[
        ['Visible entries', totalEntries, '#6366f1'],
        ['Current page', currentPage, '#10b981'],
        ['Total pages', totalPages, '#3b82f6'],
      ].map(([label, value, color]) => (
        <Paper key={String(label)} sx={{
          p: { xs: 2.25, md: 2.5 }, minHeight: 142, borderRadius: 4,
          border: '1px solid var(--color-border)', borderTop: `3px solid ${color}`,
          background: 'var(--color-card-elevated)', boxShadow: '0 14px 36px rgba(15,23,42,.06)',
          transition: 'transform .2s ease, box-shadow .2s ease',
          '&:hover': { transform: 'translateY(-3px)', boxShadow: `0 18px 40px ${alpha(String(color), isDark ? .2 : .12)}` },
        }}>
          <Typography variant="overline" color="text.secondary" fontWeight={800} letterSpacing={.7}>{label}</Typography>
          <Typography variant="h3" fontWeight={900} sx={{ mt: 2, letterSpacing: '-.05em' }}>{value}</Typography>
        </Paper>
      ))}
    </Box>
    <GlassCard sx={{ p: 0, overflow: 'hidden', '& .MuiTableRow-hover:hover': { backgroundColor: 'action.hover', boxShadow: '0 8px 24px rgba(79,70,229,.12)', transform: 'translateY(-1px)', transition: 'all .2s ease' } }}><TableContainer sx={{ overflowX: 'hidden' }}><Table sx={{ width: '100%', tableLayout: 'fixed' }}><TableHead><TableRow>{['Image', 'Store', 'Contact', 'Location', 'Status', 'Actions'].map((heading) => <TableCell key={heading} sx={{ ...headSx, '&:nth-of-type(1)': { width: 76 }, '&:nth-of-type(5)': { width: 96 }, '&:nth-of-type(6)': { width: 140 } }}>{heading}</TableCell>)}</TableRow></TableHead><TableBody>{visibleStores.map((item) => <TableRow hover key={item.id}><TableCell sx={cellSx}>{item.imageUrl ? <Box component="img" src={item.imageUrl} alt={item.name} sx={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 2, border: '1px solid', borderColor: 'divider' }} /> : <Box sx={{ width: 48, height: 48, display: 'grid', placeItems: 'center', borderRadius: 2, bgcolor: 'action.hover' }}><ImageNotSupported color="disabled" fontSize="small" /></Box>}</TableCell><TableCell sx={cellSx}><Typography fontWeight={800} sx={{ overflowWrap: 'anywhere' }}>{item.name}</Typography></TableCell><TableCell sx={cellSx}><Typography variant="body2" sx={{ overflowWrap: 'anywhere' }}>{item.phoneNumber || 'Not added'}</Typography></TableCell><TableCell sx={{ ...cellSx, overflowWrap: 'anywhere' }}><Typography variant="body2" sx={{ overflowWrap: 'anywhere' }}>{item.address ? `${item.address}${item.city ? `, ${item.city}` : ''}` : 'Not added'}</Typography></TableCell><TableCell sx={cellSx}><Chip size="small" label={item.active ? 'Active' : 'Inactive'} color={item.active ? 'success' : 'default'} sx={{ fontWeight: 800, maxWidth: '100%' }} /></TableCell><TableCell sx={cellSx}><Stack direction="row" spacing={.25}><Tooltip title="View details"><IconButton size="small" color="primary" onClick={() => setViewStoreId(item.id)}><Visibility fontSize="small" /></IconButton></Tooltip><Tooltip title="Edit"><IconButton size="small" onClick={() => { setEditData(item); setShowModal(true); }} color="primary"><Edit fontSize="small" /></IconButton></Tooltip><Tooltip title="Delete"><IconButton size="small" onClick={() => setConfirmId(item.id)} color="error"><Delete fontSize="small" /></IconButton></Tooltip></Stack></TableCell></TableRow>)}{!visibleStores.length && <TableRow><TableCell colSpan={6} align="center" sx={{ py: 8 }}><Typography variant="h6" fontWeight={800}>{search || statusFilter !== 'all' ? 'No stores found' : 'No stores available'}</Typography><Typography variant="body2" color="text.secondary" sx={{ mt: .75 }}>{search || statusFilter !== 'all' ? 'Try different filters.' : 'Stores will appear here once they are created.'}</Typography></TableCell></TableRow>}</TableBody></Table></TableContainer>{totalPages > 1 && <Stack direction="row" spacing={1} justifyContent="center" sx={{ p: 2 }}><Button disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}>Previous</Button><Typography sx={{ alignSelf: 'center' }}>{currentPage} / {totalPages}</Typography><Button disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => p + 1)}>Next</Button></Stack>}</GlassCard>
    <Dialog open={viewStoreId !== null} onClose={() => setViewStoreId(null)} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        Store details
        <IconButton onClick={() => setViewStoreId(null)} aria-label="Close store details"><Close /></IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {storeDetails && (
          <Stack spacing={2}>
            <Box sx={{ p: 2, borderRadius: 3, background: currentTheme.accentGradient, color: '#fff', boxShadow: '0 12px 28px rgba(79,70,229,.22)' }}>
              <Stack direction="row" spacing={2} alignItems="center">
                {storeDetails.imageUrl ? <Box component="img" src={storeDetails.imageUrl} alt={storeDetails.name} sx={{ width: 72, height: 72, borderRadius: 3, objectFit: 'cover', background: '#fff', p: .5 }} /> : <ImageNotSupported />}
                <Box><Typography variant="h6" fontWeight={900}>{storeDetails.name}</Typography><Typography variant="body2">Store ID: #{storeDetails.id}</Typography></Box>
              </Stack>
            </Box>
            {[
              ['Contact', storeDetails.phoneNumber || 'Not added'],
              ['Email', storeDetails.email || 'Not added'],
              ['Address', storeDetails.address || 'Not added'],
              ['City', storeDetails.city || 'Not added'],
              ['Pincode', storeDetails.pincode || 'Not added'],
              ['Status', storeDetails.active ? 'Active' : 'Inactive'],
            ].map(([label, value]) => <Box key={label}><Typography variant="caption" color="text.secondary">{label}</Typography><Typography fontWeight={700}>{value}</Typography></Box>)}
          </Stack>
        )}
      </DialogContent>
      <DialogActions><Button onClick={() => setViewStoreId(null)}>Close</Button></DialogActions>
    </Dialog>
    {showModal && <AddForm initialData={editData || null} onSave={(storeData, imageFile) => editData ? handleUpdate(editData.id, storeData, imageFile) : handleCreate(storeData, imageFile)} onClose={() => { setShowModal(false); setEditData(null); }} />}
    <ConfirmDialog open={confirmId !== null} title="Delete Store" message="Are you sure you want to delete this store?" onConfirm={() => { if (confirmId !== null) void handleDelete(confirmId); }} onCancel={() => setConfirmId(null)} />
  </Box>;
}
