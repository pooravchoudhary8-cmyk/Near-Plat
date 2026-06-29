import { Instagram, Facebook, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-background border-t border-border py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <h3 className="font-display text-2xl text-primary mb-4">NEAR PLAT</h3>
            <p className="font-body text-sm text-muted-foreground leading-relaxed">
              Luxury eyewear & lifestyle brand. Handcrafted pieces for those who 
              dare to define their own style.
            </p>
          </div>

          {/* Links */}
          <div>
            <p className="font-body text-xs tracking-[0.3em] uppercase text-primary mb-4">
              Quick Links
            </p>
            <div className="space-y-3">
              {["Collections", "Categories", "About", "Book Now"].map((link) => (
                <a
                  key={link}
                  href={`#${link.toLowerCase().replace(" ", "")}`}
                  className="block font-body text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>

          {/* Social */}
          <div>
            <p className="font-body text-xs tracking-[0.3em] uppercase text-primary mb-4">
              Follow Us
            </p>
            <div className="flex gap-4">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors duration-300"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-8 text-center">
          <p className="font-body text-xs text-muted-foreground tracking-wider">
            © 2026 Near Plat. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
