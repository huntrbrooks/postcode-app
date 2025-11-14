import { useEffect, useMemo, useRef, useState } from "react";
import ResultPanel from "./components/ResultPanel";
import type { LocationStatus, LookupResult } from "./types/location";
import { composeAddress, reverseGeocode } from "./lib/nominatim";

const GEO_OPTIONS: PositionOptions = {
  enableHighAccuracy: true,
  timeout: 15000,
  maximumAge: 0,
};

const statusCopy: Record<LocationStatus, string> = {
  idle: "Tap the button to share your location.",
  requesting: "Requesting GPS access…",
  "reverse-geocoding": "Location received. Looking up the nearest postcode…",
  success: "Postcode retrieved successfully.",
  error: "We could not fetch the postcode just yet.",
};

export default function App() {
  const [status, setStatus] = useState<LocationStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<LookupResult | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [shouldScrollAfterSuccess, setShouldScrollAfterSuccess] =
    useState(false);
  const resultRef = useRef<HTMLElement | null>(null);

  const handleGetPostcode = () => {
    if (status === "requesting" || status === "reverse-geocoding") {
      return;
    }

    setShouldScrollAfterSuccess(false);
    setStatus("requesting");
    setError(null);

    if (!("geolocation" in navigator)) {
      setStatus("error");
      setError("Geolocation is not supported in this browser.");
      setShouldScrollAfterSuccess(false);
      return;
    }

    setShouldScrollAfterSuccess(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          setStatus("reverse-geocoding");
          const contactEmail =
            import.meta.env.VITE_NOMINATIM_EMAIL ?? "hello@example.com";
          const response = await reverseGeocode(
            latitude,
            longitude,
            contactEmail
          );

          const postcode = response.address?.postcode?.toUpperCase();
          if (!postcode) {
            throw new Error(
              "Could not determine postcode from this location."
            );
          }

          const lookupResult: LookupResult = {
            postcode,
            address:
              composeAddress(response.address) ||
              response.display_name ||
              "Address unavailable for these coordinates.",
            latitude,
            longitude,
            city:
              response.address?.city ??
              response.address?.town ??
              response.address?.village,
            state: response.address?.state,
            country: response.address?.country,
          };

          setResult(lookupResult);
          setLastUpdated(new Date());
          setStatus("success");
        } catch (lookupError) {
          setResult(null);
          setLastUpdated(null);
          setStatus("error");
          setShouldScrollAfterSuccess(false);
          setError(
            lookupError instanceof Error
              ? lookupError.message
              : "Unknown error while fetching postcode."
          );
        }
      },
      (geoError) => {
        setResult(null);
        setLastUpdated(null);
        setStatus("error");
        setShouldScrollAfterSuccess(false);

        switch (geoError.code) {
          case geoError.PERMISSION_DENIED:
            setError("Location permission was denied by the user.");
            break;
          case geoError.POSITION_UNAVAILABLE:
            setError("Position unavailable. Check your network or GPS and retry.");
            break;
          case geoError.TIMEOUT:
            setError("Timed out while retrieving location. Please try again.");
            break;
          default:
            setError("Unknown geolocation error.");
        }
      },
      GEO_OPTIONS
    );
  };

  const statusMessage = useMemo(() => {
    if (error) {
      return error;
    }

    if (status === "success" && result) {
      return `Nearest postcode: ${result.postcode}`;
    }

    return statusCopy[status];
  }, [error, result, status]);

  const isBusy = status === "requesting" || status === "reverse-geocoding";

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has("demo")) {
      const demoResult: LookupResult = {
        postcode: "3121",
        address: "Rotherwood Street, Richmond, Melbourne, Victoria, Australia",
        latitude: -37.81941,
        longitude: 144.99182,
        city: "Melbourne",
        state: "Victoria",
        country: "Australia",
      };
      setResult(demoResult);
      setStatus("success");
      setLastUpdated(new Date());
      setShouldScrollAfterSuccess(false);
    }
  }, []);

  useEffect(() => {
    if (
      !shouldScrollAfterSuccess ||
      status !== "success" ||
      !result ||
      !resultRef.current
    ) {
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const timeoutId = window.setTimeout(() => {
      resultRef.current?.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start",
      });
      setShouldScrollAfterSuccess(false);
    }, prefersReducedMotion ? 0 : 250);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [result, shouldScrollAfterSuccess, status]);

  return (
    <div className="page">
      <main className="shell" role="main">
        <header className="hero">
          <p className="eyebrow">React + TypeScript web app</p>
          <h1>Postcode Revealer</h1>
          <p className="lede">
            Built in Cursor with Vite, this responsive experience runs in Safari on iOS
            and Chrome on Android. Postcode Revealer only asks for your GPS location after you tap the button.
          </p>
        </header>

        <section className="actions" aria-live="polite">
          <button
            type="button"
            className="cta"
            onClick={handleGetPostcode}
            disabled={isBusy}
          >
            {isBusy
              ? status === "requesting"
                ? "Requesting GPS…"
                : "Looking up postcode…"
              : "Use my location"}
          </button>
          <p className={`status status-${status}`}>{statusMessage}</p>
        </section>

        {result && (
          <ResultPanel
            ref={resultRef}
            result={result}
            lastUpdated={lastUpdated}
          />
        )}
      </main>

      <footer className="site-footer">
        <p>
          Powered by the HTML5 Geolocation API and OpenStreetMap’s Nominatim
          Reverse Geocoding service.{" "}
          <a href="/privacy.html" rel="noopener noreferrer">
            Privacy policy
          </a>
          .
        </p>
      </footer>
    </div>
  );
}

