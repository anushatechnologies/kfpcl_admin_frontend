import React, { useEffect, useState } from 'react';
import { useAdminStore } from '../../../store/useAdminStore';
import { useProductStore } from '../../../store/useProductStore';
import { Product } from '../../../types';
import {
  AdminProductPayload,
  createAdminCategory,
  createAdminProduct,
  createAdminSubcategory,
  deleteAdminCategory,
  deleteAdminProduct,
  fetchAdminCatalog,
  fetchAdminCategories,
  fetchAdminProducts,
  fetchAdminSubcategories,
  mapApiProductToProduct,
  updateAdminCategory,
} from '../../../services/adminCatalogApi';
import { PageTabs, TabItem } from '../../../components/common/PageTabs';
import {
  Package,
  CheckCircle2,
  XCircle,
  Plus,
  Trash2,
  Edit3,
  ShieldCheck,
  Search,
  Pencil,
  X,
  Image as ImageIcon,
  Check,
  Eye,
  Boxes,
} from 'lucide-react';

const PRODUCT_IMAGE_FALLBACK = 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=160&q=80';
const GST_BY_CATEGORY: Record<string, number> = {
  'Industrial Machinery': 18,
  'Electronics & Components': 18,
  'Raw Materials & Metals': 18,
  'Packaging & Supplies': 12,
  'Safety & PPE Apparel': 12,
  'Chemicals & Resins': 18,
  'Solar & Renewable Tech': 12,
  'Medical & Healthcare': 12,
};
const DEFAULT_SUBCATEGORIES: Record<string, string[]> = {
  'Industrial Machinery': ['CNC Machines', 'Heavy Machinery', 'Precision Parts'],
  'Electronics & Components': ['Power Electronics', 'Control Systems', 'Electronic Components'],
  'Raw Materials & Metals': ['Steel', 'Copper', 'Aluminium'],
  'Packaging & Supplies': ['Industrial Packaging', 'Protective Packaging', 'Shipping Supplies'],
  'Safety & PPE Apparel': ['Safety Wear', 'Protective Equipment', 'Workplace PPE'],
  'Chemicals & Resins': ['Industrial Chemicals', 'Resins', 'Adhesives'],
  'Solar & Renewable Tech': ['Solar Panels', 'Inverters', 'Energy Storage'],
  'Medical Equipment': ['Diagnostic Equipment', 'Hospital Supplies', 'Surgical Equipment'],
};

export const AdminCatalogManagementView: React.FC = () => {
  const {
    activeSubSection,
    setActiveSubSection,
    categories = [],
    setCategories,
    productApprovals = [],
    approveProduct,
    rejectProduct,
    theme = 'dark',
  } = useAdminStore();
  const { products = [], setProducts, deleteProduct, updateProductStatus } = useProductStore();
  const [brands, setBrands] = useState<unknown[]>([]);
  const [apiSubcategories, setApiSubcategories] = useState<any[]>([]);
  const [subcategoryPage, setSubcategoryPage] = useState(1);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [catalogError, setCatalogError] = useState('');

  const [showProductModal, setShowProductModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [subcategoryCategory, setSubcategoryCategory] = useState('');
  const [subcategoryName, setSubcategoryName] = useState('');
  const [categoryImage, setCategoryImage] = useState('');
  const [subcategoryImage, setSubcategoryImage] = useState('');
  const [subcategoryDescription, setSubcategoryDescription] = useState('');
  const [subcategoryDisplayOrder, setSubcategoryDisplayOrder] = useState('0');
  const [subcategoryDiscount, setSubcategoryDiscount] = useState('0');
  const [subcategoryIsActive, setSubcategoryIsActive] = useState(true);
  const [subcategorySubmitting, setSubcategorySubmitting] = useState(false);
  const [subcategorySuccess, setSubcategorySuccess] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('');
  const [productSubcategoryFilter, setProductSubcategoryFilter] = useState('');
  const [productStockFilter, setProductStockFilter] = useState('ALL');
  const [categoryDescription, setCategoryDescription] = useState('');
  const [categoryDisplayOrder, setCategoryDisplayOrder] = useState('0');
  const [categoryDiscount, setCategoryDiscount] = useState('0');
  const [categoryIsActive, setCategoryIsActive] = useState(true);
  const [categorySubmitting, setCategorySubmitting] = useState(false);
  const [deletingCategoryId, setDeletingCategoryId] = useState('');
  const [deletingProductId, setDeletingProductId] = useState('');
  const [updatingCategory, setUpdatingCategory] = useState(false);

  const [productSubmitting, setProductSubmitting] = useState(false);
  const [productSuccess, setProductSuccess] = useState('');
  const [productForm, setProductForm] = useState({
    productName: '',
    categoryId: '',
    subcategoryId: '',
    brand: 'KFPCL',
    description: '',
    imageUrl: '',
    price: '',
    mrp: '',
    discount: '',
    quantity: '1',
    unit: 'kg',
    stockQuantity: '100',
    status: 'Active',
    sku: '',
  });
  const [imagePreview, setImagePreview] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<typeof categories[number] | null>(null);
  const [editingCategory, setEditingCategory] = useState<typeof categories[number] | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const isDark = theme === 'dark';
  const activeCategories = categories.filter((category) => {
    const apiCategory = category as typeof category & { status?: string };
    const status = apiCategory.status?.toUpperCase();
    return apiCategory.isActive !== false && status !== 'INACTIVE' && status !== 'ARCHIVED';
  });
  const subcategoryPageSize = 8;
  const subcategoryTotalPages = Math.max(1, Math.ceil(apiSubcategories.length / subcategoryPageSize));
  const visibleSubcategories = apiSubcategories.slice((subcategoryPage - 1) * subcategoryPageSize, subcategoryPage * subcategoryPageSize);

  useEffect(() => {
    setSubcategoryPage((page) => Math.min(page, subcategoryTotalPages));
  }, [subcategoryTotalPages]);

  useEffect(() => {
    const controller = new AbortController();
    Promise.all([fetchAdminCategories(controller.signal), fetchAdminSubcategories(controller.signal)])
      .then(([apiCategories, apiSubs]) => {
        setCategories(apiCategories as typeof categories);
        setApiSubcategories(apiSubs as any[]);
      })
      .catch((error) => { if (error.name !== 'AbortError') setCatalogError(error.message || 'Unable to load catalog data.'); });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (activeSubSection === 'CATALOG_SUBCATEGORIES') return;
    const controller = new AbortController();
    setCatalogLoading(true);
    fetchAdminCatalog(controller.signal)
      .then(({ products: apiProducts, categories: apiCategories, subcategories: apiSubs, brands: apiBrands }) => {
        const cats = (apiCategories || []) as typeof categories;
        const subs = (apiSubs || []) as any[];
        const mappedProducts = (apiProducts || []).map((p) => mapApiProductToProduct(p, cats, subs));
        setProducts(mappedProducts);
        setCategories(cats);
        setApiSubcategories(subs);
        setBrands(apiBrands);
        // Subcategories are attached to their parent category when the API returns flat records.
        if (subs.length && cats.length) {
          const byCategory = new Map<string, string[]>();
          subs.forEach((item: any) => {
            const parent = item.categoryId || item.category_id || item.category?.id;
            const name = item.name || item.title;
            if (parent && name) byCategory.set(parent, [...(byCategory.get(parent) || []), name]);
          });
          setCategories((cats as any[]).map((category) => ({ ...category, subcategories: category.subcategories || byCategory.get(category.id) || [] })) as typeof categories);
        }
        setCatalogError('');
      })
      .catch((error) => { if (error.name !== 'AbortError') setCatalogError(error.message || 'Unable to load catalog data.'); })
      .finally(() => { if (!controller.signal.aborted) setCatalogLoading(false); });
    return () => controller.abort();
  }, [activeSubSection, setCategories, setProducts]);

  const fieldLabel: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 7, marginBottom: 7, color: isDark ? '#CBD5E1' : '#475569', fontSize: 11, fontWeight: 800 };
  const inputStyle: React.CSSProperties = { width: '100%', boxSizing: 'border-box', background: isDark ? 'rgba(30,41,59,.78)' : '#F8FAFC', border: `1px solid ${isDark ? '#334155' : '#CBD5E1'}`, borderRadius: 9, padding: '10px 12px', color: isDark ? '#F8FAFC' : '#0F172A', fontSize: 13, outline: 'none' };
  const badge = (kind: string): React.CSSProperties => ({ marginLeft: 'auto', fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.03em', color: kind === 'required' ? '#60A5FA' : kind === 'recommended' ? '#34D399' : '#94A3B8' });

  useEffect(() => {
    if (activeSubSection === 'CATALOG_ADD_PRODUCT') setShowProductModal(true);
  }, [activeSubSection]);

  useEffect(() => {
    if (showProductModal && !productForm.categoryId && categories.length > 0) {
      setProductForm((current) => ({ ...current, categoryId: categories[0].id, subcategoryId: '' }));
    }
  }, [showProductModal, categories, productForm.categoryId]);

  const currentTab =
    activeSubSection === 'CATALOG_PRODUCTS'
      ? 'CATALOG_PRODUCTS'
      : activeSubSection === 'CATALOG_APPROVAL'
      ? 'CATALOG_APPROVAL'
      : activeSubSection === 'CATALOG_BRANDS'
      ? 'CATALOG_BRANDS'
      : activeSubSection === 'CATALOG_SUBCATEGORIES'
      ? 'CATALOG_SUBCATEGORIES'
      : activeSubSection === 'CATALOG_ADD_PRODUCT'
      ? 'CATALOG_PRODUCTS'
      : 'CATALOG_CATEGORIES';

  const pendingApprovalsCount = (productApprovals || []).filter((p) => p.status === 'PENDING').length;

  const filteredProducts = products.filter((product) => {
    const query = productSearch.trim().toLowerCase();
    if (
      query &&
      !product.title.toLowerCase().includes(query) &&
      !product.brand.toLowerCase().includes(query) &&
      !(product.specifications?.SKU || product.id).toLowerCase().includes(query)
    )
      return false;
    if (productCategoryFilter) {
      const matchedCat = categories.find((c) => c.name === productCategoryFilter || c.id === productCategoryFilter);
      if (
        product.category !== productCategoryFilter &&
        product.category !== matchedCat?.name &&
        (product as any).categoryId !== productCategoryFilter
      )
        return false;
    }
    if (productSubcategoryFilter) {
      if (product.subcategory !== productSubcategoryFilter && (product as any).subcategoryId !== productSubcategoryFilter)
        return false;
    }
    if (productStockFilter === 'IN_STOCK' && product.stock <= 0) return false;
    if (productStockFilter === 'OUT_OF_STOCK' && product.stock > 0) return false;
    return true;
  });

  const getGstRate = (product: Product) => {
    const specificationRate = product.specifications?.GST || product.specifications?.['GST %'] || product.specifications?.GSTPercentage;
    const parsedRate = Number.parseFloat(String(specificationRate || ''));
    return Number.isFinite(parsedRate) && parsedRate > 0 ? parsedRate : GST_BY_CATEGORY[product.category] || 18;
  };

  const getAvailableSubcategories = (catIdOrName: string) => {
    const matchedCategory = categories.find((item) => item.id === catIdOrName || item.name === catIdOrName);
    const categoryId = matchedCategory?.id || catIdOrName;
    const categoryName = matchedCategory?.name || catIdOrName;

    // Filter API-fetched subcategories by parent category (match by id or name)
    const apiMatched = apiSubcategories.filter((sub: any) => {
      const parentId = sub.categoryId || sub.category_id || sub.category?.id;
      const parentName = sub.categoryName || sub.category?.name;
      return (categoryId && parentId === categoryId) || (parentName && parentName === categoryName);
    });

    if (apiMatched.length > 0) {
      return apiMatched.map((sub: any) => ({
        id: sub.id || sub._id || sub.name,
        name: sub.name || sub.title || 'Subcategory',
      }));
    }

    // Fallback to local names if no API subcategories matched
    const nameList = Array.from(new Set([...(DEFAULT_SUBCATEGORIES[categoryName] || []), ...(matchedCategory?.subcategories || [])]));
    return nameList.map((name) => ({ id: name, name }));
  };

  const getCommissionRate = (product: Product) => categories.find((category) => category.name === product.category || category.id === (product as any).categoryId)?.commissionRate || 2.5;
  const getUnitPrice = (product: Product) => product.price ?? product.tierPricing?.[0]?.pricePerUnit ?? 0;
  const formatProductStatus = (status: Product['status']) => status === 'PUBLISHED' ? 'Approved' : status === 'REJECTED' ? 'Rejected' : 'Pending review';
  const selectedGstRate = selectedProduct ? getGstRate(selectedProduct) : 0;
  const selectedCommissionRate = selectedProduct ? getCommissionRate(selectedProduct) : 0;
  const selectedUnitPrice = selectedProduct ? getUnitPrice(selectedProduct) : 0;
  const selectedTax = selectedUnitPrice * selectedGstRate / 100;
  const selectedCommission = selectedUnitPrice * selectedCommissionRate / 100;
  const selectedGstCompliant = Boolean(selectedProduct?.isGstVerified && selectedGstRate > 0);

  const handleProductDecision = (status: Product['status']) => {
    if (!selectedProduct || (status === 'PUBLISHED' && !selectedGstCompliant)) return;
    updateProductStatus(selectedProduct.id, status);
    setSelectedProduct({ ...selectedProduct, status });
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.productName.trim()) {
      setCatalogError('Product name is required.');
      return;
    }
    if (!productForm.categoryId) {
      setCatalogError('Category is required.');
      return;
    }
    if (!productForm.price || Number(productForm.price) <= 0) {
      setCatalogError('Please enter a valid price.');
      return;
    }
    if (!productForm.unit) {
      setCatalogError('Unit is required.');
      return;
    }
    if (productForm.stockQuantity === '' || Number(productForm.stockQuantity) < 0) {
      setCatalogError('Stock quantity is required.');
      return;
    }

    setProductSubmitting(true);
    setCatalogError('');
    setProductSuccess('');

    try {
      const finalImageUrl = productForm.imageUrl.trim() || imagePreview || PRODUCT_IMAGE_FALLBACK;

      const payload: AdminProductPayload = {
        productName: productForm.productName.trim(),
        categoryId: productForm.categoryId,
        ...(productForm.subcategoryId ? { subcategoryId: productForm.subcategoryId } : {}),
        brand: productForm.brand.trim() || 'KFPCL',
        price: Number(productForm.price) || 0,
        ...(productForm.mrp ? { mrp: Number(productForm.mrp) } : {}),
        ...(productForm.discount ? { discount: Number(productForm.discount) } : {}),
        quantity: Number(productForm.quantity) || 1,
        unit: productForm.unit || 'kg',
        stockQuantity: Number(productForm.stockQuantity) || 0,
        ...(productForm.sku?.trim() ? { sku: productForm.sku.trim() } : {}),
        ...(productForm.description?.trim() ? { description: productForm.description.trim() } : {}),
        ...(finalImageUrl ? { imageUrl: finalImageUrl } : {}),
        status: productForm.status === 'Active' ? 'ACTIVE' : 'DRAFT',
      };

      const created = await createAdminProduct(payload);

      const mappedNewProduct = mapApiProductToProduct(
        (created as any)?.data ?? created ?? payload,
        categories,
        apiSubcategories
      );

      setProducts([mappedNewProduct, ...products.filter((p) => p.id !== mappedNewProduct.id)]);

      // Background DB sync to ensure full consistency
      fetchAdminProducts()
        .then((latest) => {
          if (latest && Array.isArray(latest) && latest.length > 0) {
            setProducts(latest.map((item) => mapApiProductToProduct(item, categories, apiSubcategories)));
          }
        })
        .catch(() => {});

      setProductSuccess('Product created and saved to database successfully!');
      setShowProductModal(false);

      // Reset form
      setProductForm({
        productName: '',
        categoryId: categories[0]?.id || '',
        subcategoryId: '',
        brand: 'KFPCL',
        description: '',
        imageUrl: '',
        price: '',
        mrp: '',
        discount: '',
        quantity: '1',
        unit: 'kg',
        stockQuantity: '100',
        status: 'Active',
        sku: '',
      });
      setImagePreview('');
    } catch (error) {
      setCatalogError(error instanceof Error ? error.message : 'Unable to create product in database.');
    } finally {
      setProductSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id: string, title?: string) => {
    if (!window.confirm(`Delete product "${title || id}"? This action cannot be undone.`)) return;
    setDeletingProductId(id);
    setCatalogError('');
    try {
      await deleteAdminProduct(id);
      deleteProduct(id);
    } catch (error) {
      setCatalogError(error instanceof Error ? error.message : 'Unable to delete product from database.');
    } finally {
      setDeletingProductId('');
    }
  };

  const handleSaveCategoryOnly = async () => {
    const name = (productForm as any).category ? (productForm as any).category.trim() : '';

    if (!name) return;
    setCategorySubmitting(true);
    setCatalogError('');
    try {
      const imageUrl = categoryImage.startsWith('http://') || categoryImage.startsWith('https://') ? categoryImage : undefined;
      const created = await createAdminCategory({
        name,
        ...(imageUrl ? { imageUrl } : {}),
        ...(categoryDescription.trim() ? { description: categoryDescription.trim() } : {}),
        displayOrder: Number(categoryDisplayOrder) || 0,
        discount: Number(categoryDiscount) || 0,
        isActive: categoryIsActive,
        status: categoryIsActive ? 'ACTIVE' : 'INACTIVE',
      });
      const record = (created as any)?.id ? created as any : { ...(created as any), name };
      setCategories([...categories, record]);
      setShowCategoryModal(false);
      setProductForm({ productName: '', category: '', subcategory: '', brand: '', description: '', image: '', price: '', mrp: '', discount: '', quantity: '', unit: 'piece', stock: '', status: 'Active', sku: '' });
      setImagePreview('');
      setCategoryImage('');
      setCategoryDescription('');
      setCategoryDisplayOrder('0');
      setCategoryDiscount('0');
      setCategoryIsActive(true);
    } catch (error) {
      setCatalogError(error instanceof Error ? error.message : 'Unable to create category.');
    } finally {
      setCategorySubmitting(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!window.confirm('Delete this category? This action cannot be undone.')) return;
    setDeletingCategoryId(id);
    setCatalogError('');
    try {
      await deleteAdminCategory(id);
      setCategories(categories.filter((category) => category.id !== id));
      if (selectedCategory?.id === id) setSelectedCategory(null);
      if (editingCategory?.id === id) setEditingCategory(null);
    } catch (error) {
      setCatalogError(error instanceof Error ? error.message : 'Unable to delete category.');
    } finally {
      setDeletingCategoryId('');
    }
  };

  const handleUpdateCategory = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!editingCategory?.name.trim()) return;
    setUpdatingCategory(true);
    setCatalogError('');
    try {
      const category = editingCategory as typeof editingCategory & { status?: string; imageUrl?: string };
      const updated = await updateAdminCategory(category.id, {
        name: category.name.trim(),
        ...(category.imageUrl || category.image ? { imageUrl: category.imageUrl || category.image } : {}),
        ...(category.description?.trim() ? { description: category.description.trim() } : {}),
        displayOrder: Number(category.displayOrder) || 0,
        discount: Number(category.discount) || 0,
        isActive: category.isActive !== false,
        status: category.isActive === false ? 'INACTIVE' : 'ACTIVE',
      });
      const updatedRecord = { ...category, ...((updated as any)?.id ? (updated as any) : {}), name: category.name.trim() };
      setCategories(categories.map((item) => item.id === category.id ? updatedRecord : item));
      setSelectedCategory(null);
      setEditingCategory(null);
    } catch (error) {
      setCatalogError(error instanceof Error ? error.message : 'Unable to update category.');
    } finally {
      setUpdatingCategory(false);
    }
  };

  const handleAddSubcategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const parent = activeCategories.find((category) => category.id === subcategoryCategory);
    const name = subcategoryName.trim();
    if (!parent || !name) {
      setCatalogError('Choose an active parent category before creating a subcategory.');
      return;
    }
    setSubcategorySubmitting(true);
    setSubcategorySuccess('');
    setCatalogError('');
    try {
      const imageUrl = subcategoryImage.startsWith('http://') || subcategoryImage.startsWith('https://')
        ? subcategoryImage
        : undefined;
      const created = await createAdminSubcategory({
        categoryId: parent.id,
        name,
        ...(imageUrl ? { imageUrl } : {}),
        ...(subcategoryDescription.trim() ? { description: subcategoryDescription.trim() } : {}),
        displayOrder: Number(subcategoryDisplayOrder) || 0,
        discount: Number(subcategoryDiscount) || 0,
        isActive: subcategoryIsActive,
        status: subcategoryIsActive ? 'ACTIVE' : 'INACTIVE',
      });
      const createdRecord = (created as any)?.id ? created : { ...(created as any), categoryId: parent.id, categoryName: parent.name, name };
      setApiSubcategories((current) => {
        const next = [...current, createdRecord];
        setSubcategoryPage(Math.ceil(next.length / subcategoryPageSize));
        return next;
      });
      setSubcategorySuccess('Subcategory created successfully.');
      setSubcategoryName('');
      setSubcategoryImage('');
      setSubcategoryDescription('');
      setSubcategoryDisplayOrder('0');
      setSubcategoryDiscount('0');
      setSubcategoryIsActive(true);
    } catch (error) {
      setCatalogError(error instanceof Error ? error.message : 'Unable to create subcategory.');
    } finally {
      setSubcategorySubmitting(false);
    }
  };

  const catalogTabs: TabItem[] = [
    { id: 'CATALOG_CATEGORIES', label: 'Categories', badge: categories.length },
    { id: 'CATALOG_SUBCATEGORIES', label: 'Subcategories', badge: apiSubcategories.length },
    { id: 'CATALOG_PRODUCTS', label: 'Products', badge: products.length },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {catalogLoading && <div style={{ color: '#64748B', fontSize: 12 }}>Loading catalog data…</div>}
      {catalogError && (
        <div style={{ color: '#DC2626', fontSize: 12, background: 'rgba(239, 68, 68, 0.1)', padding: '10px 14px', borderRadius: 8, border: '1px solid rgba(239, 68, 68, 0.25)' }}>
          {catalogError}
        </div>
      )}
      {productSuccess && (
        <div style={{ color: '#059669', fontSize: 12, background: 'rgba(16, 185, 129, 0.1)', padding: '10px 14px', borderRadius: 8, border: '1px solid rgba(16, 185, 129, 0.25)' }}>
          {productSuccess}
        </div>
      )}
      {subcategorySuccess && currentTab === 'CATALOG_SUBCATEGORIES' && (
        <div style={{ color: '#059669', fontSize: 12, background: 'rgba(16, 185, 129, 0.1)', padding: '10px 14px', borderRadius: 8, border: '1px solid rgba(16, 185, 129, 0.25)' }}>
          {subcategorySuccess}
        </div>
      )}
      <style>{`
        .catalog-data-row { transition: background .18s ease, box-shadow .18s ease, transform .18s ease; }
        .catalog-data-row:hover { background: ${isDark ? 'rgba(59,130,246,.12)' : '#EFF6FF'} !important; box-shadow: inset 3px 0 0 ${isDark ? '#60A5FA' : '#3B82F6'}; }
        .product-filter-card { grid-template-columns: minmax(240px, 1.45fr) repeat(4, minmax(135px, 1fr)) !important; background: ${isDark ? 'rgba(15,23,42,.72)' : '#FFFFFF'} !important; border: 1px solid ${isDark ? 'rgba(148,163,184,.22)' : '#E2E8F0'} !important; border-radius: 16px !important; padding: 16px !important; gap: 12px !important; box-shadow: ${isDark ? '0 10px 30px rgba(2,6,23,.18)' : '0 8px 24px rgba(15,23,42,.06)'}; }
        .product-filter-card label { color: ${isDark ? '#94A3B8' : '#64748B'} !important; font-size: 10px !important; font-weight: 800 !important; letter-spacing: .04em; text-transform: uppercase; }
        .product-filter-card input, .product-filter-card select { min-height: 44px; background: ${isDark ? '#111827' : '#F8FAFC'} !important; border: 1px solid ${isDark ? '#334155' : '#CBD5E1'} !important; border-radius: 10px !important; color: ${isDark ? '#F8FAFC' : '#0F172A'} !important; }
        .product-filter-card input:focus, .product-filter-card select:focus { outline: 2px solid ${isDark ? 'rgba(96,165,250,.35)' : 'rgba(37,99,235,.18)'}; outline-offset: 1px; }
        @media (max-width: 1100px) { .product-filter-card { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; } .product-filter-card > div:first-child { grid-column: 1 / -1; } }
        @media (max-width: 640px) { .product-filter-card { grid-template-columns: 1fr !important; } .product-filter-card > div:first-child { grid-column: auto; } }
      `}</style>
      {/* Tab bar and Add Action button row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <PageTabs
          tabs={catalogTabs}
          activeTabId={currentTab}
          onChangeTab={(id) => {
            setProductSuccess('');
            setCatalogError('');
            setActiveSubSection(id as any);
          }}
          theme={theme}
        />

        {currentTab === 'CATALOG_CATEGORIES' && (
          <button
            onClick={() => setShowCategoryModal(true)}
            style={{
              background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
              border: 'none',
              borderRadius: 10,
              padding: '8px 14px',
              color: '#FFF',
              fontSize: 12,
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
            }}
          >
            <Plus size={14} />
            <span>Add Category</span>
          </button>
        )}

        {currentTab === 'CATALOG_PRODUCTS' && (
          <button
            onClick={() => {
              if (categories.length > 0 && !productForm.categoryId) {
                setProductForm((prev) => ({ ...prev, categoryId: categories[0].id }));
              }
              setShowProductModal(true);
            }}
            style={{
              background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
              border: 'none',
              borderRadius: 10,
              padding: '8px 16px',
              color: '#FFF',
              fontSize: 12,
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
            }}
          >
            <Plus size={14} />
            <span>Add Product</span>
          </button>
        )}
      </div>

      {currentTab === 'CATALOG_SUBCATEGORIES' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: isDark ? 'rgba(15,23,42,.82)' : '#FFF', border: `1px solid ${isDark ? 'rgba(96,165,250,.25)' : '#DBEAFE'}`, borderRadius: 16, padding: 20 }}>
            <div style={{ marginBottom: 16 }}><div style={{ color: '#60A5FA', fontSize: 10, fontWeight: 850, letterSpacing: '.1em', textTransform: 'uppercase' }}>Catalog structure</div><h3 style={{ color: isDark ? '#FFF' : '#0F172A', margin: '5px 0 3px', fontSize: 19 }}>Subcategories</h3><p style={{ color: '#94A3B8', margin: 0, fontSize: 12 }}>Add subcategories under an existing category.</p></div>
            <form onSubmit={handleAddSubcategory} style={{ display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: 12, alignItems: 'end' }}>
              <div><label style={fieldLabel}>Parent category<span style={badge('required')}>Required</span></label><select required value={subcategoryCategory} onChange={(e) => { setSubcategoryCategory(e.target.value); setCatalogError(''); }} style={inputStyle}><option value="">Select active category</option>{activeCategories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select>{!activeCategories.length && <small style={{ display: 'block', marginTop: 5, color: '#DC2626' }}>No active categories are available.</small>}</div>
              <div><label style={fieldLabel}>Subcategory name<span style={badge('required')}>Required</span></label><input required value={subcategoryName} onChange={(e) => setSubcategoryName(e.target.value)} placeholder="e.g. Milk" style={inputStyle} /></div>
              <label style={{ height: 40, border: `1px dashed ${isDark ? '#475569' : '#CBD5E1'}`, background: isDark ? 'rgba(30,41,59,.6)' : '#F8FAFC', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, cursor: 'pointer', overflow: 'hidden', color: '#94A3B8', fontSize: 11 }}>{subcategoryImage ? <img src={subcategoryImage} alt="Subcategory preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <><ImageIcon size={16} color="#60A5FA" />Upload image</>}<input type="file" accept="image/*" onChange={(e) => { const file = e.target.files?.[0]; if (file) setSubcategoryImage(URL.createObjectURL(file)); }} style={{ display: 'none' }} /></label>
              <div style={{ gridColumn: '1 / -1' }}><label style={fieldLabel}>Description<span style={badge('optional')}>Optional</span></label><textarea value={subcategoryDescription} onChange={(e) => setSubcategoryDescription(e.target.value)} placeholder="Describe this subcategory" rows={2} style={{ ...inputStyle, resize: 'vertical' }} /></div>
              <div><label style={fieldLabel}>Display order<span style={badge('optional')}>Optional</span></label><input type="number" min="0" value={subcategoryDisplayOrder} onChange={(e) => setSubcategoryDisplayOrder(e.target.value)} style={inputStyle} /></div>
              <div><label style={fieldLabel}>Discount (%)<span style={badge('optional')}>Optional</span></label><input type="number" min="0" max="100" value={subcategoryDiscount} onChange={(e) => setSubcategoryDiscount(e.target.value)} style={inputStyle} /></div>
              <label style={{ height: 40, display: 'flex', alignItems: 'center', gap: 9, color: isDark ? '#E2E8F0' : '#334155', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}><input type="checkbox" checked={subcategoryIsActive} onChange={(e) => setSubcategoryIsActive(e.target.checked)} style={{ width: 17, height: 17, accentColor: '#2563EB' }} />Active subcategory</label>
              <button type="submit" disabled={subcategorySubmitting} style={{ height: 40, border: 0, borderRadius: 9, padding: '0 18px', background: subcategorySubmitting ? '#93C5FD' : '#2563EB', color: '#FFF', fontSize: 12, fontWeight: 800, cursor: subcategorySubmitting ? 'wait' : 'pointer', whiteSpace: 'nowrap' }}><Plus size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} />{subcategorySubmitting ? 'Creating…' : 'Add subcategory'}</button>
            </form>
          </div>
          <div style={{ background: isDark ? 'rgba(15,23,42,.82)' : '#FFF', border: `1px solid ${isDark ? 'rgba(148,163,184,.16)' : '#E2E8F0'}`, borderRadius: 16, overflow: 'hidden' }}>
            <div style={{ padding: '14px 18px', color: isDark ? '#F8FAFC' : '#0F172A', fontSize: 13, fontWeight: 800, borderBottom: `1px solid ${isDark ? 'rgba(148,163,184,.14)' : '#E2E8F0'}` }}>Subcategory directory</div>
            {apiSubcategories.length ? <>{visibleSubcategories.map((subcategory) => <div key={subcategory.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 18px', borderBottom: `1px solid ${isDark ? 'rgba(148,163,184,.1)' : '#F1F5F9'}`, color: isDark ? '#E2E8F0' : '#334155', fontSize: 12 }}><div style={{ width: 30, height: 30, borderRadius: 8, overflow: 'hidden', background: isDark ? '#1E293B' : '#F1F5F9', display: 'grid', placeItems: 'center' }}>{subcategory.imageUrl ? <img src={subcategory.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <ImageIcon size={14} color="#60A5FA" />}</div><span style={{ flex: 1 }}>{subcategory.name}</span><span style={{ color: '#94A3B8' }}>{subcategory.categoryName || subcategory.category?.name || subcategory.categoryId || '—'}</span></div>)}{apiSubcategories.length > subcategoryPageSize && <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '12px 18px', color: '#94A3B8', fontSize: 11 }}><span>Showing {(subcategoryPage - 1) * subcategoryPageSize + 1}–{Math.min(subcategoryPage * subcategoryPageSize, apiSubcategories.length)} of {apiSubcategories.length}</span><div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><button type="button" disabled={subcategoryPage === 1} onClick={() => setSubcategoryPage((page) => page - 1)} style={{ border: `1px solid ${isDark ? '#334155' : '#CBD5E1'}`, borderRadius: 7, background: 'transparent', color: isDark ? '#E2E8F0' : '#334155', padding: '5px 9px', cursor: subcategoryPage === 1 ? 'not-allowed' : 'pointer', opacity: subcategoryPage === 1 ? .45 : 1 }}>Previous</button><span style={{ minWidth: 52, textAlign: 'center', color: isDark ? '#F8FAFC' : '#0F172A', fontWeight: 700 }}>Page {subcategoryPage} / {subcategoryTotalPages}</span><button type="button" disabled={subcategoryPage === subcategoryTotalPages} onClick={() => setSubcategoryPage((page) => page + 1)} style={{ border: 0, borderRadius: 7, background: '#2563EB', color: '#FFF', padding: '6px 10px', cursor: subcategoryPage === subcategoryTotalPages ? 'not-allowed' : 'pointer', opacity: subcategoryPage === subcategoryTotalPages ? .45 : 1 }}>Next</button></div></div>}</> : <div style={{ padding: 22, textAlign: 'center', color: '#94A3B8', fontSize: 12 }}>No subcategories available.</div>}
          </div>
        </div>
      )}

      {/* ─── TAB: CATEGORIES ────────────────────────────────────────────── */}
      {currentTab === 'CATALOG_CATEGORIES' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: 16 }}>
          {categories.map((c) => (
            <div
              key={c.id}
              role="button"
              tabIndex={0}
              onClick={() => setSelectedCategory(c)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedCategory(c); }}
              style={{
                background: isDark ? 'rgba(17, 24, 39, 0.75)' : '#FFFFFF',
                border: `1px solid ${isDark ? 'rgba(148, 163, 184, .16)' : '#E2E8F0'}`,
                borderRadius: 14,
                padding: 18,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: isDark ? '0 10px 30px rgba(2,6,23,.18)' : '0 8px 24px rgba(15,23,42,.06)',
                cursor: 'pointer',
                transition: 'transform .18s ease, box-shadow .18s ease, border-color .18s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.borderColor = isDark ? '#60A5FA' : '#93C5FD'; e.currentTarget.style.boxShadow = isDark ? '0 16px 36px rgba(2,6,23,.35)' : '0 14px 30px rgba(37,99,235,.13)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = isDark ? 'rgba(148, 163, 184, .16)' : '#E2E8F0'; e.currentTarget.style.boxShadow = isDark ? '0 10px 30px rgba(2,6,23,.18)' : '0 8px 24px rgba(15,23,42,.06)'; }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}><div style={{ width: 34, height: 34, borderRadius: 9, overflow: 'hidden', background: isDark ? '#1E293B' : '#F1F5F9', display: 'grid', placeItems: 'center' }}>{c.image ? <img src={c.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Package size={16} color="#60A5FA" />}</div><h4 style={{ fontSize: 17, fontWeight: 800, color: isDark ? '#F8FAFC' : '#0F172A', margin: 0 }}>{c.name}</h4></div>
                  <div style={{ display: 'flex', gap: 5 }}>
                    <button aria-label={`Edit ${c.name}`} onClick={(e) => { e.stopPropagation(); setEditingCategory(c); }} style={{ width: 28, height: 28, display: 'grid', placeItems: 'center', background: isDark ? 'rgba(59,130,246,.14)' : '#EFF6FF', border: 0, borderRadius: 7, color: '#3B82F6', cursor: 'pointer' }}><Pencil size={13} /></button>
                    <button aria-label={`Delete ${c.name}`} disabled={deletingCategoryId === c.id} onClick={(e) => { e.stopPropagation(); handleDeleteCategory(c.id); }} style={{ width: 28, height: 28, display: 'grid', placeItems: 'center', background: 'transparent', border: 0, borderRadius: 7, color: '#EF4444', cursor: deletingCategoryId === c.id ? 'wait' : 'pointer', opacity: deletingCategoryId === c.id ? 0.5 : 1 }}><Trash2 size={14} /></button>
                  </div>
                </div>
                <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>{c.count}</div>

                <div style={{ margin: '10px 0', borderTop: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)'}`, paddingTop: 8 }}>
                  <div style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 700, textTransform: 'uppercase' }}>Subcategories:</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 6 }}>
                    {c.subcategories?.map((sub) => (
                      <span key={sub} style={{ fontSize: 9, background: isDark ? 'rgba(31, 41, 55, 0.8)' : '#F3F4F6', padding: '2px 6px', borderRadius: 4, color: isDark ? '#D1D5DB' : '#4B5563' }}>
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ fontSize: 11, color: '#2563EB', fontWeight: 800, marginTop: 4 }}>
                Category discount: {c.discount ?? 0}%
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedCategory && !editingCategory && (
        <div onClick={() => setSelectedCategory(null)} style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'grid', placeItems: 'center', padding: 20, background: 'rgba(2,6,23,.68)', backdropFilter: 'blur(8px)' }}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: 'min(100%, 520px)', background: isDark ? '#111827' : '#FFFFFF', border: `1px solid ${isDark ? 'rgba(148,163,184,.2)' : '#E2E8F0'}`, borderRadius: 18, padding: 24, color: isDark ? '#F8FAFC' : '#0F172A', boxShadow: '0 24px 70px rgba(2,6,23,.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}><div><div style={{ color: '#60A5FA', fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.08em' }}>Category details</div><h2 style={{ margin: '7px 0 0', fontSize: 24 }}>{selectedCategory.name}</h2></div><button onClick={() => setSelectedCategory(null)} style={{ border: 0, background: 'transparent', color: isDark ? '#CBD5E1' : '#64748B', cursor: 'pointer' }}><X size={19} /></button></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, margin: '22px 0' }}><div style={{ background: isDark ? 'rgba(30,41,59,.7)' : '#F8FAFC', borderRadius: 10, padding: 13 }}><small style={{ color: '#94A3B8' }}>Products</small><strong style={{ display: 'block', marginTop: 5, fontSize: 18 }}>{selectedCategory.count}</strong></div><div style={{ background: isDark ? 'rgba(30,41,59,.7)' : '#F8FAFC', borderRadius: 10, padding: 13 }}><small style={{ color: '#94A3B8' }}>Category discount</small><strong style={{ display: 'block', marginTop: 5, fontSize: 18, color: '#3B82F6' }}>{selectedCategory.discount ?? 0}%</strong></div></div>
            <div style={{ color: '#94A3B8', fontSize: 11, fontWeight: 800, textTransform: 'uppercase', marginBottom: 9 }}>Subcategories</div><div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>{selectedCategory.subcategories?.map((sub) => <span key={sub} style={{ background: isDark ? 'rgba(51,65,85,.75)' : '#F1F5F9', color: isDark ? '#CBD5E1' : '#475569', borderRadius: 7, padding: '6px 9px', fontSize: 12 }}>{sub}</span>)}</div>
            <button onClick={() => setEditingCategory(selectedCategory)} style={{ width: '100%', marginTop: 24, border: 0, borderRadius: 10, padding: 11, background: '#2563EB', color: '#FFF', fontWeight: 800, cursor: 'pointer' }}>Edit category</button>
          </div>
        </div>
      )}

      {editingCategory && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1001, display: 'grid', placeItems: 'center', padding: 20, background: 'rgba(2,6,23,.68)', backdropFilter: 'blur(8px)' }}>
          <form onSubmit={handleUpdateCategory} style={{ width: 'min(100%, 500px)', background: isDark ? '#111827' : '#FFFFFF', borderRadius: 18, padding: 24, color: isDark ? '#F8FAFC' : '#0F172A' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><h2 style={{ margin: 0, fontSize: 20 }}>Edit category</h2><button type="button" onClick={() => setEditingCategory(null)} style={{ border: 0, background: 'transparent', color: '#94A3B8', cursor: 'pointer' }}><X size={18} /></button></div>
            <label style={{ display: 'block', marginTop: 20, color: '#94A3B8', fontSize: 11, fontWeight: 800 }}>CATEGORY NAME<input required value={editingCategory.name} onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })} style={{ display: 'block', width: '100%', boxSizing: 'border-box', marginTop: 7, padding: 10, borderRadius: 9, border: `1px solid ${isDark ? '#334155' : '#CBD5E1'}`, background: isDark ? '#1E293B' : '#F8FAFC', color: isDark ? '#FFF' : '#0F172A' }} /></label>
            <label style={{ display: 'block', marginTop: 14, color: '#94A3B8', fontSize: 11, fontWeight: 800 }}>DISCOUNT (%)<input type="number" min="0" max="100" step="0.1" value={editingCategory.discount ?? 0} onChange={(e) => setEditingCategory({ ...editingCategory, discount: Number(e.target.value) })} style={{ display: 'block', width: '100%', boxSizing: 'border-box', marginTop: 7, padding: 10, borderRadius: 9, border: `1px solid ${isDark ? '#334155' : '#CBD5E1'}`, background: isDark ? '#1E293B' : '#F8FAFC', color: isDark ? '#FFF' : '#0F172A' }} /></label>
            <button type="submit" disabled={updatingCategory} style={{ width: '100%', marginTop: 22, border: 0, borderRadius: 10, padding: 11, background: updatingCategory ? '#93C5FD' : '#2563EB', color: '#FFF', fontWeight: 800, cursor: updatingCategory ? 'wait' : 'pointer' }}>{updatingCategory ? 'Saving…' : 'Save changes'}</button>
          </form>
        </div>
      )}

      {/* ─── TAB: PRODUCTS ──────────────────────────────────────────────── */}
      {currentTab === 'CATALOG_PRODUCTS' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: isDark ? 'rgba(15,23,42,.82)' : '#FFF', border: `1px solid ${isDark ? 'rgba(96,165,250,.25)' : '#DBEAFE'}`, borderRadius: 16, padding: '20px 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <div>
              <h2 style={{ margin: 0, color: isDark ? '#A5B4FC' : '#3730A3', fontSize: 22 }}>Products</h2>
              <p style={{ margin: '5px 0 0', color: '#94A3B8', fontSize: 11 }}>{products.length} products · Stored and synchronized with backend database</p>
            </div>
            <button
              type="button"
              onClick={() => {
                if (categories.length > 0 && !productForm.categoryId) {
                  setProductForm((prev) => ({ ...prev, categoryId: categories[0].id }));
                }
                setShowProductModal(true);
              }}
              style={{
                border: 0,
                borderRadius: 22,
                padding: '11px 20px',
                background: 'linear-gradient(135deg,#2563EB,#1D4ED8)',
                color: '#FFF',
                fontSize: 13,
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(37,99,235,.35)',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <Plus size={16} />
              <span>Add Product</span>
            </button>
          </div>

          <div className="product-filter-card" style={{ background: isDark ? 'linear-gradient(135deg,#06376B,#052C5B)' : '#EFF6FF', border: `1px solid ${isDark ? 'rgba(59,130,246,.55)' : '#BFDBFE'}`, borderRadius: 28, padding: 10, display: 'grid', gridTemplateColumns: 'minmax(220px,1fr) repeat(4,minmax(120px,.45fr))', gap: 8, alignItems: 'end' }}>
            <div style={{ position: 'relative' }}>
              <label style={{ display: 'none' }}>Search products</label>
              <Search size={15} color="#93C5FD" style={{ position: 'absolute', left: 13, top: 13 }} />
              <input value={productSearch} onChange={(e) => setProductSearch(e.target.value)} placeholder="Search products by name, SKU, brand..." style={{ ...inputStyle, paddingLeft: 36, borderRadius: 22, background: isDark ? '#062C57' : '#FFF', borderColor: isDark ? '#1D5A97' : '#BFDBFE' }} />
            </div>
            <div>
              <label style={{ color: '#BFDBFE', fontSize: 9, display: 'block', margin: '0 0 4px 8px' }}>Store</label>
              <select style={{ ...inputStyle, borderRadius: 22, padding: '9px 12px', background: isDark ? '#062C57' : '#FFF', borderColor: isDark ? '#1D5A97' : '#BFDBFE' }}><option>All Stores</option></select>
            </div>
            <div>
              <label style={{ color: '#BFDBFE', fontSize: 9, display: 'block', margin: '0 0 4px 8px' }}>Category</label>
              <select value={productCategoryFilter} onChange={(e) => { setProductCategoryFilter(e.target.value); setProductSubcategoryFilter(''); }} style={{ ...inputStyle, borderRadius: 22, padding: '9px 12px', background: isDark ? '#062C57' : '#FFF', borderColor: isDark ? '#1D5A97' : '#BFDBFE' }}>
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.name}>{category.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ color: '#BFDBFE', fontSize: 9, display: 'block', margin: '0 0 4px 8px' }}>Subcategory</label>
              <select value={productSubcategoryFilter} onChange={(e) => setProductSubcategoryFilter(e.target.value)} style={{ ...inputStyle, borderRadius: 22, padding: '9px 12px', background: isDark ? '#062C57' : '#FFF', borderColor: isDark ? '#1D5A97' : '#BFDBFE' }}>
                <option value="">{productCategoryFilter ? 'All Subcategories' : 'Select Category First'}</option>
                {getAvailableSubcategories(productCategoryFilter).map((sub) => (
                  <option key={sub.id} value={sub.name}>{sub.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ color: '#BFDBFE', fontSize: 9, display: 'block', margin: '0 0 4px 8px' }}>Stock</label>
              <select value={productStockFilter} onChange={(e) => setProductStockFilter(e.target.value)} style={{ ...inputStyle, borderRadius: 22, padding: '9px 12px', background: isDark ? '#062C57' : '#FFF', borderColor: isDark ? '#1D5A97' : '#BFDBFE' }}>
                <option value="ALL">All stock</option>
                <option value="IN_STOCK">In stock</option>
                <option value="OUT_OF_STOCK">Out of stock</option>
              </select>
            </div>
          </div>

          <div className="product-table-card" style={{ background: isDark ? 'rgba(15,23,42,.82)' : '#FFFFFF', border: `1px solid ${isDark ? 'rgba(148,163,184,.22)' : '#E2E8F0'}`, borderRadius: 16, overflowX: 'auto', boxShadow: isDark ? '0 12px 30px rgba(2,6,23,.18)' : '0 8px 24px rgba(15,23,42,.06)' }}>
            <table style={{ width: '100%', minWidth: 1040, borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: isDark ? 'rgba(30, 41, 59, 0.82)' : '#F8FAFC' }}>
                  {['Listing Product', 'Category / Subcategory', 'Brand', 'Price', 'MRP', 'Stock', 'Status', 'Action'].map((h) => (
                    <th key={h} style={{ textAlign: 'left', padding: '12px 14px', fontSize: 11, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ padding: '36px 14px', textAlign: 'center', color: '#94A3B8', fontSize: 13 }}>
                      No products found. Click &quot;Add Product&quot; to create a new product in the database.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((p) => (
                    <tr key={p.id} className="catalog-data-row" style={{ borderBottom: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'}` }}>
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <img
                            src={p.images?.[0] || p.image || PRODUCT_IMAGE_FALLBACK}
                            alt={p.title}
                            onError={(event) => { event.currentTarget.src = PRODUCT_IMAGE_FALLBACK; }}
                            style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover', background: '#E2E8F0', flexShrink: 0 }}
                          />
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 700, color: isDark ? '#FFF' : '#111827' }}>{p.title}</div>
                            <div style={{ fontSize: 11, color: '#9CA3AF' }}>
                              SKU: {p.specifications?.SKU && p.specifications.SKU !== '-' ? p.specifications.SKU : p.id.toUpperCase()}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: isDark ? '#E5E7EB' : '#374151' }}>{p.category}</div>
                        <div style={{ fontSize: 11, color: '#9CA3AF' }}>{p.subcategory || '—'}</div>
                      </td>
                      <td style={{ padding: '12px 14px', fontSize: 12, color: isDark ? '#E2E8F0' : '#334155' }}>
                        <span style={{ background: isDark ? 'rgba(30, 41, 59, 0.8)' : '#F1F5F9', padding: '3px 8px', borderRadius: 6, fontSize: 11, fontWeight: 700 }}>
                          {p.brand || 'KFPCL'}
                        </span>
                      </td>
                      <td style={{ padding: '12px 14px', fontSize: 13, color: '#10B981', fontWeight: 800 }}>
                        ₹{Number(p.price ?? p.tierPricing?.[0]?.pricePerUnit ?? 0).toLocaleString('en-IN')}
                        <span style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 500, marginLeft: 4 }}>/ {p.unit || 'kg'}</span>
                      </td>
                      <td style={{ padding: '12px 14px', fontSize: 12, color: '#9CA3AF', textDecoration: p.specifications?.MRP && p.specifications.MRP !== '-' ? 'line-through' : 'none' }}>
                        {p.specifications?.MRP && p.specifications.MRP !== '-' ? `₹${Number(p.specifications.MRP).toLocaleString('en-IN')}` : '—'}
                      </td>
                      <td style={{ padding: '12px 14px', fontSize: 12, color: isDark ? '#FFF' : '#111827', fontWeight: 600 }}>
                        {p.stock} {p.unit || 'units'}
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '5px 8px', borderRadius: 999, fontSize: 10, fontWeight: 800, color: p.status === 'PUBLISHED' ? '#059669' : p.status === 'REJECTED' ? '#DC2626' : '#B45309', background: p.status === 'PUBLISHED' ? '#D1FAE5' : p.status === 'REJECTED' ? '#FEE2E2' : '#FEF3C7' }}>
                          {p.status === 'PUBLISHED' ? <CheckCircle2 size={12} /> : p.status === 'REJECTED' ? <XCircle size={12} /> : <ShieldCheck size={12} />}{formatProductStatus(p.status)}
                        </span>
                      </td>
                      <td style={{ padding: '12px 14px', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 10 }}>
                          <button type="button" title="View product details" aria-label={`View ${p.title}`} onClick={() => setSelectedProduct(p)} style={{ display: 'inline-grid', placeItems: 'center', width: 30, height: 30, padding: 0, background: 'transparent', border: 'none', borderRadius: 7, color: '#2563EB', cursor: 'pointer' }}><Eye size={17} /></button>
                          <button
                            type="button"
                            title="Delete product"
                            disabled={deletingProductId === p.id}
                            aria-label={`Delete ${p.title}`}
                            onClick={() => handleDeleteProduct(p.id, p.title)}
                            style={{ display: 'inline-grid', placeItems: 'center', width: 30, height: 30, padding: 0, background: 'transparent', border: 'none', color: '#EF4444', cursor: deletingProductId === p.id ? 'wait' : 'pointer', opacity: deletingProductId === p.id ? 0.5 : 1 }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── TAB: PRODUCT APPROVALS ──────────────────────────────────────── */}
      {currentTab === 'CATALOG_APPROVAL' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 14 }}>
          {productApprovals.map((item) => (
            <div
              key={item.id}
              style={{
                background: isDark ? 'rgba(17, 24, 39, 0.75)' : '#FFFFFF',
                border: item.status === 'PENDING'
                  ? '1px solid rgba(245, 158, 11, 0.4)'
                  : `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}`,
                borderRadius: 14,
                padding: 16,
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                boxShadow: isDark ? 'none' : '0 4px 12px rgba(0,0,0,0.03)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 6, background: item.status === 'PENDING' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(16, 185, 129, 0.2)', color: item.status === 'PENDING' ? '#FBBF24' : '#34D399' }}>
                  {item.status}
                </span>
                <span style={{ fontSize: 11, color: '#9CA3AF' }}>By {item.supplierName}</span>
              </div>

              <div>
                <h4 style={{ fontSize: 14, fontWeight: 800, color: isDark ? '#FFF' : '#111827' }}>{item.title}</h4>
                <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>Category: {item.category} · Specified Brand: {item.brand}</div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: isDark ? 'rgba(31, 41, 55, 0.5)' : '#F3F4F6', padding: 8, borderRadius: 8, fontSize: 11 }}>
                <span style={{ color: '#9CA3AF' }}>Pricing Quote:</span>
                <strong style={{ color: '#10B981' }}>₹{Number(item.basePrice).toLocaleString('en-IN')}</strong>
              </div>

              {item.status === 'PENDING' && (
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => approveProduct(item.id)}
                    style={{ flex: 1, background: '#2563EB', color: '#FFF', border: 'none', borderRadius: 8, padding: '8px 0', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                  >
                    Approve Listing
                  </button>
                  <button
                    onClick={() => rejectProduct(item.id)}
                    style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '8px 12px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ─── TAB: BRANDS & ATTRIBUTES ────────────────────────────────────── */}
      {currentTab === 'CATALOG_BRANDS' && (
        <div style={{ background: isDark ? 'rgba(17, 24, 39, 0.75)' : '#FFFFFF', border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}`, borderRadius: 14, padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <ShieldCheck size={20} color="#10B981" />
            <h3 style={{ fontSize: 16, fontWeight: 800, color: isDark ? '#FFF' : '#111827' }}>Wholesale Brand Registry</h3>
          </div>
          <p style={{ fontSize: 13, color: '#9CA3AF' }}>
            Manage authorized global and domestic manufacturing brands allowed to display wholesale products on KFPL B2B platform.
          </p>
          <div style={{ marginTop: 16, color: '#64748B', fontSize: 12 }}>
            {brands.length ? brands.map((brand: any) => brand.name || brand.title || brand.id).join(' · ') : 'No brand data available.'}
          </div>
        </div>
      )}

      {selectedProduct && (
        <div onClick={() => setSelectedProduct(null)} style={{ position: 'fixed', inset: 0, zIndex: 1100, display: 'grid', placeItems: 'center', padding: 20, background: 'rgba(2,6,23,.72)', backdropFilter: 'blur(8px)' }}>
          <div onClick={(event) => event.stopPropagation()} style={{ width: 'min(100%, 720px)', maxHeight: 'calc(100vh - 40px)', overflowY: 'auto', background: isDark ? '#0F172A' : '#FFFFFF', border: `1px solid ${isDark ? 'rgba(96,165,250,.28)' : '#DBEAFE'}`, borderRadius: 18, padding: 24, color: isDark ? '#F8FAFC' : '#0F172A', boxShadow: '0 28px 90px rgba(2,6,23,.45)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'flex-start' }}>
              <div><div style={{ color: '#60A5FA', fontSize: 10, fontWeight: 850, letterSpacing: '.12em', textTransform: 'uppercase' }}>Product governance</div><h2 style={{ margin: '6px 0 4px', fontSize: 23 }}>{selectedProduct.title}</h2><p style={{ margin: 0, color: '#94A3B8', fontSize: 12 }}>SKU: {selectedProduct.specifications?.SKU && selectedProduct.specifications.SKU !== '-' ? selectedProduct.specifications.SKU : selectedProduct.id.toUpperCase()} · {selectedProduct.category}</p></div>
              <button type="button" aria-label="Close product details" onClick={() => setSelectedProduct(null)} style={{ border: 0, borderRadius: 9, width: 34, height: 34, display: 'grid', placeItems: 'center', background: isDark ? 'rgba(255,255,255,.08)' : '#F1F5F9', color: '#94A3B8', cursor: 'pointer' }}><X size={17} /></button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '160px minmax(0,1fr)', gap: 18, marginTop: 20 }}>
              <img src={selectedProduct.images?.[0] || selectedProduct.image || PRODUCT_IMAGE_FALLBACK} alt={selectedProduct.title} onError={(event) => { event.currentTarget.src = PRODUCT_IMAGE_FALLBACK; }} style={{ width: 160, height: 160, borderRadius: 12, objectFit: 'cover', background: '#E2E8F0' }} />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: 10 }}>
                {[['Supplier', selectedProduct.supplierName], ['Brand', selectedProduct.brand || 'KFPCL'], ['Stock', `${selectedProduct.stock} ${selectedProduct.unit || 'units'}`], ['MOQ', `${selectedProduct.moq} ${selectedProduct.unit || 'units'}`], ['GST rate', `${selectedGstRate}% · ${selectedGstCompliant ? 'Verified' : 'Needs review'}`], ['Status', formatProductStatus(selectedProduct.status)]].map(([label, value]) => <div key={label} style={{ background: isDark ? 'rgba(30,41,59,.72)' : '#F8FAFC', borderRadius: 10, padding: 11 }}><small style={{ display: 'block', color: '#94A3B8', fontSize: 10 }}>{label}</small><strong style={{ display: 'block', marginTop: 5, fontSize: 13 }}>{value}</strong></div>)}
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: 10, marginTop: 18 }}>
              {[['Wholesale price', `₹${Number(selectedUnitPrice).toLocaleString('en-IN')}`], ['GST / tax per unit', `₹${Number(selectedTax).toLocaleString('en-IN')}`], ['Commission per unit', `₹${Number(selectedCommission).toLocaleString('en-IN')} (${selectedCommissionRate}%)`]].map(([label, value]) => <div key={label} style={{ border: `1px solid ${isDark ? 'rgba(148,163,184,.18)' : '#E2E8F0'}`, borderRadius: 10, padding: 12 }}><small style={{ display: 'block', color: '#94A3B8', fontSize: 10 }}>{label}</small><strong style={{ display: 'block', marginTop: 5, color: '#10B981', fontSize: 14 }}>{value}</strong></div>)}
            </div>
            <div style={{ marginTop: 18, color: isDark ? '#CBD5E1' : '#475569', fontSize: 13, lineHeight: 1.55 }}><strong style={{ color: isDark ? '#F8FAFC' : '#0F172A' }}>Product details</strong><p style={{ margin: '6px 0 0' }}>{selectedProduct.description || 'No product description provided.'}</p></div>
            <div style={{ marginTop: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap', paddingTop: 16, borderTop: `1px solid ${isDark ? 'rgba(148,163,184,.16)' : '#E2E8F0'}` }}>
              <span style={{ fontSize: 11, color: selectedGstCompliant ? '#059669' : '#DC2626', fontWeight: 750 }}>{selectedGstCompliant ? 'GST verified — eligible for approval' : 'GST verification required before approval'}</span>
              <div style={{ display: 'flex', gap: 8 }}><button type="button" onClick={() => handleProductDecision('REJECTED')} style={{ border: '1px solid #FCA5A5', borderRadius: 9, padding: '10px 14px', background: '#FEF2F2', color: '#DC2626', fontWeight: 800, cursor: 'pointer' }}>Reject</button><button type="button" disabled={!selectedGstCompliant} onClick={() => handleProductDecision('PUBLISHED')} style={{ border: 0, borderRadius: 9, padding: '10px 14px', background: selectedGstCompliant ? '#2563EB' : '#CBD5E1', color: '#FFF', fontWeight: 800, cursor: selectedGstCompliant ? 'pointer' : 'not-allowed' }}>Approve product</button></div>
            </div>
          </div>
        </div>
      )}

      {showCategoryModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(2,6,23,.72)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', overflowY: 'auto', padding: '28px 20px' }}>
          <form onSubmit={(e) => { e.preventDefault(); handleSaveCategoryOnly(); }} style={{ width: 'min(100%, 480px)', maxHeight: 'calc(100vh - 56px)', overflowY: 'auto', background: isDark ? '#0F172A' : '#FFFFFF', borderRadius: 18, padding: 24, border: `1px solid ${isDark ? 'rgba(96,165,250,.28)' : '#DBEAFE'}`, boxShadow: '0 28px 90px rgba(2,6,23,.45)', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}><div><div style={{ color: '#60A5FA', fontSize: 10, fontWeight: 850, letterSpacing: '.12em', textTransform: 'uppercase' }}>Catalog structure</div><h3 style={{ margin: '5px 0 4px', color: isDark ? '#FFF' : '#0F172A', fontSize: 21 }}>Add category</h3><p style={{ margin: 0, color: '#94A3B8', fontSize: 12 }}>Create a category card in the catalog.</p></div><button type="button" onClick={() => setShowCategoryModal(false)} style={{ background: isDark ? 'rgba(255,255,255,.08)' : '#F1F5F9', border: 0, borderRadius: 9, width: 34, height: 34, color: '#94A3B8', cursor: 'pointer', display: 'grid', placeItems: 'center' }}><X size={17} /></button></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
              <div><label style={fieldLabel}>Category name<span style={badge('required')}>Required</span></label><input autoFocus required value={(productForm as any).category || ''} onChange={(e) => setProductForm({ ...productForm, category: e.target.value } as any)} placeholder="e.g. Spices, Grains, Oils" style={inputStyle} /></div>
              <div><label style={fieldLabel}>Category image<span style={badge('optional')}>Optional</span></label><label style={{ height: 110, border: `1px dashed ${isDark ? '#475569' : '#CBD5E1'}`, background: isDark ? 'rgba(30,41,59,.6)' : '#F8FAFC', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9, cursor: 'pointer', overflow: 'hidden' }}>{categoryImage ? <img src={categoryImage} alt="Category preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <><ImageIcon size={19} color="#60A5FA" /><span style={{ color: '#94A3B8', fontSize: 12 }}>Upload category image</span></>}<input type="file" accept="image/*" onChange={(e) => { const file = e.target.files?.[0]; if (file) setCategoryImage(URL.createObjectURL(file)); }} style={{ display: 'none' }} /></label></div>
              <div><label style={fieldLabel}>Description<span style={badge('optional')}>Optional</span></label><textarea value={categoryDescription} onChange={(e) => setCategoryDescription(e.target.value)} placeholder="Describe this category" rows={3} style={{ ...inputStyle, resize: 'vertical' }} /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}><div><label style={fieldLabel}>Display order<span style={badge('optional')}>Optional</span></label><input type="number" min="0" value={categoryDisplayOrder} onChange={(e) => setCategoryDisplayOrder(e.target.value)} placeholder="0" style={inputStyle} /></div><div><label style={fieldLabel}>Discount (%)<span style={badge('optional')}>Optional</span></label><input type="number" min="0" max="100" value={categoryDiscount} onChange={(e) => setCategoryDiscount(e.target.value)} placeholder="0" style={inputStyle} /></div></div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, color: isDark ? '#E2E8F0' : '#334155', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}><input type="checkbox" checked={categoryIsActive} onChange={(e) => setCategoryIsActive(e.target.checked)} style={{ width: 17, height: 17, accentColor: '#2563EB' }} />Active category</label>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 24 }}><button type="button" onClick={() => setShowCategoryModal(false)} style={{ background: isDark ? 'rgba(255,255,255,.08)' : '#F1F5F9', color: isDark ? '#CBD5E1' : '#475569', border: 0, borderRadius: 10, padding: '11px 18px', fontWeight: 750, cursor: 'pointer' }}>Cancel</button><button type="submit" disabled={categorySubmitting} style={{ background: categorySubmitting ? '#93C5FD' : '#2563EB', color: '#FFF', border: 0, borderRadius: 10, padding: '11px 18px', fontWeight: 800, cursor: categorySubmitting ? 'wait' : 'pointer' }}><Plus size={15} style={{ verticalAlign: 'middle', marginRight: 6 }} />{categorySubmitting ? 'Creating…' : 'Save category'}</button></div>
          </form>
        </div>
      )}

      {/* Add Product Modal */}
      {showProductModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ width: '100%', maxWidth: 780, maxHeight: 'calc(100vh - 40px)', overflowY: 'auto', background: isDark ? '#0F172A' : '#FFFFFF', borderRadius: 20, border: `1px solid ${isDark ? 'rgba(96,165,250,.28)' : '#DBEAFE'}`, boxShadow: '0 28px 90px rgba(2,6,23,.45)' }}>
            <div style={{ padding: '22px 26px 18px', borderBottom: `1px solid ${isDark ? 'rgba(148,163,184,.16)' : '#E2E8F0'}`, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ color: '#60A5FA', fontSize: 10, fontWeight: 800, letterSpacing: '.12em', textTransform: 'uppercase' }}>Admin Catalog</div>
                <h3 style={{ fontSize: 22, fontWeight: 850, color: isDark ? '#FFF' : '#0F172A', margin: '5px 0 4px' }}>Add Product</h3>
                <p style={{ color: '#94A3B8', fontSize: 12, margin: 0 }}>Create a product stored directly in the database (POST /api/v1/admin/catalog/products).</p>
              </div>
              <button type="button" aria-label="Close" onClick={() => setShowProductModal(false)} style={{ background: isDark ? 'rgba(255,255,255,.08)' : '#F1F5F9', border: 0, borderRadius: 9, width: 34, height: 34, color: isDark ? '#CBD5E1' : '#64748B', cursor: 'pointer', display: 'grid', placeItems: 'center' }}><X size={17} /></button>
            </div>
            <form onSubmit={handleCreateProduct} style={{ padding: 26 }}>
              <style>{`.catalog-form-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}.catalog-field-wide{grid-column:1/-1}@media(max-width:640px){.catalog-form-grid{grid-template-columns:1fr}.catalog-field-wide{grid-column:auto}}`}</style>
              
              {/* Step 1: Product Identity */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 15 }}>
                <span style={{ width: 25, height: 25, borderRadius: 8, background: '#DBEAFE', color: '#2563EB', display: 'grid', placeItems: 'center', fontWeight: 900, fontSize: 12 }}>1</span>
                <strong style={{ color: isDark ? '#F8FAFC' : '#0F172A', fontSize: 14 }}>Product Identity</strong>
                <span style={{ color: '#94A3B8', fontSize: 11 }}>Basic details & category hierarchy</span>
              </div>
              <div className="catalog-form-grid">
                <div>
                  <label style={fieldLabel}>Category<span style={badge('required')}>Required</span></label>
                  <select
                    required
                    value={productForm.categoryId}
                    onChange={(e) => setProductForm({ ...productForm, categoryId: e.target.value, subcategoryId: '' })}
                    style={inputStyle}
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={fieldLabel}>Subcategory<span style={badge('optional')}>Optional</span></label>
                  <select
                    disabled={!productForm.categoryId}
                    value={productForm.subcategoryId}
                    onChange={(e) => setProductForm({ ...productForm, subcategoryId: e.target.value })}
                    style={{ ...inputStyle, cursor: productForm.categoryId ? 'pointer' : 'not-allowed', opacity: productForm.categoryId ? 1 : 0.65 }}
                  >
                    <option value="">{productForm.categoryId ? 'Select Subcategory' : 'Select Category First'}</option>
                    {getAvailableSubcategories(productForm.categoryId).map((sub) => (
                      <option key={sub.id} value={sub.id}>{sub.name}</option>
                    ))}
                  </select>
                </div>
                <div className="catalog-field-wide">
                  <label style={fieldLabel}>Product Name<span style={badge('required')}>Required</span></label>
                  <input
                    type="text"
                    required
                    value={productForm.productName}
                    onChange={(e) => setProductForm({ ...productForm, productName: e.target.value })}
                    placeholder="e.g. Organic Red Chili Powder"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={fieldLabel}>Brand<span style={badge('recommended')}>Recommended</span></label>
                  <input
                    type="text"
                    value={productForm.brand}
                    onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                    placeholder="e.g. KFPCL"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={fieldLabel}>SKU / Product Code<span style={badge('recommended')}>Recommended</span></label>
                  <input
                    type="text"
                    value={productForm.sku}
                    onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
                    placeholder="e.g. CHILI-KG-01"
                    style={inputStyle}
                  />
                </div>
                <div className="catalog-field-wide">
                  <label style={fieldLabel}>Description<span style={badge('recommended')}>Recommended</span></label>
                  <textarea
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    placeholder="e.g. Premium Guntur chili powder."
                    rows={3}
                    style={{ ...inputStyle, resize: 'vertical' }}
                  />
                </div>
              </div>

              <div style={{ height: 1, background: isDark ? 'rgba(148,163,184,.14)' : '#E2E8F0', margin: '24px 0' }} />

              {/* Step 2: Commercial & Inventory Details */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 15 }}>
                <span style={{ width: 25, height: 25, borderRadius: 8, background: '#DCFCE7', color: '#16A34A', display: 'grid', placeItems: 'center', fontWeight: 900, fontSize: 12 }}>2</span>
                <strong style={{ color: isDark ? '#F8FAFC' : '#0F172A', fontSize: 14 }}>Pricing & Stock</strong>
                <span style={{ color: '#94A3B8', fontSize: 11 }}>Unit price, MRP, quantity and inventory</span>
              </div>
              <div className="catalog-form-grid">
                <div>
                  <label style={fieldLabel}>Price (₹)<span style={badge('required')}>Required</span></label>
                  <input
                    required
                    type="number"
                    min="0"
                    step="0.01"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    placeholder="220.0"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={fieldLabel}>MRP (₹)<span style={badge('recommended')}>Recommended</span></label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={productForm.mrp}
                    onChange={(e) => setProductForm({ ...productForm, mrp: e.target.value })}
                    placeholder="250.0"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={fieldLabel}>Quantity<span style={badge('required')}>Required</span></label>
                  <input
                    required
                    type="number"
                    min="1"
                    value={productForm.quantity}
                    onChange={(e) => setProductForm({ ...productForm, quantity: e.target.value })}
                    placeholder="1"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={fieldLabel}>Unit<span style={badge('required')}>Required</span></label>
                  <select
                    required
                    value={productForm.unit}
                    onChange={(e) => setProductForm({ ...productForm, unit: e.target.value })}
                    style={inputStyle}
                  >
                    {['kg', 'g', 'l', 'ml', 'piece', 'box', 'pack', 'quintal', 'ton'].map((u) => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={fieldLabel}>Stock Quantity<span style={badge('required')}>Required</span></label>
                  <input
                    required
                    type="number"
                    min="0"
                    value={productForm.stockQuantity}
                    onChange={(e) => setProductForm({ ...productForm, stockQuantity: e.target.value })}
                    placeholder="100"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={fieldLabel}>Status<span style={badge('recommended')}>Recommended</span></label>
                  <select
                    value={productForm.status}
                    onChange={(e) => setProductForm({ ...productForm, status: e.target.value })}
                    style={inputStyle}
                  >
                    <option value="Active">Active</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>
              </div>

              <div style={{ height: 1, background: isDark ? 'rgba(148,163,184,.14)' : '#E2E8F0', margin: '24px 0' }} />

              {/* Step 3: Product Image */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 15 }}>
                <span style={{ width: 25, height: 25, borderRadius: 8, background: '#FEF3C7', color: '#D97706', display: 'grid', placeItems: 'center', fontWeight: 900, fontSize: 12 }}>3</span>
                <strong style={{ color: isDark ? '#F8FAFC' : '#0F172A', fontSize: 14 }}>Product Image</strong>
                <span style={{ color: '#94A3B8', fontSize: 11 }}>Provide URL or upload file</span>
              </div>
              <div className="catalog-form-grid">
                <div>
                  <label style={fieldLabel}>Image URL<span style={badge('optional')}>Optional</span></label>
                  <input
                    type="url"
                    value={productForm.imageUrl}
                    onChange={(e) => {
                      setProductForm({ ...productForm, imageUrl: e.target.value });
                      setImagePreview(e.target.value);
                    }}
                    placeholder="https://example.com/chili.jpg"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={fieldLabel}>Or Upload Image File<span style={badge('optional')}>Optional</span></label>
                  <label style={{ height: 44, border: `1px dashed ${isDark ? '#475569' : '#CBD5E1'}`, background: isDark ? 'rgba(30,41,59,.6)' : '#F8FAFC', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, cursor: 'pointer', overflow: 'hidden', padding: '0 12px' }}>
                    <ImageIcon size={18} color="#60A5FA" />
                    <span style={{ color: '#94A3B8', fontSize: 12 }}>Browse device image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (ev) => {
                            const dataUrl = ev.target?.result as string;
                            setImagePreview(dataUrl);
                            setProductForm((prev) => ({ ...prev, imageUrl: dataUrl }));
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>
                {imagePreview && (
                  <div className="catalog-field-wide" style={{ display: 'flex', alignItems: 'center', gap: 12, background: isDark ? 'rgba(30,41,59,.5)' : '#F1F5F9', padding: 10, borderRadius: 10 }}>
                    <img src={imagePreview} alt="Product preview" style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 8 }} />
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: isDark ? '#FFF' : '#0F172A' }}>Selected Image Preview</div>
                      <div style={{ fontSize: 10, color: '#94A3B8', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{productForm.imageUrl || 'Uploaded local image file'}</div>
                    </div>
                    <button type="button" onClick={() => { setImagePreview(''); setProductForm({ ...productForm, imageUrl: '' }); }} style={{ border: 0, background: 'transparent', color: '#EF4444', cursor: 'pointer' }}><X size={16} /></button>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 25, paddingTop: 18, borderTop: `1px solid ${isDark ? 'rgba(148,163,184,.14)' : '#E2E8F0'}`, flexWrap: 'wrap' }}>
                <button type="button" onClick={() => setShowProductModal(false)} style={{ background: isDark ? 'rgba(255,255,255,.08)' : '#F1F5F9', color: isDark ? '#CBD5E1' : '#475569', border: 0, borderRadius: 10, padding: '11px 18px', fontSize: 13, fontWeight: 750, cursor: 'pointer' }}>Cancel</button>
                <button
                  type="submit"
                  disabled={productSubmitting}
                  style={{
                    background: productSubmitting ? '#93C5FD' : 'linear-gradient(135deg,#2563EB,#1D4ED8)',
                    color: '#FFF',
                    border: 0,
                    borderRadius: 10,
                    padding: '11px 22px',
                    fontSize: 13,
                    fontWeight: 800,
                    cursor: productSubmitting ? 'wait' : 'pointer',
                    boxShadow: '0 8px 18px rgba(37,99,235,.24)',
                    display: 'flex',
                    gap: 7,
                    alignItems: 'center',
                  }}
                >
                  <Check size={16} />
                  <span>{productSubmitting ? 'Saving to Database…' : 'Create Product'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

