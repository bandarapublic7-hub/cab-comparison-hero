import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowDownUp, ArrowLeft, Clock, Gauge, Car, Bike, Leaf, Search, ChevronLeft, ChevronRight, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import LocationSearch from "@/components/jabalpur/LocationSearch";
import RideCard from "@/components/jabalpur/RideCard";
import JsonOutput from "@/components/jabalpur/JsonOutput";
import {
  JabalpurLocation,
  TrafficLevel,
  VehicleType,
  evaluateRides,
  RideResult,
} from "@/lib/jabalpur";

const ITEMS_PER_PAGE = 4;

const trafficOptions: { key: TrafficLevel; label: string; color: string }[] = [
  { key: "low", label: "Low", color: "text-emerald-400" },
  { key: "medium", label: "Medium", color: "text-amber-400" },
  { key: "high", label: "High", color: "text-destructive" },
];

const vehicleOptions: { key: VehicleType | "all"; label: string; icon: React.ReactNode }[] = [
  { key: "all", label: "All", icon: <Zap className="h-4 w-4" /> },
  { key: "auto", label: "Auto", icon: <Car className="h-4 w-4" /> },
  { key: "bike", label: "Bike", icon: <Bike className="h-4 w-4" /> },
  { key: "car", label: "Cab", icon: <Car className="h-4 w-4" /> },
];

const JabalpurRides = () => {
  const [pickup, setPickup] = useState<JabalpurLocation | null>(null);
  const [drop, setDrop] = useState<JabalpurLocation | null>(null);
  const [time, setTime] = useState(12);
  const [traffic, setTraffic] = useState<TrafficLevel>("low");
  const [vehicleFilter, setVehicleFilter] = useState<VehicleType | "all">("all");
  const [page, setPage] = useState(1);
  const [showJson, setShowJson] = useState(false);

  const result: RideResult | null = useMemo(() => {
    if (!pickup || !drop) return null;
    return evaluateRides(pickup, drop, time, traffic, vehicleFilter);
  }, [pickup, drop, time, traffic, vehicleFilter]);

  const totalPages = result ? Math.ceil(result.evaluated_rides.length / ITEMS_PER_PAGE) : 0;
  const paginatedRides = result
    ? result.evaluated_rides.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)
    : [];

  // Reset page when filters change
  useMemo(() => setPage(1), [pickup, drop, time, traffic, vehicleFilter]);

  const handleSwap = () => {
    const temp = pickup;
    setPickup(drop);
    setDrop(temp);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-6 h-14 flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">Back</span>
          </Link>
          <div className="h-5 w-px bg-border" />
          <h1 className="font-display font-bold text-foreground">
            Jabalpur <span className="text-primary">Rides</span>
          </h1>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold uppercase tracking-wider">
            MP
          </span>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 max-w-2xl space-y-6">
        {/* Location inputs */}
        <div className="space-y-1 relative">
          <LocationSearch label="Pickup" value={pickup} onChange={setPickup} icon="pickup" />
          <div className="absolute left-1/2 -translate-x-1/2 top-[calc(50%-14px)] z-10">
            <button
              onClick={handleSwap}
              disabled={!pickup && !drop}
              className="h-7 w-7 rounded-full bg-secondary border border-border flex items-center justify-center hover:bg-primary/20 hover:border-primary/30 transition-all disabled:opacity-30"
            >
              <ArrowDownUp className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          </div>
          <LocationSearch label="Drop" value={drop} onChange={setDrop} icon="drop" />
        </div>

        {/* Controls row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Time slider */}
          <div className="p-4 rounded-xl bg-secondary/30 border border-border space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <Clock className="h-3.5 w-3.5" />
                Time
              </div>
              <span className="text-sm font-display font-bold text-foreground">
                {time.toString().padStart(2, "0")}:00
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={23}
              value={time}
              onChange={(e) => setTime(parseInt(e.target.value))}
              className="w-full accent-primary h-1.5"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>00:00</span>
              <span>12:00</span>
              <span>23:00</span>
            </div>
          </div>

          {/* Traffic level */}
          <div className="p-4 rounded-xl bg-secondary/30 border border-border space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <Gauge className="h-3.5 w-3.5" />
              Traffic
            </div>
            <div className="flex gap-2">
              {trafficOptions.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTraffic(t.key)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                    traffic === t.key
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary/50 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Vehicle filter tabs */}
        <div className="flex gap-2 p-1 rounded-xl bg-secondary/50">
          {vehicleOptions.map((v) => (
            <button
              key={v.key}
              onClick={() => setVehicleFilter(v.key)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                vehicleFilter === v.key
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {v.icon}
              {v.label}
            </button>
          ))}
        </div>

        {/* Results */}
        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-12 text-center"
            >
              <div className="h-16 w-16 rounded-full bg-secondary/50 flex items-center justify-center mx-auto mb-4">
                <Search className="h-7 w-7 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground text-sm">
                Select pickup & drop locations in Jabalpur to compare rides
              </p>
            </motion.div>
          ) : (
            <motion.div
              key={`${pickup?.id}-${drop?.id}-${vehicleFilter}-${time}-${traffic}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {/* Summary bar */}
              <div className="flex items-center justify-between flex-wrap gap-3 p-4 rounded-xl bg-secondary/30 border border-border">
                <div className="text-sm text-muted-foreground">
                  <span className="text-foreground font-semibold">{result.distance_km} km</span> · Surge{" "}
                  <span className={`font-semibold ${result.surge_multiplier > 1 ? "text-destructive" : "text-emerald-400"}`}>
                    {result.surge_multiplier}x
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {result.evaluated_rides.length} rides found
                </div>
              </div>

              {/* Ride cards with pagination */}
              <div className="space-y-3">
                {paginatedRides.map((ride, i) => (
                  <motion.div
                    key={ride.provider}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                  >
                    <RideCard
                      ride={ride}
                      isBest={ride.provider === result.best_ride}
                      rank={(page - 1) * ITEMS_PER_PAGE + i + 1}
                    />
                  </motion.div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-2">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="h-9 w-9 rounded-lg bg-secondary/50 border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all disabled:opacity-30"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`h-9 w-9 rounded-lg text-sm font-medium transition-all ${
                        page === p
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary/50 border border-border text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="h-9 w-9 rounded-lg bg-secondary/50 border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all disabled:opacity-30"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}

              {/* Best ride reasoning */}
              <div className="flex items-start gap-3 p-4 rounded-xl bg-primary/10 border border-primary/20">
                <Leaf className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div className="text-sm text-muted-foreground">
                  <span className="text-foreground font-semibold">{result.best_ride}</span> — {result.reasoning}
                </div>
              </div>

              {/* JSON toggle */}
              <button
                onClick={() => setShowJson(!showJson)}
                className="w-full py-2.5 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all"
              >
                {showJson ? "Hide" : "Show"} JSON Output
              </button>

              {showJson && <JsonOutput result={result} />}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer note */}
        <p className="text-center text-xs text-muted-foreground pt-4 pb-8">
          Geo-constrained to Jabalpur, Madhya Pradesh · All data simulated · No external APIs
        </p>
      </main>
    </div>
  );
};

export default JabalpurRides;
