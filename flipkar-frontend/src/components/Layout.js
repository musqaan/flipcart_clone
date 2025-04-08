import React from "react";
import Navbar from "./Navbar"; // Ensure Navbar.js exists
import Footer from "./Footer"; // Ensure Footer.js exists
import CategorySection from "./CategorySection"; // Ensure CategorySection.js exists

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <CategorySection />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
