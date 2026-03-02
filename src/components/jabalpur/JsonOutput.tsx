import { RideResult } from "@/lib/jabalpur";
import { Copy, Check } from "lucide-react";
import { useState } from "react";

interface JsonOutputProps {
  result: RideResult;
}

const JsonOutput = ({ result }: JsonOutputProps) => {
  const [copied, setCopied] = useState(false);

  const jsonStr = JSON.stringify({
    city: result.city,
    state: result.state,
    surge_multiplier: result.surge_multiplier,
    evaluated_rides: result.evaluated_rides.map(r => ({
      provider: r.provider,
      adjusted_price: r.adjusted_price,
      eta_minutes: r.eta_minutes,
      score: r.score,
      carbon_emission_g: r.carbon_emission_g,
    })),
    best_ride: result.best_ride,
    reasoning: result.reasoning,
    notes: result.notes,
  }, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonStr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl bg-secondary/30 border border-border overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-secondary/50">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">JSON Output</span>
        <button onClick={handleCopy} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
          {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="p-4 text-xs text-foreground/80 overflow-x-auto max-h-80 overflow-y-auto font-mono leading-relaxed">
        {jsonStr}
      </pre>
    </div>
  );
};

export default JsonOutput;
