import {
  Dashboard,
  Store,
  Category,
  Inventory2,
  Notifications,
  People,
  RequestQuote,
} from '@mui/icons-material';

import CampaignIcon from '@mui/icons-material/Campaign';

export interface RouteLinkItem {
  name: string;
  path: string;
  Icon: any;
  roles?: string[];
}

export interface RouteLinkGroup {
  section: string;
  links: RouteLinkItem[];
}

export const ADMIN_PANEL_ROLES = ['ADMIN', 'ROLE_ADMIN', 'ROLE_SUPER_ADMIN'];

export const RouteLinks: RouteLinkGroup[] = [
  // ---------------- DASHBOARD ----------------
  {
    section: 'Dashboard',
    links: [
      { name: 'Dashboard', path: '/', Icon: Dashboard, roles: ADMIN_PANEL_ROLES },
    ],
  },

  // ---------------- GOODS (Catalog) ----------------
  {
    section: 'Goods',
    links: [
      { name: 'Category', path: '/categories', Icon: Category, roles: ADMIN_PANEL_ROLES },
      { name: 'SubCategory', path: '/subcategories', Icon: Category, roles: ADMIN_PANEL_ROLES },
      { name: 'Product', path: '/products', Icon: Inventory2, roles: ADMIN_PANEL_ROLES },
    ],
  },

  // ---------------- STORE ----------------
  {
    section: 'Store',
    links: [
      { name: 'Store List', path: '/store-type', Icon: Store, roles: ADMIN_PANEL_ROLES },
    ],
  },

  // ---------------- MARKETING ----------------
  {
    section: 'Marketing',
    links: [
      { name: 'Banners', path: '/marketing/banners', Icon: CampaignIcon, roles: ADMIN_PANEL_ROLES },
    ],
  },

  // ---------------- APP ----------------
  {
    section: 'App',
    links: [
      { name: 'Buyer Management', path: '/buyer-management', Icon: People, roles: ADMIN_PANEL_ROLES },
      {
        name: 'Notification',
        path: 'notifications',
        Icon: Notifications,
        roles: ADMIN_PANEL_ROLES,
      },
    ],
  },

  // ---------------- OPERATIONS ----------------
  {
    section: 'Operations',
    links: [
      { name: 'RFQ Management', path: '/rfq-management', Icon: RequestQuote, roles: ADMIN_PANEL_ROLES },
    ],
  },

];
