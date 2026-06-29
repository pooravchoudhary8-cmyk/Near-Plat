import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { AuthProvider } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { WishlistProvider } from './context/WishlistContext.jsx';
import { CurrencyProvider } from './context/CurrencyContext.jsx';
import { HelmetProvider } from 'react-helmet-async';
import React from "react";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HelmetProvider>
      <AuthProvider>
        <CurrencyProvider>
          <CartProvider>
            <WishlistProvider>
              <App />
            </WishlistProvider>
          </CartProvider>
        </CurrencyProvider>
      </AuthProvider>
    </HelmetProvider>
  </React.StrictMode>
);
