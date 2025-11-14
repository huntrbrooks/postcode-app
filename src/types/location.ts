export type LocationStatus =
  | "idle"
  | "requesting"
  | "reverse-geocoding"
  | "success"
  | "error";

export interface LookupResult {
  postcode: string;
  address: string;
  latitude: number;
  longitude: number;
  city?: string;
  state?: string;
  country?: string;
}

