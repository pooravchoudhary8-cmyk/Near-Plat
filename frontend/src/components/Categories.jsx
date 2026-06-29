import { motion } from "framer-motion";
import categoryClothing from "@/assets/category-clothing.jpg";
import categoryShoes from "@/assets/category-shoes.jpg";
import categoryPerfume from "@/assets/category-perfume.jpg";
import heroGlasses from "@/assets/hero-glasses.jpg";
import categoryWatches from "@/assets/products/watches/rado/front.jpg";

const categories = [
  {
    id: "eyewear",
    name: "Eyewear",
    tagline: "Our signature collection",
    image: heroGlasses,
    span: "lg:col-span-2 lg:row-span-2",
    aspect: "aspect-square lg:aspect-auto lg:h-full",
  },
  {
    id: "clothing",
    name: "Clothing",
    tagline: "Minimal. Bold. Near Plat.",
    image: categoryClothing,
    span: "",
    aspect: "aspect-[4/3]",
  },
  {
    id: "shoes",
    name: "Shoes",
    tagline: "Walk with confidence",
    image: categoryShoes,
    span: "",
    aspect: "aspect-[4/3]",
  },
  {
    id: "perfumes",
    name: "Perfumes",
    tagline: "Scent of mystery",
    image: categoryPerfume,
    span: "lg:col-span-2",
    aspect: "aspect-[2/1] lg:aspect-[3/1]",
  },
  {
    id: "watches",
    name: "Watches",
    tagline: "Timeless elegance",
    image: categoryWatches,
    span: "lg:col-span-2 lg:col-start-2",
    aspect: "aspect-[2/1] lg:aspect-[3/1]",
  },
];

const Categories = ({ selectedCategory, setSelectedCategory }) => {
  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
    // Smooth scroll to collections
    const element = document.getElementById("collections");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="categories" className="section-padding bg-noir-gradient">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="font-body text-xs tracking-[0.4em] uppercase text-primary mb-4">
            Beyond Eyewear
          </p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground">
            Shop by Category
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {categories.map((cat, index) => (
            <motion.div
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`group relative overflow-hidden cursor-pointer ${cat.span} ${
                selectedCategory === cat.id ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : ""
              }`}
            >
              <div className={`relative ${cat.aspect} overflow-hidden`}>
                <img
                  src={cat.image}
                  alt={cat.name}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className={`absolute inset-0 transition-colors duration-500 ${
                  selectedCategory === cat.id ? "bg-background/20" : "bg-background/50 group-hover:bg-background/30"
                }`} />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                  <p className={`font-body text-xs tracking-[0.3em] uppercase mb-2 transition-colors duration-300 ${
                    selectedCategory === cat.id ? "text-primary" : "text-primary/80 group-hover:text-primary"
                  }`}>
                    {cat.tagline}
                  </p>
                  <h3 className={`font-display text-3xl md:text-4xl transition-colors duration-300 ${
                    selectedCategory === cat.id ? "text-primary" : "text-foreground"
                  }`}>
                    {cat.name}
                  </h3>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 flex justify-center"
        >
          <button
            onClick={() => handleCategoryClick("all")}
            className={`px-8 py-3 border border-primary font-body text-sm tracking-widest uppercase transition-all duration-300 ${
              selectedCategory === "all"
                ? "bg-primary text-primary-foreground"
                : "bg-transparent text-primary hover:bg-primary/10"
            }`}
          >
            All Products
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default Categories;
