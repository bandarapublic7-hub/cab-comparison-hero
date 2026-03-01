import { motion } from "framer-motion";
import { useState } from "react";
import { MapPin, Navigation, Bike, Car, TrendingDown } from "lucide-react";

type RideType = "auto" | "bike" | "cab";

const rideData: Record<RideType, { service: string; price: number; eta: string; color: string }[]> = {
  auto: [
    { service: "Namma Yatri", price: 89, eta: "3 min", color: "bg-emerald-500" },
    { service: "Rapido", price: 95, eta: "4 min", color: "bg-amber-400" },
    { service: "Ola", price: 112, eta: "5 min", color: "bg-amber-500" },
    { service: "Uber", price: 125, eta: "6 min", color: "bg-foreground" },
  ],
  bike: [
    { service: "Rapido", price: 45, eta: "2 min", color: "bg-amber-400" },
    { service: "Uber Moto", price: 52, eta: "4 min", color: "bg-foreground" },
    { service: "Ola Bike", price: 55, eta: "5 min", color: "bg-amber-500" },
    { service: "Namma Yatri", price: 48, eta: "3 min", color: "bg-emerald-500" },
  ],
  cab: [
    { service: "Ola", price: 245, eta: "5 min", color: "bg-amber-500" },
    { service: "Uber", price: 260, eta: "4 min", color: "bg-foreground" },
    { service: "Rapido", price: 230, eta: "6 min", color: "bg-amber-400" },
    { service: "Namma Yatri", price: 215, eta: "7 min", color: "bg-emerald-500" },
  ],
};

const FareComparison = () => {
  const [rideType, setRideType] = useState<RideType>("auto");

  const rides = [...rideData[rideType]].sort((a, b) => a.price - b.price);
  const cheapest = rides[0].price;
  const mostExpensive = rides[rides.length - 1].price;
  const savings = mostExpensive - cheapest;

  const rideTypes: { key: RideType; label: string; icon: React.ReactNode }[] = [
    { key: "auto", label: "Auto", icon: <Car className="h-4 w-4" /> },
    { key: "bike", label: "Bike", icon: <Bike className="h-4 w-4" /> },
    { key: "cab", label: "Cab", icon: <Car className="h-4 w-4" /> },
  ];

  return (
    <section id="compare" className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />
      <div className="container mx-auto px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Real-Time Fare <span className="text-primary">Comparison</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            See exactly how much you save on every ride. No hidden fees, no surprises.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-lg mx-auto"
        >
          <div className="glass rounded-2xl p-6 space-y-6">
            {/* Location inputs */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50">
                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <MapPin className="h-4 w-4 text-primary" />
                </div>
                <div className="text-sm">
                  <div className="text-muted-foreground text-xs">Pickup</div>
                  <div className="text-foreground font-medium">Koramangala, Bengaluru</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50">
                <div className="h-8 w-8 rounded-full bg-destructive/20 flex items-center justify-center">
                  <Navigation className="h-4 w-4 text-destructive" />
                </div>
                <div className="text-sm">
                  <div className="text-muted-foreground text-xs">Drop</div>
                  <div className="text-foreground font-medium">Indiranagar, Bengaluru</div>
                </div>
              </div>
            </div>

            {/* Ride type tabs */}
            <div className="flex gap-2 p-1 rounded-xl bg-secondary/50">
              {rideTypes.map((type) => (
                <button
                  key={type.key}
                  onClick={() => setRideType(type.key)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    rideType === type.key
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {type.icon}
                  {type.label}
                </button>
              ))}
            </div>

            {/* Fare cards */}
            <div className="space-y-3">
              {rides.map((ride, i) => (
                <motion.div
                  key={ride.service}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className={`flex items-center justify-between p-4 rounded-xl transition-all ${
                    i === 0
                      ? "bg-primary/10 border border-primary/30"
                      : "bg-secondary/30 border border-transparent hover:border-border"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-full ${ride.color} opacity-90 flex items-center justify-center`}>
                      <span className="text-xs font-bold text-background">
                        {ride.service.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-foreground flex items-center gap-2">
                        {ride.service}
                        {i === 0 && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary text-primary-foreground font-semibold uppercase tracking-wider">
                            Best
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">{ride.eta} away</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-display text-lg font-bold ${i === 0 ? "text-primary" : "text-foreground"}`}>
                      ₹{ride.price}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Savings banner */}
            <div className="flex items-center gap-3 p-4 rounded-xl bg-primary/10 border border-primary/20">
              <TrendingDown className="h-5 w-5 text-primary" />
              <div className="text-sm">
                <span className="text-muted-foreground">You save up to </span>
                <span className="text-primary font-display font-bold text-lg">₹{savings}</span>
                <span className="text-muted-foreground"> with Buyhatke</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FareComparison;
