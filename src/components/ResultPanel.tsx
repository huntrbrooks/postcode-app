import { forwardRef } from "react";
import type { LookupResult } from "../types/location";

interface ResultPanelProps {
  result: LookupResult;
  lastUpdated: Date | null;
}

const formatter = new Intl.DateTimeFormat(undefined, {
  hour: "2-digit",
  minute: "2-digit",
});

const ResultPanel = forwardRef<HTMLElement, ResultPanelProps>(
  ({ result, lastUpdated }, ref) => {
  const rows: Array<{ label: string; value: string }> = [
    { label: "Latitude", value: result.latitude.toFixed(5) },
    { label: "Longitude", value: result.longitude.toFixed(5) },
    { label: "City / Town", value: result.city ?? "—" },
    { label: "State / Region", value: result.state ?? "—" },
    { label: "Country", value: result.country ?? "—" },
  ];

    return (
      <section className="result" aria-live="polite" ref={ref}>
        <p className="label">Nearest postcode</p>
        <p className="postcode-badge">{result.postcode}</p>
        <p className="address">{result.address}</p>

        <dl className="meta">
          {rows.map((row) => (
            <div key={row.label} className="meta-row">
              <dt>{row.label}</dt>
              <dd>{row.value}</dd>
            </div>
          ))}
        </dl>

        {lastUpdated && (
          <p className="timestamp">Updated {formatter.format(lastUpdated)}</p>
        )}
      </section>
    );
  }
);

ResultPanel.displayName = "ResultPanel";

export default ResultPanel;

