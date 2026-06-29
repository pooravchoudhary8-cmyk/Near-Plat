import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { z } from "zod";

const orderSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Valid email required").max(255),
  phone: z.string().trim().min(10, "Valid phone number required").max(15),
  product: z.string().min(1, "Select a product category"),
  message: z.string().trim().max(1000).optional(),
});

const productOptions = [
  "Sunglasses — Aviator",
  "Sunglasses — Round Frame",
  "Sunglasses — Cat-Eye",
  "Sunglasses — Wayfarer",
  "Clothing",
  "Shoes",
  "Perfume",
  "Multiple Products",
];

const OrderForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    product: "",
    message: "",
  });
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = orderSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0]] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    toast.success("Your order has been booked! We'll contact you shortly.");
    setFormData({ name: "", email: "", phone: "", product: "", message: "" });
  };

  const inputClass =
    "w-full bg-secondary border border-border px-5 py-4 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors duration-300";

  return (
    <section id="order" className="section-padding bg-noir-gradient">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <p className="font-body text-xs tracking-[0.4em] uppercase text-primary mb-4">
            Reserve Yours
          </p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mb-4">
            Book Your Piece
          </h2>
          <p className="font-body text-muted-foreground max-w-lg mx-auto">
            Fill in your details and we'll reach out to confirm your selection, 
            pricing, and delivery.
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <input
                type="text"
                placeholder="Full Name *"
                className={inputClass}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              {errors.name && (
                <p className="text-destructive text-xs mt-1 font-body">{errors.name}</p>
              )}
            </div>
            <div>
              <input
                type="email"
                placeholder="Email Address *"
                className={inputClass}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              {errors.email && (
                <p className="text-destructive text-xs mt-1 font-body">{errors.email}</p>
              )}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <input
                type="tel"
                placeholder="Phone Number *"
                className={inputClass}
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
              {errors.phone && (
                <p className="text-destructive text-xs mt-1 font-body">{errors.phone}</p>
              )}
            </div>
            <div>
              <select
                className={`${inputClass} ${!formData.product ? "text-muted-foreground" : ""}`}
                value={formData.product}
                onChange={(e) => setFormData({ ...formData, product: e.target.value })}
              >
                <option value="">Select Product *</option>
                {productOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              {errors.product && (
                <p className="text-destructive text-xs mt-1 font-body">{errors.product}</p>
              )}
            </div>
          </div>

          <textarea
            placeholder="Additional details or preferences (optional)"
            rows={4}
            className={inputClass}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          />

          <div className="text-center pt-4">
            <button
              type="submit"
              className="bg-gold-shimmer text-primary-foreground font-body text-sm tracking-widest uppercase px-14 py-4 hover-gold-glow transition-all duration-500"
            >
              Submit Order
            </button>
          </div>
        </motion.form>
      </div>
    </section>
  );
};

export default OrderForm;
