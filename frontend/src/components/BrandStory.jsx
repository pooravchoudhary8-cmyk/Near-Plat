import { motion } from "framer-motion";

const stats = [
  { number: "500+", label: "Designs Crafted" },
  { number: "10K+", label: "Happy Customers" },
  { number: "25+", label: "Cities Reached" },
  { number: "100%", label: "Handcrafted" },
];

const BrandStory = () => {
  return (
    <section id="about" className="section-padding bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <p className="font-body text-xs tracking-[0.4em] uppercase text-primary mb-4">
              Our Philosophy
            </p>
            <h2 className="font-display text-4xl md:text-5xl text-foreground mb-8 leading-tight">
              Crafted for Those Who{" "}
              <span className="text-gold-gradient italic">Dare to Stand Out</span>
            </h2>
            <div className="space-y-5 text-muted-foreground font-body leading-relaxed">
              <p>
                Near Plat was born from a singular vision — to create eyewear and lifestyle 
                pieces that don't just follow trends, but define them. Every frame is a statement. 
                Every piece is a conversation.
              </p>
              <p>
                From our signature sunglasses to our curated collection of apparel, shoes, and 
                fragrances, we believe luxury should be accessible without compromise. Each product 
                is crafted with obsessive attention to detail, blending timeless design with 
                contemporary edge.
              </p>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-2 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                className="border border-border p-8 text-center hover-gold-glow transition-all duration-500"
              >
                <p className="font-display text-3xl md:text-4xl text-gold-gradient mb-2">
                  {stat.number}
                </p>
                <p className="font-body text-xs tracking-[0.2em] uppercase text-muted-foreground">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BrandStory;
