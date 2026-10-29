import React from 'react';
import { BookOpen, MapPin, Clock, Heart, ExternalLink, ArrowRight, Sparkles } from 'lucide-react';
import { Vendor, Language } from '../types';
import { translations } from '../i18n/translations';
import { getGoogleMapsUrl } from '../utils/helpers';

interface StoriesViewProps {
  vendors: Vendor[];
  lang: Language;
  onSelectVendor: (vendor: Vendor) => void;
  onOpenMapToVendor: (vendor: Vendor) => void;
}

export const StoriesView: React.FC<StoriesViewProps> = ({
  vendors,
  lang,
  onSelectVendor,
  onOpenMapToVendor,
}) => {
  const t = translations[lang];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF5EE] border border-[#EBDCCB] text-[#E07A5F] text-xs font-bold uppercase tracking-wider">
          <BookOpen className="w-3.5 h-3.5" />
          <span>{lang === 'vi' ? 'Tiếng Lòng Hè Phố' : 'Sidewalk Chronicles'}</span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2C241E] leading-tight">
          {lang === 'vi' ? 'Những Phận Đời Lặng Lẽ Giữa Dòng Đời Hối Hả' : 'Dignified Lives in the Hustle and Bustle'}
        </h1>
        <p className="text-sm sm:text-base text-[#6B5A4D] leading-relaxed">
          {lang === 'vi'
            ? 'Đằng sau mỗi gánh hàng rong, nồi chè khói tỏa, hay xe chuối nướng ven đường là hàng chục năm tảo tần nuôi sống gia đình bằng sức lao động chân chính.'
            : 'Behind every carrying pole, simmering soup pot, or roadside grill lies decades of honest labor and heartwarming resilience.'}
        </p>
      </div>

      {/* Featured Long-Form Story Grid */}
      <div className="space-y-12">
        {vendors.slice(0, 6).map((vendor, index) => {
          const isReversed = index % 2 === 1;

          return (
            <div
              key={vendor.id}
              className={`bg-[#FFFDF9] rounded-3xl border border-[#EBDCCB] p-6 sm:p-8 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col ${
                isReversed ? 'lg:flex-row-reverse' : 'lg:flex-row'
              } gap-6 sm:gap-8 items-center`}
            >
              {/* Photo & Quote Box */}
              <div className="w-full lg:w-1/2 relative group overflow-hidden rounded-2xl aspect-4/3 shadow-md bg-[#FAF5EE]">
                <img
                  src={vendor.imageUrl}
                  alt={vendor.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&w=800&q=80';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />

                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="flex items-center gap-2 text-xs font-semibold text-amber-200 mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{vendor.vendorName}</span>
                    <span>•</span>
                    <span>{vendor.vendorAge} {t.card.age}</span>
                  </div>
                  <p className="font-serif italic text-sm text-stone-100 line-clamp-3">
                    {vendor.quote[lang]}
                  </p>
                </div>
              </div>

              {/* Story Text & Action */}
              <div className="w-full lg:w-1/2 space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-[#E07A5F] uppercase tracking-wide">
                  <span>{t.cities[vendor.city]}</span>
                  <span>•</span>
                  <span>{vendor.district}</span>
                </div>

                <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#2C241E] leading-snug">
                  {vendor.name}
                </h2>

                <p className="text-sm sm:text-base text-[#5C4D42] leading-relaxed">
                  {vendor.story[lang]}
                </p>

                {/* Specialties preview */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {vendor.specialties[lang].map((sp, idx) => (
                    <span
                      key={idx}
                      className="text-xs font-semibold bg-[#FAF5EE] text-[#4A3B32] px-3 py-1 rounded-xl border border-[#EBDCCB]"
                    >
                      {sp}
                    </span>
                  ))}
                </div>

                <div className="pt-3 border-t border-[#EBDCCB] flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => onSelectVendor(vendor)}
                    className="bg-[#2C241E] hover:bg-[#3D322A] text-white px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-sm transition-all"
                  >
                    <span>{t.card.details}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onOpenMapToVendor(vendor)}
                    className="bg-[#FAF5EE] hover:bg-[#F3E8DC] text-[#E07A5F] border border-[#EBDCCB] px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <MapPin className="w-4 h-4" />
                    <span>{lang === 'vi' ? 'Xem trên bản đồ' : 'View on Map'}</span>
                  </button>

                  <a
                    href={getGoogleMapsUrl(vendor)}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-[#8A7968] hover:text-[#2C241E] flex items-center gap-1 ml-auto underline"
                  >
                    <span>{t.card.directions}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
