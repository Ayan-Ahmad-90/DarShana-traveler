import React from "react";
import { HashRouter, Routes, Route, useLocation } from "react-router-dom";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react";

import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Auth Components
import { RequireAuth, RequireAdmin, GuestOnly } from "./components/Auth/ProtectedRoute";

// Pages
import Home from "./pages/Home";
import MoodAnalyzer from "./pages/MoodAnalyzer";
import TravelHub from "./pages/TravelHub"; // ✔️ Correct Import
import Festivals from "./pages/Festivals";
import Sustainable from "./pages/Sustainable";
import Assistant from "./pages/Assistant";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import MyTrips from "./pages/MyTrips";
import FestivalAlerts from "./pages/FestivalAlerts";
import LanguageSelector from "./pages/LanguageSelector";
import EcoRewardsDashboard from "./pages/EcoRewardsDashboard";
import LocalGuideDashboard from "./pages/LocalGuideDashboard";
import BecomeGuide from "./components/Guide/BecomeGuide";
import GuideListing from "./pages/GuideListing";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import UIStyleGuide from "./pages/UIStyleGuide";
import Booking from "./pages/Booking";
import YatraShayak from "./components/YatraShayak";
import AdminDashboard from "./pages/AdminDashboard";
import NotAuthorized from "./pages/NotAuthorized";
import GreenRoutePlanner from "./pages/GreenRoutePlanner";
import SafetyDashboard from "./pages/SafetyDashboard";
import SafetyGuide from "./pages/SafetyGuide";
import SafetyModal from "./components/SafetyModal";
import LoginOverlay from "./components/Auth/LoginOverlay";


// Auto scroll to top when route changes
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  return null;
};

const App: React.FC = () => {
  const [isSafetyOpen, setIsSafetyOpen] = React.useState(false);

  return (
    <AuthProvider>
      <HashRouter>
        <ScrollToTop />

        {/* Page Wrapper */}
        <div className="min-h-screen flex flex-col bg-primary-50 text-primary-900 font-sans">

          {/* Navbar */}
          <Navbar />

          {/* Page Content */}
          <main className="flex-grow pt-20 sm:pt-24">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<GuestOnly><Login /></GuestOnly>} />
            <Route path="/register" element={<GuestOnly><Login /></GuestOnly>} />
            <Route path="/home" element={<Home />} />
            <Route path="/mood" element={<MoodAnalyzer />} />
            <Route path="/travelhub" element={<TravelHub />} />
            <Route path="/festivals" element={<Festivals />} />
            <Route path="/sustainable" element={<Sustainable />} />
            <Route path="/green-route-planner" element={<GreenRoutePlanner />} />
            <Route path="/safety" element={<SafetyDashboard />} />
            <Route path="/safety-guide" element={<SafetyGuide />} />
            <Route path="/assistant" element={<Assistant />} />
            <Route path="/festival-alerts" element={<FestivalAlerts />} />
            <Route path="/language" element={<LanguageSelector />} />
            <Route path="/guides" element={<GuideListing />} />
            <Route path="/style-guide" element={<UIStyleGuide />} />
            <Route path="/not-authorized" element={<NotAuthorized />} />
            
            {/* Guest Only Routes (redirect if logged in) */}
            <Route path="/forgot-password" element={<GuestOnly><ForgotPassword /></GuestOnly>} />
            <Route path="/reset-password/:token" element={<GuestOnly><ResetPassword /></GuestOnly>} />
            
            {/* Protected Routes (require authentication) */}
            <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
            <Route path="/my-trips" element={<RequireAuth><MyTrips /></RequireAuth>} />
            <Route path="/rewards" element={<RequireAuth><EcoRewardsDashboard /></RequireAuth>} />
            <Route path="/become-guide" element={<RequireAuth><BecomeGuide /></RequireAuth>} />
            <Route path="/guide-dashboard" element={<RequireAuth><LocalGuideDashboard /></RequireAuth>} />
            <Route path="/booking" element={<Booking />} />
            
            {/* Admin Only Routes */}
            <Route path="/admin" element={<RequireAdmin><AdminDashboard /></RequireAdmin>} />
          </Routes>
        </main>
        {/* Footer */}
        <Footer />
        <YatraShayak onSafetyClick={() => setIsSafetyOpen(true)} />
        <SpeedInsights />
        <Analytics />

        <SafetyModal isOpen={isSafetyOpen} onClose={() => setIsSafetyOpen(false)} />
        <LoginOverlay />

      </div>
    </HashRouter>
    </AuthProvider>
  );
};

export default App;
