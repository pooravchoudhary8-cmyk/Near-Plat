import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeaturedCollection from "@/components/FeaturedCollection";
import Categories from "@/components/Categories";
import BrandStory from "@/components/BrandStory";
import OrderForm from "@/components/OrderForm";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet-async";

import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const Index = () => {
  const location = useLocation();
  const isRestoringRef = useRef(false);

  // We store the restored scroll position here so we can scroll to it after rendering
  const restoreScrollY = useRef(null);

  const [selectedCategory, setSelectedCategory] = useState(() => {
    const savedState = sessionStorage.getItem(`indexState-${location.key}`);
    if (savedState) {
      isRestoringRef.current = true;
      const parsed = JSON.parse(savedState);
      restoreScrollY.current = parsed.scrollY;
      return parsed.category;
    }
    return "eyewear";
  });

  useEffect(() => {
    const saveState = () => {
      // Don't save if we are currently in the middle of restoring!
      // Once we scroll to the restored position, we will allow saving again.
      if (isRestoringRef.current) return;
      
      sessionStorage.setItem(`indexState-${location.key}`, JSON.stringify({
        category: selectedCategory,
        scrollY: window.scrollY
      }));
    };

    saveState();

    let timeoutId;
    const handleScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(saveState, 100);
    };

    const handleBeforeUnload = () => {
      sessionStorage.removeItem(`indexState-${location.key}`);
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      clearTimeout(timeoutId);
    };
  }, [selectedCategory, location.key]);

  useEffect(() => {
    if (isRestoringRef.current && restoreScrollY.current !== null) {
      // Wait a tiny bit for the DOM to render the products grid
      setTimeout(() => {
        window.scrollTo({ top: restoreScrollY.current, behavior: "instant" });
        // After restoring, we can allow saving state again
        isRestoringRef.current = false;
      }, 100);
    } else {
      window.scrollTo(0, 0);
      isRestoringRef.current = false;
    }
  }, [location.key]);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Near Plat | Premium Luxury Eyewear & Accessories</title>
        <meta name="description" content="Discover the ultimate collection of premium sunglasses, optical frames, fragrances, and luxury watches at Near Plat." />
      </Helmet>
      <Navbar />
      <Hero />
      <FeaturedCollection selectedCategory={selectedCategory} />
      <Categories selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
      <BrandStory />
      <OrderForm />
      <Footer />
    </div>
  );
};

export default Index;
