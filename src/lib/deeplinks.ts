// Deep-link URLs for ride-hailing apps
// These open the respective apps with pickup/drop pre-filled

export interface DeepLinkParams {
  pickupLat: number;
  pickupLng: number;
  dropLat: number;
  dropLng: number;
  pickupName?: string;
  dropName?: string;
}

type ServiceKey = string;

interface DeepLinkGenerator {
  appLink: (p: DeepLinkParams) => string;
  webLink: (p: DeepLinkParams) => string;
  label: string;
}

const generators: Record<ServiceKey, DeepLinkGenerator> = {
  uber: {
    label: "Uber",
    appLink: (p) =>
      `uber://?action=setPickup&pickup[latitude]=${p.pickupLat}&pickup[longitude]=${p.pickupLng}&pickup[nickname]=${encodeURIComponent(p.pickupName || "Pickup")}&dropoff[latitude]=${p.dropLat}&dropoff[longitude]=${p.dropLng}&dropoff[nickname]=${encodeURIComponent(p.dropName || "Drop")}`,
    webLink: (p) =>
      `https://m.uber.com/ul/?action=setPickup&pickup[latitude]=${p.pickupLat}&pickup[longitude]=${p.pickupLng}&pickup[nickname]=${encodeURIComponent(p.pickupName || "Pickup")}&dropoff[latitude]=${p.dropLat}&dropoff[longitude]=${p.dropLng}&dropoff[nickname]=${encodeURIComponent(p.dropName || "Drop")}`,
  },
  ola: {
    label: "Ola",
    appLink: (p) =>
      `olacabs://app/launch?lat=${p.pickupLat}&lng=${p.pickupLng}&drop_lat=${p.dropLat}&drop_lng=${p.dropLng}`,
    webLink: (p) =>
      `https://book.olacabs.com/?lat=${p.pickupLat}&lng=${p.pickupLng}&drop_lat=${p.dropLat}&drop_lng=${p.dropLng}`,
  },
  rapido: {
    label: "Rapido",
    appLink: (p) =>
      `https://rapido.bike/ride?pickup_lat=${p.pickupLat}&pickup_lng=${p.pickupLng}&drop_lat=${p.dropLat}&drop_lng=${p.dropLng}`,
    webLink: (p) =>
      `https://www.rapido.bike/`,
  },
  indrive: {
    label: "InDrive",
    appLink: (p) =>
      `https://indrive.com/order?pickup_lat=${p.pickupLat}&pickup_lng=${p.pickupLng}&dest_lat=${p.dropLat}&dest_lng=${p.dropLng}`,
    webLink: (p) =>
      `https://indrive.com/en/home/`,
  },
  nammayatri: {
    label: "Namma Yatri",
    appLink: (p) =>
      `https://nammayatri.in/`,
    webLink: (p) =>
      `https://nammayatri.in/`,
  },
};

// Map service display names to deep-link keys
function normalizeServiceName(service: string): ServiceKey | null {
  const s = service.toLowerCase();
  if (s.includes("uber")) return "uber";
  if (s.includes("ola")) return "ola";
  if (s.includes("rapido")) return "rapido";
  if (s.includes("indrive")) return "indrive";
  if (s.includes("namma")) return "nammayatri";
  return null;
}

export function getBookingLink(service: string, params: DeepLinkParams): string | null {
  const key = normalizeServiceName(service);
  if (!key || !generators[key]) return null;
  
  // On mobile, try app link; on desktop, use web link
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  const gen = generators[key];
  return isMobile ? gen.appLink(params) : gen.webLink(params);
}

export function hasBookingLink(service: string): boolean {
  return normalizeServiceName(service) !== null;
}
