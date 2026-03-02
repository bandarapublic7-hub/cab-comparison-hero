import { useState, useRef, useEffect } from "react";
import { MapPin, Navigation, X } from "lucide-react";
import { JabalpurLocation, searchJabalpurLocations } from "@/lib/jabalpur";

interface LocationSearchProps {
  label: string;
  value: JabalpurLocation | null;
  onChange: (loc: JabalpurLocation | null) => void;
  icon: "pickup" | "drop";
}

const LocationSearch = ({ label, value, onChange, icon }: LocationSearchProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<JabalpurLocation[]>([]);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSearch = (q: string) => {
    setQuery(q);
    if (q.length >= 2) {
      setResults(searchJabalpurLocations(q));
      setOpen(true);
    } else {
      setResults([]);
      setOpen(false);
    }
  };

  const handleSelect = (loc: JabalpurLocation) => {
    onChange(loc);
    setQuery("");
    setOpen(false);
  };

  const handleClear = () => {
    onChange(null);
    setQuery("");
  };

  return (
    <div ref={ref} className="relative">
      <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50 border border-border focus-within:border-primary/40 transition-colors">
        <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${
          icon === "pickup" ? "bg-primary/20 text-primary" : "bg-destructive/20 text-destructive"
        }`}>
          {icon === "pickup" ? <Navigation className="h-4 w-4" /> : <MapPin className="h-4 w-4" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-0.5">{label}</div>
          {value ? (
            <div className="flex items-center justify-between gap-2">
              <div className="truncate">
                <span className="text-sm font-medium text-foreground">{value.name}</span>
                <span className="text-xs text-muted-foreground ml-1">({value.area})</span>
              </div>
              <button onClick={handleClear} className="shrink-0 text-muted-foreground hover:text-foreground">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <input
              type="text"
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder={`Search ${label.toLowerCase()} in Jabalpur...`}
              className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground/60 outline-none"
            />
          )}
        </div>
      </div>

      {open && results.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-1 z-50 rounded-xl bg-card border border-border shadow-xl overflow-hidden">
          {results.map((loc) => (
            <button
              key={loc.id}
              onClick={() => handleSelect(loc)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-secondary/50 transition-colors text-left"
            >
              <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
              <div>
                <div className="text-sm font-medium text-foreground">{loc.name}</div>
                <div className="text-xs text-muted-foreground">{loc.area}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationSearch;
