import { FaShoppingCart, FaBars, FaTimes } from "react-icons/fa";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";

import React, { useState } from "react";



import { IoIosArrowDown } from "react-icons/io";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import CategorySection from "./CategorySection"; // Import CategorySection component


const Navbar = () => {
  const [showMore, setShowMore] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-[#2874f0]/80 backdrop-blur-md p-2 sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto flex justify-between items-center flex-wrap">
        {/* Logo */}
        <div className="flex items-center space-x-1">
          <h1 className="text-white text-2xl font-bold cursor-pointer">Flipkart</h1>
          <span className="text-yellow-300 text-xs italic">
            Explore&nbsp;<span className="text-white">Plus</span>
          </span>
        </div>

        {/* Hamburger Icon for Mobile */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle Menu">
            {menuOpen ? (
              <FaTimes className="text-white text-2xl" />
            ) : (
              <FaBars className="text-white text-2xl" />
            )}
          </button>
        </div>

        {/* Search Bar */}
        <div className="flex-grow max-w-md w-full mx-4 hidden md:block">
          <input
            type="text"
            placeholder="Search for products, brands and more"
            className="w-full p-2 rounded-lg outline-none text-sm"
          />
        </div>

        {/* Navbar Links */}
        <div
          className={`${menuOpen ? "block" : "hidden"} w-full md:flex md:items-center md:space-x-6 text-white text-sm md:w-auto`}
        >
          <div className="w-full md:w-auto flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
            <button className="bg-white text-[#2874f0] px-4 py-1 rounded-lg font-semibold hover:bg-gray-100 w-full md:w-auto">
              Login
            </button>

            <p className="cursor-pointer hidden md:block">Become a Seller</p>

            {/* More Dropdown */}
            <div
              className="relative cursor-pointer hidden md:flex items-center"
              onMouseEnter={() => setShowMore(true)}
              onMouseLeave={() => setShowMore(false)}
            >
              <span>More</span>
              <IoIosArrowDown className="ml-1" />
              {showMore && (
                <div className="absolute bg-white text-black rounded-lg shadow-md mt-2 p-3 w-40">
                  <ul className="space-y-2">
                    <li className="hover:text-[#2874f0] cursor-pointer">Notification Preferences</li>
                    <li className="hover:text-[#2874f0] cursor-pointer">24x7 Customer Care</li>
                    <li className="hover:text-[#2874f0] cursor-pointer">Advertise</li>
                    <li className="hover:text-[#2874f0] cursor-pointer">Download App</li>
                  </ul>
                </div>
              )}
            </div>

            {/* Cart Icon */}
            <div className="flex items-center cursor-pointer">
              <FaShoppingCart className="text-xl mr-1" />
              <span>Cart</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

const HeroSection = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div className="w-full"> {/* Full width container */}
      <Slider {...settings}>
        <div className="flex justify-center">
          <img src="/banner1.jpg" alt="Banner 1" className="max-w-full" />
        </div>
        <div className="flex justify-center">
          <img src="/banner2.jpg" alt="Banner 2" className="max-w-full" />
        </div>
        <div className="flex justify-center">
          <img src="/banner3.jpg" alt="Banner 3" className="max-w-full" />
        </div>
      </Slider>
    </div>
  );
};



const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-10 px-5 mt-auto">
    <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
      {/* About Us */}
      <div>
        <h3 className="font-semibold text-lg mb-3">About Us</h3>
        <ul className="space-y-2 text-sm">
          <li>Company Information</li>
          <li>Careers</li>
          <li>Press Releases</li>
          <li>Flipkart Wholesale</li>
        </ul>
      </div>
  
      {/* Customer Care */}
      <div>
        <h3 className="font-semibold text-lg mb-3">Customer Care</h3>
        <ul className="space-y-2 text-sm">
          <li>Help Center</li>
          <li>Returns</li>
          <li>Track Orders</li>
          <li>Shipping</li>
        </ul>
      </div>
  
      {/* Policies */}
      <div>
        <h3 className="font-semibold text-lg mb-3">Policies</h3>
        <ul className="space-y-2 text-sm">
          <li>Return Policy</li>
          <li>Terms of Use</li>
          <li>Security</li>
          <li>Privacy</li>
        </ul>
      </div>
  
      {/* Social Media */}
      <div>
        <h3 className="font-semibold text-lg mb-3">Follow Us</h3>
        <div className="flex space-x-4">
        <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
  <FaFacebook size={20} />
</a>
<a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
  <FaTwitter size={20} />
</a>
<a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
  <FaInstagram size={20} />
</a>

        </div>
      </div>
    </div>
  
    {/* Copyright Section */}
    <div className="text-center text-xs py-4 border-t border-gray-700 mt-8">
      © 2025 Flipkart Clone. All rights reserved.
    </div>
  </footer>
  
  );
};

const Layout = ({ children }) => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <CategorySection /> {/* Add Category Section Here */}
    <HeroSection />
    <main className="flex-grow">{children}</main>
    <Footer />
  </div>
);

export default Layout;
