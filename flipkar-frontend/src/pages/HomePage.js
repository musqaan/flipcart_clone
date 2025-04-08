// src/pages/HomePage.js
import React from "react";
import HeroSection from "../components/HeroSection";
import CategorySection from "../components/CategorySection";

const HomePage = () => {
  return (
    <>
      <HeroSection />
      <div className="max-w-7xl mx-auto w-full px-4 mt-8">
        <CategorySection />
        {/* Additional homepage content can be added here */}
      </div>
    </>
  );
};

export default HomePage;
