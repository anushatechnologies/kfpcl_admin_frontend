import { useState } from 'react';
import { toast } from '../../../components/toast/ToastContainer';
import { StoreRequest, StoreType } from '../api/storeapi';

type Props = {
  initialData?: StoreType | null;
  onSave: (data: StoreRequest, imageFile?: File) => void;
  onClose: () => void;
};

export default function AddStoreType({ initialData, onSave, onClose }: Props) {
  const [name, setName] = useState(initialData?.name || '');
  const [active, setActive] = useState(initialData?.active ?? true);
  const [address, setAddress] = useState(initialData?.address || '');
  const [city, setCity] = useState(initialData?.city || '');
  const [pincode, setPincode] = useState(initialData?.pincode || '');
  const [phoneNumber, setPhoneNumber] = useState(initialData?.phoneNumber || '');
  const [imagePreview, setImagePreview] = useState<string | undefined>(initialData?.imageUrl);
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || '');
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleSubmit = () => {
    if (!name.trim()) {
      toast.error('Name is required');
      return;
    }
    if (!initialData && !imageUrl.trim() && !imageFile) {
      toast.error('Please upload a store image or provide an image URL');
      return;
    }

    onSave(
      {
        name: name.trim(),
        imageUrl: imageUrl.trim() || undefined,
        active,
        address: address.trim() || undefined,
        city: city.trim() || undefined,
        pincode: pincode.trim() || undefined,
        phoneNumber: phoneNumber.trim() || undefined,
      },
      imageFile || undefined,
    );
  };

  const inputStyle = {
    backgroundColor: 'var(--bg-color)',
    color: 'var(--text-color)',
    borderColor: 'var(--border-soft)',
  };
  const inputClass =
    'w-full rounded-xl border px-4 py-3 outline-none transition focus:ring-2 focus:ring-indigo-500';
  const sectionTitleClass = 'text-sm font-semibold uppercase tracking-[0.16em] opacity-65';
  const formTitle = initialData ? 'Edit Store' : 'Add Store';

  return (
    <div className="store-form-overlay">
      <div
        className="store-form-dialog"
        style={{
          backgroundColor: 'var(--card-bg)',
          color: 'var(--text-color)',
          borderColor: 'var(--border-soft)',
        }}
      >
        <div className="store-form-header" style={{ borderColor: 'var(--border-soft)' }}>
          <h2 className="text-2xl font-semibold">{formTitle}</h2>
          <p className="mt-1 text-sm opacity-70" style={{ color: 'var(--text-color)' }}>
            Fill in the store details below. The save button will create or update the store immediately.
          </p>
        </div>

        <div className="store-form-content">
          <div className="space-y-4">
            <p className={sectionTitleClass}>Store Details</p>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium opacity-75">Store Name *</label>
                <input
                  placeholder="e.g. KFPCL Mart.com"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputClass}
                  style={inputStyle}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium opacity-75">Phone Number</label>
                <input
                  placeholder="+91XXXXXXXXXX"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className={inputClass}
                  style={inputStyle}
                />
              </div>
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium opacity-75">Street Address</label>
                <input
                  placeholder="Street address or landmark"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className={inputClass}
                  style={inputStyle}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium opacity-75">City</label>
                <input
                  placeholder="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className={inputClass}
                  style={inputStyle}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium opacity-75">Pincode</label>
                <input
                  placeholder="Pincode / Postal code"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className={inputClass}
                  style={inputStyle}
                />
              </div>
              <div className="store-status-field md:col-span-2">
                <div>
                  <label htmlFor="store-status">Status</label>
                  <p>Inactive stores stay saved but won’t show as active in the list.</p>
                </div>
                <select
                  id="store-status"
                  value={active ? 'ACTIVE' : 'INACTIVE'}
                  onChange={(e) => setActive(e.target.value === 'ACTIVE')}
                  aria-label="Store status"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <p className={sectionTitleClass}>Store Image</p>
            <input
              value={imageUrl}
              onChange={(e) => {
                setImageUrl(e.target.value);
                if (e.target.value) setImagePreview(e.target.value);
              }}
              placeholder="Public store image URL (https://...)"
              className={inputClass}
              style={inputStyle}
            />
            <div className="space-y-3">
              <label
                className="flex min-h-[140px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-4 text-center transition hover:opacity-90"
                style={{ borderColor: '#2563eb' }}
              >
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setImageFile(file);
                      setImagePreview(URL.createObjectURL(file));
                    }
                  }}
                />
                <p className="text-sm font-semibold" style={{ color: '#2563eb' }}>
                  {imagePreview ? 'Change store image' : 'Upload store image *'}
                </p>
                <p className="mt-2 text-xs opacity-60" style={{ color: 'var(--text-color)' }}>
                  Recommended: square cover image with good contrast.
                </p>
              </label>

              {imagePreview && (
                <div
                  className="flex items-center justify-center rounded-2xl border p-3"
                  style={{ borderColor: 'var(--border-soft)' }}
                >
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-40 max-w-full rounded-xl object-contain"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div
          className="store-form-footer"
          style={{ borderColor: 'var(--border-soft)' }}
        >
          <button
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-xl border px-6 py-3 text-sm font-semibold transition hover:opacity-80"
            style={{ borderColor: 'var(--border-soft)' }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:opacity-95"
            style={{
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              boxShadow: '0 16px 30px rgba(37, 99, 235, 0.22)',
            }}
          >
            {initialData ? 'Update Store' : 'Create Store'}
          </button>
        </div>
      </div>
    </div>
  );
}
