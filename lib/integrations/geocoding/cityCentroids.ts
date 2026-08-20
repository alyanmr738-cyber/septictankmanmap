export const SWFL_CITY_CENTROIDS: Record<
  string,
  { lat: number; lng: number; state: string; city: string }
> = {
  bradenton: { lat: 27.4989, lng: -82.5748, state: "FL", city: "Bradenton" },
  palmetto: { lat: 27.5214, lng: -82.5723, state: "FL", city: "Palmetto" },
  "lakewood ranch": { lat: 27.4014, lng: -82.4334, state: "FL", city: "Lakewood Ranch" },
  sarasota: { lat: 27.3364, lng: -82.5307, state: "FL", city: "Sarasota" },
  "siesta key": { lat: 27.2673, lng: -82.5515, state: "FL", city: "Siesta Key" },
  osprey: { lat: 27.1967, lng: -82.4901, state: "FL", city: "Osprey" },
  venice: { lat: 27.0998, lng: -82.4543, state: "FL", city: "Venice" },
  nokomis: { lat: 27.1237, lng: -82.4443, state: "FL", city: "Nokomis" },
  englewood: { lat: 26.9617, lng: -82.3526, state: "FL", city: "Englewood" },
  "port charlotte": { lat: 26.9761, lng: -82.0906, state: "FL", city: "Port Charlotte" },
  "punta gorda": { lat: 26.9298, lng: -82.0453, state: "FL", city: "Punta Gorda" },
  "north port": { lat: 27.0442, lng: -82.2359, state: "FL", city: "North Port" },
  "rotonda west": { lat: 26.8937, lng: -82.2715, state: "FL", city: "Rotonda West" },
  ellenton: { lat: 27.5225, lng: -82.5301, state: "FL", city: "Ellenton" },
  fruitville: { lat: 27.3323, lng: -82.4595, state: "FL", city: "Fruitville" },
  "gulf gate": { lat: 27.2595, lng: -82.5068, state: "FL", city: "Gulf Gate" },
  "bee ridge": { lat: 27.3114, lng: -82.4748, state: "FL", city: "Bee Ridge" },
  "south venice": { lat: 27.0531, lng: -82.4387, state: "FL", city: "South Venice" },
  "venice gardens": { lat: 27.0706, lng: -82.4073, state: "FL", city: "Venice Gardens" },
  "deep creek": { lat: 27.0203, lng: -82.0462, state: "FL", city: "Deep Creek" },
  "harbour heights": { lat: 26.9903, lng: -82.0051, state: "FL", city: "Harbour Heights" },
  "warm mineral springs": {
    lat: 27.0598,
    lng: -82.2604,
    state: "FL",
    city: "Warm Mineral Springs",
  },
  "longboat key": { lat: 27.4123, lng: -82.659, state: "FL", city: "Longboat Key" },
  "anna maria": { lat: 27.5303, lng: -82.7332, state: "FL", city: "Anna Maria" },
  "holmes beach": { lat: 27.4953, lng: -82.7073, state: "FL", city: "Holmes Beach" },
};

export function lookupCityCentroid(city?: string) {
  if (!city) {
    return null;
  }
  return SWFL_CITY_CENTROIDS[city.trim().toLowerCase()] ?? null;
}
