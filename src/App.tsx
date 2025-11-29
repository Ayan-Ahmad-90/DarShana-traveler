import React from "react";
import { HashRouter, Routes, Route, useLocation } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Pages
import Home from "./pages/Home";
import MoodAnalyzer from "./pages/MoodAnalyzer";
import TravelHub from "./pages/TravelHub"; // ✔️ Correct Import
import Festivals from "./pages/Festivals";
import Sustainable from "./pages/Sustainable";
import Assistant from "./pages/Assistant";
import TripPlanner from "./pages/TripPlanner";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import MyTrips from "./pages/MyTrips";
import FestivalAlerts from "./pages/FestivalAlerts";
import LanguageSelector from "./pages/LanguageSelector";
import TripPlannerWithSuggestions from "./pages/TripPlannerWithSuggestions";
import EcoRewardsDashboard from "./pages/EcoRewardsDashboard";
import LocalGuideDashboard from "./pages/LocalGuideDashboard";
import BecomeGuide from "./components/Guide/BecomeGuide";
import GuideListing from "./pages/GuideListing";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import UIStyleGuide from "./pages/UIStyleGuide";
import YatraShayak from "./components/YatraShayak";

// Auto scroll to top when route changes
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  return null;
};


const App: React.FC = () => {
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
            <Route path="/" element={<Home />} />
            <Route path="/mood" element={<MoodAnalyzer />} />
            <Route path="/travelhub" element={<TravelHub />} />
            <Route path="/festivals" element={<Festivals />} />
            <Route path="/sustainable" element={<Sustainable />} />
            <Route path="/trip-planner-new" element={<TripPlanner />} />
            <Route path="/assistant" element={<Assistant />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/my-trips" element={<MyTrips />} />
            <Route path="/festival-alerts" element={<FestivalAlerts />} />
            <Route path="/language" element={<LanguageSelector />} />
            <Route path="/trip-planner" element={<TripPlannerWithSuggestions />} />
            <Route path="/rewards" element={<EcoRewardsDashboard />} />
            <Route path="/become-guide" element={<BecomeGuide />} />
            <Route path="/guide-dashboard" element={<LocalGuideDashboard />} />
            <Route path="/guides" element={<GuideListing />} />
            <Route path="/style-guide" element={<UIStyleGuide />} />
          </Routes>
        </main>
        {/* Footer */}
        <Footer />
        <YatraShayak />

      </div>
    </HashRouter>
    </AuthProvider>
  );
};

export default App;
