import React from "react";
import Navbar from "./Navbar";
import HeroSection from "./HeroSection";
import PromoSection from "./PromoSection";
import Footer from "./Footer";
import CategorySection from "./CategorySection";  // <-- Import Here

const Layout = ({ children }) => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <CategorySection />  {/* <-- Add Here (Before Banner) */}
    <HeroSection />
    <PromoSection />
    <main className="flex-grow">{children}</main>
    <Footer />
  </div>
);

export default Layout;
