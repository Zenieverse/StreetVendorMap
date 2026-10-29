/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  MapPin, 
  ListFilter, 
  Search, 
  Sparkles, 
  Heart, 
  ExternalLink, 
  ArrowUpDown,
  CheckCircle,
  HelpCircle,
  SlidersHorizontal
} from 'lucide-react';
import { Vendor, Category, CityId, Language, VendorReview } from './types';
import { INITIAL_VENDORS, CITIES } from './data/vendors';
import { translations } from './i18n/translations';
import { isVendorOpenNow } from './utils/helpers';
import { toggleStreetAmbiance } from './utils/audio';

import { Navbar } from './components/Navbar';
import { MapView } from './components/MapView';
import { VendorCard } from './components/VendorCard';
import { VendorModal } from './components/VendorModal';
import { AddVendorModal } from './components/AddVendorModal';
import { StoriesView } from './components/StoriesView';
import { AboutView } from './components/AboutView';
import { SavedDrawer } from './components/SavedDrawer';

const LOCAL_STORAGE_KEY_VENDORS = 'ganhmuusinh_custom_vendors';
const LOCAL_STORAGE_KEY_SAVED = 'ganhmuusinh_saved_ids';
const LOCAL_STORAGE_KEY_LANG = 'ganhmuusinh_lang';
const LOCAL_STORAGE_KEY_OVERRIDES = 'ganhmuusinh_vendor_overrides';

export default function App() {
  const [lang, setLang] = useState<Language>(() => {
    const savedLang = localStorage.getItem(LOCAL_STORAGE_KEY_LANG);
    return (savedLang === 'en' || savedLang === 'vi') ? savedLang : 'vi';
  });

  const [currentTab, setCurrentTab] = useState<'map' | 'list' | 'stories' | 'about'>('map');
  const [selectedCity, setSelectedCity] = useState<CityId>('hcm');
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [openOnly, setOpenOnly] = useState(false);
  const [elderlyOnly, setElderlyOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'age'>('popular');
  const [searchQuery, setSearchQuery] = useState('');

  // Vendors state (Initial dataset merged with custom user-added vendors and review/check-in overrides)
  const [vendors, setVendors] = useState<Vendor[]>(() => {
    let combined = INITIAL_VENDORS;
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY_VENDORS);
      if (stored) {
        const customVendors: Vendor[] = JSON.parse(stored);
        combined = [...customVendors, ...INITIAL_VENDORS];
      }
      const overridesStr = localStorage.getItem(LOCAL_STORAGE_KEY_OVERRIDES);
      if (overridesStr) {
        const overrides: Record<string, { checkIns?: number; extraReviews?: VendorReview[] }> = JSON.parse(overridesStr);
        combined = combined.map((v) => {
          const override = overrides[v.id];
          if (!override) return v;
          return {
            ...v,
            checkIns: override.checkIns !== undefined ? override.checkIns : v.checkIns,
            reviews: override.extraReviews ? [...override.extraReviews, ...v.reviews] : v.reviews,
          };
        });
      }
    } catch {
      // Fallback
    }
    return combined;
  });

  // Saved bookmark IDs
  const [savedVendorIds, setSavedVendorIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY_SAVED);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Modals and Drawers
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState(false);
  const [isAudioActive, setIsAudioActive] = useState(false);

  // Sync lang change to localStorage and html tag
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_LANG, lang);
    document.documentElement.lang = lang;
  }, [lang]);

  // Sync saved IDs to localStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_SAVED, JSON.stringify(savedVendorIds));
  }, [savedVendorIds]);

  const t = translations[lang];

  // Toggle audio ambiance
  const handleToggleAudio = () => {
    toggleStreetAmbiance((active) => {
      setIsAudioActive(active);
    });
  };

  // Toggle Save / Bookmark
  const handleToggleSave = (vendorId: string) => {
    setSavedVendorIds((prev) =>
      prev.includes(vendorId) ? prev.filter((id) => id !== vendorId) : [...prev, vendorId]
    );
  };

  // Helper to persist overrides
  const persistOverride = (vendorId: string, updater: (prev: { checkIns?: number; extraReviews?: VendorReview[] }) => { checkIns?: number; extraReviews?: VendorReview[] }) => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY_OVERRIDES);
      const overrides: Record<string, { checkIns?: number; extraReviews?: VendorReview[] }> = stored ? JSON.parse(stored) : {};
      overrides[vendorId] = updater(overrides[vendorId] || {});
      localStorage.setItem(LOCAL_STORAGE_KEY_OVERRIDES, JSON.stringify(overrides));
    } catch {
      // Ignore localStorage errors
    }
  };

  // Check-in increment handler
  const handleCheckIn = (vendorId: string) => {
    setVendors((prev) =>
      prev.map((v) => {
        if (v.id === vendorId) {
          const newCount = v.checkIns + 1;
          persistOverride(vendorId, (ov) => ({ ...ov, checkIns: newCount }));
          return { ...v, checkIns: newCount };
        }
        return v;
      })
    );
    if (selectedVendor && selectedVendor.id === vendorId) {
      setSelectedVendor((prev) => (prev ? { ...prev, checkIns: prev.checkIns + 1 } : null));
    }
  };

  // Community review addition handler
  const handleAddReview = (
    vendorId: string,
    newReviewData: Omit<VendorReview, 'id' | 'date'>
  ) => {
    const newRev: VendorReview = {
      id: `rev-${Date.now()}`,
      author: newReviewData.author,
      comment: newReviewData.comment,
      rating: newReviewData.rating || 5,
      date: new Date().toLocaleDateString(lang === 'vi' ? 'vi-VN' : 'en-US'),
    };

    setVendors((prev) =>
      prev.map((v) => {
        if (v.id === vendorId) {
          persistOverride(vendorId, (ov) => ({
            ...ov,
            extraReviews: [newRev, ...(ov.extraReviews || [])],
          }));
          return { ...v, reviews: [newRev, ...v.reviews] };
        }
        return v;
      })
    );

    if (selectedVendor && selectedVendor.id === vendorId) {
      setSelectedVendor((prev) =>
        prev ? { ...prev, reviews: [newRev, ...prev.reviews] } : null
      );
    }
  };

  // Add new vendor from community submission modal
  const handleAddVendor = (newVendor: Vendor) => {
    setVendors((prev) => {
      const updated = [newVendor, ...prev];
      try {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY_VENDORS);
        const customVendors: Vendor[] = stored ? JSON.parse(stored) : [];
        localStorage.setItem(
          LOCAL_STORAGE_KEY_VENDORS,
          JSON.stringify([newVendor, ...customVendors])
        );
      } catch {
        // Fallback
      }
      return updated;
    });

    // Automatically select the newly created vendor
    setSelectedVendor(newVendor);
  };

  // Filtered & sorted vendor list
  const filteredVendors = useMemo(() => {
    return vendors
      .filter((vendor) => {
        // City filter
        if (selectedCity !== 'all' && vendor.city !== selectedCity) return false;

        // Category filter
        if (selectedCategory !== 'all' && vendor.category !== selectedCategory) return false;

        // Open now filter
        if (openOnly && !isVendorOpenNow(vendor)) return false;

        // Elderly filter (80+)
        if (elderlyOnly && vendor.vendorAge < 80) return false;

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchesName = vendor.name.toLowerCase().includes(q);
          const matchesVendor = vendor.vendorName.toLowerCase().includes(q);
          const matchesAddress = vendor.address.toLowerCase().includes(q);
          const matchesDistrict = vendor.district.toLowerCase().includes(q);
          const matchesSpecialties = [
            ...(vendor.specialties.vi || []),
            ...(vendor.specialties.en || []),
          ].some((item) => item.toLowerCase().includes(q));

          if (!matchesName && !matchesVendor && !matchesAddress && !matchesDistrict && !matchesSpecialties) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'popular') return (b.upvotes + b.checkIns) - (a.upvotes + a.checkIns);
        if (sortBy === 'age') return b.vendorAge - a.vendorAge;
        return 0; // Default order
      });
  }, [vendors, selectedCity, selectedCategory, openOnly, elderlyOnly, searchQuery, sortBy]);

  // Saved vendor objects
  const savedVendors = useMemo(() => {
    return vendors.filter((v) => savedVendorIds.includes(v.id));
  }, [vendors, savedVendorIds]);

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-[#2C241E] flex flex-col font-sans selection:bg-[#E07A5F] selection:text-white">
      
      {/* Top Header / Navigation Bar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        lang={lang}
        setLang={setLang}
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenSavedDrawer={() => setIsSavedDrawerOpen(true)}
        savedCount={savedVendorIds.length}
        isAudioActive={isAudioActive}
        onToggleAudio={handleToggleAudio}
      />

      {/* Main Content Areas */}
      <main className="flex-1 flex flex-col">
        {currentTab === 'map' && (
          <div className="flex-1 w-full flex flex-col">
            <MapView
              vendors={filteredVendors}
              selectedCity={selectedCity}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              openOnly={openOnly}
              setOpenOnly={setOpenOnly}
              elderlyOnly={elderlyOnly}
              setElderlyOnly={setElderlyOnly}
              onSelectVendor={(v) => setSelectedVendor(v)}
              lang={lang}
            />
          </div>
        )}

        {currentTab === 'list' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6">
            
            {/* Header & Filter Controls Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#FAF5EE] p-4 rounded-3xl border border-[#EBDCCB]">
              <div>
                <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#2C241E]">
                  {t.nav.list} ({filteredVendors.length})
                </h1>
                <p className="text-xs text-[#8A7968]">
                  {lang === 'vi'
                    ? 'Tìm và ghé mua trực tiếp ủng hộ các cụ mưu sinh trên đường phố'
                    : 'Find and support hardworking elderly street vendors directly'}
                </p>
              </div>

              {/* Filter Pills & Sorting */}
              <div className="flex flex-wrap items-center gap-2">
                
                {/* Open Now Chip */}
                <button
                  onClick={() => setOpenOnly(!openOnly)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    openOnly
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-white text-[#5C4D42] border border-[#EBDCCB] hover:bg-[#FAF5EE]'
                  }`}
                >
                  {t.filters.openNow}
                </button>

                {/* Elderly 80+ Chip */}
                <button
                  onClick={() => setElderlyOnly(!elderlyOnly)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    elderlyOnly
                      ? 'bg-amber-700 text-white shadow-xs'
                      : 'bg-white text-[#5C4D42] border border-[#EBDCCB] hover:bg-[#FAF5EE]'
                  }`}
                >
                  {t.filters.elderly}
                </button>

                {/* Sort Selector */}
                <div className="flex items-center gap-1.5 bg-white border border-[#EBDCCB] rounded-xl px-2.5 py-1.5 text-xs font-medium text-[#4A3B32]">
                  <ArrowUpDown className="w-3.5 h-3.5 text-[#E07A5F]" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'newest' | 'popular' | 'age')}
                    aria-label={t.filters.sortBy}
                    className="bg-transparent border-none focus:outline-none cursor-pointer pr-1 text-[#2C241E]"
                  >
                    <option value="popular">{t.filters.sortPopular}</option>
                    <option value="age">{t.filters.sortAge}</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {(['all', 'food', 'dessert', 'snack', 'drink', 'fruit', 'service'] as Category[]).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-[#E07A5F] text-white shadow-xs'
                      : 'bg-[#FAF5EE] text-[#5C4D42] border border-[#EBDCCB] hover:bg-[#F3E8DC]'
                  }`}
                >
                  {t.categories[cat]}
                </button>
              ))}
            </div>

            {/* Vendors Cards Grid */}
            {filteredVendors.length === 0 ? (
              <div className="text-center py-20 px-4 bg-[#FAF5EE] rounded-3xl border border-[#EBDCCB] space-y-3">
                <Search className="w-10 h-10 text-[#A89887] mx-auto" />
                <h3 className="font-display text-lg font-bold text-[#2C241E]">
                  {lang === 'vi' ? 'Không tìm thấy gánh hàng phù hợp' : 'No matching vendors found'}
                </h3>
                <p className="text-xs text-[#8A7968] max-w-sm mx-auto">
                  {lang === 'vi'
                    ? 'Hãy thử thay đổi tiêu chí lọc hoặc đóng góp thêm gánh hàng mới cho cộng đồng nhé!'
                    : 'Try clearing some filters or contribute a new street vendor to the community map!'}
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setOpenOnly(false);
                    setElderlyOnly(false);
                    setSearchQuery('');
                  }}
                  className="px-4 py-2 bg-[#E07A5F] text-white rounded-xl text-xs font-bold hover:bg-[#C85A32] transition-colors"
                >
                  {lang === 'vi' ? 'Đặt lại bộ lọc' : 'Reset Filters'}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVendors.map((vendor) => (
                  <VendorCard
                    key={vendor.id}
                    vendor={vendor}
                    lang={lang}
                    onSelect={(v) => setSelectedVendor(v)}
                    isSaved={savedVendorIds.includes(vendor.id)}
                    onToggleSave={handleToggleSave}
                  />
                ))}
              </div>
            )}

          </div>
        )}

        {currentTab === 'stories' && (
          <StoriesView
            vendors={vendors}
            lang={lang}
            onSelectVendor={(v) => setSelectedVendor(v)}
            onOpenMapToVendor={(v) => {
              setSelectedCity(v.city);
              setCurrentTab('map');
              setSelectedVendor(v);
            }}
          />
        )}

        {currentTab === 'about' && (
          <AboutView lang={lang} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#EBDCCB] bg-[#FAF5EE] text-[#6B5A4D] py-10 px-4 sm:px-6 lg:px-8 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          
          <div className="space-y-1.5 max-w-md">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="font-display font-bold text-lg text-[#2C241E]">
                {t.siteTitle}
              </span>
              <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded-md bg-[#F4E3D7] text-[#A64B2A]">
                .vn
              </span>
            </div>
            <p className="text-xs text-[#8A7968] leading-relaxed">
              {t.footer.communityNote}
            </p>
            <p className="text-[11px] text-[#A89887]">
              {t.footer.disclaimer}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 text-xs font-semibold text-[#5C4D42]">
            <button
              onClick={() => setCurrentTab('about')}
              className="hover:text-[#E07A5F] transition-colors"
            >
              {t.about.threeNoTitle}
            </button>
            <span className="hidden sm:inline text-stone-300">•</span>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="hover:text-[#E07A5F] transition-colors"
            >
              {t.nav.addVendor}
            </button>
            <span className="hidden sm:inline text-stone-300">•</span>
            <span className="text-[#A89887] font-normal">
              {t.footer.madeWithLove}
            </span>
          </div>

        </div>
      </footer>

      {/* Vendor Profile Modal */}
      <VendorModal
        vendor={selectedVendor}
        onClose={() => setSelectedVendor(null)}
        lang={lang}
        isSaved={selectedVendor ? savedVendorIds.includes(selectedVendor.id) : false}
        onToggleSave={handleToggleSave}
        onCheckIn={handleCheckIn}
        onAddReview={handleAddReview}
      />

      {/* Add New Vendor Modal */}
      <AddVendorModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddVendor={handleAddVendor}
        lang={lang}
      />

      {/* Saved Bookmarks Drawer */}
      <SavedDrawer
        isOpen={isSavedDrawerOpen}
        onClose={() => setIsSavedDrawerOpen(false)}
        savedVendors={savedVendors}
        onSelectVendor={(v) => setSelectedVendor(v)}
        onRemoveSaved={handleToggleSave}
        lang={lang}
      />

    </div>
  );
}
