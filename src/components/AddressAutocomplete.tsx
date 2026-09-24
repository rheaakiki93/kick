import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";

export interface AddressParts {
  street: string;
  city: string;
  cap: string;
}

interface AddressAutocompleteProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  onSelectAddress: (parts: AddressParts) => void;
  placeholder?: string;
  className?: string;
}

interface Suggestion {
  id: string;
  street: string;
  secondary: string;
  city: string;
  cap: string;
}

// Free-text Milan street lookup via OpenStreetMap's Nominatim — no API key
// needed (unlike Google Places). Debounced, aborts stale requests, biases
// to Milan via a bounding-box viewbox, and on selection also fills the
// separate city/CAP fields from the result's address breakdown.
const MILAN_VIEWBOX = "9.04,45.56,9.29,45.38";

const AddressAutocomplete = ({ id, value, onChange, onSelectAddress, placeholder, className }: AddressAutocompleteProps) => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const abortRef = useRef<AbortController>();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return () => {
      clearTimeout(debounceRef.current);
      abortRef.current?.abort();
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchSuggestions = (query: string) => {
    clearTimeout(debounceRef.current);

    if (query.trim().length < 3) {
      setSuggestions([]);
      setLoading(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      setLoading(true);
      try {
        const url = new URL("https://nominatim.openstreetmap.org/search");
        url.searchParams.set("format", "json");
        url.searchParams.set("addressdetails", "1");
        url.searchParams.set("q", `${query}, Milano`);
        url.searchParams.set("countrycodes", "it");
        url.searchParams.set("viewbox", MILAN_VIEWBOX);
        url.searchParams.set("limit", "5");

        const res = await fetch(url.toString(), { signal: controller.signal });
        const data: {
          place_id: number;
          address: {
            road?: string;
            house_number?: string;
            postcode?: string;
            city?: string;
            town?: string;
            village?: string;
            suburb?: string;
          };
        }[] = await res.json();

        setSuggestions(
          data
            .filter((r) => r.address?.road)
            .map((r) => {
              const street = [r.address.road, r.address.house_number].filter(Boolean).join(" ");
              const city = r.address.city ?? r.address.town ?? r.address.village ?? r.address.suburb ?? "Milano";
              const cap = r.address.postcode ?? "";
              return {
                id: String(r.place_id),
                street,
                secondary: [cap, city].filter(Boolean).join(" "),
                city,
                cap,
              };
            })
        );
        setOpen(true);
      } catch (err) {
        if ((err as Error).name !== "AbortError") setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 400);
  };

  return (
    <div ref={containerRef} className="relative">
      <Input
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          fetchSuggestions(e.target.value);
        }}
        onFocus={() => suggestions.length > 0 && setOpen(true)}
        autoComplete="off"
        className={className}
      />
      {open && (loading || suggestions.length > 0) && (
        <div className="absolute z-10 top-full left-0 right-0 mt-1 bg-white shadow-lg max-h-60 overflow-y-auto">
          {loading && suggestions.length === 0 ? (
            <p className="px-3 py-2 text-sm text-secondary/60">Searching…</p>
          ) : (
            suggestions.map((s) => (
              <button
                key={s.id}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  onChange(s.street);
                  onSelectAddress({ street: s.street, city: s.city, cap: s.cap });
                  setSuggestions([]);
                  setOpen(false);
                }}
                className="block w-full text-left px-3 py-2 hover:bg-secondary/10 border-b border-secondary/10 last:border-b-0"
              >
                <span className="block text-sm text-secondary">{s.street}</span>
                {s.secondary && <span className="block text-xs text-secondary/60">{s.secondary}</span>}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AddressAutocomplete;
