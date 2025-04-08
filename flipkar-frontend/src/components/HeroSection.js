import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

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
    <div className="w-full">
      <Slider {...settings}>
        {["/banner1.jpg", "/banner2.jpg", "/banner3.jpg"].map((src, index) => (
          <div key={index} className="flex justify-center">
            <img src={src} alt={`Banner ${index + 1}`} className="w-full h-auto object-cover" />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default HeroSection;
