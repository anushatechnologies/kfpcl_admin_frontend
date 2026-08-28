// Runtime API contract for administrator dashboard data.

export interface DashboardSale {
  id: string;
  name: string;
  status: 'Completed' | 'Pending' | 'Refunded';
  date: string;
  amount: number;
}

export interface DashboardRegion {
  region: string;
  flag: string;
  percentage: number;
  growth: number;
}

export interface DashboardOrderStatus {
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  count: number;
}

export const ADMIN_SALES_OVERVIEW: Array<{ label: string; revenue: number }> = [];

export const ADMIN_LATEST_SALES: Array<{ period: string; total: number; items: DashboardSale[] }> = [];

/* export const ADMIN_REGION_SALES = [{
  period: 'August 2026',
  items: [
    { region: 'North America', flag: '🇺🇸', percentage: 38, growth: 12.4 },
    { region: 'Western India', flag: '🇮🇳', percentage: 27, growth: 8.1 },
    { region: 'Europe', flag: '🇪🇺', percentage: 19, growth: 5.6 },
    { region: 'Southeast Asia', flag: '🌏', percentage: 16, growth: -2.3 },
  ] satisfies DashboardRegion[],
}]; */
export const ADMIN_REGION_SALES: Array<{ period: string; items: DashboardRegion[] }> = [];
