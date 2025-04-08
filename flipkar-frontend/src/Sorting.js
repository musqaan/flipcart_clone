import React from "react";

const Sorting = () => {
  return (
    <div className="bg-white p-4 shadow-md rounded-lg">
      <h2 className="font-bold text-lg">Sort By</h2>
      <select className="mt-2 p-2 border rounded">
        <option value="lowToHigh">Price: Low to High</option>
        <option value="highToLow">Price: High to Low</option>
        <option value="popularity">Popularity</option>
      </select>
    </div>
  );
};

export default Sorting;
