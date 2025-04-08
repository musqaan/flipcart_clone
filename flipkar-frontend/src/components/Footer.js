import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-4">
      <div className="max-w-4xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <h3 className="font-bold text-base mb-2">About</h3>
          <ul className="space-y-1 text-sm">
            <li>Contact Us</li>
            <li>About Us</li>
            <li>Careers</li>
            <li>Flipkart Stories</li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-base mb-2">Help</h3>
          <ul className="space-y-1 text-sm">
            <li>Payments</li>
            <li>Shipping</li>
            <li>Cancellation & Returns</li>
            <li>FAQ</li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-base mb-2">Policy</h3>
          <ul className="space-y-1 text-sm">
            <li>Return Policy</li>
            <li>Terms of Use</li>
            <li>Security</li>
            <li>Privacy</li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-base mb-2">Social</h3>
          <ul className="space-y-1 text-sm">
            <li>Facebook</li>
            <li>Twitter</li>
            <li>YouTube</li>
          </ul>
        </div>
      </div>

      <div className="text-center text-xs py-2 border-t border-gray-700 mt-2">
        © {new Date().getFullYear()} Flipkart Clone. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
