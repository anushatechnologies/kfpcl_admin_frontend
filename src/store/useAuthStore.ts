import { create } from 'zustand';
import { UserProfile, ActiveRole } from '../types';

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isOnboarded: boolean;
  currentLanguage: string;
  locationPermission: boolean;
  login: (phone: string, otp: string) => void;
  logout: () => void;
  updateRole: (role: ActiveRole) => void;
  completeProfile: (profile: Partial<UserProfile>) => void;
  toggleLocationPermission: () => void;
  setLanguage: (lang: string) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isOnboarded: false,
  currentLanguage: 'English (US)',
  locationPermission: false,

  login: (phone, otp) => {
    set({
      isAuthenticated: true,
      user: { id: `usr_${Date.now()}`, name: '', phone, email: '', companyName: '', businessType: 'BUYER', activeRole: 'BUYER', gstNumber: '', verifiedGst: false, avatar: '', location: { city: '', state: '', country: '', address: '' }, kycStatus: 'PENDING', approvalStatus: 'PENDING', walletBalance: 0, rating: 0, reviewCount: 0, totalOrders: 0, totalRevenue: 0 },
    });
  },

  logout: () => {
    set({ isAuthenticated: false });
  },

  updateRole: (role: ActiveRole) => {
    set((state) => ({
      user: state.user ? { ...state.user, activeRole: role } : null,
    }));
  },

  completeProfile: (updated) => {
    set((state) => ({
      user: state.user ? { ...state.user, ...updated } : null,
      isOnboarded: true,
    }));
  },

  toggleLocationPermission: () => {
    set((state) => ({ locationPermission: !state.locationPermission }));
  },

  setLanguage: (lang) => {
    set({ currentLanguage: lang });
  },
}));
