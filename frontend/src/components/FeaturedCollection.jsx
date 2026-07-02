import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import axios from '../api/axios.js';

// Static imports for product front images (Vite bundles these correctly at build time)
const monarchFront = "/products/monarch/front.jpg";
const visionaryFront = "/products/visionary/front.jpg";
const enigmaFront = "/products/enigma/front.jpg";
const classicFront = "/products/classic/front.jpg";
const armaniHero = "/products/armani/hero.jpg";
const oakleySportFront = "/products/oakley-sport/front.png";
const carreraRoundFront = "/products/carrera-round/front.jpg";
const lacosteSquareFront = "/products/lacoste-square/front.jpg";
const celineOvalFront = "/products/celine-oval/front.jpg";
const marcJacobsFront = "/products/marc-jacobs-geometric/front.jpg";
const montBlancFront = "/products/mont-blanc-frame/front.jpg";
const pradaPremiumFront = "/products/prada-premium-sunglasses/front.jpg";
const louisVuittonLadiesFront = "/products/louis-vuitton-ladies/front.png";
const moscotBlackGreyFront = "/products/moscot-black-grey/front.jpg";
const moscotBrownTransparentFront = "/products/moscot-brown-transparent/front.jpg";
const davidBeckhamFront = "/products/david-beckham/front.jpg";
const bmwFront = "/products/bmw/front.jpg";
const radoFront = "/products/watches/rado/front.jpg";
const jacobCoBlackFront = "/products/watches/jacob-co-black/front.png";
const jacobCoBrownFront = "/products/watches/jacob-co-brown/front.png";
const vacheronConstantinFront = "/products/watches/vacheron-constantin/front.png";
const rado2Front = "/products/watches/rado2/front.png";
const sevenfridayFront = "/products/watches/sevenfriday/front.png";
const bugattiFront = "/products/watches/bugatti/front.png";
const tissotFront = "/products/watches/tissot/front.png";
const cartierPanthereFront = "/products/cartier-panthere/front.jpg";
const cartierPanthereSilverFront = "/products/cartier-panthere-silver/front.jpg";
const cartierPanthereBrownFront = "/products/cartier-panthere-brown/front.jpg";
const pradaMilanoFront = "/products/prada-milano/front.jpg";
const raybanClassicFront = "/products/rayban-classic/front.jpg";
const raybanTransparentFront = "/products/rayban-transparent/front.jpg";
const raybanHavanaFront = "/products/rayban-havana/front.jpg";
const lvAfternoonSwimFront = "/products/perfumes/lv-afternoon-swim/front.jpg";
const lvPacificChillFront = "/products/perfumes/lv-pacific-chill/front.jpg";
const lvOmbreNomadeFront = "/products/perfumes/lv-ombre-nomade/front.jpg";
const lvPurOudFront = "/products/perfumes/lv-pur-oud/front.jpg";
const ttTeleaFront = "/products/perfumes/tiziana-terenzi-telea/front.jpg";
const ttOrzaFront = "/products/perfumes/tiziana-terenzi-orza/front.jpg";
const ttHalleyFront = "/products/perfumes/tiziana-terenzi-halley/front.jpg";
const ttHaleBoppFront = "/products/perfumes/tiziana-terenzi-hale-bopp/front.jpg";
const initioOudForGreatnessFront = "/products/perfumes/initio-oud-for-greatness/front.jpg";
const bdkCitrusRivieraFront = "/products/perfumes/bdk-citrus-riviera/front.jpg";
const amouageReasonsFront = "/products/perfumes/amouage-reasons/front.jpg";
const cliveChristianNo1Front = "/products/perfumes/clive-christian-no1/front.jpg";
const amouageLustreFront = "/products/perfumes/amouage-lustre/front.jpg";
const mkSexyRubyFront = "/products/perfumes/michael-kors-sexy-ruby/front.jpg";
const cliveChristianXFront = "/products/perfumes/clive-christian-x/front.jpg";
const rojaElysiumFront = "/products/perfumes/roja-elysium/front.jpg";
const cliveChristian1872Front = "/products/perfumes/clive-christian-1872/front.jpg";
const amouageInterludeFront = "/products/perfumes/amouage-interlude/front.jpg";
const amouageOutlandsFront = "/products/perfumes/amouage-outlands/front.jpg";
const bdkTabacRoseFront = "/products/perfumes/bdk-tabac-rose/front.jpg";
const kajalDahabFront = "/products/perfumes/kajal-dahab/front.jpg";
const liquidesImaginairesBeteHumaineFront = "/products/perfumes/liquides-imaginaires-bete-humaine/front.jpg";
const rojaLakmeFront = "/products/perfumes/roja-lakme/front.jpg";
const pdmCassiliFront = "/products/perfumes/pdm-cassili/front.jpg";
const kayaliBurningCherryFront = "/products/perfumes/kayali-burning-cherry/front.jpg";
const nishaneKaragozFront = "/products/perfumes/nishane-karagoz/front.jpg";
const nishaneVainNaiveFront = "/products/perfumes/nishane-vain-naive/front.jpg";
const pdmPegasusFront = "/products/perfumes/pdm-pegasus/front.jpg";
const pdmNiseanFront = "/products/perfumes/pdm-nisean/front.jpg";
const nishaneFavoniusFront = "/products/perfumes/nishane-favonius/front.jpg";
const kayaliTobaccoOudFront = "/products/perfumes/kayali-tobacco-oud/front.jpg";
const nishaneAfrikaOlifantFront = "/products/perfumes/nishane-afrika-olifant/front.jpg";
const pdmOrianaFront = "/products/perfumes/pdm-oriana/front.jpg";
const kobeFront = "/products/shoes/kobe-af1-yellow/img1.jpg";
const bossBootsFront = "/products/shoes/boss-black-boots/img1.jpg";

// Maps product id to its Vite-bundled front image import
const productFrontImages = {
  1: monarchFront,
  2: visionaryFront,
  3: enigmaFront,
  4: classicFront,
  5: armaniHero,
  6: oakleySportFront,
  7: carreraRoundFront,
  8: lacosteSquareFront,
  9: celineOvalFront,
  10: marcJacobsFront,
  11: montBlancFront,
  12: pradaPremiumFront,
  13: louisVuittonLadiesFront,
  14: moscotBlackGreyFront,
  15: moscotBrownTransparentFront,
  16: davidBeckhamFront,
  17: bmwFront,
  18: radoFront,
  19: jacobCoBlackFront,
  20: jacobCoBrownFront,
  21: vacheronConstantinFront,
  22: sevenfridayFront,
  23: rado2Front,
  24: bugattiFront,
  25: tissotFront,
  26: cartierPanthereFront,
  27: cartierPanthereSilverFront,
  28: cartierPanthereBrownFront,
  29: pradaMilanoFront,
  30: raybanClassicFront,
  31: raybanTransparentFront,
  32: raybanHavanaFront,
  33: lvAfternoonSwimFront,
  34: lvPacificChillFront,
  35: lvOmbreNomadeFront,
  36: lvPurOudFront,
  37: ttTeleaFront,
  38: ttOrzaFront,
  39: ttHalleyFront,
  40: ttHaleBoppFront,
  41: initioOudForGreatnessFront,
  42: bdkCitrusRivieraFront,
  43: amouageReasonsFront,
  44: cliveChristianNo1Front,
  45: amouageLustreFront,
  46: mkSexyRubyFront,
  47: cliveChristianXFront,
  48: rojaElysiumFront,
  49: cliveChristian1872Front,
  50: amouageInterludeFront,
  51: amouageOutlandsFront,
  52: bdkTabacRoseFront,
  53: kajalDahabFront,
  54: liquidesImaginairesBeteHumaineFront,
  55: rojaLakmeFront,
  56: pdmCassiliFront,
  57: kayaliBurningCherryFront,
  58: nishaneKaragozFront,
  59: nishaneVainNaiveFront,
  60: pdmPegasusFront,
  61: pdmNiseanFront,
  62: nishaneFavoniusFront,
  63: kayaliTobaccoOudFront,
  64: nishaneAfrikaOlifantFront,
  65: pdmOrianaFront,
  82: kobeFront,
  83: bossBootsFront,
};

import { useQuery } from "@tanstack/react-query";
import { useCurrency } from "../context/CurrencyContext.jsx";

const FeaturedCollection = ({ selectedCategory }) => {
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();

  const [sortOrder, setSortOrder] = useState("newest");

  const { data, isLoading, error } = useQuery({
    queryKey: ['products', sortOrder],
    queryFn: async () => {
      const res = await axios.get(`/products?pageSize=100&sort=${sortOrder}`);
      return res.data;
    }
  });

  const products = data?.products || [];

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((product) => product.category?.slug === selectedCategory);

  const getCategoryTitle = () => {
    switch (selectedCategory) {
      case "eyewear":
        return "Featured Eyewear";
      case "clothing":
        return "Featured Clothing";
      case "shoes":
        return "Featured Shoes";
      case "perfumes":
        return "Featured Perfumes";
      case "watches":
        return "Featured Watches";
      default:
        return "Featured Products";
    }
  };

  const renderProductGrid = (prods) => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-24">
          <p className="text-muted-foreground text-lg tracking-widest uppercase">Loading luxury collections...</p>
        </div>
      );
    }
    if (error) {
      return (
        <div className="flex justify-center items-center py-24">
          <p className="text-destructive text-lg tracking-widest uppercase">Failed to load collections.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-4 gap-1.5 md:gap-6">
        <AnimatePresence mode="popLayout">
          {prods.map((product, index) => (
            <motion.div
              key={product._id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              onClick={() => navigate(`/product/${product._id}`)}
              style={{ cursor: "pointer" }}
              className="group h-full"
            >
              <div className="relative overflow-hidden bg-card border border-border hover-gold-glow transition-all duration-500 h-full flex flex-col">
                <div className="aspect-square overflow-hidden shrink-0 bg-white/5 flex items-center justify-center p-1 md:p-4">
                  <img
                    src={product.images && product.images.length > 0 ? product.images[0].url : (productFrontImages[product.id] ?? product.angles?.[0]?.image)}
                    alt={product.name}
                    loading="lazy"
                    width={800}
                    height={1000}
                    className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="p-1.5 md:p-5 flex flex-col flex-grow">
                  <p className="font-body text-[8px] md:text-xs tracking-wider md:tracking-[0.3em] uppercase text-primary mb-0.5 md:mb-1 truncate">
                    {product.type}
                  </p>
                  <h3 className="font-display text-[10px] md:text-xl leading-tight md:leading-normal text-foreground mb-0.5 md:mb-2 truncate md:whitespace-normal">
                    {product.name}
                  </h3>
                  <p className="font-body text-[9px] md:text-sm text-muted-foreground mt-auto">
                    {formatPrice(product.price)}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <section id="collections" className="section-padding bg-background min-h-[600px]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          key={selectedCategory}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row justify-between items-center mb-16"
        >
          <div className="text-left mb-6 md:mb-0">
            <p className="font-body text-xs tracking-[0.4em] uppercase text-primary mb-4">
              Signature Series
            </p>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground capitalize">
              {getCategoryTitle()}
            </h2>
          </div>
          
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="bg-transparent border border-border p-3 font-body text-sm text-foreground focus:border-primary outline-none cursor-pointer"
          >
            <option value="newest">Newest Arrivals</option>
            <option value="lowest">Price: Low to High</option>
            <option value="highest">Price: High to Low</option>
            <option value="toprated">Top Rated</option>
          </select>
        </motion.div>

        {renderProductGrid(filteredProducts)}
        
        {!isLoading && !error && filteredProducts.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 text-muted-foreground"
          >
            <p className="text-xl">New collection coming soon.</p>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default FeaturedCollection;
