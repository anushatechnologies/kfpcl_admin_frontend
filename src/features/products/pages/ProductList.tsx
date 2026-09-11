import { useState, useEffect, useMemo, type ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  useGetProductsQuery,
  useSearchProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useUploadCatalogImageMutation,
  useAddProductGalleryImageMutation,
  resolveCatalogImageUrl,
  ProductRequest,
} from '../api/productApi';
import { Product } from '../../category/types/index';
import ProductForm, { PendingGalleryUpload } from './ProductForm';
import { toast } from '../../../components/toast/ToastContainer';
import { useErrorHandler } from '../../../hooks/useErrorHandler';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  TextField,
  InputAdornment,
  Chip,
  Avatar,
  Box,
  Tooltip,
  Stack,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  ImageNotSupported as ImageNotSupportedIcon,
  FilterListOff as FilterListOffIcon,
} from '@mui/icons-material';
import ConfirmDialog from '../../../components/ConfirmDialog';
import {
  GlassPageHeader,
  GradientText,
  GlassCard,
} from '../../../components/glassmorphism/GlassComponents';
import { SkeletonPageHeader, SkeletonTable } from '../../../components/skeletons/LoadingSkeletons';
import EmptyState from '../../../components/empty-state/EmptyState';
import { useAppTheme } from '@contexts/ThemeContext';
import { useGetCategoriesQuery } from '../../category/components/api/categoryApi';
import { useGetAllSubCategoriesQuery, useGetSubCategoriesByCategoryQuery } from '../../category/components/api/subCategoryApi';
import { useGetStoreTypesQuery } from '../../store_type/api/storeapi';

const ITEMS_PER_PAGE = 10;

const PRODUCT_STORES_CACHE_KEY = 'kfpcl_admin_product_stores';

const getSavedProductStores = (): Record<string, { storeId?: number; storeName?: string }> => {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(PRODUCT_STORES_CACHE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const saveProductStore = (idOrName: string | number, storeId?: number | null, storeName?: string) => {
  if (typeof window === 'undefined') return;
  try {
    const current = getSavedProductStores();
    if (storeId) {
      current[String(idOrName)] = { storeId: Number(storeId), storeName };
    } else {
      delete current[String(idOrName)];
    }
    localStorage.setItem(PRODUCT_STORES_CACHE_KEY, JSON.stringify(current));
  } catch {}
};

export default function ProductList() {
  const { currentTheme, isDark } = useAppTheme();
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);
  const [localProductStores, setLocalProductStores] = useState<Record<string, { storeId?: number; storeName?: string }>>(getSavedProductStores);
  const { handleError } = useErrorHandler();

  // Filter state
  const [filterStore, setFilterStore] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [filterSubCategory, setFilterSubCategory] = useState<string>('');
  const [filterStock, setFilterStock] = useState<string>('');

  // Fetch filter dropdown data
  const { data: categoriesData } = useGetCategoriesQuery();
  const { data: allSubCategoriesData } = useGetAllSubCategoriesQuery();
  const { data: categorySubCategoriesData } = useGetSubCategoriesByCategoryQuery(
    Number(filterCategory),
    { skip: !filterCategory },
  );
  const { data: storesData } = useGetStoreTypesQuery({ page: 0, size: 100 });

  const categories = categoriesData || [];
  const allSubCategories = allSubCategoriesData || [];
  const stores = useMemo(() => {
    if (!storesData) return [];
    if (Array.isArray(storesData)) return storesData;
    if (Array.isArray((storesData as any).content)) return (storesData as any).content;
    if (Array.isArray((storesData as any).data?.content)) return (storesData as any).data.content;
    if (Array.isArray((storesData as any).data?.stores)) return (storesData as any).data.stores;
    if (Array.isArray((storesData as any).data)) return (storesData as any).data;
    if (Array.isArray((storesData as any).stores)) return (storesData as any).stores;
    if (Array.isArray((storesData as any).items)) return (storesData as any).items;
    return [];
  }, [storesData]);

  // Create store lookup map
  const storeMap = useMemo(() => {
    const map = new Map<string | number, string>();
    stores.forEach((s: any) => {
      if (s.id !== undefined && s.name) {
        map.set(Number(s.id), s.name);
        map.set(String(s.id), s.name);
      }
    });
    return map;
  }, [stores]);

  const getStoreName = (p: Product) => {
    // 1. Direct fields
    if (p.storeName && p.storeName.trim() && p.storeName.toLowerCase() !== 'unassigned') return p.storeName;
    if (p.store?.name && p.store.name.trim() && p.store.name.toLowerCase() !== 'unassigned') return p.store.name;
    const rawAny = p as any;
    if (rawAny.storeType?.name && rawAny.storeType.name.trim()) return rawAny.storeType.name;
    if (rawAny.storeTypeName && rawAny.storeTypeName.trim()) return rawAny.storeTypeName;

    // 2. ID match from backend
    const sId =
      p.storeId ??
      rawAny.store_id ??
      rawAny.store?.id ??
      rawAny.storeTypeId ??
      rawAny.store_type_id ??
      rawAny.storeType?.id ??
      (typeof rawAny.store === 'number' ? rawAny.store : undefined);

    if (sId !== undefined && sId !== null && sId !== 0 && sId !== '0') {
      const matchName = storeMap.get(Number(sId)) || storeMap.get(String(sId));
      if (matchName) return matchName;
      return `Store #${sId}`;
    }

    // 3. Fallback to local stored mapping
    const localById = p.id ? localProductStores[String(p.id)] : undefined;
    const localByName = p.name ? localProductStores[p.name.trim()] : undefined;
    const localItem = localById || localByName;
    if (localItem) {
      if (localItem.storeName && localItem.storeName.trim()) return localItem.storeName;
      if (localItem.storeId) {
        const matchName = storeMap.get(Number(localItem.storeId)) || storeMap.get(String(localItem.storeId));
        if (matchName) return matchName;
        return `Store #${localItem.storeId}`;
      }
    }

    return 'Unassigned';
  };

  // Selected category object lookup
  const selectedCat = useMemo(() => {
    if (!filterCategory) return null;
    return categories.find(
      (c: any) =>
        String(c.id) === String(filterCategory) ||
        String(c.name).trim().toLowerCase() === String(filterCategory).trim().toLowerCase(),
    );
  }, [categories, filterCategory]);

  const [debouncedSearch, setDebouncedSearch] = useState(searchKeyword);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchKeyword), 250);
    return () => clearTimeout(timer);
  }, [searchKeyword]);

  // RTK Query hooks
  const {
    data: allProducts,
    isLoading: productsLoading,
    isError: isAllError,
    error: allError,
  } = useGetProductsQuery({});
  const {
    data: searchedProducts,
    isLoading: searchLoading,
    isError: isSearchError,
    error: searchError,
  } = useSearchProductsQuery(debouncedSearch, {
    skip: debouncedSearch.trim().length === 0,
  });

  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();
  const [uploadCatalogImage] = useUploadCatalogImageMutation();
  const [addProductGalleryImage] = useAddProductGalleryImageMutation();

  const loading = productsLoading || searchLoading;
  const isError = isAllError || isSearchError;
  const error = allError || searchError;
  const rawProducts = debouncedSearch.trim().length > 0 ? searchedProducts || [] : allProducts || [];

  // Filter subcategories based on selected category
  const filteredSubCategories = useMemo(() => {
    if (!filterCategory) return allSubCategories;

    const selectedCatId = filterCategory;
    const selectedCatName = selectedCat?.name?.trim().toLowerCase();

    const results: any[] = [];
    const seenNames = new Set<string>();

    const addSubCategory = (sc: any) => {
      if (!sc) return;
      const name = sc.name || sc.subCategoryName || sc.subcategoryName || sc.title;
      if (!name || !name.trim()) return;
      const cleanName = name.trim().toLowerCase();
      if (seenNames.has(cleanName)) return;
      seenNames.add(cleanName);
      results.push({
        id: sc.id ?? sc.subCategoryId ?? name.trim(),
        name: name.trim(),
        categoryId: sc.categoryId ?? selectedCatId,
      });
    };

    // 1. From category-specific API endpoint results
    const categorySpecific = categorySubCategoriesData || [];
    categorySpecific.forEach(addSubCategory);

    // 2. From allSubCategories list matching by ID or category name
    allSubCategories.forEach((sc: any) => {
      const catId =
        sc.categoryId ??
        sc.category_id ??
        sc.category_Id ??
        sc.subCategoryCategoryId ??
        (typeof sc.category === 'object' ? sc.category?.id : typeof sc.category === 'number' ? sc.category : undefined);
      const catName =
        sc.categoryName ??
        sc.category_name ??
        (typeof sc.category === 'object' ? sc.category?.name : typeof sc.category === 'string' ? sc.category : undefined);

      const matchesId = catId !== undefined && catId !== null && String(catId) === String(selectedCatId);
      const matchesName = selectedCatName && catName && catName.trim().toLowerCase() === selectedCatName;

      if (matchesId || matchesName) {
        addSubCategory(sc);
      }
    });

    // 3. Fallback: extract subcategories directly from loaded products matching selected category
    rawProducts.forEach((p: any) => {
      const pCatId =
        p.categoryId ??
        p.category_id ??
        p.category_Id ??
        p.category?.id ??
        (typeof p.category === 'number' ? p.category : undefined);
      const pCatName =
        p.categoryName ??
        p.category_name ??
        p.category?.name ??
        (typeof p.category === 'string' ? p.category : undefined);

      const matchesId = pCatId !== undefined && pCatId !== null && String(pCatId) === String(selectedCatId);
      const matchesName = selectedCatName && pCatName && pCatName.trim().toLowerCase() === selectedCatName;

      if (matchesId || matchesName) {
        const subName =
          p.subCategoryName ||
          p.subcategoryName ||
          p.subCategory_name ||
          p.subCategory?.name ||
          (typeof p.subCategory === 'string' ? p.subCategory : '');
        const subId =
          p.subCategoryId ??
          p.subcategoryId ??
          p.sub_category_id ??
          p.subCategory?.id;

        if (subName) {
          addSubCategory({ id: subId || subName, name: subName, categoryId: selectedCatId });
        }
      }
    });

    return results;
  }, [filterCategory, selectedCat, allSubCategories, categorySubCategoriesData, rawProducts]);

  const hasActiveFilters = filterStore !== '' || filterCategory !== '' || filterSubCategory !== '' || filterStock !== '';

  const handleResetFilters = () => {
    setFilterStore('');
    setFilterCategory('');
    setFilterSubCategory('');
    setFilterStock('');
    setCurrentPage(1);
  };

  // Apply client-side filters
  const products = useMemo(() => {
    let filtered = rawProducts;

    if (filterStore) {
      filtered = filtered.filter((p) => {
        const pStoreId =
          p.storeId ??
          (p as any).store?.id ??
          (p as any).storeTypeId ??
          (p as any).storeType?.id;
        return String(pStoreId) === String(filterStore);
      });
    }
    if (filterCategory) {
      filtered = filtered.filter((p) => {
        const pCatId =
          p.categoryId ??
          (p as any).category_id ??
          (p as any).category_Id ??
          (p as any).category?.id ??
          (typeof (p as any).category === 'number' ? (p as any).category : undefined);
        const pCatName =
          p.categoryName ??
          (p as any).category_name ??
          (p as any).category?.name ??
          (typeof (p as any).category === 'string' ? (p as any).category : undefined);

        const matchesId = pCatId !== undefined && pCatId !== null && String(pCatId) === String(filterCategory);
        const matchesName = selectedCat?.name && pCatName && pCatName.trim().toLowerCase() === selectedCat.name.trim().toLowerCase();

        return matchesId || matchesName;
      });
    }
    if (filterSubCategory) {
      filtered = filtered.filter((p: any) => {
        const pSubCatId =
          p.subCategoryId ??
          p.subcategoryId ??
          p.sub_category_id ??
          p.subcategory_id ??
          p.subCategory?.id ??
          (typeof p.subCategory === 'number' ? p.subCategory : undefined);
        const pSubCatName =
          p.subCategoryName ??
          p.subcategoryName ??
          p.subCategory_name ??
          p.subCategory?.name ??
          (typeof p.subCategory === 'string' ? p.subCategory : '');

        const matchesId = pSubCatId !== undefined && pSubCatId !== null && String(pSubCatId) === String(filterSubCategory);
        const matchesName = pSubCatName && pSubCatName.trim().toLowerCase() === String(filterSubCategory).trim().toLowerCase();

        return matchesId || matchesName;
      });
    }
    if (filterStock === 'in_stock') {
      filtered = filtered.filter((p) => {
        const totalStock = p.variants?.reduce((sum, v) => sum + (v.stock || 0), 0) ?? 0;
        return totalStock > 0;
      });
    } else if (filterStock === 'out_of_stock') {
      filtered = filtered.filter((p) => {
        const totalStock = p.variants?.reduce((sum, v) => sum + (v.stock || 0), 0) ?? 0;
        return totalStock === 0;
      });
    }

    return filtered;
  }, [rawProducts, filterStore, filterCategory, filterSubCategory, filterStock, selectedCat]);

  useEffect(() => {
    if (isError && error) {
      handleError(error);
    }
  }, [isError, error, handleError]);

  const handleSave = async (
    data: ProductRequest,
    imageFile?: File,
    _videoFile?: File,
    galleryUploads: PendingGalleryUpload[] = [],
  ) => {
    try {
      let productId = editingProduct?.id;

      // 1. Upload main image to catalog endpoint if a file was selected
      let mainImageUrl = data.mainImageUrl;
      if (imageFile) {
        try {
          const uploadRes = await uploadCatalogImage({
            file: imageFile,
            type: 'PRODUCT',
          }).unwrap();
          const uploadedUrl = resolveCatalogImageUrl(uploadRes);
          if (uploadedUrl) {
            mainImageUrl = uploadedUrl;
          }
        } catch (uploadErr) {
          console.warn('Direct catalog upload failed, proceeding with standard save', uploadErr);
        }
      }

      const productPayload: ProductRequest = {
        ...data,
        mainImageUrl,
      };

      if (editingProduct) {
        const updatedProduct = await updateProduct({
          id: editingProduct.id,
          product: productPayload,
          image: imageFile,
        }).unwrap();
        productId = (updatedProduct as any)?.id ?? editingProduct.id;
        toast.success('Product updated successfully');
      } else {
        const createdProduct = await createProduct({
          product: productPayload,
          image: imageFile,
        }).unwrap();
        productId = (createdProduct as any)?.id;
        toast.success('Product created successfully');
      }

      // Save store association locally for immediate display
      if (productPayload.storeId) {
        const sName =
          storeMap.get(Number(productPayload.storeId)) ||
          storeMap.get(String(productPayload.storeId)) ||
          `Store #${productPayload.storeId}`;
        if (productId) {
          saveProductStore(productId, productPayload.storeId, sName);
        }
        if (productPayload.name) {
          saveProductStore(productPayload.name.trim(), productPayload.storeId, sName);
        }
        setLocalProductStores(getSavedProductStores());
      }

      // Upload pending gallery images one by one via the catalog upload endpoint
      if (galleryUploads.length && productId) {
        let uploaded = 0;
        let failed = 0;
        for (const item of galleryUploads) {
          try {
            const uploadRes = await uploadCatalogImage({
              file: item.file,
              type: 'PRODUCT',
            }).unwrap();
            const imageUrl = resolveCatalogImageUrl(uploadRes);
            if (imageUrl) {
              await addProductGalleryImage({
                productId: productId!,
                imageUrl,
                isPrimary: item.displayOrder === 1,
              }).unwrap();
              uploaded++;
            } else {
              failed++;
            }
          } catch {
            failed++;
          }
        }
        if (uploaded > 0)
          toast.success(`${uploaded} gallery image${uploaded > 1 ? 's' : ''} uploaded`);
        if (failed > 0)
          toast.error(`${failed} gallery image${failed > 1 ? 's' : ''} failed to upload`);
      }

      setSearchKeyword('');
      setShowModal(false);
      setEditingProduct(null);
    } catch (err: any) {
      console.error('Failed to save product:', err);
      const msg =
        err?.data?.message ||
        err?.data?.error ||
        (typeof err?.data === 'string' ? err.data : null) ||
        err?.error ||
        err?.message ||
        `Failed to save product (${err?.status || 'check network/logs'})`;
      toast.error(msg);
    }
  };

  const handleConfirmDelete = async () => {
    if (productToDelete === null) return;
    try {
      await deleteProduct(productToDelete).unwrap();
      toast.success('Product deleted successfully');
      setDeleteConfirmOpen(false);
      setProductToDelete(null);
    } catch (err: any) {
      toast.error(err.data?.message || 'Failed to delete product');
    }
  };

  const handleAddNew = () => {
    setEditingProduct(null);
    setShowModal(true);
  };

  const handleEdit = (p: Product) => {
    setEditingProduct(p);
    setShowModal(true);
  };

  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const currentData = products.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const handlePageChange = (_event: ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  if (loading && !products.length) {
    return (
      <Box sx={{ p: 4, background: currentTheme.bg, minHeight: '100vh' }}>
        <SkeletonPageHeader />
        <SkeletonTable />
      </Box>
    );
  }

  if (isError && !products.length) {
    return (
      <Box sx={{ p: 4, background: currentTheme.bg, minHeight: '100vh' }}>
        <EmptyState
          type="error"
          title="Failed to load products"
          description="There was an error loading the products. Please try again."
          secondaryActionLabel="Retry"
          onSecondaryAction={() => window.location.reload()}
        />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <GlassPageHeader>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: { xs: 'flex-start', sm: 'center' },
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: 1.5, sm: 2 },
            }}
          >
            <Box sx={{ width: { xs: '100%', sm: 'auto' } }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  mb: 0.5,
                  fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' },
                }}
              >
                <GradientText>Products</GradientText>
              </Typography>
              <Typography
                color="text.secondary"
                sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
              >
                {products.length} products • Manage your product catalog
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddNew}
              disabled={isCreating || isUpdating}
              fullWidth={false}
              sx={{
                borderRadius: { xs: 2, sm: 3 },
                textTransform: 'none',
                fontWeight: 600,
                background: currentTheme.accentGradient,
                boxShadow: isDark
                  ? '0 4px 15px rgba(0, 245, 255, 0.4), 0 0 30px rgba(0, 245, 255, 0.2)'
                  : currentTheme.shadow,
                py: { xs: 1, sm: 1.2 },
                px: { xs: 2, sm: 3 },
                fontSize: { xs: '0.875rem', sm: '1rem' },
                width: { xs: '100%', sm: 'auto' },
                minWidth: { sm: '140px' },
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: isDark
                    ? '0 6px 20px rgba(0, 245, 255, 0.6), 0 0 40px rgba(0, 245, 255, 0.3)'
                    : currentTheme.hoverShadow,
                  transform: 'translateY(-2px)',
                },
              }}
            >
              Add Product
            </Button>
          </Box>
        </GlassPageHeader>
      </motion.div>

      {/* Search & Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Box
          sx={{
            mb: { xs: 2, sm: 3 },
            p: { xs: 1.5, sm: 2, md: 2.5 },
            background: currentTheme.cardBg,
            backdropFilter: 'blur(20px)',
            borderRadius: { xs: 2, sm: 3 },
            border: `1px solid ${currentTheme.border}`,
            boxShadow: currentTheme.shadow,
          }}
        >
          {/* Row 1: Search + Store + Category */}
          <Box
            sx={{
              display: 'flex',
              gap: { xs: 1, sm: 2 },
              flexWrap: 'wrap',
              mb: { xs: 1, sm: 1.5 },
            }}
          >
            <TextField
              placeholder="Search products..."
              value={searchKeyword}
              onChange={(e) => {
                setSearchKeyword(e.target.value);
                setCurrentPage(1);
              }}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: currentTheme.accent }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                flex: 1,
                minWidth: { xs: '100%', sm: 250, md: 300 },
                '& .MuiOutlinedInput-root': {
                  borderRadius: { xs: 2, sm: 3 },
                  background: currentTheme.inputBg,
                  color: currentTheme.text,
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  '& fieldset': { borderColor: currentTheme.border },
                  '&:hover fieldset': { borderColor: currentTheme.accent },
                  '&.Mui-focused fieldset': { borderColor: currentTheme.accent },
                },
                '& .MuiInputBase-input::placeholder': { color: currentTheme.textSecondary },
              }}
            />

            {/* Store Filter */}
            <FormControl
              sx={{
                minWidth: { xs: '100%', sm: 180 },
                '& .MuiOutlinedInput-root': {
                  borderRadius: { xs: 2, sm: 3 },
                  background: currentTheme.inputBg,
                  color: currentTheme.text,
                  '& fieldset': { borderColor: currentTheme.border },
                  '&:hover fieldset': { borderColor: currentTheme.accent },
                  '&.Mui-focused fieldset': { borderColor: currentTheme.accent },
                },
                '& .MuiInputLabel-root': { color: currentTheme.textSecondary },
                '& .MuiInputLabel-root.Mui-focused': { color: currentTheme.accent },
                '& .MuiSelect-icon': { color: currentTheme.textSecondary },
              }}
              size="small"
            >
              <InputLabel>Store</InputLabel>
              <Select
                value={filterStore}
                label="Store"
                onChange={(e) => {
                  setFilterStore(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <MenuItem value="">All Stores</MenuItem>
                {stores.map((store: any) => (
                  <MenuItem key={store.id} value={store.id}>
                    {store.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Category Filter */}
            <FormControl
              sx={{
                minWidth: { xs: '100%', sm: 180 },
                '& .MuiOutlinedInput-root': {
                  borderRadius: { xs: 2, sm: 3 },
                  background: currentTheme.inputBg,
                  color: currentTheme.text,
                  '& fieldset': { borderColor: currentTheme.border },
                  '&:hover fieldset': { borderColor: currentTheme.accent },
                  '&.Mui-focused fieldset': { borderColor: currentTheme.accent },
                },
                '& .MuiInputLabel-root': { color: currentTheme.textSecondary },
                '& .MuiInputLabel-root.Mui-focused': { color: currentTheme.accent },
                '& .MuiSelect-icon': { color: currentTheme.textSecondary },
              }}
              size="small"
            >
              <InputLabel>Category</InputLabel>
              <Select
                value={filterCategory}
                label="Category"
                onChange={(e) => {
                  setFilterCategory(e.target.value);
                  setFilterSubCategory('');
                  setCurrentPage(1);
                }}
              >
                <MenuItem value="">All Categories</MenuItem>
                {categories.map((cat: any) => (
                  <MenuItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Row 2: SubCategory + Stock + Reset */}
          <Box
            sx={{
              display: 'flex',
              gap: { xs: 1, sm: 2 },
              flexWrap: 'wrap',
              alignItems: 'center',
            }}
          >
            {/* SubCategory Filter */}
            <FormControl
              sx={{
                minWidth: { xs: '100%', sm: 180 },
                '& .MuiOutlinedInput-root': {
                  borderRadius: { xs: 2, sm: 3 },
                  background: currentTheme.inputBg,
                  color: currentTheme.text,
                  '& fieldset': { borderColor: currentTheme.border },
                  '&:hover fieldset': { borderColor: currentTheme.accent },
                  '&.Mui-focused fieldset': { borderColor: currentTheme.accent },
                },
                '& .MuiInputLabel-root': { color: currentTheme.textSecondary },
                '& .MuiInputLabel-root.Mui-focused': { color: currentTheme.accent },
                '& .MuiSelect-icon': { color: currentTheme.textSecondary },
              }}
              size="small"
            >
              <InputLabel>SubCategory</InputLabel>
              <Select
                value={filterSubCategory}
                label="SubCategory"
                onChange={(e) => {
                  setFilterSubCategory(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <MenuItem value="">All SubCategories</MenuItem>
                {filteredSubCategories.map((sc: any) => (
                  <MenuItem key={sc.id} value={sc.id}>
                    {sc.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Stock Filter */}
            <FormControl
              sx={{
                minWidth: { xs: '100%', sm: 160 },
                '& .MuiOutlinedInput-root': {
                  borderRadius: { xs: 2, sm: 3 },
                  background: currentTheme.inputBg,
                  color: currentTheme.text,
                  '& fieldset': { borderColor: currentTheme.border },
                  '&:hover fieldset': { borderColor: currentTheme.accent },
                  '&.Mui-focused fieldset': { borderColor: currentTheme.accent },
                },
                '& .MuiInputLabel-root': { color: currentTheme.textSecondary },
                '& .MuiInputLabel-root.Mui-focused': { color: currentTheme.accent },
                '& .MuiSelect-icon': { color: currentTheme.textSecondary },
              }}
              size="small"
            >
              <InputLabel>Stock</InputLabel>
              <Select
                value={filterStock}
                label="Stock"
                onChange={(e) => {
                  setFilterStock(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <MenuItem value="">All stock</MenuItem>
                <MenuItem value="in_stock">In Stock</MenuItem>
                <MenuItem value="out_of_stock">Out of Stock</MenuItem>
              </Select>
            </FormControl>

            {/* Reset Filters Button */}
            <AnimatePresence>
              {hasActiveFilters && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                >
                  <Button
                    variant="outlined"
                    startIcon={<FilterListOffIcon />}
                    onClick={handleResetFilters}
                    sx={{
                      borderRadius: { xs: 2, sm: 3 },
                      textTransform: 'none',
                      fontWeight: 600,
                      borderColor: currentTheme.border,
                      color: currentTheme.textSecondary,
                      background: isDark
                        ? 'rgba(255, 255, 255, 0.04)'
                        : 'rgba(0, 0, 0, 0.04)',
                      px: { xs: 2, sm: 3 },
                      py: 0.8,
                      whiteSpace: 'nowrap',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        borderColor: currentTheme.accent,
                        color: currentTheme.accent,
                        background: isDark
                          ? 'rgba(0, 245, 255, 0.08)'
                          : 'rgba(99, 102, 241, 0.08)',
                      },
                    }}
                  >
                    Reset Filters
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </Box>
        </Box>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <GlassCard>
          <>
            {/* Desktop Table View */}
            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
              <TableContainer
                component={Paper}
                sx={{
                  boxShadow: 'none',
                  background: 'transparent',
                  overflowX: 'hidden',
                }}
              >
                <Table sx={{ width: '100%', tableLayout: 'fixed' }}>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700, color: currentTheme.text }}>Image</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: currentTheme.text }}>Name</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: currentTheme.text }}>Variants</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: currentTheme.text }}>Category</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: currentTheme.text }}>SubCategory</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: currentTheme.text }}>Store</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: currentTheme.text }}>Active</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: currentTheme.text }}>Trending</TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          width: 112,
                          fontWeight: 700,
                          color: currentTheme.text,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <AnimatePresence mode="popLayout">
                      {currentData.map((p, index) => (
                        <TableRow
                          key={p.id}
                          hover
                          sx={{
                            '&:hover > td': {
                              backgroundColor: isDark
                                ? 'rgba(255, 255, 255, 0.08)'
                                : 'rgba(99, 102, 241, 0.08)',
                            },
                          }}
                          component={motion.tr}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                          <TableCell>
                            {p.imageUrl ? (
                              <Avatar
                                src={p.imageUrl}
                                alt={p.name}
                                variant="rounded"
                                sx={{ width: 48, height: 48, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                              />
                            ) : (
                              <Box
                                sx={{
                                  width: 48,
                                  height: 48,
                                  borderRadius: 1,
                                  background: 'linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                <ImageNotSupportedIcon color="disabled" />
                              </Box>
                            )}
                          </TableCell>
                          <TableCell>
                            <Typography fontWeight={600} sx={{ color: currentTheme.text }}>
                              {p.name}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Tooltip title={p.variants?.map((v: any) => v.name).join(', ') || 'No variants'}>
                              <Chip
                                label={`${p.variants?.length || 0} variant${p.variants?.length !== 1 ? 's' : ''}`}
                                size="small"
                                sx={{
                                  background: currentTheme.chipBg,
                                  color: currentTheme.accent,
                                  fontWeight: 600,
                                  borderRadius: 2,
                                  border: `1px solid ${currentTheme.border}`,
                                }}
                              />
                            </Tooltip>
                          </TableCell>
                          <TableCell>
                            <Typography sx={{ color: currentTheme.textSecondary }}>
                              {p.categoryName || p.categoryId}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography sx={{ color: currentTheme.textSecondary }}>
                              {p.subCategoryName || p.subCategoryId}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography sx={{ color: currentTheme.textSecondary }}>
                              {getStoreName(p)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={p.isActive ? 'Yes' : 'No'}
                              size="small"
                              sx={{
                                background: p.isActive
                                  ? isDark ? 'rgba(0, 255, 157, 0.2)' : 'rgba(34, 197, 94, 0.15)'
                                  : isDark ? 'rgba(255, 71, 87, 0.2)' : 'rgba(156, 163, 175, 0.15)',
                                color: p.isActive ? currentTheme.success : currentTheme.error,
                                fontWeight: 600,
                                borderRadius: 2,
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={p.isTrending ? 'Yes' : 'No'}
                              size="small"
                              sx={{
                                background: p.isTrending
                                  ? isDark ? 'rgba(0, 212, 255, 0.2)' : 'rgba(59, 130, 246, 0.15)'
                                  : isDark ? 'rgba(156, 163, 175, 0.15)' : 'rgba(156, 163, 175, 0.15)',
                                color: p.isTrending ? currentTheme.info : currentTheme.textSecondary,
                                fontWeight: 600,
                                borderRadius: 2,
                              }}
                            />
                          </TableCell>
                          <TableCell
                            align="center"
                            sx={{
                              width: 112,
                              whiteSpace: 'nowrap',
                              position: 'sticky',
                              right: 0,
                              zIndex: 1,
                              background: currentTheme.cardBg,
                            }}
                          >
                            <Stack direction="row" spacing={1} justifyContent="center" sx={{ minWidth: 96 }}>
                              <Tooltip title="Edit">
                                <IconButton
                                  onClick={() => handleEdit(p)}
                                  size="small"
                                  sx={{
                                    color: currentTheme.accent,
                                    background: isDark
                                      ? 'rgba(0, 245, 255, 0.1)'
                                      : 'rgba(99, 102, 241, 0.1)',
                                    '&:hover': {
                                      background: isDark
                                        ? 'rgba(0, 245, 255, 0.2)'
                                        : 'rgba(99, 102, 241, 0.2)',
                                      boxShadow: isDark ? '0 0 10px rgba(0, 245, 255, 0.5)' : 'none',
                                    },
                                  }}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete">
                                <IconButton
                                  onClick={() => {
                                    setProductToDelete(p.id);
                                    setDeleteConfirmOpen(true);
                                  }}
                                  size="small"
                                  disabled={isDeleting && productToDelete === p.id}
                                  sx={{
                                    color: currentTheme.error,
                                    background: isDark
                                      ? 'rgba(255, 71, 87, 0.1)'
                                      : 'rgba(239, 68, 68, 0.1)',
                                    '&:hover': {
                                      background: isDark
                                        ? 'rgba(255, 71, 87, 0.2)'
                                        : 'rgba(239, 68, 68, 0.2)',
                                      boxShadow: isDark ? '0 0 10px rgba(255, 71, 87, 0.5)' : 'none',
                                    },
                                  }}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))}
                    </AnimatePresence>
                    {!currentData.length && (
                      <TableRow>
                        <TableCell colSpan={9} align="center" sx={{ py: 8 }}>
                          <Typography variant="h6" fontWeight={700} color="text.primary">
                            {searchKeyword ? 'No products found' : 'No products available'}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
                            {searchKeyword
                              ? `No results for "${searchKeyword}". Try a different search term.`
                              : 'Add your first product to start building the catalog.'}
                          </Typography>
                          {searchKeyword && (
                            <Button
                              variant="outlined"
                              onClick={() => { setSearchKeyword(''); setCurrentPage(1); }}
                              sx={{ mt: 2, textTransform: 'none' }}
                            >
                              Clear search
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            {/* Mobile Card View */}
            <Box sx={{ display: { xs: 'block', md: 'none' } }}>
              <AnimatePresence mode="popLayout">
                {currentData.map((p, index) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Paper
                      sx={{
                        p: 2,
                        mb: 2,
                        borderRadius: 3,
                        background: currentTheme.cardBg,
                        backdropFilter: 'blur(20px)',
                        border: `1px solid ${currentTheme.border}`,
                        boxShadow: currentTheme.shadow,
                        transition: 'all 0.3s ease',
                        '&:hover': isDark
                          ? { boxShadow: '0 8px 32px rgba(0, 245, 255, 0.3)', border: '1px solid rgba(0, 245, 255, 0.4)' }
                          : {},
                      }}
                    >
                      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                        {p.imageUrl ? (
                          <Avatar
                            src={p.imageUrl}
                            alt={p.name}
                            variant="rounded"
                            sx={{ width: 64, height: 64, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                          />
                        ) : (
                          <Box
                            sx={{
                              width: 64,
                              height: 64,
                              borderRadius: 2,
                              background: 'linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <ImageNotSupportedIcon color="disabled" />
                          </Box>
                        )}
                        <Box flex={1}>
                          <Typography fontWeight={700} fontSize="1rem" mb={0.5} sx={{ color: currentTheme.text }}>
                            {p.name}
                          </Typography>
                          <Stack direction="row" spacing={1} gap={0.5} sx={{ flexWrap: 'wrap' }}>
                            <Chip
                              label={p.isActive ? 'Active' : 'Inactive'}
                              size="small"
                              sx={{
                                background: p.isActive
                                  ? isDark ? 'rgba(0, 255, 157, 0.2)' : 'rgba(34, 197, 94, 0.15)'
                                  : isDark ? 'rgba(255, 71, 87, 0.2)' : 'rgba(156, 163, 175, 0.15)',
                                color: p.isActive ? currentTheme.success : currentTheme.error,
                                fontWeight: 600,
                                borderRadius: 2,
                                fontSize: '0.7rem',
                              }}
                            />
                            {p.isTrending && (
                              <Chip
                                label="Trending"
                                size="small"
                                sx={{
                                  background: isDark ? 'rgba(0, 212, 255, 0.2)' : 'rgba(59, 130, 246, 0.15)',
                                  color: currentTheme.info,
                                  fontWeight: 600,
                                  borderRadius: 2,
                                  fontSize: '0.7rem',
                                }}
                              />
                            )}
                          </Stack>
                        </Box>
                      </Box>

                      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, mb: 2 }}>
                        <Box>
                          <Typography variant="caption" sx={{ color: currentTheme.textSecondary }}>Category</Typography>
                          <Typography variant="body2" fontWeight={500} sx={{ color: currentTheme.text }}>
                            {p.categoryName || p.categoryId}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" sx={{ color: currentTheme.textSecondary }}>SubCategory</Typography>
                          <Typography variant="body2" fontWeight={500} sx={{ color: currentTheme.text }}>
                            {p.subCategoryName || p.subCategoryId}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" sx={{ color: currentTheme.textSecondary }}>Store</Typography>
                          <Typography variant="body2" fontWeight={500} sx={{ color: currentTheme.text }}>
                            {getStoreName(p)}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" sx={{ color: currentTheme.textSecondary }}>Variants</Typography>
                          <Typography variant="body2" fontWeight={500} sx={{ color: currentTheme.text }}>
                            {p.variants?.length || 0}
                          </Typography>
                        </Box>
                      </Box>

                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<EditIcon fontSize="small" />}
                          onClick={() => handleEdit(p)}
                          sx={{
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 600,
                            borderColor: currentTheme.border,
                            color: currentTheme.accent,
                            '&:hover': {
                              borderColor: currentTheme.accent,
                              background: isDark ? 'rgba(0, 245, 255, 0.1)' : 'rgba(99, 102, 241, 0.1)',
                            },
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          color="error"
                          startIcon={<DeleteIcon fontSize="small" />}
                          onClick={() => {
                            setProductToDelete(p.id);
                            setDeleteConfirmOpen(true);
                          }}
                          disabled={isDeleting && productToDelete === p.id}
                          sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
                        >
                          Delete
                        </Button>
                      </Stack>
                    </Paper>
                  </motion.div>
                ))}
              </AnimatePresence>
            </Box>

            {totalPages > 1 && (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  mt: { xs: 2, sm: 3 },
                  pb: { xs: 1, sm: 2 },
                  px: { xs: 1, sm: 0 },
                }}
              >
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="primary"
                  shape="rounded"
                  size="small"
                  sx={{
                    '& .MuiPaginationItem-root': {
                      borderRadius: 2,
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      minWidth: { xs: 28, sm: 32 },
                      height: { xs: 28, sm: 32 },
                    },
                  }}
                />
              </Box>
            )}
          </>
        </GlassCard>
      </motion.div>

      {/* Create/Edit Modal */}
      <Dialog
        open={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingProduct(null);
        }}
        maxWidth="md"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              borderRadius: { xs: 0, sm: 4 },
              background: currentTheme.cardBg,
              backdropFilter: 'blur(20px)',
              border: `1px solid ${currentTheme.border}`,
              boxShadow: currentTheme.shadow,
              m: { xs: 0, sm: 2 },
              maxHeight: { xs: '100%', sm: '90vh' },
              width: { xs: '100%', sm: 'auto' },
            },
          },
        }}
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight={700} component="span" sx={{ color: currentTheme.text }}>
            {editingProduct ? 'Edit Product' : 'Create Product'}
          </Typography>
        </DialogTitle>
        <DialogContent dividers sx={{ borderColor: currentTheme.border }}>
          {showModal && (
            <ProductForm
              key={editingProduct?.id ?? 'new'}
              initialData={editingProduct || undefined}
              onSave={handleSave}
              onClose={() => {
                setShowModal(false);
                setEditingProduct(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteConfirmOpen}
        title="Delete Product"
        message="Are you sure you want to delete this product? This will also delete all its variants and cannot be undone."
        confirmLabel="Delete"
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setDeleteConfirmOpen(false);
          setProductToDelete(null);
        }}
      />
    </Box>
  );
}
