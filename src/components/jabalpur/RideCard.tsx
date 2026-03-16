import { Car, Bike, Leaf, ExternalLink } from "lucide-react";
import { EvaluatedRide, VehicleType } from "@/lib/jabalpur";
import { getBookingLink, hasBookingLink, DeepLinkParams } from "@/lib/deeplinks";

interface RideCardProps {
  ride: EvaluatedRide;
  isBest: boolean;
  rank: number;
  deepLinkParams?: DeepLinkParams;
}

const vehicleIcons: Record<VehicleType, React.ReactNode> = {
  car: <Car className="h-4 w-4" />,
  auto: <Car className="h-4 w-4" />,
  bike: <Bike className="h-4 w-4" />,
};

const vehicleColors: Record<VehicleType, string> = {
  car: "bg-primary/20 text-primary",
  auto: "bg-amber-500/20 text-amber-400",
  bike: "bg-emerald-500/20 text-emerald-400",
};

const RideCard = ({ ride, isBest, rank, deepLinkParams }: RideCardProps) => (
  <div className={`flex items-center justify-between p-4 rounded-xl transition-all ${
    isBest
      ? "bg-primary/10 border border-primary/30 ring-1 ring-primary/20"
      : "bg-secondary/30 border border-transparent hover:border-border"
  }`}>
    <div className="flex items-center gap-3 min-w-0">
      <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${vehicleColors[ride.vehicle_type]}`}>
        {vehicleIcons[ride.vehicle_type]}
      </div>
      <div className="min-w-0">
        <div className="font-medium text-foreground flex items-center gap-2 flex-wrap">
          <span className="truncate">{ride.provider}</span>
          {isBest && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary text-primary-foreground font-semibold uppercase tracking-wider shrink-0">
              Best
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
          <span>{ride.eta_minutes} min ETA</span>
          <span className="flex items-center gap-1">
            <Leaf className="h-3 w-3 text-emerald-400" />
            {ride.carbon_emission_g}g CO₂
          </span>
        </div>
      </div>
    </div>
      <div className="text-right shrink-0 ml-3 flex flex-col items-end gap-1">
      <div className={`font-display text-lg font-bold ${isBest ? "text-primary" : "text-foreground"}`}>
        ₹{ride.adjusted_price}
      </div>
      {ride.adjusted_price !== ride.original_price && (
        <div className="text-xs text-muted-foreground line-through">₹{ride.original_price}</div>
      )}
      <div className="text-[10px] text-muted-foreground">Score: {ride.score}</div>
      {deepLinkParams && hasBookingLink(ride.provider) && (
        <a
          href={getBookingLink(ride.provider, deepLinkParams) || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity mt-0.5"
        >
          Book <ExternalLink className="h-3 w-3" />
        </a>
      )}
    </div>
  </div>
);

export default RideCard;
