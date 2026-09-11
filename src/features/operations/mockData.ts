export const mockSupportTickets = [
  { id: 101, ticketNumber: 'SUP-0101', subject: 'Payment captured but order is pending', description: 'The buyer was charged twice and the order still shows pending.', category: 'Payments', status: 'open', priority: 'high', customerName: 'Aarav Mehta', customerEmail: 'aarav@example.com', createdAt: '2026-08-30T10:15:00Z', updatedAt: '2026-09-01T08:20:00Z' },
  { id: 102, ticketNumber: 'SUP-0102', subject: 'Damaged product received', description: 'Customer shared images and is requesting a replacement.', category: 'Returns', status: 'in_progress', priority: 'medium', customerName: 'Priya Shah', customerEmail: 'priya@example.com', createdAt: '2026-08-29T12:00:00Z', updatedAt: '2026-09-01T11:10:00Z' },
  { id: 103, ticketNumber: 'SUP-0103', subject: 'Unable to update delivery address', description: 'The delivery address needs to be corrected before dispatch.', category: 'Orders', status: 'resolved', priority: 'low', customerName: 'Rohan Nair', customerEmail: 'rohan@example.com', createdAt: '2026-08-27T09:30:00Z', updatedAt: '2026-08-30T14:05:00Z' },
];

export const mockRatings = [
  { id: 501, customerName: 'Neha Kapoor', productName: 'Premium Basmati Rice', rating: 5, review: 'Excellent quality and fast delivery.', createdAt: '2026-09-01T10:00:00Z' },
  { id: 502, customerName: 'Vikram Singh', productName: 'Cold Pressed Groundnut Oil', rating: 4, review: 'Good product, packaging can be improved.', createdAt: '2026-08-30T08:20:00Z' },
  { id: 503, customerName: 'Ananya Rao', productName: 'Organic Toor Dal', rating: 2, review: 'The pack arrived damaged.', createdAt: '2026-08-28T16:40:00Z' },
];

export const mockInventory = [
  { id: 1, name: 'Premium Basmati Rice', sku: 'RICE-BAS-001', category: 'Grains', stock: 248, reorderAt: 80, value: 186000, status: 'Healthy' },
  { id: 2, name: 'Cold Pressed Groundnut Oil', sku: 'OIL-GRO-014', category: 'Oils', stock: 42, reorderAt: 60, value: 37800, status: 'Low stock' },
  { id: 3, name: 'Organic Toor Dal', sku: 'DAL-TOO-008', category: 'Pulses', stock: 0, reorderAt: 35, value: 0, status: 'Out of stock' },
  { id: 4, name: 'Whole Wheat Atta', sku: 'ATTA-WHE-021', category: 'Flours', stock: 126, reorderAt: 40, value: 50400, status: 'Healthy' },
];

export const mockRfqs = [
  { id: 201, rfqNumber: 'RFQ-0201', title: 'Monthly grocery supply', buyerName: 'Green Basket Stores', supplierName: 'Anusha Foods', status: 'open', quantity: 1200, createdAt: '2026-09-01T09:15:00Z' },
  { id: 202, rfqNumber: 'RFQ-0202', title: 'Restaurant oil requirement', buyerName: 'Urban Spoon Kitchens', supplierName: 'Awaiting response', status: 'pending', quantity: 480, createdAt: '2026-08-30T13:40:00Z' },
  { id: 203, rfqNumber: 'RFQ-0203', title: 'Pulses for retail chain', buyerName: 'Daily Needs Mart', supplierName: 'Harvest Co.', status: 'approved', quantity: 760, createdAt: '2026-08-28T07:10:00Z' },
];

export const mockReports = [
  { label: 'Gross revenue', value: '₹18.42L', change: '+12.8%', tone: 'success' },
  { label: 'Orders fulfilled', value: '2,846', change: '+8.4%', tone: 'success' },
  { label: 'Active buyers', value: '9,421', change: '+16.2%', tone: 'success' },
  { label: 'Support resolution', value: '94.6%', change: '+3.1%', tone: 'success' },
];
