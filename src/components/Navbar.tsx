import React from 'react';
import { 
  MapPin, 
  ListFilter, 
  BookOpen, 
  Info, 
  PlusCircle, 
  Heart, 
  Volume2, 
  VolumeX, 
  Search,
  ChevronDown
} from 'lucide-react';
import { Language, CityId } from '../types';
import { translations } from '../i18n/translations';
import { CITIES } from '../data/vendors';

interface NavbarProps {
  currentTab: 'map' | 'list' | 'stories' | 'about';
  setCurrentTab: (tab: 'map' | 'list' | 'stories' | 'about') => void;
  lang: Language;
  setLang: (lang: Language) => void;
  selectedCity: CityId;
  setSelectedCity: (city: CityId) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenAddModal: () => void;
  onOpenSavedDrawer: () => void;
  savedCount: number;
  isAudioActive: boolean;
  onToggleAudio: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  lang,
  setLang,
  selectedCity,
  setSelectedCity,
  searchQuery,
  setSearchQuery,
  onOpenAddModal,
  onOpenSavedDrawer,
  savedCount,
  isAudioActive,
  onToggleAudio,
}) => {
  const t = translations[lang];

  return (
    <header className="sticky top-0 z-40 bg-[#FFFDF9]/95 backdrop-blur-md border-b border-[#EBDCCB]">
      {/* Top Banner / Kind Reminder */}
      <div className="bg-[#E07A5F] text-white text-xs py-1.5 px-4 text-center font-medium tracking-wide flex items-center justify-center gap-2 shadow-xs">
        <span className="inline-block w-2 h-2 rounded-full bg-amber-300 animate-ping"></span>
        <span>{t.tagline}</span>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
          
          {/* Logo & Brand Identity */}
          <div 
            onClick={() => setCurrentTab('map')}
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group shrink-0"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-[#E07A5F] to-[#C85A32] flex items-center justify-center text-white shadow-md shadow-[#E07A5F]/25 group-hover:scale-105 transition-transform duration-200">
              {/* Stylized Vietnamese Conical Hat & Carrying Pole Icon */}
              <svg viewBox="0 0 48 48" className="w-6 h-6 sm:w-7 sm:h-7 fill-none stroke-current stroke-[2.2] stroke-linecap-round stroke-linejoin-round">
                {/* Conical hat nón lá */}
                <path d="M24 10 L10 24 L38 24 Z" />
                <path d="M24 10 L24 24" />
                {/* Carrying pole đòn gánh */}
                <path d="M6 31 C 18 27, 30 27, 42 31" />
                {/* Left basket thúng */}
                <path d="M7 32 L8 40 C 8 41, 14 41, 14 40 L15 32 Z" />
                {/* Right basket thúng */}
                <path d="M33 32 L34 40 C 34 41, 40 41, 40 40 L41 32 Z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-bold text-xl sm:text-2xl text-[#2C241E] tracking-tight group-hover:text-[#E07A5F] transition-colors">
                  {t.siteTitle}
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-[#F4E3D7] text-[#A64B2A]">
                  .vn
                </span>
              </div>
              <p className="hidden md:block text-xs text-[#8A7968] font-normal leading-tight">
                {t.siteSubtitle}
              </p>
            </div>
          </div>

          {/* Quick Search bar (Tablet & Desktop) */}
          <div className="hidden lg:flex items-center flex-1 max-w-xs xl:max-w-sm mx-2">
            <div className="relative w-full">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#A89887]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.nav.searchPlaceholder}
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-[#FAF5EE] border border-[#E8DACB] rounded-full focus:outline-none focus:ring-2 focus:ring-[#E07A5F]/40 focus:border-[#E07A5F] transition-all text-[#2C241E] placeholder-[#9E8E7F]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#9E8E7F] hover:text-[#2C241E]"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* City Selector Dropdown */}
          <div className="relative shrink-0">
            <div className="flex items-center bg-[#FAF5EE] border border-[#E8DACB] rounded-xl px-2.5 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm font-medium text-[#4A3B32] hover:border-[#D1BAA3] transition-colors">
              <MapPin className="w-3.5 h-3.5 text-[#E07A5F] mr-1.5 shrink-0" />
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value as CityId)}
                aria-label={lang === 'vi' ? 'Chọn thành phố' : 'Select city'}
                className="bg-transparent border-none focus:outline-none cursor-pointer pr-4 appearance-none text-[#2C241E]"
              >
                {CITIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {lang === 'vi' ? c.nameVi : c.nameEn}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#8A7968] pointer-events-none -ml-3" />
            </div>
          </div>

          {/* Navigation Tabs (Desktop) */}
          <nav className="hidden md:flex items-center gap-1 bg-[#FAF5EE] p-1 rounded-2xl border border-[#E8DACB]">
            <button
              onClick={() => setCurrentTab('map')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                currentTab === 'map'
                  ? 'bg-white text-[#E07A5F] shadow-xs'
                  : 'text-[#6B5A4D] hover:text-[#2C241E]'
              }`}
            >
              <MapPin className="w-4 h-4" />
              {t.nav.map}
            </button>
            <button
              onClick={() => setCurrentTab('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                currentTab === 'list'
                  ? 'bg-white text-[#E07A5F] shadow-xs'
                  : 'text-[#6B5A4D] hover:text-[#2C241E]'
              }`}
            >
              <ListFilter className="w-4 h-4" />
              {t.nav.list}
            </button>
            <button
              onClick={() => setCurrentTab('stories')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                currentTab === 'stories'
                  ? 'bg-white text-[#E07A5F] shadow-xs'
                  : 'text-[#6B5A4D] hover:text-[#2C241E]'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              {t.nav.stories}
            </button>
            <button
              onClick={() => setCurrentTab('about')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                currentTab === 'about'
                  ? 'bg-white text-[#E07A5F] shadow-xs'
                  : 'text-[#6B5A4D] hover:text-[#2C241E]'
              }`}
            >
              <Info className="w-4 h-4" />
              {t.nav.about}
            </button>
          </nav>

          {/* Action buttons: Ambient Audio, Saved, Add Vendor, Language Toggle */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            
            {/* Ambient street audio chime toggle */}
            <button
              onClick={onToggleAudio}
              title={isAudioActive ? 'Tắt âm thanh hoài niệm' : 'Bật âm thanh đường phố hoài niệm'}
              className={`p-2 rounded-xl border transition-all ${
                isAudioActive
                  ? 'bg-[#E07A5F]/15 text-[#E07A5F] border-[#E07A5F]'
                  : 'bg-[#FAF5EE] text-[#7A695C] border-[#E8DACB] hover:text-[#2C241E]'
              }`}
            >
              {isAudioActive ? (
                <Volume2 className="w-4 h-4 text-[#E07A5F] animate-pulse" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
            </button>

            {/* Saved bookmarks button */}
            <button
              onClick={onOpenSavedDrawer}
              className="relative p-2 rounded-xl bg-[#FAF5EE] text-[#7A695C] border border-[#E8DACB] hover:text-[#E07A5F] hover:border-[#E07A5F]/40 transition-colors"
              title={t.nav.saved}
            >
              <Heart className={`w-4 h-4 ${savedCount > 0 ? 'text-[#E07A5F] fill-[#E07A5F]' : ''}`} />
              {savedCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#E07A5F] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {savedCount}
                </span>
              )}
            </button>

            {/* Add Vendor Button (Call to Action) */}
            <button
              onClick={onOpenAddModal}
              className="flex items-center gap-1.5 bg-[#2C241E] hover:bg-[#3D322A] text-[#FAF5EE] px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold shadow-sm hover:shadow transition-all active:scale-95 shrink-0"
            >
              <PlusCircle className="w-4 h-4 text-[#F2A383]" />
              <span className="hidden sm:inline">{t.nav.addVendor}</span>
              <span className="sm:hidden">{lang === 'vi' ? 'Thêm' : 'Add'}</span>
            </button>

            {/* Language Switcher */}
            <div className="flex items-center bg-[#FAF5EE] border border-[#E8DACB] rounded-xl p-0.5 text-xs font-semibold">
              <button
                onClick={() => setLang('vi')}
                className={`px-2 py-1 rounded-lg transition-all ${
                  lang === 'vi'
                    ? 'bg-[#E07A5F] text-white shadow-xs'
                    : 'text-[#7A695C] hover:text-[#2C241E]'
                }`}
                title="Tiếng Việt"
              >
                🇻🇳 VI
              </button>
              <button
                onClick={() => setLang('en')}
                className={`px-2 py-1 rounded-lg transition-all ${
                  lang === 'en'
                    ? 'bg-[#E07A5F] text-white shadow-xs'
                    : 'text-[#7A695C] hover:text-[#2C241E]'
                }`}
                title="English"
              >
                🇬🇧 EN
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Search input */}
        <div className="lg:hidden pb-2.5">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#A89887]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.nav.searchPlaceholder}
              className="w-full pl-9 pr-3 py-2 text-xs bg-[#FAF5EE] border border-[#E8DACB] rounded-full focus:outline-none focus:ring-2 focus:ring-[#E07A5F]/40 focus:border-[#E07A5F] transition-all text-[#2C241E] placeholder-[#9E8E7F]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#9E8E7F] hover:text-[#2C241E]"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Nav on Mobile screens */}
      <div className="md:hidden flex items-center justify-around border-t border-[#EBDCCB] bg-[#FAF5EE] py-1.5 px-2">
        <button
          onClick={() => setCurrentTab('map')}
          className={`flex flex-col items-center py-1 px-3 rounded-lg text-[11px] font-medium ${
            currentTab === 'map' ? 'text-[#E07A5F] font-bold' : 'text-[#7A695C]'
          }`}
        >
          <MapPin className="w-4 h-4 mb-0.5" />
          {t.nav.map}
        </button>
        <button
          onClick={() => setCurrentTab('list')}
          className={`flex flex-col items-center py-1 px-3 rounded-lg text-[11px] font-medium ${
            currentTab === 'list' ? 'text-[#E07A5F] font-bold' : 'text-[#7A695C]'
          }`}
        >
          <ListFilter className="w-4 h-4 mb-0.5" />
          {t.nav.list}
        </button>
        <button
          onClick={() => setCurrentTab('stories')}
          className={`flex flex-col items-center py-1 px-3 rounded-lg text-[11px] font-medium ${
            currentTab === 'stories' ? 'text-[#E07A5F] font-bold' : 'text-[#7A695C]'
          }`}
        >
          <BookOpen className="w-4 h-4 mb-0.5" />
          {t.nav.stories}
        </button>
        <button
          onClick={() => setCurrentTab('about')}
          className={`flex flex-col items-center py-1 px-3 rounded-lg text-[11px] font-medium ${
            currentTab === 'about' ? 'text-[#E07A5F] font-bold' : 'text-[#7A695C]'
          }`}
        >
          <Info className="w-4 h-4 mb-0.5" />
          {t.nav.about}
        </button>
      </div>
    </header>
  );
};
