import { motion } from "framer-motion";
import heroImage from "@/assets/hero-glasses.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Near Plat luxury eyewear"
          className="w-full h-full object-cover"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-background/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto pt-20">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-body text-xs md:text-sm tracking-[0.4em] uppercase text-primary mb-6"
        >
          Luxury Eyewear & Lifestyle
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="font-display text-5xl md:text-7xl lg:text-8xl font-semibold leading-[0.95] mb-8"
        >
          <span className="text-foreground">See the World</span>
          <br />
          <span className="text-gold-gradient">Through Near Plat</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="font-body text-muted-foreground text-base md:text-lg max-w-xl mx-auto mb-12 leading-relaxed"
        >
          Handcrafted eyewear, curated fashion, and signature fragrances — 
          designed for those who define their own style.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="#collections"
            className="bg-gold-shimmer text-primary-foreground font-body text-sm tracking-widest uppercase px-10 py-4 hover-gold-glow transition-all duration-500"
          >
            Explore Collection
          </a>
          <a
            href="#order"
            className="border border-primary/30 text-foreground font-body text-sm tracking-widest uppercase px-10 py-4 hover:bg-primary/10 transition-all duration-300"
          >
            Book a Piece
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="w-px h-12 bg-gradient-to-b from-primary/60 to-transparent"
        />
      </motion.div>
    </section>
  );
};

export default Hero;
