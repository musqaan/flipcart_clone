const express = require("express");
const mysql = require("mysql2/promise");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cors = require("cors");
require("dotenv").config({ path: "./.env" });

const app = express();
const PORT = 5000;

console.log("Loaded SECRET_KEY:", process.env.SECRET_KEY);

app.use(cors());
app.use(express.json());

// ✅ **Database Connection**
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "root",
  database: "flipkart_clone",
});

// ✅ **Middleware to Authenticate Token**
function authenticateToken(req, res, next) {
  const authHeader = req.header("Authorization");
  console.log("Received Authorization Header:", authHeader);

  const token = authHeader?.split(" ")[1];
  if (!token) {
    console.log("❌ No token provided");
    return res.status(403).json({ error: "No token provided" });
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err) {
      console.log("❌ Invalid token:", err.message);
      return res.status(403).json({ error: "Invalid token" });
    }
    console.log("✅ Token verified. User:", user);
    req.user = user;
    next();
  });
}

const authorizeAdmin = (req, res, next) => {
  console.log("Decoded User:", req.user);
  if (req.user.user_type !== "admin") {
      return res.status(403).json({ error: "Access denied! Only admins can manage users." });
  }
  next();
};
// ✅ **User Signup API**
app.post("/api/signup", async (req, res) => {
  const { name, email, password, user_type } = req.body;
  
  if (!name || !email || !password) {
      console.log("❌ Signup Error: Missing Fields", req.body);
      return res.status(400).json({ error: "All fields are required" });
  }

  try {
      // Check if the user already exists
      const [existingUser] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
      if (existingUser.length > 0) {
          console.log("❌ Signup Error: Email already exists", email);
          return res.status(400).json({ error: "Email already registered" });
      }

      // Hash password before storing
      const bcrypt = require("bcrypt");
      const hashedPassword = await bcrypt.hash(password, 10);

      // Default userType to "customer" if not provided
      const userRole = user_type || "customer";  
      console.log("✅ Creating User:", { name, email, userRole });

      // Insert new user
      await db.query(
          "INSERT INTO users (name, email, password, user_type) VALUES (?, ?, ?, ?)",
          [name, email, hashedPassword, userRole]
      );

      console.log("✅ Signup Success:", email);
      res.status(201).json({ message: "Signup successful! Please log in." });

  } catch (error) {
      console.error("❌ Signup Error:", error);
      res.status(500).json({ error: "Server error. Please try again." });
  }
});


// ✅ **User Login API**
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const [users] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

    if (users.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user.id, user_type: user.user_type },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );

    // Return full user object (excluding password)
    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        user_type: user.user_type,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error" });
  }
});
// get users
app.get("/api/users", authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const [users] = await db.query("SELECT id, name, email, user_type FROM users");
    res.json(users);
  } catch (error) {
    console.error("Users fetch error:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});
// New PUT /api/users/:id route (Update user)
app.put("/api/users/:id", authenticateToken, authorizeAdmin, async (req, res) => {
    const { id } = req.params;
    const { email, password, user_type } = req.body;
    try {
        const [user] = await db.query("SELECT * FROM users WHERE id = ?", [id]);
        if (user.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        const updates = {};
        if (email) updates.email = email;
        if (password) updates.password = await bcrypt.hash(password, 10);
        if (user_type) updates.user_type = user_type;

        const [result] = await db.query(
            "UPDATE users SET ? WHERE id = ?",
            [updates, id]
        );
        if (result.affectedRows === 0) {
            return res.status(400).json({ error: "No changes made" });
        }
        res.json({ message: "User updated successfully" });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ error: "Server error" });
    }
});
// GET /api/admins
app.get("/api/admins", authenticateToken, async (req, res) => {
  try {
    const [admins] = await db.query("SELECT id, name, email, role, status FROM admins");
    res.json(admins);
  } catch (error) {
    console.error("Fetch admins error:", error);
    res.status(500).json({ error: "Failed to fetch admins" });
  }
});

// POST /api/admins
app.post("/api/admins", authenticateToken, async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const [result] = await db.query(
      "INSERT INTO admins (name, email, password, role, status) VALUES (?, ?, ?, ?, 'Active')",
      [name, email, password, role] // In production, hash password with bcrypt
    );
    res.status(201).json({ id: result.insertId, name, email, role, status: "Active" });
  } catch (error) {
    console.error("Add admin error:", error);
    res.status(500).json({ error: "Failed to add admin" });
  }
});

// PUT /api/admins/:id
app.put("/api/admins/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { role, status } = req.body;
  try {
    const [result] = await db.query(
      "UPDATE admins SET role = ?, status = ? WHERE id = ?",
      [role, status, id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: "Admin not found" });
    const [updatedAdmin] = await db.query("SELECT id, name, email, role, status FROM admins WHERE id = ?", [id]);
    res.json(updatedAdmin[0]);
  } catch (error) {
    console.error("Update admin error:", error);
    res.status(500).json({ error: "Failed to update admin" });
  }
});
// DELETE /api/admins/:id
// DELETE /api/admins/:id
app.delete("/api/admins/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  console.log("Attempting to delete admin with ID:", id); // Debug log
  try {
    const [result] = await db.query("DELETE FROM admins WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      console.log("Admin not found with ID:", id); // Debug log
      return res.status(404).json({ error: "Admin not found" });
    }
    res.status(200).json({ message: "Admin deleted successfully" });
  } catch (error) {
    console.error("Delete admin error:", error);
    res.status(500).json({ error: "Failed to delete admin" });
  }
});
// ✅ **Admin Dashboard Analytics**

app.get("/api/admin/analytics", authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    // Fetch analytics data from the database
    const [userCount] = await db.query("SELECT COUNT(*) as totalUsers FROM users");
    const [orderCount] = await db.query("SELECT COUNT(*) as totalOrders FROM orders");
    const [revenue] = await db.query("SELECT SUM(total_price) as totalRevenue FROM orders");

    const analytics = {
      totalUsers: userCount[0].totalUsers || 0,
      totalOrders: orderCount[0].totalOrders || 0,
      totalRevenue: revenue[0].totalRevenue || 0,
      salesData: [10, 20, 30], // Example data; replace with real query
      returnsData: [5, 10, 15], // Example data; replace with real query
      months: ["Jan", "Feb", "Mar"], // Example data
      categorySales: [40, 30, 20], // Example data
      categories: ["Electronics", "Clothing", "Books"], // Example data
    };

    res.json(analytics);
  } catch (error) {
    console.error("Analytics error:", error);
    res.status(500).json({ error: "Failed to fetch analytics data" });
  }
});


// Get user by ID (accessible to authenticated users)
app.get("/api/users/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const [users] = await db.query("SELECT id, name, email, user_type FROM users WHERE id = ?", [id]);
    if (users.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = users[0];
    // Ensure the requesting user can only access their own profile unless admin
    if (req.user.id !== user.id && req.user.user_type !== "admin") {
      return res.status(403).json({ error: "Access denied" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ **Get All Products (With Pagination & Search)**
app.get("/api/products", async (req, res) => {
  const { search, category, page = 1, limit = 10 } = req.query;
  let sql = "SELECT * FROM products WHERE 1=1";
  let params = [];

  if (search) {
    sql += " AND name LIKE ?";
    params.push(`%${search}%`);
  }
  if (category) {
    sql += " AND category = ?";
    params.push(category);
  }
  
  sql += " LIMIT ?, ?";
  params.push((page - 1) * limit, parseInt(limit));

  try {
    const [products] = await db.query(sql, params);
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Get product by ID
app.get("/api/products/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [product] = await db.query("SELECT * FROM products WHERE id = ?", [id]);

    if (product.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product[0]); // Return single product
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    res.status(500).json({ error: "Server error" });
  }
});


// ✅ **Add a New Product (Admin Only)**
app.post("/api/products", authenticateToken, async (req, res) => {
  // Check admin privileges
  if (req.user.user_type !== "admin") {
    return res.status(403).json({ error: "Access denied" });
  }

  const { 
    name, 
    price, 
    category, 
    des, // Changed from description to match schema
    image, 
    brand, 
    stock,
    rating 
  } = req.body;

  // Validate required fields (adjust based on your requirements)
  if (!name || !price || !category || !des || !image) {
    return res.status(400).json({ 
      error: "Name, price, category, description, and image are required" 
    });
  }

  try {
    // Prepare values with proper type conversion
    const productData = {
      name,
      price: Number(price), // Convert to number for DECIMAL(10,2)
      category,
      des,
      image,
      brand: brand || 'HERBALIFE', // Use default if not provided
      stock: Number(stock) || 0,   // Use default if not provided or invalid
      rating: Number(rating) || null // Allow null since field is nullable
    };

    // Validate numeric fields
    if (isNaN(productData.price)) {
      return res.status(400).json({ error: "Price must be a valid number" });
    }
    if (rating && isNaN(productData.rating)) {
      return res.status(400).json({ error: "Rating must be a valid number" });
    }
    if (stock && isNaN(productData.stock)) {
      return res.status(400).json({ error: "Stock must be a valid integer" });
    }

    const [result] = await db.query(
      "INSERT INTO products (name, price, category, des, image, brand, stock, rating) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        productData.name,
        productData.price,
        productData.category,
        productData.des,
        productData.image,
        productData.brand,
        productData.stock,
        productData.rating
      ]
    );

    res.status(201).json({ 
      message: "Product added successfully",
      productId: result.insertId 
    });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ 
      error: "Server error",
      details: error.sqlMessage || error.message // More specific error info
    });
  }
});


// ✅ **Place Order API**
// In index.js
app.post("/api/orders", authenticateToken, async (req, res) => {
  const { userId, cartItems, address } = req.body;

  console.log("Request body:", JSON.stringify(req.body, null, 2));

  if (!userId || !cartItems || !Array.isArray(cartItems) || cartItems.length === 0 || !address) {
    return res.status(400).json({ error: "Invalid order data. User ID, cart items, and address are required." });
  }

  const invalidItems = cartItems.filter(item => 
    !Number.isInteger(item.id) || item.id <= 0 || 
    !Number.isInteger(item.quantity) || item.quantity <= 0 || 
    typeof item.price !== "number" || item.price < 0
  );
  if (invalidItems.length > 0) {
    return res.status(400).json({ 
      error: "All cart items must have a valid product ID (positive integer), quantity (positive integer), and price (non-negative number).",
      invalidItems 
    });
  }

  try {
    const orderDate = new Date().toISOString().split("T")[0];
    const values = cartItems.map(item => [
      userId,
      item.id,
      item.quantity,
      item.price * item.quantity,
      orderDate,
      "Pending",
      address
    ]);

    const [result] = await db.query(
      "INSERT INTO orders (user_id, product_id, quantity, total_price, order_date, status, address) VALUES ?",
      [values]
    );

    res.json({
      message: "Order placed successfully!",
      orderId: result.insertId,
    });
  } catch (error) {
    console.error("Order insert error:", error);
    res.status(500).json({ error: "Server error while placing order" });
  }
});

app.get("/api/orders/:userId", authenticateToken, async (req, res) => {
  const { userId } = req.params;

  try {
    const [orders] = await db.query(
      "SELECT * FROM orders WHERE user_id = ? ORDER BY order_date DESC",
      [userId]
    );
    res.json(orders);
  } catch (error) {
    console.error("Orders fetch error:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// In index.js or server.js
app.get("/api/orders", authenticateToken, async (req, res) => {
  const { status, updated } = req.query;
  try {
    let query = "SELECT id, user_id, status, product_id, quantity, CAST(total_price AS DECIMAL(10,2)) as total_price, order_date, address, updated_at FROM orders WHERE 1=1";
    const params = [];

    if (status) {
      query += " AND status = ?";
      params.push(status);
    }
    if (updated) {
      query += " AND updated_at > NOW() - INTERVAL 1 HOUR";
    }

    console.log("Executing query:", query, "with params:", params); // Debug log
    const [orders] = await db.query(query, params);
    console.log("Query result:", orders); // Debug result
    if (orders.length === 0) {
      return res.status(200).json([]); // Return empty array with 200 OK instead of 204
    }
    res.json(orders);
  } catch (error) {
    console.error("Orders fetch error:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});
app.put("/api/orders/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const [result] = await db.query("UPDATE orders SET status = ? WHERE id = ?", [status, id]);
    if (result.affectedRows === 0) throw new Error("Order not found");
    res.json({ message: "Status updated successfully" });
  } catch (error) {
    console.error("Order update error:", error);
    res.status(500).json({ error: "Failed to update order status" });
  }
});
// ✅ **Start Server**
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
