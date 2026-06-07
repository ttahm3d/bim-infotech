/**
 * Calculate the distance between two geographic coordinates using the Haversine formula
 * @param lat1 Latitude of point 1
 * @param lon1 Longitude of point 1
 * @param lat2 Latitude of point 2
 * @param lon2 Longitude of point 2
 * @returns Distance in meters
 */
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number => {
  const R = 6371000; // Earth's radius in meters
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in meters
};

const toRad = (deg: number): number => {
  return deg * (Math.PI / 180);
};

/**
 * Check if a location is within a certain radius
 * @param userLat User's latitude
 * @param userLon User's longitude
 * @param officeLat Office latitude
 * @param officeLon Office longitude
 * @param radiusMeters Allowed radius in meters
 * @returns true if user is within radius, false otherwise
 */
export const isLocationWithinRadius = (
  userLat: number,
  userLon: number,
  officeLat: number,
  officeLon: number,
  radiusMeters: number,
): boolean => {
  const distance = calculateDistance(userLat, userLon, officeLat, officeLon);
  return distance <= radiusMeters;
};
