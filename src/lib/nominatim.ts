export interface NominatimAddress {
  postcode?: string;
  road?: string;
  neighbourhood?: string;
  suburb?: string;
  city?: string;
  town?: string;
  village?: string;
  state?: string;
  country?: string;
}

export interface NominatimResponse {
  address?: NominatimAddress;
  display_name?: string;
}

const NOMINATIM_ENDPOINT = "https://nominatim.openstreetmap.org/reverse";

export async function reverseGeocode(
  latitude: number,
  longitude: number,
  contactEmail: string
): Promise<NominatimResponse> {
  const params = new URLSearchParams({
    format: "jsonv2",
    addressdetails: "1",
    zoom: "18",
    lat: latitude.toString(),
    lon: longitude.toString(),
  });

  if (contactEmail) {
    params.set("email", contactEmail);
  }

  const response = await fetch(`${NOMINATIM_ENDPOINT}?${params.toString()}`, {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Reverse geocoding failed with ${response.status}`);
  }

  return (await response.json()) as NominatimResponse;
}

export function composeAddress(address?: NominatimAddress): string {
  if (!address) {
    return "";
  }

  const parts = [
    address.road,
    address.neighbourhood ?? address.suburb,
    address.city ?? address.town ?? address.village,
    address.state,
    address.country,
  ].filter(Boolean);

  return parts.join(", ");
}

