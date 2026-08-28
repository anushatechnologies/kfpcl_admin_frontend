import React, { useMemo, useState } from 'react';
import { useAdminStore } from '../../../store/useAdminStore';
import { CheckCircle2, Edit3, Eye, MapPin, Package, Search, SlidersHorizontal, TriangleAlert, X, Save, Plus, Trash2 } from 'lucide-react';

type StockFilter = 'ALL' | 'IN_STOCK' | 'LOW_STOCK' | 'CRITICAL';

export const AdminInventoryView: React.FC = () => {
  const { inventory, addInventory, updateInventoryDetails, deleteInventory, theme = 'dark' } = useAdminStore();
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<typeof inventory[number] | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({ availableStock: '', reservedStock: '', reorderLevel: '', warehouseLocation: '' });
  const [showAddModal, setShowAddModal] = useState(false);
  const [newInventory, setNewInventory] = useState({ productTitle: '', sku: '', category: '', supplierName: '', warehouseLocation: '', availableStock: '', reservedStock: '0', reorderLevel: '', unit: 'Units' });
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<StockFilter>('ALL');

  const isDark = theme === 'dark';
  const colors = {
    text: isDark ? '#F8FAFC' : '#0F172A',
    muted: isDark ? '#94A3B8' : '#64748B',
    panel: isDark ? 'rgba(15, 23, 42, .72)' : '#FFFFFF',
    border: isDark ? 'rgba(148, 163, 184, .16)' : '#E2E8F0',
    soft: isDark ? 'rgba(30, 41, 59, .72)' : '#F8FAFC',
  };

  const filteredInventory = useMemo(() => inventory.filter((item) => {
    const matchesQuery = `${item.productTitle} ${item.sku} ${item.warehouseLocation}`.toLowerCase().includes(query.toLowerCase());
    return matchesQuery && (filter === 'ALL' || item.status === filter);
  }), [inventory, query, filter]);

  const counts = useMemo(() => ({
    all: inventory.length,
    healthy: inventory.filter((i) => i.status === 'IN_STOCK').length,
    attention: inventory.filter((i) => i.status === 'LOW_STOCK').length,
    critical: inventory.filter((i) => i.status === 'CRITICAL').length,
  }), [inventory]);

  const openDetails = (item: typeof inventory[number], editing = false) => {
    setSelectedItem(item);
    setEditMode(editing);
    setEditForm({ availableStock: String(item.availableStock), reservedStock: String(item.reservedStock), reorderLevel: String(item.reorderLevel), warehouseLocation: item.warehouseLocation });
  };

  const saveDetails = () => {
    if (!selectedItem || [editForm.availableStock, editForm.reservedStock, editForm.reorderLevel].some((value) => value === '' || Number(value) < 0)) return;
    updateInventoryDetails(selectedItem.id, { availableStock: Number(editForm.availableStock), reservedStock: Number(editForm.reservedStock), reorderLevel: Number(editForm.reorderLevel), warehouseLocation: editForm.warehouseLocation });
    setSelectedItem(null);
    setEditMode(false);
  };

  const handleAddInventory = (event: React.FormEvent) => {
    event.preventDefault();
    if (!newInventory.productTitle.trim() || !newInventory.sku.trim() || !newInventory.warehouseLocation.trim() || !newInventory.availableStock || !newInventory.reorderLevel) return;
    addInventory({ ...newInventory, productTitle: newInventory.productTitle.trim(), sku: newInventory.sku.trim(), category: newInventory.category.trim() || 'General', supplierName: newInventory.supplierName.trim() || 'Unassigned supplier', warehouseLocation: newInventory.warehouseLocation.trim(), availableStock: Number(newInventory.availableStock), reservedStock: Number(newInventory.reservedStock), reorderLevel: Number(newInventory.reorderLevel), unit: newInventory.unit.trim() || 'Units' });
    setNewInventory({ productTitle: '', sku: '', category: '', supplierName: '', warehouseLocation: '', availableStock: '', reservedStock: '0', reorderLevel: '', unit: 'Units' });
    setShowAddModal(false);
  };

  const handleDelete = (id: string) => { if (window.confirm('Delete this inventory record?')) deleteInventory(id); };

  const statusMeta = (status: string) => status === 'CRITICAL'
    ? { label: 'Critical', color: '#F87171', bg: 'rgba(239,68,68,.12)', icon: TriangleAlert }
    : status === 'LOW_STOCK'
      ? { label: 'Low stock', color: '#FBBF24', bg: 'rgba(245,158,11,.12)', icon: TriangleAlert }
      : { label: 'In stock', color: '#34D399', bg: 'rgba(16,185,129,.12)', icon: CheckCircle2 };

  return (
    <div style={{ maxWidth: 1480, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
      <section style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 20, flexWrap: 'wrap' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, display: 'grid', placeItems: 'center', background: 'rgba(59,130,246,.12)', color: '#60A5FA' }}><Package size={19} /></div>
            <span style={{ color: '#60A5FA', fontSize: 11, fontWeight: 800, letterSpacing: '.1em', textTransform: 'uppercase' }}>Operations / Inventory</span>
          </div>
          <h1 style={{ margin: 0, color: colors.text, fontSize: 'clamp(22px, 2.2vw, 30px)', lineHeight: 1.15, letterSpacing: '-.03em' }}>Inventory & warehouse stock</h1>
          <p style={{ margin: '8px 0 0', color: colors.muted, fontSize: 13 }}>Monitor availability, reorder thresholds, and warehouse allocation in real time.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingBottom: 4 }}><div style={{ color: colors.muted, fontSize: 12 }}>Last synced just now <span style={{ color: '#34D399', marginLeft: 5 }}>●</span></div></div>
      </section>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 12 }}>
        {[['Total SKUs', counts.all, '#60A5FA'], ['Healthy stock', counts.healthy, '#34D399'], ['Needs attention', counts.attention, '#FBBF24'], ['Critical stock', counts.critical, '#F87171']].map(([label, value, color]) => (
          <div key={String(label)} style={{ background: colors.panel, border: `1px solid ${colors.border}`, borderRadius: 14, padding: '16px 18px', boxShadow: '0 8px 24px rgba(2,6,23,.08)' }}>
            <div style={{ color: colors.muted, fontSize: 11, fontWeight: 700 }}>{label}</div>
            <div style={{ color: String(color), fontSize: 25, fontWeight: 800, marginTop: 7 }}>{value}</div>
          </div>
        ))}
      </section>

      <section style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 280px', minWidth: 220, display: 'flex', alignItems: 'center', gap: 9, background: colors.panel, border: `1px solid ${colors.border}`, borderRadius: 11, padding: '10px 13px' }}>
          <Search size={16} color={colors.muted} />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search products, SKU or warehouse..." style={{ width: '100%', border: 0, outline: 0, background: 'transparent', color: colors.text, fontSize: 13 }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: colors.muted, fontSize: 12 }}><SlidersHorizontal size={15} /> Status</div>
        {(['ALL', 'IN_STOCK', 'LOW_STOCK', 'CRITICAL'] as StockFilter[]).map((item) => (
          <button key={item} onClick={() => setFilter(item)} style={{ border: `1px solid ${filter === item ? '#3B82F6' : colors.border}`, background: filter === item ? 'rgba(59,130,246,.14)' : colors.panel, color: filter === item ? '#60A5FA' : colors.muted, borderRadius: 9, padding: '9px 12px', fontSize: 11, fontWeight: 800, cursor: 'pointer' }}>{item === 'ALL' ? 'All' : item.replace('_', ' ')}</button>
        ))}
      </section>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 330px), 1fr))', gap: 16 }}>
        {filteredInventory.map((item) => {
          const meta = statusMeta(item.status);
          const Icon = meta.icon;
          const isHovered = hoveredId === item.id;
          return <article key={item.id} onMouseEnter={() => setHoveredId(item.id)} onMouseLeave={() => setHoveredId(null)} style={{ position: 'relative', overflow: 'hidden', background: colors.panel, border: `1px solid ${isHovered ? '#60A5FA' : item.status === 'CRITICAL' ? 'rgba(248,113,113,.45)' : colors.border}`, borderRadius: 16, padding: 18, display: 'flex', flexDirection: 'column', minHeight: 248, boxShadow: isHovered ? '0 18px 38px rgba(37,99,235,.18)' : '0 10px 28px rgba(2,6,23,.08)', transform: isHovered ? 'translateY(-3px)' : 'translateY(0)', transition: 'transform .18s ease, box-shadow .18s ease, border-color .18s ease' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: meta.color, background: meta.bg, borderRadius: 999, padding: '5px 9px', fontSize: 10, fontWeight: 800 }}><Icon size={12} /> {meta.label}</span>
              <span style={{ color: colors.muted, fontSize: 10, fontWeight: 700 }}>{item.sku}</span>
            </div>
            <h2 style={{ color: colors.text, fontSize: 16, lineHeight: 1.35, margin: '17px 0 9px', letterSpacing: '-.015em' }}>{item.productTitle}</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#60A5FA', fontSize: 12, marginBottom: 16 }}><MapPin size={14} /> {item.warehouseLocation}</div>
            <div style={{ background: colors.soft, border: `1px solid ${colors.border}`, borderRadius: 11, padding: '12px 13px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 'auto' }}>
              <div><div style={{ color: colors.muted, fontSize: 10 }}>Available stock</div><strong style={{ display: 'block', color: item.status === 'CRITICAL' ? '#F87171' : colors.text, fontSize: 19, marginTop: 3 }}>{item.availableStock.toLocaleString()} <small style={{ fontSize: 11 }}>{item.unit}</small></strong></div>
              <div><div style={{ color: colors.muted, fontSize: 10 }}>Reorder threshold</div><strong style={{ display: 'block', color: '#FBBF24', fontSize: 16, marginTop: 5 }}>{item.reorderLevel.toLocaleString()} <small style={{ fontSize: 10 }}>{item.unit}</small></strong></div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12, opacity: isHovered ? 1 : .82, transition: 'opacity .18s ease' }}><button onClick={() => openDetails(item)} title="View inventory details" aria-label={`View ${item.productTitle}`} style={{ width: 38, height: 38, display: 'grid', placeItems: 'center', border: '1px solid rgba(96,165,250,.45)', borderRadius: 9, background: 'rgba(96,165,250,.12)', color: '#60A5FA', cursor: 'pointer' }}><Eye size={16} /></button><button onClick={() => openDetails(item, true)} title="Edit inventory" aria-label={`Edit ${item.productTitle}`} style={{ width: 38, height: 38, display: 'grid', placeItems: 'center', border: 0, borderRadius: 9, background: '#2563EB', color: '#FFF', cursor: 'pointer' }}><Edit3 size={16} /></button><button onClick={() => handleDelete(item.id)} title="Delete inventory" aria-label={`Delete ${item.productTitle}`} style={{ width: 38, height: 38, display: 'grid', placeItems: 'center', border: '1px solid rgba(248,113,113,.4)', borderRadius: 9, background: 'rgba(248,113,113,.1)', color: '#F87171', cursor: 'pointer' }}><Trash2 size={15} /></button></div>
          </article>;
        })}
      </section>
      {filteredInventory.length === 0 && <div style={{ textAlign: 'center', color: colors.muted, padding: 50, border: `1px dashed ${colors.border}`, borderRadius: 14 }}>No inventory matches your filters.</div>}

      {selectedItem && <div onClick={() => setSelectedItem(null)} style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'grid', placeItems: 'center', padding: 20, background: 'rgba(2,6,23,.72)', backdropFilter: 'blur(8px)' }}><div onClick={(event) => event.stopPropagation()} style={{ width: 'min(100%, 560px)', maxHeight: '90vh', overflowY: 'auto', background: isDark ? '#111827' : '#FFF', border: `1px solid ${colors.border}`, borderRadius: 18, padding: 24, color: colors.text, boxShadow: '0 24px 70px rgba(0,0,0,.35)' }}><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}><div><div style={{ color: '#60A5FA', fontSize: 10, fontWeight: 800, letterSpacing: '.08em' }}>{editMode ? 'EDIT INVENTORY RECORD' : 'INVENTORY DETAILS'}</div><h2 style={{ margin: '7px 0 4px', fontSize: 20 }}>{selectedItem.productTitle}</h2><div style={{ color: colors.muted, fontSize: 12 }}>{selectedItem.sku}</div></div><button onClick={() => setSelectedItem(null)} aria-label="Close inventory details" style={{ border: 0, borderRadius: 8, width: 32, height: 32, background: isDark ? 'rgba(255,255,255,.08)' : '#F1F5F9', color: colors.muted, cursor: 'pointer' }}><X size={15} /></button></div>{editMode ? <div style={{ display: 'grid', gap: 13, marginTop: 22 }}>{[['Available stock', 'availableStock'], ['Reserved stock', 'reservedStock'], ['Reorder threshold', 'reorderLevel']].map(([label, key]) => <label key={key} style={{ color: colors.muted, fontSize: 11, fontWeight: 800 }}>{label}<input type="number" min="0" value={editForm[key as keyof typeof editForm]} onChange={(event) => setEditForm({ ...editForm, [key]: event.target.value })} style={{ width: '100%', boxSizing: 'border-box', marginTop: 6, background: colors.soft, border: `1px solid ${colors.border}`, borderRadius: 9, padding: '10px 11px', color: colors.text }} /></label>)}<label style={{ color: colors.muted, fontSize: 11, fontWeight: 800 }}>Warehouse location<input value={editForm.warehouseLocation} onChange={(event) => setEditForm({ ...editForm, warehouseLocation: event.target.value })} style={{ width: '100%', boxSizing: 'border-box', marginTop: 6, background: colors.soft, border: `1px solid ${colors.border}`, borderRadius: 9, padding: '10px 11px', color: colors.text }} /></label><div style={{ display: 'flex', gap: 9, marginTop: 6 }}><button onClick={() => setSelectedItem(null)} style={{ flex: 1, border: `1px solid ${colors.border}`, borderRadius: 9, padding: 11, background: 'transparent', color: colors.muted, fontWeight: 800, cursor: 'pointer' }}>Cancel</button><button onClick={saveDetails} style={{ flex: 1, border: 0, borderRadius: 9, padding: 11, background: '#2563EB', color: '#FFF', fontWeight: 800, cursor: 'pointer' }}><Save size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} />Save changes</button></div></div> : <div style={{ marginTop: 22, display: 'grid', gap: 10 }}>{[['Status', statusMeta(selectedItem.status).label], ['Warehouse', selectedItem.warehouseLocation], ['Supplier', selectedItem.supplierName], ['Category', selectedItem.category], ['Available stock', `${selectedItem.availableStock.toLocaleString()} ${selectedItem.unit}`], ['Reserved stock', `${selectedItem.reservedStock.toLocaleString()} ${selectedItem.unit}`], ['Reorder threshold', `${selectedItem.reorderLevel.toLocaleString()} ${selectedItem.unit}`]].map(([label, value]) => <div key={label} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, padding: '11px 0', borderBottom: `1px solid ${colors.border}` }}><span style={{ color: colors.muted, fontSize: 12 }}>{label}</span><strong style={{ color: colors.text, fontSize: 12, textAlign: 'right' }}>{value}</strong></div>)}<button onClick={() => setEditMode(true)} style={{ marginTop: 10, border: 0, borderRadius: 9, padding: 11, background: '#2563EB', color: '#FFF', fontWeight: 800, cursor: 'pointer' }}><Edit3 size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} />Edit fields</button></div>}</div></div>}
      {showAddModal && <div onClick={() => setShowAddModal(false)} style={{ position: 'fixed', inset: 0, zIndex: 1100, display: 'grid', placeItems: 'center', padding: 20, background: 'rgba(2,6,23,.72)', backdropFilter: 'blur(8px)' }}><div onClick={(event) => event.stopPropagation()} style={{ width: 'min(100%, 620px)', maxHeight: '90vh', overflowY: 'auto', background: isDark ? '#111827' : '#FFF', border: `1px solid ${colors.border}`, borderRadius: 18, padding: 24, color: colors.text, boxShadow: '0 24px 70px rgba(0,0,0,.35)' }}><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}><div><div style={{ color: '#60A5FA', fontSize: 10, fontWeight: 800, letterSpacing: '.08em' }}>INVENTORY MANAGEMENT</div><h2 style={{ margin: '7px 0 4px', fontSize: 21 }}>Add inventory</h2><p style={{ margin: 0, color: colors.muted, fontSize: 12 }}>Create a new warehouse stock record.</p></div><button onClick={() => setShowAddModal(false)} aria-label="Close add inventory" style={{ border: 0, borderRadius: 8, width: 32, height: 32, background: isDark ? 'rgba(255,255,255,.08)' : '#F1F5F9', color: colors.muted, cursor: 'pointer' }}><X size={15} /></button></div><form onSubmit={handleAddInventory} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 22 }}>{[['Product name', 'productTitle'], ['SKU', 'sku'], ['Category', 'category'], ['Supplier', 'supplierName'], ['Warehouse location', 'warehouseLocation'], ['Unit', 'unit'], ['Available stock', 'availableStock'], ['Reserved stock', 'reservedStock'], ['Reorder threshold', 'reorderLevel']].map(([label, key]) => <label key={key} style={{ color: colors.muted, fontSize: 11, fontWeight: 800, gridColumn: key === 'productTitle' || key === 'warehouseLocation' ? '1 / -1' : 'auto' }}>{label}<input required={['productTitle', 'sku', 'warehouseLocation', 'availableStock', 'reorderLevel'].includes(key)} type={['availableStock', 'reservedStock', 'reorderLevel'].includes(key) ? 'number' : 'text'} min="0" value={newInventory[key as keyof typeof newInventory]} onChange={(event) => setNewInventory({ ...newInventory, [key]: event.target.value })} style={{ width: '100%', boxSizing: 'border-box', marginTop: 6, background: colors.soft, border: `1px solid ${colors.border}`, borderRadius: 9, padding: '10px 11px', color: colors.text }} /></label>)}<div style={{ gridColumn: '1 / -1', display: 'flex', gap: 9, marginTop: 6 }}><button type="button" onClick={() => setShowAddModal(false)} style={{ flex: 1, border: `1px solid ${colors.border}`, borderRadius: 9, padding: 11, background: 'transparent', color: colors.muted, fontWeight: 800, cursor: 'pointer' }}>Cancel</button><button type="submit" style={{ flex: 1, border: 0, borderRadius: 9, padding: 11, background: '#2563EB', color: '#FFF', fontWeight: 800, cursor: 'pointer' }}><Plus size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} />Add inventory</button></div></form></div></div>}
    </div>
  );
};
