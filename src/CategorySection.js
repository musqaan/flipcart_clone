import React from "react";

const CategorySection = () => {
  const categories = [
    { name: "Grocery", img: "/categories/kilos.jpg" },
    { name: "Electronics", img: "/categories/mobiles.jpg" },
    { name: "Clothing", img: "/categories/toys_files/0d75b34f7d8fbcb3.png" },
    { name: "Appliances", img: "/categories/toys_files/-original-imah96c4jguzd2f5.jpeg" },
    { name: "Beauty", img: "/categories/toys_files/dff3f7adcf3a90c6.png" },
    { name: "Toys", img: "/categories/toys_files/119766-flair-original-imag9nzubznagufg.jpeg" },
  ];

  return (
    <div className="w-full max-w-screen-xl mx-auto mt-4 p-4">
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 text-center">
        {categories.map((category, index) => (
          <div key={index} className="flex flex-col items-center cursor-pointer hover:scale-105 transition-transform">
            <img src={category.img} alt={category.name} className="w-20 h-20 object-cover rounded-full border border-gray-300" />
            <span className="text-sm mt-2">{category.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategorySection;
