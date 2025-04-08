import React, { useState, useEffect } from "react";

const ManageProducts = () => {
    const [products, setProducts] = useState([]);
    const [newProduct, setNewProduct] = useState({
        name: "",
        price: "",
        rating: "",
        category: "",
        brand: "",
        des: "",
        stock: "0",
        image: "",
    });
    const [editingProduct, setEditingProduct] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/products", {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) throw new Error("Failed to fetch products");
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error("Error fetching products:", error);
            alert("Failed to load products: " + error.message);
        }
    };

    const handleChange = (e) => {
        console.log(`Updating ${e.target.name} to ${e.target.value}`);
        setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const token = localStorage.getItem('token');
        if (!token) {
            alert("Please log in first");
            return;
        }
    
        // Strict validation with trimming and type checks
        const missingFields = [];
        if (!newProduct.name || newProduct.name.trim() === "") missingFields.push("Name");
        if (!newProduct.price || isNaN(Number(newProduct.price))) missingFields.push("Price");
        if (!newProduct.category || newProduct.category.trim() === "") missingFields.push("Category");
        if (!newProduct.des || newProduct.des.trim() === "") missingFields.push("Description");
        if (!newProduct.image || newProduct.image.trim() === "") missingFields.push("Image");
    
        if (missingFields.length > 0) {
            console.log("Missing or invalid fields:", missingFields);
            alert(`Please fill in the following required fields: ${missingFields.join(", ")}`);
            return;
        }
    
        try {
            const productToSubmit = {
                name: newProduct.name.trim(),
                price: Number(newProduct.price),
                category: newProduct.category.trim(),
                des: newProduct.des.trim(), // Ensure 'des' is used, not 'description'
                image: newProduct.image.trim(),
                brand: newProduct.brand.trim() || "HERBALIFE",
                stock: Number(newProduct.stock) || 0,
                rating: Number(newProduct.rating) || null
            };
            console.log("Submitting product data:", JSON.stringify(productToSubmit, null, 2));
            console.log("Request headers:", {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            });
    
            const response = await fetch("http://localhost:5000/api/products", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(productToSubmit),
            });
    
            const data = await response.json();
            console.log("Server response:", data);
    
            if (!response.ok) {
                throw new Error(data.error || "Failed to add product");
            }
    
            await fetchProducts();
            setNewProduct({
                name: "",
                price: "",
                rating: "",
                category: "",
                brand: "",
                des: "",
                stock: "0",
                image: "",
            });
            alert("Product added successfully!");
        } catch (error) {
            console.error("Error adding product:", error);
            alert(`Error adding product: ${error.message}`);
        }
    };

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert("Please log in first");
                return;
            }

            const response = await fetch(`http://localhost:5000/api/products/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to delete product");
            }

            await fetchProducts();
            alert("Product deleted successfully!");
        } catch (error) {
            console.error("Error deleting product:", error);
            alert(`Error deleting product: ${error.message}`);
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setNewProduct({
            ...product,
            price: product.price.toString(),
            rating: product.rating ? product.rating.toString() : "",
            stock: product.stock.toString()
        });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');
        if (!token) {
            alert("Please log in first");
            return;
        }

        const missingFields = [];
        if (!newProduct.name) missingFields.push("Name");
        if (!newProduct.price) missingFields.push("Price");
        if (!newProduct.category) missingFields.push("Category");
        if (!newProduct.des) missingFields.push("Description");
        if (!newProduct.image) missingFields.push("Image");

        if (missingFields.length > 0) {
            alert(`Please fill in: ${missingFields.join(", ")}`);
            return;
        }

        try {
            const updatedProduct = {
                ...newProduct,
                price: Number(newProduct.price),
                rating: Number(newProduct.rating) || null,
                stock: Number(newProduct.stock) || 0
            };

            const response = await fetch(`http://localhost:5000/api/products/${editingProduct.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(updatedProduct),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to update product");
            }

            await fetchProducts();
            setEditingProduct(null);
            setNewProduct({
                name: "",
                price: "",
                rating: "",
                category: "",
                brand: "",
                des: "",
                stock: "0",
                image: "",
            });
            alert("Product updated successfully!");
        } catch (error) {
            console.error("Error updating product:", error);
            alert(`Error: ${error.message}`);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">{editingProduct ? "Edit Product" : "Add Product"}</h2>
            <form onSubmit={editingProduct ? handleUpdate : handleSubmit} className="mb-6">
                <input 
                    type="text" 
                    name="name" 
                    placeholder="Product Name" 
                    value={newProduct.name} 
                    onChange={handleChange} 
                    className="border p-2 m-2 w-full" 
                    required 
                />
                <input 
                    type="number" 
                    name="price" 
                    placeholder="Price" 
                    value={newProduct.price} 
                    onChange={handleChange} 
                    className="border p-2 m-2 w-full" 
                    step="0.01" 
                    required 
                />
                <input 
                    type="number" 
                    name="rating" 
                    placeholder="Rating" 
                    value={newProduct.rating} 
                    onChange={handleChange} 
                    className="border p-2 m-2 w-full" 
                    step="0.1" 
                />
                <input 
                    type="text" 
                    name="category" 
                    placeholder="Category" 
                    value={newProduct.category} 
                    onChange={handleChange} 
                    className="border p-2 m-2 w-full" 
                    required 
                />
                <input 
                    type="text" 
                    name="brand" 
                    placeholder="Brand" 
                    value={newProduct.brand} 
                    onChange={handleChange} 
                    className="border p-2 m-2 w-full" 
                />
                <input 
                    type="text" 
                    name="des" 
                    placeholder="Description" 
                    value={newProduct.des} 
                    onChange={handleChange} 
                    className="border p-2 m-2 w-full" 
                    required 
                />
                <input 
                    type="number" 
                    name="stock" 
                    placeholder="Stock" 
                    value={newProduct.stock} 
                    onChange={handleChange} 
                    className="border p-2 m-2 w-full" 
                />
                <input 
                    type="text" 
                    name="image" 
                    placeholder="Image URL" 
                    value={newProduct.image} 
                    onChange={handleChange} 
                    className="border p-2 m-2 w-full" 
                    required 
                />
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 mt-2">
                    {editingProduct ? "Update Product" : "Add Product"}
                </button>
            </form>

            <h2 className="text-2xl font-bold mb-4">Product List</h2>
            <table className="table-auto w-full border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border border-gray-300 px-4 py-2">Name</th>
                        <th className="border border-gray-300 px-4 py-2">Price</th>
                        <th className="border border-gray-300 px-4 py-2">Stock</th>
                        <th className="border border-gray-300 px-4 py-2">Category</th>
                        <th className="border border-gray-300 px-4 py-2">Brand</th>
                        <th className="border border-gray-300 px-4 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product.id} className="text-center">
                            <td className="border border-gray-300 px-4 py-2">{product.name}</td>
                            <td className="border border-gray-300 px-4 py-2">₹{new Intl.NumberFormat("en-IN").format(product.price)}</td>
                            <td className="border border-gray-300 px-4 py-2">{product.stock}</td>
                            <td className="border border-gray-300 px-4 py-2">{product.category}</td>
                            <td className="border border-gray-300 px-4 py-2">{product.brand}</td>
                            <td className="border border-gray-300 px-4 py-2">
                                <button onClick={() => handleEdit(product)} className="bg-yellow-500 text-white px-4 py-1">Edit</button>
                                <button onClick={() => handleDelete(product.id)} className="bg-red-500 text-white px-4 py-1 ml-2">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ManageProducts;