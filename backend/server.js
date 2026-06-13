const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const itemRoutes = require("./routes/itemRoutes");
const borrowRoutes = require("./routes/BorrowRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const reviewRoutes = require("./routes/reviewRoutes");

const app = express();

// added database connection for mongodb
connectDB();

app.use(cors());
app.use(express.json());

// added item routes so the frontend can create and load item listings later
app.use("/api/items", itemRoutes);

// added borrow request routes so borrowers can request items
app.use("/api/borrow-requests", borrowRoutes);

// added user routes so users can register, log in, and manage profiles
app.use("/api/users", userRoutes);

// added admin routes so the admin dashboard can manage items, users, and requests
app.use("/api/admin", adminRoutes);

// added review routes so users can leave ratings and feedback
app.use("/api/reviews", reviewRoutes);

app.get("/", (req, res) => {
    res.send("NeighborGood backend is running");
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});