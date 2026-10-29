import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { 
  Navigation, 
  Clock, 
  MapPin, 
  ExternalLink, 
  Compass, 
  Layers, 
  CheckCircle2, 
  Sparkles 
} from 'lucide-react';
import { Vendor, Category, CityId, Language } from '../types';
import { translations } from '../i18n/translations';
import { isVendorOpenNow, getGoogleMapsUrl } from '../utils/helpers';
import { CITIES } from '../data/vendors';

interface MapViewProps {
  vendors: Vendor[];
  selectedCity: CityId;
  selectedCategory: Category;
  setSelectedCategory: (cat: Category) => void;
  openOnly: boolean;
  setOpenOnly: (open: boolean) => void;
  elderlyOnly: boolean;
  setElderlyOnly: (val: boolean) => void;
  onSelectVendor: (vendor: Vendor) => void;
  lang: Language;
}

// Category icons mapping for custom marker rendering
const CATEGORY_ICONS: Record<Category, string> = {
  all: '📍',
  food: '🍲',
  dessert: '🍮',
  snack: '🍢',
  drink: '🧋',
  fruit: '🥑',
  service: '🛠️',
};

export const MapView: React.FC<MapViewProps> = ({
  vendors,
  selectedCity,
  selectedCategory,
  setSelectedCategory,
  openOnly,
  setOpenOnly,
  elderlyOnly,
  setElderlyOnly,
  onSelectVendor,
  lang,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);

  const t = translations[lang];

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Find starting center
      const currentCityConfig = CITIES.find((c) => c.id === selectedCity) || CITIES[1];

      const map = L.map(mapContainerRef.current, {
        center: currentCityConfig.center,
        zoom: currentCityConfig.zoom,
        zoomControl: false,
      });

      // CartoDB Voyager tiles (warm, beautiful, readable street map)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://openstreetmap.org">OSM</a>',
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map);

      // Add Zoom control on bottom-right
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      const markersGroup = L.layerGroup().addTo(map);
      markersLayerRef.current = markersGroup;
      mapInstanceRef.current = map;

      // Invalidate size after layout completes to prevent gray tile gaps
      setTimeout(() => {
        map.invalidateSize();
      }, 150);

      const handleResize = () => {
        map.invalidateSize();
      };
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }
      };
    }
  }, []);

  // Handle City Change
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const cityConfig = CITIES.find((c) => c.id === selectedCity);
    if (cityConfig) {
      mapInstanceRef.current.flyTo(cityConfig.center, cityConfig.zoom, {
        duration: 1.2,
      });
    }
  }, [selectedCity]);

  // Update Markers when vendors or filters change
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    const layerGroup = markersLayerRef.current;
    layerGroup.clearLayers();

    vendors.forEach((vendor) => {
      const isOpen = isVendorOpenNow(vendor);
      const iconEmoji = CATEGORY_ICONS[vendor.category] || '📍';

      // Custom HTML Marker Pin
      const customIcon = L.divIcon({
        className: 'custom-vendor-pin',
        iconSize: [44, 44],
        iconAnchor: [22, 44],
        popupAnchor: [0, -44],
        html: `
          <div style="position: relative; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center;">
            ${
              isOpen
                ? `<div style="position: absolute; width: 40px; height: 40px; border-radius: 50%; background: rgba(224, 122, 95, 0.4); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>`
                : ''
            }
            <div style="
              width: 36px; 
              height: 36px; 
              border-radius: 50% 50% 50% 0; 
              transform: rotate(-45deg); 
              background: ${isOpen ? 'linear-gradient(135deg, #E07A5F, #C85A32)' : '#8A7968'}; 
              border: 2px solid #FFF; 
              box-shadow: 0 4px 10px rgba(0,0,0,0.25);
              display: flex;
              align-items: center;
              justify-content: center;
              cursor: pointer;
            ">
              <span style="transform: rotate(45deg); font-size: 16px;">${iconEmoji}</span>
            </div>
          </div>
        `,
      });

      const marker = L.marker(vendor.coordinates, { icon: customIcon });

      // Popup Content Card
      const popupHtml = `
        <div style="width: 280px; font-family: inherit; color: #2C241E;">
          <div id="popup-img-${vendor.id}" style="position: relative; height: 110px; width: 100%; overflow: hidden; cursor: pointer;">
            <img 
              src="${vendor.imageUrl}" 
              alt="${vendor.name}" 
              onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&w=800&q=80';"
              style="width: 100%; height: 100%; object-fit: cover;" 
            />
            <div style="position: absolute; top: 8px; right: 8px; background: ${isOpen ? '#10B981' : '#6B7280'}; color: #FFF; font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 9999px; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">
              ${isOpen ? (lang === 'vi' ? 'Đang mở bán' : 'Open now') : (lang === 'vi' ? 'Đã nghỉ hôm nay' : 'Closed today')}
            </div>
          </div>
          <div style="padding: 12px;">
            <div style="font-size: 11px; font-weight: 700; color: #E07A5F; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 2px;">
              ${vendor.vendorName} • ${vendor.vendorAge} ${lang === 'vi' ? 'tuổi' : 'yrs'}
            </div>
            <div id="popup-title-${vendor.id}" style="font-size: 14px; font-weight: 700; color: #1E1B18; line-height: 1.25; margin-bottom: 6px; cursor: pointer;">
              ${vendor.name}
            </div>
            <div style="font-size: 11px; color: #6B5A4D; margin-bottom: 4px; display: flex; align-items: center; gap: 4px;">
              <span>📍</span> <span>${vendor.address}</span>
            </div>
            <div style="font-size: 11px; color: #6B5A4D; margin-bottom: 8px; display: flex; align-items: center; gap: 4px;">
              <span>⏰</span> <span>${vendor.openHours.start} - ${vendor.openHours.end}</span>
            </div>
            <div style="display: flex; gap: 6px; margin-top: 10px;">
              <button 
                id="btn-detail-${vendor.id}"
                style="flex: 1; background: #2C241E; color: #FFF; border: none; padding: 6px 10px; border-radius: 8px; font-size: 11px; font-weight: 600; cursor: pointer; text-align: center;"
              >
                ${lang === 'vi' ? 'Xem chi tiết' : 'Details'}
              </button>
              <a 
                href="${getGoogleMapsUrl(vendor)}" 
                target="_blank" 
                rel="noreferrer"
                style="background: #FAF5EE; color: #E07A5F; border: 1px solid #E8DACB; padding: 6px 10px; border-radius: 8px; font-size: 11px; font-weight: 600; text-decoration: none; display: flex; align-items: center; justify-content: center; gap: 3px;"
              >
                🗺️ ${lang === 'vi' ? 'Chỉ đường' : 'Maps'}
              </a>
            </div>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml, { maxWidth: 300 });

      // Handle custom popup button and title clicks
      marker.on('popupopen', () => {
        const detailBtn = document.getElementById(`btn-detail-${vendor.id}`);
        const titleElem = document.getElementById(`popup-title-${vendor.id}`);
        const imgElem = document.getElementById(`popup-img-${vendor.id}`);
        const openDetail = () => onSelectVendor(vendor);

        if (detailBtn) detailBtn.onclick = openDetail;
        if (titleElem) titleElem.onclick = openDetail;
        if (imgElem) imgElem.onclick = openDetail;
      });

      marker.addTo(layerGroup);
    });
  }, [vendors, lang, onSelectVendor]);

  // Locate user with HTML5 geolocation
  const handleLocateMe = () => {
    if (!navigator.geolocation || !mapInstanceRef.current) {
      alert(lang === 'vi' ? 'Trình duyệt của bạn chưa hỗ trợ định vị' : 'Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const userLat = pos.coords.latitude;
        const userLng = pos.coords.longitude;

        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([userLat, userLng], 15, { duration: 1.5 });

          if (userMarkerRef.current) {
            userMarkerRef.current.setLatLng([userLat, userLng]);
          } else {
            const userIcon = L.divIcon({
              className: 'user-location-pin',
              iconSize: [20, 20],
              iconAnchor: [10, 10],
              html: `
                <div style="width: 20px; height: 20px; border-radius: 50%; background: #3B82F6; border: 3px solid white; box-shadow: 0 0 10px rgba(59, 130, 246, 0.8);"></div>
              `,
            });
            userMarkerRef.current = L.marker([userLat, userLng], { icon: userIcon }).addTo(mapInstanceRef.current);
          }
        }
      },
      () => {
        alert(
          lang === 'vi'
            ? 'Không thể lấy vị trí hiện tại. Vui lòng cho phép quyền định vị trong cài đặt trình duyệt.'
            : 'Could not access current location. Please allow geolocation permission in your browser.'
        );
      }
    );
  };

  return (
    <div className="relative w-full h-[calc(100vh-8rem)] min-h-[500px]">
      
      {/* Floating Filter Bar over the Map */}
      <div className="absolute top-3 left-3 right-3 sm:left-6 sm:right-auto z-20 max-w-2xl flex flex-wrap items-center gap-1.5 sm:gap-2 bg-[#FFFDF9]/95 backdrop-blur-md p-2 rounded-2xl shadow-lg border border-[#EBDCCB]">
        
        {/* Category Pills */}
        <div className="flex items-center gap-1 overflow-x-auto py-0.5 no-scrollbar max-w-full">
          {(['all', 'food', 'dessert', 'snack', 'drink', 'fruit', 'service'] as Category[]).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-[#E07A5F] text-white shadow-xs'
                  : 'bg-[#FAF5EE] text-[#5C4D42] hover:bg-[#F3E8DC]'
              }`}
            >
              <span>{CATEGORY_ICONS[cat]}</span>
              <span>{t.categories[cat]}</span>
            </button>
          ))}
        </div>

        <div className="w-full sm:w-auto h-px sm:h-5 bg-[#E8DACB] my-1 sm:my-0"></div>

        {/* Quick Toggles: Open Now & Elderly 80+ */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setOpenOnly(!openOnly)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold transition-all ${
              openOnly
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-[#FAF5EE] text-[#5C4D42] hover:bg-[#F3E8DC]'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${openOnly ? 'bg-white' : 'bg-emerald-500'}`}></span>
            {t.filters.openNow}
          </button>

          <button
            onClick={() => setElderlyOnly(!elderlyOnly)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold transition-all ${
              elderlyOnly
                ? 'bg-amber-700 text-white shadow-xs'
                : 'bg-[#FAF5EE] text-[#5C4D42] hover:bg-[#F3E8DC]'
            }`}
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
            {t.filters.elderly}
          </button>
        </div>
      </div>

      {/* Map Control: Locate Me Button */}
      <div className="absolute bottom-6 left-4 z-20 flex flex-col gap-2">
        <button
          onClick={handleLocateMe}
          title={lang === 'vi' ? 'Tìm gánh hàng quanh vị trí của tôi' : 'Find street vendors near me'}
          className="flex items-center gap-2 bg-[#FFFDF9] hover:bg-[#FAF5EE] text-[#2C241E] px-3.5 py-2.5 rounded-2xl shadow-lg border border-[#EBDCCB] text-xs font-bold transition-all active:scale-95 group"
        >
          <Navigation className="w-4 h-4 text-[#E07A5F] group-hover:rotate-45 transition-transform" />
          <span className="hidden sm:inline">
            {lang === 'vi' ? 'Vị trí của tôi' : 'Near Me'}
          </span>
        </button>
      </div>

      {/* Map View Statistics Pill on bottom right */}
      <div className="absolute bottom-6 right-16 z-20 hidden sm:flex items-center gap-2 bg-[#FFFDF9]/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#EBDCCB] shadow-md text-xs font-medium text-[#5C4D42]">
        <CheckCircle2 className="w-3.5 h-3.5 text-[#E07A5F]" />
        <span>
          {vendors.length} {lang === 'vi' ? 'gánh mưu sinh hiển thị' : 'active vendors shown'}
        </span>
      </div>

      {/* Leaflet DOM container */}
      <div ref={mapContainerRef} className="w-full h-full z-10" />
    </div>
  );
};
