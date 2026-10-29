import React, { useState } from 'react';
import { 
  X, 
  PlusCircle, 
  MapPin, 
  Clock, 
  Sparkles, 
  Image as ImageIcon,
  Check 
} from 'lucide-react';
import { Vendor, Category, CityId, Language } from '../types';
import { translations } from '../i18n/translations';
import { CITIES } from '../data/vendors';

interface AddVendorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddVendor: (vendor: Vendor) => void;
  lang: Language;
}

// Preset verified street vendor photos for easy quick selection
const PHOTO_PRESETS = [
  {
    name: 'Bánh nướng & Chè',
    url: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Bánh mì đường phố',
    url: 'https://images.unsplash.com/photo-1626804475297-41608ea09aeb?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Nước sâm thảo mộc',
    url: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Trái cây miệt vườn',
    url: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Món nước & Xôi nóng',
    url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80',
  },
];

export const AddVendorModal: React.FC<AddVendorModalProps> = ({
  isOpen,
  onClose,
  onAddVendor,
  lang,
}) => {
  const t = translations[lang];

  const [name, setName] = useState('');
  const [vendorName, setVendorName] = useState('');
  const [vendorAge, setVendorAge] = useState('78');
  const [category, setCategory] = useState<Category>('food');
  const [city, setCity] = useState<CityId>('hcm');
  const [district, setDistrict] = useState('Quận 1, TP.HCM');
  const [address, setAddress] = useState('');
  const [mobility, setMobility] = useState<'fixed' | 'moving'>('fixed');
  const [movingRoute, setMovingRoute] = useState('');
  const [startHour, setStartHour] = useState('07:00');
  const [endHour, setEndHour] = useState('17:00');
  const [priceRange, setPriceRange] = useState('15.000đ - 30.000đ');
  const [specialtiesStr, setSpecialtiesStr] = useState('');
  const [story, setStory] = useState('');
  const [imageUrl, setImageUrl] = useState(PHOTO_PRESETS[0].url);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !address.trim()) return;

    // Determine default city coordinates with a gentle jitter around center
    const cityConfig = CITIES.find((c) => c.id === city) || CITIES[1];
    const jitterLat = (Math.random() - 0.5) * 0.04;
    const jitterLng = (Math.random() - 0.5) * 0.04;
    const finalCoords: [number, number] = [
      cityConfig.center[0] + jitterLat,
      cityConfig.center[1] + jitterLng,
    ];

    const specialtiesList = specialtiesStr
      ? specialtiesStr.split(',').map((s) => s.trim()).filter(Boolean)
      : [lang === 'vi' ? 'Món ăn gia truyền thơm ngon' : 'Authentic traditional recipe'];

    const newVendor: Vendor = {
      id: `custom-vendor-${Date.now()}`,
      name: name.trim(),
      vendorName: vendorName.trim() || (lang === 'vi' ? 'Cụ già mưu sinh' : 'Elderly Vendor'),
      vendorAge: parseInt(vendorAge) || 75,
      category,
      city,
      district: district.trim() || address.trim(),
      address: address.trim(),
      coordinates: finalCoords,
      openHours: {
        start: startHour,
        end: endHour,
        days: lang === 'vi' ? 'Mỗi ngày' : 'Daily',
      },
      mobility,
      movingRoute: mobility === 'moving' && movingRoute ? { vi: movingRoute, en: movingRoute } : undefined,
      priceRange: priceRange.trim() || '15.000đ - 30.000đ',
      specialties: {
        vi: specialtiesList,
        en: specialtiesList,
      },
      story: {
        vi: story.trim() || 'Một phận đời mưu sinh chịu thương chịu khó trên hè phố, rất cần sự ghé mua ủng hộ từ bà con cô bác.',
        en: story.trim() || 'A dignified and hardworking elder on the sidewalk who truly appreciates every kind customer stopping by.',
      },
      quote: {
        vi: '"Cảm ơn bà con đã ghé mua ủng hộ gánh hàng rong này."',
        en: '"Thank you all for stopping by to support my humble cart."',
      },
      imageUrl: imageUrl.trim() || PHOTO_PRESETS[0].url,
      verified: true,
      upvotes: 12,
      checkIns: 3,
      lastReportedTime: lang === 'vi' ? 'Vừa mới thêm' : 'Just added',
      reviews: [],
    };

    onAddVendor(newVendor);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      
      <div 
        className="relative w-full max-w-2xl bg-[#FFFDF9] rounded-3xl shadow-2xl border border-[#EBDCCB] overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-[#EBDCCB] flex items-center justify-between bg-[#FAF5EE]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#E07A5F] flex items-center justify-center text-white shadow-md">
              <PlusCircle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-display text-lg sm:text-xl font-bold text-[#2C241E]">
                {t.addModal.title}
              </h2>
              <p className="text-xs text-[#8A7968]">
                {t.addModal.subtitle}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#EBDCCB] text-[#5C4D42] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1 text-xs sm:text-sm">
          
          {/* Cart Name & Vendor Name */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 space-y-1">
              <label className="font-bold text-[#2C241E]">
                {t.addModal.vendorNameLabel}
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t.addModal.vendorNamePlaceholder}
                className="w-full p-2.5 rounded-xl bg-white border border-[#E8DACB] focus:outline-none focus:border-[#E07A5F] text-[#2C241E]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[#2C241E]">
                {t.addModal.ageLabel}
              </label>
              <input
                type="number"
                value={vendorAge}
                onChange={(e) => setVendorAge(e.target.value)}
                placeholder={t.addModal.agePlaceholder}
                className="w-full p-2.5 rounded-xl bg-white border border-[#E8DACB] focus:outline-none focus:border-[#E07A5F] text-[#2C241E]"
              />
            </div>
          </div>

          {/* Category & City */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-[#2C241E]">
                {t.addModal.categoryLabel}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="w-full p-2.5 rounded-xl bg-white border border-[#E8DACB] focus:outline-none focus:border-[#E07A5F] text-[#2C241E]"
              >
                <option value="food">{t.categories.food}</option>
                <option value="dessert">{t.categories.dessert}</option>
                <option value="snack">{t.categories.snack}</option>
                <option value="drink">{t.categories.drink}</option>
                <option value="fruit">{t.categories.fruit}</option>
                <option value="service">{t.categories.service}</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[#2C241E]">
                {t.addModal.cityLabel}
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value as CityId)}
                className="w-full p-2.5 rounded-xl bg-white border border-[#E8DACB] focus:outline-none focus:border-[#E07A5F] text-[#2C241E]"
              >
                {CITIES.filter((c) => c.id !== 'all').map((c) => (
                  <option key={c.id} value={c.id}>
                    {lang === 'vi' ? c.nameVi : c.nameEn}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* District & Specific Address */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-[#2C241E]">
                {t.addModal.districtLabel}
              </label>
              <input
                type="text"
                required
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                placeholder={t.addModal.districtPlaceholder}
                className="w-full p-2.5 rounded-xl bg-white border border-[#E8DACB] focus:outline-none focus:border-[#E07A5F] text-[#2C241E]"
              />
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="font-bold text-[#2C241E]">
                {t.addModal.addressLabel}
              </label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder={t.addModal.addressPlaceholder}
                className="w-full p-2.5 rounded-xl bg-white border border-[#E8DACB] focus:outline-none focus:border-[#E07A5F] text-[#2C241E]"
              />
            </div>
          </div>

          {/* Mobility Type */}
          <div className="space-y-1.5">
            <label className="font-bold text-[#2C241E]">
              {t.addModal.mobilityLabel}
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer text-[#4A3B32]">
                <input
                  type="radio"
                  name="mobility"
                  checked={mobility === 'fixed'}
                  onChange={() => setMobility('fixed')}
                  className="accent-[#E07A5F]"
                />
                <span>{t.addModal.fixedOption}</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-[#4A3B32]">
                <input
                  type="radio"
                  name="mobility"
                  checked={mobility === 'moving'}
                  onChange={() => setMobility('moving')}
                  className="accent-[#E07A5F]"
                />
                <span>{t.addModal.movingOption}</span>
              </label>
            </div>

            {mobility === 'moving' && (
              <input
                type="text"
                value={movingRoute}
                onChange={(e) => setMovingRoute(e.target.value)}
                placeholder={t.addModal.routePlaceholder}
                className="w-full p-2.5 rounded-xl bg-white border border-[#E8DACB] focus:outline-none focus:border-[#E07A5F] text-[#2C241E] mt-2"
              />
            )}
          </div>

          {/* Selling Hours & Price */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-[#2C241E]">
                {t.addModal.hoursStart}
              </label>
              <input
                type="time"
                value={startHour}
                onChange={(e) => setStartHour(e.target.value)}
                className="w-full p-2 rounded-xl bg-white border border-[#E8DACB] text-[#2C241E]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[#2C241E]">
                {t.addModal.hoursEnd}
              </label>
              <input
                type="time"
                value={endHour}
                onChange={(e) => setEndHour(e.target.value)}
                className="w-full p-2 rounded-xl bg-white border border-[#E8DACB] text-[#2C241E]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[#2C241E]">
                {t.addModal.priceLabel}
              </label>
              <input
                type="text"
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                placeholder={t.addModal.pricePlaceholder}
                className="w-full p-2 rounded-xl bg-white border border-[#E8DACB] text-[#2C241E]"
              />
            </div>
          </div>

          {/* Specialties */}
          <div className="space-y-1">
            <label className="font-bold text-[#2C241E]">
              {t.addModal.specialtiesLabel}
            </label>
            <input
              type="text"
              value={specialtiesStr}
              onChange={(e) => setSpecialtiesStr(e.target.value)}
              placeholder={t.addModal.specialtiesPlaceholder}
              className="w-full p-2.5 rounded-xl bg-white border border-[#E8DACB] focus:outline-none focus:border-[#E07A5F] text-[#2C241E]"
            />
          </div>

          {/* Story & Background */}
          <div className="space-y-1">
            <label className="font-bold text-[#2C241E]">
              {t.addModal.storyLabel}
            </label>
            <textarea
              rows={3}
              value={story}
              onChange={(e) => setStory(e.target.value)}
              placeholder={t.addModal.storyPlaceholder}
              className="w-full p-2.5 rounded-xl bg-white border border-[#E8DACB] focus:outline-none focus:border-[#E07A5F] text-[#2C241E] resize-none"
            />
          </div>

          {/* Image Presets */}
          <div className="space-y-2">
            <label className="font-bold text-[#2C241E] flex items-center justify-between">
              <span>{t.addModal.imageLabel}</span>
              <span className="text-xs font-normal text-[#8A7968]">
                {lang === 'vi' ? 'Chọn ảnh mẫu nhanh bên dưới' : 'Quick select preset image'}
              </span>
            </label>

            <div className="grid grid-cols-5 gap-2">
              {PHOTO_PRESETS.map((preset, idx) => (
                <div
                  key={idx}
                  onClick={() => setImageUrl(preset.url)}
                  className={`relative cursor-pointer rounded-xl overflow-hidden aspect-video border-2 transition-all ${
                    imageUrl === preset.url
                      ? 'border-[#E07A5F] ring-2 ring-[#E07A5F]/30 scale-102'
                      : 'border-transparent opacity-75 hover:opacity-100'
                  }`}
                >
                  <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                  {imageUrl === preset.url && (
                    <div className="absolute inset-0 bg-[#E07A5F]/40 flex items-center justify-center text-white">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder={t.addModal.imagePlaceholder}
              className="w-full p-2 rounded-xl bg-white border border-[#E8DACB] text-xs text-[#2C241E]"
            />
          </div>

          {/* Action Footer */}
          <div className="pt-4 border-t border-[#EBDCCB] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-[#EBDCCB] text-[#5C4D42] hover:bg-[#FAF5EE] font-semibold text-xs sm:text-sm"
            >
              {t.addModal.cancelBtn}
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#E07A5F] hover:bg-[#C85A32] text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95"
            >
              {t.addModal.submitBtn}
            </button>
          </div>

        </form>

      </div>

    </div>
  );
};
