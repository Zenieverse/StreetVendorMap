import React from 'react';
import { X, Heart, ExternalLink, Trash2, ArrowRight } from 'lucide-react';
import { Vendor, Language } from '../types';
import { translations } from '../i18n/translations';
import { getGoogleMapsUrl } from '../utils/helpers';

interface SavedDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedVendors: Vendor[];
  onSelectVendor: (vendor: Vendor) => void;
  onRemoveSaved: (vendorId: string) => void;
  lang: Language;
}

export const SavedDrawer: React.FC<SavedDrawerProps> = ({
  isOpen,
  onClose,
  savedVendors,
  onSelectVendor,
  onRemoveSaved,
  lang,
}) => {
  if (!isOpen) return null;

  const t = translations[lang];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end animate-fadeIn">
      <div 
        className="w-full max-w-md bg-[#FFFDF9] h-full shadow-2xl border-l border-[#EBDCCB] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-[#EBDCCB] flex items-center justify-between bg-[#FAF5EE]">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-[#E07A5F] fill-[#E07A5F]" />
            <h3 className="font-display font-bold text-lg text-[#2C241E]">
              {t.savedDrawer.title} ({savedVendors.length})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#EBDCCB] text-[#5C4D42] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="p-4 overflow-y-auto flex-1 space-y-3">
          {savedVendors.length === 0 ? (
            <div className="text-center py-12 px-4 space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#FAF5EE] text-[#A89887] flex items-center justify-center">
                <Heart className="w-6 h-6 stroke-[1.5]" />
              </div>
              <p className="text-xs sm:text-sm text-[#8A7968] leading-relaxed">
                {t.savedDrawer.empty}
              </p>
            </div>
          ) : (
            savedVendors.map((vendor) => (
              <div
                key={vendor.id}
                className="bg-white rounded-2xl border border-[#EBDCCB] p-3 flex gap-3 shadow-2xs hover:shadow-md transition-shadow"
              >
                <img
                  src={vendor.imageUrl}
                  alt={vendor.name}
                  className="w-20 h-20 rounded-xl object-cover shrink-0 bg-[#FAF5EE]"
                />

                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-[#2C241E] truncate">
                      {vendor.name}
                    </h4>
                    <p className="text-[11px] text-[#6B5A4D] truncate">
                      📍 {vendor.address}
                    </p>
                    <p className="text-[11px] text-[#E07A5F] font-semibold">
                      ⏰ {vendor.openHours.start} - {vendor.openHours.end}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={() => {
                        onSelectVendor(vendor);
                        onClose();
                      }}
                      className="text-xs font-bold text-[#2C241E] hover:text-[#E07A5F] flex items-center gap-1"
                    >
                      <span>{t.card.details}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>

                    <div className="flex items-center gap-2">
                      <a
                        href={getGoogleMapsUrl(vendor)}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#E07A5F] p-1 rounded-lg hover:bg-[#FAF5EE]"
                        title={t.card.directions}
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      <button
                        onClick={() => onRemoveSaved(vendor.id)}
                        className="text-stone-400 hover:text-rose-500 p-1 rounded-lg"
                        title="Xóa khỏi đã lưu"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-[#EBDCCB] bg-[#FAF5EE]">
          <button
            onClick={onClose}
            className="w-full bg-[#2C241E] text-white py-2.5 rounded-xl font-semibold text-xs sm:text-sm hover:bg-[#3D322A] transition-colors"
          >
            {t.savedDrawer.close}
          </button>
        </div>

      </div>
    </div>
  );
};
