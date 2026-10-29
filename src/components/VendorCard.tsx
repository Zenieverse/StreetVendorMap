import React from 'react';
import { 
  Clock, 
  MapPin, 
  Heart, 
  ExternalLink, 
  CheckCircle, 
  Bike, 
  Store,
  ChevronRight,
  MessageSquare
} from 'lucide-react';
import { Vendor, Language } from '../types';
import { translations } from '../i18n/translations';
import { isVendorOpenNow, getGoogleMapsUrl } from '../utils/helpers';

interface VendorCardProps {
  vendor: Vendor;
  lang: Language;
  onSelect: (vendor: Vendor) => void;
  isSaved: boolean;
  onToggleSave: (vendorId: string) => void;
}

export const VendorCard: React.FC<VendorCardProps> = ({
  vendor,
  lang,
  onSelect,
  isSaved,
  onToggleSave,
}) => {
  const t = translations[lang];
  const isOpen = isVendorOpenNow(vendor);

  return (
    <div className="group bg-[#FFFDF9] rounded-2xl border border-[#EBDCCB] hover:border-[#E07A5F]/50 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden">
      
      {/* Vendor Image & Overlays */}
      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-[#FAF5EE]">
        <img
          src={vendor.imageUrl}
          alt={vendor.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&w=800&q=80';
          }}
        />

        {/* Gradient backdrop for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {/* Status Badge */}
            <span
              className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full text-white shadow-md ${
                isOpen ? 'bg-emerald-600' : 'bg-[#6B5A4D]'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isOpen ? 'bg-white animate-pulse' : 'bg-stone-300'}`} />
              {isOpen ? t.status.open : t.status.closed}
            </span>

            {/* Mobility Badge */}
            {vendor.mobility === 'moving' && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-500 text-white shadow-md">
                <Bike className="w-3 h-3" />
                {t.status.moving}
              </span>
            )}
          </div>

          {/* Bookmark Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave(vendor.id);
            }}
            aria-label={isSaved ? t.card.saved : t.card.save}
            className="p-2 rounded-full bg-white/90 hover:bg-white text-[#5C4D42] hover:text-[#E07A5F] shadow-md transition-all active:scale-90"
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                isSaved ? 'text-[#E07A5F] fill-[#E07A5F]' : ''
              }`}
            />
          </button>
        </div>

        {/* Bottom Vendor Name & Age */}
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#FDEBD0] mb-0.5">
            <span>{vendor.vendorName}</span>
            <span>•</span>
            <span className="bg-white/20 backdrop-blur-xs px-2 py-0.5 rounded-md">
              {vendor.vendorAge} {t.card.age}
            </span>
          </div>
          <h3 className="font-display text-lg font-bold leading-snug line-clamp-1 drop-shadow-sm">
            {vendor.name}
          </h3>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div className="space-y-2.5">
          
          {/* Address */}
          <div className="flex items-start gap-2 text-xs text-[#5C4D42]">
            <MapPin className="w-3.5 h-3.5 text-[#E07A5F] shrink-0 mt-0.5" />
            <span className="line-clamp-2 leading-relaxed">{vendor.address}</span>
          </div>

          {/* Hours & Price */}
          <div className="flex items-center justify-between text-xs text-[#6B5A4D] bg-[#FAF5EE] p-2.5 rounded-xl border border-[#EBDCCB]/60">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#C85A32]" />
              <span className="font-semibold text-[#2C241E]">
                {vendor.openHours.start} - {vendor.openHours.end}
              </span>
            </div>
            <div className="font-bold text-[#E07A5F]">
              {vendor.priceRange}
            </div>
          </div>

          {/* Specialties Pills */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {vendor.specialties[lang].slice(0, 3).map((item, idx) => (
              <span
                key={idx}
                className="text-[11px] font-medium px-2 py-0.5 rounded-lg bg-[#FAF5EE] text-[#5C4D42] border border-[#EBDCCB]"
              >
                {item}
              </span>
            ))}
          </div>

          {/* Heartfelt Quote excerpt */}
          <p className="text-xs italic text-[#7A695C] line-clamp-2 border-l-2 border-[#E07A5F]/50 pl-2.5 my-2">
            {vendor.quote[lang]}
          </p>
        </div>

        {/* Card Footer: Action Buttons */}
        <div className="pt-4 border-t border-[#EBDCCB] mt-3 flex items-center gap-2">
          <button
            onClick={() => onSelect(vendor)}
            className="flex-1 bg-[#2C241E] hover:bg-[#3D322A] text-white py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 shadow-xs transition-colors"
          >
            <span>{t.card.details}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          <a
            href={getGoogleMapsUrl(vendor)}
            target="_blank"
            rel="noreferrer"
            className="bg-[#FAF5EE] hover:bg-[#F3E8DC] text-[#E07A5F] border border-[#EBDCCB] p-2 rounded-xl text-xs font-semibold flex items-center justify-center transition-colors"
            title={t.card.directions}
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};
