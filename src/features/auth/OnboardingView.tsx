import React, { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { useRoleStore } from '../../store/useRoleStore';
import { useAdminStore } from '../../store/useAdminStore';
import { UserRole, ActiveRole } from '../../types';
import { Globe, MapPin, Phone, ShieldCheck, ArrowRight, Building2, ShoppingBag, Store, CheckCircle2 } from 'lucide-react';

interface Props {
  onComplete: () => void;
}

export const OnboardingView: React.FC<Props> = ({ onComplete }) => {
  const { login, completeProfile, user, currentLanguage, setLanguage } = useAuthStore();
  const { submitSellerApplication } = useAdminStore();
  const { switchRole } = useRoleStore();

  const [step, setStep] = useState<'SLIDES' | 'LANG' | 'LOCATION' | 'OTP' | 'ROLE_SELECT' | 'PROFILE'>('SLIDES');
  const [phoneNumber, setPhoneNumber] = useState('+1 (555) 382-9900');
  const [otpCode, setOtpCode] = useState('8892');
  const [selectedType, setSelectedType] = useState<UserRole>('BUYER_SUPPLIER');
  const [companyName, setCompanyName] = useState('Apex Industrial Solutions');
  const [gstNumber, setGstNumber] = useState('27AAACA12341Z5');

  const handleNextStep = () => {
    if (step === 'SLIDES') setStep('LANG');
    else if (step === 'LANG') setStep('LOCATION');
    else if (step === 'LOCATION') setStep('OTP');
    else if (step === 'OTP') {
      login(phoneNumber, otpCode);
      setStep('ROLE_SELECT');
    } else if (step === 'ROLE_SELECT') {
      const active: ActiveRole = selectedType === 'SUPPLIER' ? 'SUPPLIER' : 'BUYER';
      switchRole(active);
      setStep('PROFILE');
    } else if (step === 'PROFILE') {
      completeProfile({
        companyName,
        businessType: selectedType,
        gstNumber,
        verifiedGst: true,
        approvalStatus: 'PENDING',
      });
      if (selectedType === 'SUPPLIER' || selectedType === 'BUYER_SUPPLIER') {
        submitSellerApplication({ applicantId: user?.id, companyName, contactPerson: user?.name || 'New seller', email: user?.email || '', phone: user?.phone || phoneNumber, gstNumber, category: 'General Catalog', yearsInBusiness: 0, expectedAnnualTurnover: 'Not provided', submittedAt: new Date().toISOString(), documents: [] });
      }
      onComplete();
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: '#090D16',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 24,
      }}
    >
      {/* Step 1: Onboarding Carousel Slide */}
      {step === 'SLIDES' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 20 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 20,
              background: 'linear-gradient(135deg, #2563EB 0%, #10B981 100%)',
              color: '#FFF',
              fontSize: 32,
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            K
          </div>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: '#FFF', lineHeight: '1.2' }}>
              World-Class Unified B2B Marketplace
            </h1>
            <p style={{ fontSize: 14, color: '#9CA3AF', marginTop: 8, lineHeight: '1.5' }}>
              One single mobile application for Buyers and Suppliers. Switch roles instantly, manage RFQs, and fulfill wholesale orders.
            </p>
          </div>
        </div>
      )}

      {/* Step 2: Language Selection */}
      {step === 'LANG' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#60A5FA' }}>
            <Globe size={24} />
            <h2 style={{ fontSize: 22, fontWeight: 800, color: '#FFF' }}>Select Prefered Language</h2>
          </div>
          {['English (US)', 'Spanish (Español)', 'German (Deutsch)', 'Hindi (हिंदी)', 'Mandarin (中文)'].map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              style={{
                background: currentLanguage === lang ? '#2563EB' : 'rgba(31, 41, 55, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#FFF',
                borderRadius: 14,
                padding: '14px',
                fontSize: 14,
                fontWeight: 700,
                textAlign: 'left',
                cursor: 'pointer',
              }}
            >
              {lang}
            </button>
          ))}
        </div>
      )}

      {/* Step 3: Location Permission */}
      {step === 'LOCATION' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 16, textAlign: 'center' }}>
          <div
            style={{
              width: 70,
              height: 70,
              borderRadius: 35,
              background: 'rgba(59, 130, 246, 0.15)',
              color: '#60A5FA',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
            }}
          >
            <MapPin size={32} />
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#FFF' }}>Enable Location Services</h2>
          <p style={{ fontSize: 13, color: '#9CA3AF', lineHeight: '1.5' }}>
            We use your location to calculate accurate freight shipping estimates and match you with nearby verified factories.
          </p>
        </div>
      )}

      {/* Step 4: OTP Verification */}
      {step === 'OTP' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#10B981' }}>
            <Phone size={24} />
            <h2 style={{ fontSize: 22, fontWeight: 800, color: '#FFF' }}>Mobile OTP Login</h2>
          </div>
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            style={{
              background: 'rgba(31, 41, 55, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: 12,
              padding: 14,
              color: '#FFF',
              fontSize: 16,
              fontWeight: 700,
            }}
          />
          <div style={{ display: 'flex', gap: 8 }}>
            {['8', '8', '9', '2'].map((digit, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: 50,
                  borderRadius: 12,
                  background: '#1F2937',
                  border: '1px solid #2563EB',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 20,
                  fontWeight: 800,
                  color: '#FFF',
                }}
              >
                {digit}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 5: Business Type Selection */}
      {step === 'ROLE_SELECT' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 16 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#FFF' }}>Select Your Business Account Type</h2>
          <p style={{ fontSize: 13, color: '#9CA3AF' }}>You can switch active roles anytime inside the app.</p>

          {[
            { id: 'BUYER' as UserRole, title: 'Buyer Account', sub: 'Procure materials, post RFQs, request quotations', icon: ShoppingBag },
            { id: 'SUPPLIER' as UserRole, title: 'Supplier Account', sub: 'List products, respond to RFQ leads, fulfill orders', icon: Store },
            { id: 'BUYER_SUPPLIER' as UserRole, title: 'Buyer + Supplier (Recommended)', sub: 'Full platform features, instant role switching', icon: Building2 },
          ].map((item) => {
            const Icon = item.icon;
            const isSel = selectedType === item.id;
            return (
              <div
                key={item.id}
                onClick={() => setSelectedType(item.id)}
                style={{
                  background: isSel ? 'rgba(37, 99, 235, 0.2)' : 'rgba(31, 41, 55, 0.7)',
                  border: isSel ? '2px solid #2563EB' : '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 16,
                  padding: 16,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  cursor: 'pointer',
                }}
              >
                <div style={{ color: isSel ? '#60A5FA' : '#9CA3AF' }}>
                  <Icon size={24} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 800, color: '#FFF' }}>{item.title}</div>
                  <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>{item.sub}</div>
                </div>
                {isSel && <CheckCircle2 size={20} color="#60A5FA" />}
              </div>
            );
          })}
        </div>
      )}

      {/* Step 6: Complete Profile */}
      {step === 'PROFILE' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 16 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#FFF' }}>Complete Business Profile</h2>

          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: '#9CA3AF', marginBottom: 4, display: 'block' }}>
              Company / Firm Name
            </label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              style={{
                width: '100%',
                background: 'rgba(31, 41, 55, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: 12,
                padding: 12,
                color: '#FFF',
                fontSize: 14,
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: '#9CA3AF', marginBottom: 4, display: 'block' }}>
              GST Registration Number
            </label>
            <input
              type="text"
              value={gstNumber}
              onChange={(e) => setGstNumber(e.target.value)}
              style={{
                width: '100%',
                background: 'rgba(31, 41, 55, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: 12,
                padding: 12,
                color: '#FFF',
                fontSize: 14,
              }}
            />
          </div>
        </div>
      )}

      {/* Bottom CTA Button */}
      <button
        onClick={handleNextStep}
        style={{
          width: '100%',
          background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
          color: '#FFF',
          border: 'none',
          borderRadius: 14,
          padding: 16,
          fontSize: 15,
          fontWeight: 800,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(37, 99, 235, 0.4)',
        }}
      >
        <span>{step === 'PROFILE' ? 'Enter B2B Marketplace App' : 'Continue'}</span>
        <ArrowRight size={18} />
      </button>
    </div>
  );
};
