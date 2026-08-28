import { create } from 'zustand';
import { ActiveRole, UserRole } from '../types';
import { useAuthStore } from './useAuthStore';

interface RoleState {
  activeRole: ActiveRole;
  userRoleType: UserRole;
  switchRole: (role: ActiveRole) => void;
  canAccessSupplierTools: () => boolean;
  canAccessBuyerTools: () => boolean;
}

export const useRoleStore = create<RoleState>((set, get) => ({
  activeRole: 'BUYER',
  userRoleType: 'BUYER_SUPPLIER',

  switchRole: (newRole: ActiveRole) => {
    set({ activeRole: newRole });
    useAuthStore.getState().updateRole(newRole);
  },

  canAccessSupplierTools: () => {
    const roleType = get().userRoleType;
    return roleType === 'SUPPLIER' || roleType === 'BUYER_SUPPLIER';
  },

  canAccessBuyerTools: () => {
    const roleType = get().userRoleType;
    return roleType === 'BUYER' || roleType === 'BUYER_SUPPLIER';
  },
}));
