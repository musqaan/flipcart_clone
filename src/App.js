import React, { useState } from "react";
import { FaShoppingCart, FaBars, FaTimes } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";

const Navbar = () => {
  const [showMore, setShowMore] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-[#2874f0] p-2 sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto flex justify-between items-center flex-wrap">
        {/* Logo */}
        <div className="flex items-center space-x-1">
          <h1 className="text-white text-2xl font-bold cursor-pointer">
            Flipkart
          </h1>
          <span className="text-yellow-300 text-xs italic">
            Explore&nbsp;
            <span className="text-white">Plus</span>
          </span>
        </div>

        {/* Hamburger Icon for Mobile */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)}>
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
          className={`${
            menuOpen ? "block" : "hidden"
          } w-full md:flex md:items-center md:space-x-6 text-white text-sm md:w-auto`}
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
                    <li className="hover:text-[#2874f0] cursor-pointer">
                      Notification Preferences
                    </li>
                    <li className="hover:text-[#2874f0] cursor-pointer">
                      24x7 Customer Care
                    </li>
                    <li className="hover:text-[#2874f0] cursor-pointer">
                      Advertise
                    </li>
                    <li className="hover:text-[#2874f0] cursor-pointer">
                      Download App
                    </li>
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

export default Navbar;
