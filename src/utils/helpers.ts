import { Vendor } from '../types';

/**
 * Checks if vendor is open right now based on start/end hour strings like "06:30" and "11:00"
 */
export function isVendorOpenNow(vendor: Vendor): boolean {
  try {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const [startH, startM] = vendor.openHours.start.split(':').map(Number);
    const [endH, endM] = vendor.openHours.end.split(':').map(Number);

    const startMinutes = startH * 60 + (startM || 0);
    const endMinutes = endH * 60 + (endM || 0);

    if (endMinutes >= startMinutes) {
      return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
    } else {
      // Overnight hours (e.g. 18:00 to 02:00)
      return currentMinutes >= startMinutes || currentMinutes <= endMinutes;
    }
  } catch {
    return true;
  }
}

/**
 * Generates Google Maps navigation URL for a vendor
 */
export function getGoogleMapsUrl(vendor: Vendor): string {
  const [lat, lng] = vendor.coordinates;
  const encodedQuery = encodeURIComponent(`${vendor.name}, ${vendor.address}`);
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}+(${encodedQuery})`;
}

/**
 * Haversine formula to compute distance in km between two lat/lng pairs
 */
export function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}
