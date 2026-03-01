import { motion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";

const CtaSection = () => {
  return (
    <section id="download" className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
      <div className="container mx-auto px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center space-y-8"
        >
          <div className="flex items-center justify-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-5 w-5 fill-primary text-primary" />
            ))}
            <span className="ml-2 text-muted-foreground text-sm">4.8 rating · 100K+ downloads</span>
          </div>

          <h2 className="font-display text-4xl md:text-5xl font-bold">
            Start Saving on <span className="text-primary">Every Ride</span>
          </h2>

          <p className="text-lg text-muted-foreground max-w-lg mx-auto">
            Join lakhs of smart riders across India. Download Swaft X and never overpay for a ride again.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-primary text-primary-foreground font-display font-semibold text-lg hover:opacity-90 transition-all glow-primary"
            >
              Download Free
              <ArrowRight className="h-5 w-5" />
            </a>
          </div>

          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <span>✓ No signup needed</span>
            <span>✓ 100% free</span>
            <span>✓ No data stored</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CtaSection;
