import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import axios from '../api/axios.js';

// Static imports for product front images (Vite bundles these correctly at build time)
import monarchFront from "@/assets/products/monarch/front.jpg";
import visionaryFront from "@/assets/products/visionary/front.jpg";
import enigmaFront from "@/assets/products/enigma/front.jpg";
import classicFront from "@/assets/products/classic/front.jpg";
import armaniHero from "@/assets/products/armani/hero.jpg";
import oakleySportFront from "@/assets/products/oakley-sport/front.png";
import carreraRoundFront from "@/assets/products/carrera-round/front.jpg";
import lacosteSquareFront from "@/assets/products/lacoste-square/front.jpg";
import celineOvalFront from "@/assets/products/celine-oval/front.jpg";
import marcJacobsFront from "@/assets/products/marc-jacobs-geometric/front.jpg";
import montBlancFront from "@/assets/products/mont-blanc-frame/front.jpg";
import pradaPremiumFront from "@/assets/products/prada-premium-sunglasses/front.jpg";
import louisVuittonLadiesFront from "@/assets/products/louis-vuitton-ladies/front.png";
import moscotBlackGreyFront from "@/assets/products/moscot-black-grey/front.jpg";
import moscotBrownTransparentFront from "@/assets/products/moscot-brown-transparent/front.jpg";
import davidBeckhamFront from "@/assets/products/david-beckham/front.jpg";
import bmwFront from "@/assets/products/bmw/front.jpg";
import radoFront from "@/assets/products/watches/rado/front.jpg";
import jacobCoBlackFront from "@/assets/products/watches/jacob-co-black/front.png";
import jacobCoBrownFront from "@/assets/products/watches/jacob-co-brown/front.png";
import vacheronConstantinFront from "@/assets/products/watches/vacheron-constantin/front.png";
import rado2Front from "@/assets/products/watches/rado2/front.png";
import sevenfridayFront from "@/assets/products/watches/sevenfriday/front.png";
import bugattiFront from "@/assets/products/watches/bugatti/front.png";
import tissotFront from "@/assets/products/watches/tissot/front.png";
import cartierPanthereFront from "@/assets/products/cartier-panthere/front.jpg";
import cartierPanthereSilverFront from "@/assets/products/cartier-panthere-silver/front.jpg";
import cartierPanthereBrownFront from "@/assets/products/cartier-panthere-brown/front.jpg";
import pradaMilanoFront from "@/assets/products/prada-milano/front.jpg";
import raybanClassicFront from "@/assets/products/rayban-classic/front.jpg";
import raybanTransparentFront from "@/assets/products/rayban-transparent/front.jpg";
import raybanHavanaFront from "@/assets/products/rayban-havana/front.jpg";
import lvAfternoonSwimFront from "@/assets/products/perfumes/lv-afternoon-swim/front.jpg";
import lvPacificChillFront from "@/assets/products/perfumes/lv-pacific-chill/front.jpg";
import lvOmbreNomadeFront from "@/assets/products/perfumes/lv-ombre-nomade/front.jpg";
import lvPurOudFront from "@/assets/products/perfumes/lv-pur-oud/front.jpg";
import ttTeleaFront from "@/assets/products/perfumes/tiziana-terenzi-telea/front.jpg";
import ttOrzaFront from "@/assets/products/perfumes/tiziana-terenzi-orza/front.jpg";
import ttHalleyFront from "@/assets/products/perfumes/tiziana-terenzi-halley/front.jpg";
import ttHaleBoppFront from "@/assets/products/perfumes/tiziana-terenzi-hale-bopp/front.jpg";
import initioOudForGreatnessFront from "@/assets/products/perfumes/initio-oud-for-greatness/front.jpg";
import bdkCitrusRivieraFront from "@/assets/products/perfumes/bdk-citrus-riviera/front.jpg";
import amouageReasonsFront from "@/assets/products/perfumes/amouage-reasons/front.jpg";
import cliveChristianNo1Front from "@/assets/products/perfumes/clive-christian-no1/front.jpg";
import amouageLustreFront from "@/assets/products/perfumes/amouage-lustre/front.jpg";
import mkSexyRubyFront from "@/assets/products/perfumes/michael-kors-sexy-ruby/front.jpg";
import cliveChristianXFront from "@/assets/products/perfumes/clive-christian-x/front.jpg";
import rojaElysiumFront from "@/assets/products/perfumes/roja-elysium/front.jpg";
import cliveChristian1872Front from "@/assets/products/perfumes/clive-christian-1872/front.jpg";
import amouageInterludeFront from "@/assets/products/perfumes/amouage-interlude/front.jpg";
import amouageOutlandsFront from "@/assets/products/perfumes/amouage-outlands/front.jpg";
import bdkTabacRoseFront from "@/assets/products/perfumes/bdk-tabac-rose/front.jpg";
import kajalDahabFront from "@/assets/products/perfumes/kajal-dahab/front.jpg";
import liquidesImaginairesBeteHumaineFront from "@/assets/products/perfumes/liquides-imaginaires-bete-humaine/front.jpg";
import rojaLakmeFront from "@/assets/products/perfumes/roja-lakme/front.jpg";
import pdmCassiliFront from "@/assets/products/perfumes/pdm-cassili/front.jpg";
import kayaliBurningCherryFront from "@/assets/products/perfumes/kayali-burning-cherry/front.jpg";
import nishaneKaragozFront from "@/assets/products/perfumes/nishane-karagoz/front.jpg";
import nishaneVainNaiveFront from "@/assets/products/perfumes/nishane-vain-naive/front.jpg";
import pdmPegasusFront from "@/assets/products/perfumes/pdm-pegasus/front.jpg";
import pdmNiseanFront from "@/assets/products/perfumes/pdm-nisean/front.jpg";
import nishaneFavoniusFront from "@/assets/products/perfumes/nishane-favonius/front.jpg";
import kayaliTobaccoOudFront from "@/assets/products/perfumes/kayali-tobacco-oud/front.jpg";
import nishaneAfrikaOlifantFront from "@/assets/products/perfumes/nishane-afrika-olifant/front.jpg";
import pdmOrianaFront from "@/assets/products/perfumes/pdm-oriana/front.jpg";
import kobeFront from "@/assets/products/shoes/kobe-af1-yellow/img1.jpg";
import bossBootsFront from "@/assets/products/shoes/boss-black-boots/img1.jpg";

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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
                <div className="aspect-square overflow-hidden shrink-0 bg-white/5 flex items-center justify-center p-4">
                  <img
                    src={product.images && product.images.length > 0 ? product.images[0].url : (productFrontImages[product.id] ?? product.angles?.[0]?.image)}
                    alt={product.name}
                    loading="lazy"
                    width={800}
                    height={1000}
                    className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="p-5 flex flex-col flex-grow">
                  <p className="font-body text-xs tracking-[0.3em] uppercase text-primary mb-1">
                    {product.type}
                  </p>
                  <h3 className="font-display text-xl text-foreground mb-2">
                    {product.name}
                  </h3>
                  <p className="font-body text-sm text-muted-foreground mt-auto">
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
