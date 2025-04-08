import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { CartContext } from "../context/CartContext";

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");

  useEffect(() => {
    // No token check since products are now public
    fetch(`http://localhost:5000/api/products/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async (res) => {
        const contentType = res.headers.get("content-type");
        if (!res.ok || !contentType?.includes("application/json")) {
          const text = await res.text();
          throw new Error(`Server Error: ${res.status} ${text}`);
        }
        return res.json();
      })
      .then((data) => setProduct(data))
      .catch((err) => {
        console.error("Error fetching product:", err.message);
        setError("Failed to load product. Please try again later.");
      });
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return; // Guard against adding null product
    addToCart(product, quantity);
    alert("Product added to cart!");
  };

  if (error) return <div className="container mx-auto p-4 text-center text-red-600">{error}</div>;

  if (!product) return <div className="container mx-auto p-4 text-center">Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left: Product Image */}
        <div className="md:w-1/3">
          <img
            src={product.image}
            alt={product.name}
            className="w-full object-cover rounded shadow-md"
            loading="lazy"
          />
        </div>

        {/* Right: Product Details */}
        <div className="md:w-2/3">
          <h2 className="text-2xl font-bold">{product.name}</h2>
          <p className="mt-2 text-gray-600">{product.description || "No description available"}</p>
          <p className="mt-4 text-xl font-semibold text-red-600">₹{product.price}</p>
          <div className="mt-4">
            <label className="mr-2 font-semibold">Quantity:</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-16 border p-1 text-center"
            />
          </div>
          <button
  onClick={handleAddToCart}
  disabled={!JSON.parse(localStorage.getItem("user"))}
  className={`mt-6 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition transform hover:scale-105 ${!JSON.parse(localStorage.getItem("user")) ? "opacity-50 cursor-not-allowed" : ""}`}
>
  Add to Cart
</button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;