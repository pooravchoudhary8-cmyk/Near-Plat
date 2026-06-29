import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User, ShoppingCart, Heart } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { useWishlist } from "../context/WishlistContext.jsx";
import { useCurrency } from "../context/CurrencyContext.jsx";

const navLinks = [
  { label: "Collections", href: "/#collections" },
  { label: "Categories", href: "/#categories" },
  { label: "About", href: "/#about" },
  { label: "Book Now", href: "/#order" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { cart } = useCart();
  const { user, logout } = useAuth();
  const { currency, setCurrency, currencies } = useCurrency();
  const { wishlist } = useWishlist();
  const cartItemCount = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between h-20">
        <Link to="/" className="font-display text-2xl md:text-3xl tracking-wider text-primary">
          NEAR PLAT
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="font-body text-sm tracking-widest uppercase text-muted-foreground hover:text-primary transition-colors duration-300"
            >
              {link.label}
            </a>
          ))}
          <div className="flex items-center gap-6 border-l border-border pl-6">
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="bg-transparent border-none text-foreground font-body text-xs outline-none cursor-pointer hover:text-primary transition-colors"
            >
              {currencies.map(c => (
                <option key={c} value={c} className="bg-background">{c}</option>
              ))}
            </select>
            <Link to="/wishlist" className="text-muted-foreground hover:text-primary transition-colors relative">
              <Heart size={20} />
              {wishlist?.products?.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                  {wishlist.products.length}
                </span>
              )}
            </Link>
            <Link to="/cart" className="text-muted-foreground hover:text-primary transition-colors relative">
              <ShoppingCart size={20} />
              {cart?.items?.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                  {cart.items.reduce((a, c) => a + c.quantity, 0)}
                </span>
              )}
            </Link>
            <Link
              to={user ? "/profile" : "/login"}
              className="flex items-center gap-2 font-body text-sm tracking-widest uppercase text-muted-foreground hover:text-primary transition-colors duration-300 ml-2"
            >
              <User size={18} />
              {user ? "Profile" : "Login"}
            </Link>
          </div>
        </div>

        {/* Mobile toggle */}
        <div className="flex items-center gap-4 md:hidden">
          <Link to={user ? "/profile" : "/login"} className="text-foreground hover:text-primary">
            <User size={24} />
          </Link>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-foreground"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background border-b border-border overflow-hidden"
          >
            <div className="px-6 py-8 flex flex-col gap-6">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="font-body text-lg tracking-widest uppercase text-muted-foreground hover:text-primary transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
