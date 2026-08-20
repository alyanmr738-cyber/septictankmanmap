export type MapTileConfig = {
  name: string;
  url: string;
  attribution: string;
  subdomains?: string;
  maxZoom: number;
};

const CARTO_POSITRON: MapTileConfig = {
  name: "carto-voyager",
  url: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
  subdomains: "abcd",
  maxZoom: 19,
};

export function getMapTileConfig(): MapTileConfig {
  const url = process.env.NEXT_PUBLIC_MAP_TILE_URL;
  const attribution = process.env.NEXT_PUBLIC_MAP_TILE_ATTRIBUTION;
  if (url) {
    return {
      name: "custom",
      url,
      attribution: attribution ?? CARTO_POSITRON.attribution,
      maxZoom: 19,
    };
  }
  return CARTO_POSITRON;
}

export const SWFL_CENTER: [number, number] = [27.08, -82.42];
export const SWFL_DEFAULT_ZOOM = 10;
