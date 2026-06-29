import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import NotFound from "./pages/NotFound.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Profile from "./pages/Profile.jsx";
import Cart from "./pages/Cart.jsx";
import Checkout from "./pages/Checkout.jsx";
import Wishlist from "./pages/Wishlist.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import ChatWidget from "./components/ChatWidget.jsx";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

const queryClient = new QueryClient();

const initialOptions = {
  "client-id": "sb", // This will be loaded dynamically or kept as 'sb' for sandbox
  currency: "USD",
  intent: "capture",
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <PayPalScriptProvider options={initialOptions}>
      <TooltipProvider>
        <Sonner />
        <Toaster />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
            <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <ChatWidget />
        </BrowserRouter>
      </TooltipProvider>
    </PayPalScriptProvider>
  </QueryClientProvider>
);

export default App;
