export type Language = 'vi' | 'en';

export type Category = 'all' | 'food' | 'dessert' | 'snack' | 'drink' | 'fruit' | 'service';

export type CityId = 'all' | 'hcm' | 'hanoi' | 'danang' | 'cantho' | 'hue';

export interface VendorReview {
  id: string;
  author: string;
  date: string;
  comment: string;
  rating: number;
}

export interface Vendor {
  id: string;
  name: string;
  vendorName: string;
  vendorAge: number;
  category: Category;
  city: CityId;
  district: string;
  address: string;
  coordinates: [number, number]; // [lat, lng]
  openHours: {
    start: string; // "06:00"
    end: string;   // "11:30"
    days?: string;
  };
  mobility: 'fixed' | 'moving';
  movingRoute?: {
    vi: string;
    en: string;
  };
  priceRange: string;
  specialties: {
    vi: string[];
    en: string[];
  };
  story: {
    vi: string;
    en: string;
  };
  quote: {
    vi: string;
    en: string;
  };
  imageUrl: string;
  galleryUrls?: string[];
  verified: boolean;
  upvotes: number;
  checkIns: number;
  lastReportedTime: string;
  phone?: string;
  notes?: {
    vi: string;
    en: string;
  };
  reviews: VendorReview[];
}

export interface CityOption {
  id: CityId;
  nameVi: string;
  nameEn: string;
  center: [number, number];
  zoom: number;
}
