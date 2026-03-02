// Jabalpur MP geographic constraints and ride intelligence engine

export interface JabalpurLocation {
  id: string;
  name: string;
  area: string;
  lat: number;
  lng: number;
}

const LAT_MIN = 23.1000;
const LAT_MAX = 23.2500;
const LNG_MIN = 79.8500;
const LNG_MAX = 80.0500;

export const jabalpurLocations: JabalpurLocation[] = [
  { id: "jbp-1", name: "Jabalpur Railway Station", area: "Railway Station Area", lat: 23.1688, lng: 79.9516 },
  { id: "jbp-2", name: "Sadar Bazaar", area: "Sadar", lat: 23.1660, lng: 79.9460 },
  { id: "jbp-3", name: "Napier Town", area: "Napier Town", lat: 23.1750, lng: 79.9550 },
  { id: "jbp-4", name: "Wright Town", area: "Wright Town", lat: 23.1810, lng: 79.9600 },
  { id: "jbp-5", name: "Gwarighat", area: "Gwarighat Road", lat: 23.1350, lng: 79.9900 },
  { id: "jbp-6", name: "Adhartal", area: "Adhartal", lat: 23.2100, lng: 79.9300 },
  { id: "jbp-7", name: "Vijay Nagar", area: "Vijay Nagar Colony", lat: 23.1900, lng: 79.9750 },
  { id: "jbp-8", name: "Madan Mahal", area: "Madan Mahal", lat: 23.1580, lng: 79.9350 },
  { id: "jbp-9", name: "Garha", area: "Garha Bazaar", lat: 23.1950, lng: 79.9950 },
  { id: "jbp-10", name: "Gorakhpur", area: "Gorakhpur Area", lat: 23.2000, lng: 79.9500 },
  { id: "jbp-11", name: "Ranjhi", area: "Ranjhi", lat: 23.2200, lng: 79.9400 },
  { id: "jbp-12", name: "Tilwara Ghat", area: "Narmada Ghat", lat: 23.1400, lng: 79.9850 },
  { id: "jbp-13", name: "Damoh Naka", area: "Damoh Naka Chowk", lat: 23.1850, lng: 79.9400 },
  { id: "jbp-14", name: "Russel Chowk", area: "Russel Crossing", lat: 23.1770, lng: 79.9520 },
  { id: "jbp-15", name: "Cantt Area", area: "Jabalpur Cantt", lat: 23.1620, lng: 79.9700 },
  { id: "jbp-16", name: "Medical College", area: "Neta Ji Subhash Chandra Bose Medical College", lat: 23.1730, lng: 79.9650 },
  { id: "jbp-17", name: "Bhedaghat", area: "Marble Rocks", lat: 23.1350, lng: 79.8100 },
  { id: "jbp-18", name: "Engineering College", area: "JNEC Dewanganj", lat: 23.1820, lng: 79.9880 },
  { id: "jbp-19", name: "Kachnar City", area: "Kachnar City Township", lat: 23.2050, lng: 79.9650 },
  { id: "jbp-20", name: "Cherital", area: "Cherital Chowk", lat: 23.1500, lng: 79.9500 },
];

export function isWithinJabalpur(lat: number, lng: number): boolean {
  return lat >= LAT_MIN && lat <= LAT_MAX && lng >= LNG_MIN && lng <= LNG_MAX;
}

export function searchJabalpurLocations(query: string): JabalpurLocation[] {
  if (!query || query.length < 2) return [];
  const q = query.toLowerCase();
  return jabalpurLocations
    .filter(l => l.name.toLowerCase().includes(q) || l.area.toLowerCase().includes(q))
    .slice(0, 6);
}

// Haversine distance in km
function haversine(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

export type VehicleType = "car" | "auto" | "bike";
export type TrafficLevel = "low" | "medium" | "high";

export interface RideInput {
  provider: string;
  price: number;
  eta_minutes: number;
  vehicle_type: VehicleType;
}

export interface EvaluatedRide {
  provider: string;
  vehicle_type: VehicleType;
  original_price: number;
  adjusted_price: number;
  eta_minutes: number;
  score: number;
  carbon_emission_g: number;
}

export interface RideResult {
  city: string;
  state: string;
  pickup: string;
  drop: string;
  distance_km: number;
  surge_multiplier: number;
  evaluated_rides: EvaluatedRide[];
  best_ride: string;
  reasoning: string;
  notes: string;
}

const EMISSION_PER_KM: Record<VehicleType, number> = {
  car: 120,
  auto: 80,
  bike: 60,
};

// Service definitions with base pricing per km
const serviceDefinitions: { provider: string; vehicle_type: VehicleType; basePerKm: number; baseFare: number; minFare: number; baseEta: number }[] = [
  { provider: "Ola Auto", vehicle_type: "auto", basePerKm: 12, baseFare: 25, minFare: 30, baseEta: 4 },
  { provider: "Uber Auto", vehicle_type: "auto", basePerKm: 13, baseFare: 30, minFare: 35, baseEta: 5 },
  { provider: "Rapido Auto", vehicle_type: "auto", basePerKm: 11, baseFare: 20, minFare: 25, baseEta: 3 },
  { provider: "Ola Mini", vehicle_type: "car", basePerKm: 14, baseFare: 60, minFare: 80, baseEta: 6 },
  { provider: "Uber Go", vehicle_type: "car", basePerKm: 15, baseFare: 65, minFare: 85, baseEta: 7 },
  { provider: "Ola Sedan", vehicle_type: "car", basePerKm: 18, baseFare: 80, minFare: 100, baseEta: 8 },
  { provider: "Uber Premier", vehicle_type: "car", basePerKm: 20, baseFare: 90, minFare: 120, baseEta: 9 },
  { provider: "Rapido Bike", vehicle_type: "bike", basePerKm: 5, baseFare: 10, minFare: 15, baseEta: 2 },
  { provider: "Uber Moto", vehicle_type: "bike", basePerKm: 6, baseFare: 15, minFare: 20, baseEta: 3 },
  { provider: "Ola Bike", vehicle_type: "bike", basePerKm: 5.5, baseFare: 12, minFare: 18, baseEta: 3 },
  { provider: "InDrive", vehicle_type: "car", basePerKm: 13, baseFare: 50, minFare: 70, baseEta: 5 },
  { provider: "Rapido Cab", vehicle_type: "car", basePerKm: 12, baseFare: 55, minFare: 75, baseEta: 6 },
];

function calculateSurge(time24hr: number, trafficLevel: TrafficLevel): { multiplier: number; notes: string } {
  let multiplier = 1;
  const notesParts: string[] = [];

  if (time24hr >= 17 && time24hr <= 21) {
    multiplier += 0.5;
    notesParts.push("Peak hour surge (+0.5)");
  }
  if (trafficLevel === "high") {
    multiplier += 0.3;
    notesParts.push("High traffic surge (+0.3)");
  }

  return {
    multiplier,
    notes: notesParts.length > 0 ? notesParts.join(". ") : "No surge conditions active",
  };
}

export function evaluateRides(
  pickup: JabalpurLocation,
  drop: JabalpurLocation,
  time24hr: number,
  trafficLevel: TrafficLevel,
  vehicleFilter?: VehicleType | "all"
): RideResult {
  const distance = haversine(pickup, drop);
  const rideDistance = Math.max(distance, 1); // min 1 km
  const { multiplier, notes } = calculateSurge(time24hr, trafficLevel);

  let services = serviceDefinitions;
  if (vehicleFilter && vehicleFilter !== "all") {
    services = services.filter(s => s.vehicle_type === vehicleFilter);
  }

  // Generate rides with some variance
  const rides: RideInput[] = services.map(s => {
    const variance = 0.9 + Math.random() * 0.2;
    const price = Math.max(s.minFare, Math.round((s.baseFare + s.basePerKm * rideDistance) * variance));
    const eta = Math.max(1, Math.round(s.baseEta + Math.random() * 4));
    return { provider: s.provider, price, eta_minutes: eta, vehicle_type: s.vehicle_type };
  });

  const evaluated: EvaluatedRide[] = rides.map(r => {
    const adjustedPrice = Math.round(r.price * multiplier);
    const score = parseFloat(((0.7 * adjustedPrice) + (0.3 * r.eta_minutes)).toFixed(2));
    const emission = EMISSION_PER_KM[r.vehicle_type] * Math.round(rideDistance);
    return {
      provider: r.provider,
      vehicle_type: r.vehicle_type,
      original_price: r.price,
      adjusted_price: adjustedPrice,
      eta_minutes: r.eta_minutes,
      score,
      carbon_emission_g: emission,
    };
  });

  evaluated.sort((a, b) => a.score - b.score);

  // Best ride: if top two within 5% score, pick lower carbon
  let bestRide = evaluated[0];
  if (evaluated.length > 1) {
    const diff = Math.abs(evaluated[0].score - evaluated[1].score) / evaluated[0].score;
    if (diff < 0.05 && evaluated[1].carbon_emission_g < evaluated[0].carbon_emission_g) {
      bestRide = evaluated[1];
    }
  }

  const reasoning = `${bestRide.provider} selected with score ${bestRide.score} (adjusted ₹${bestRide.adjusted_price}, ETA ${bestRide.eta_minutes}min). ` +
    `${bestRide.carbon_emission_g}g CO₂ for ${Math.round(rideDistance)}km ride.` +
    (multiplier > 1 ? ` Surge ${multiplier}x applied.` : "");

  return {
    city: "Jabalpur",
    state: "Madhya Pradesh",
    pickup: pickup.name,
    drop: drop.name,
    distance_km: parseFloat(rideDistance.toFixed(2)),
    surge_multiplier: multiplier,
    evaluated_rides: evaluated,
    best_ride: bestRide.provider,
    reasoning,
    notes,
  };
}
