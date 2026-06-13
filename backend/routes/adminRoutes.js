const express = require("express");
const Item = require("../models/items");
const BorrowRequest = require("../models/BorrowRequest");
const User = require("../models/User");
const { protect, adminOnly } = require("../auth/auth");

const router = express.Router();

// added protection so only logged-in admins can use admin routes
router.use(protect, adminOnly);

// added route to get admin dashboard stats
router.get("/stats", async (req, res) => {
    try {
        const totalItems = await Item.countDocuments();
        const totalUsers = await User.countDocuments();
        const totalBorrowRequests = await BorrowRequest.countDocuments();
        const pendingBorrowRequests = await BorrowRequest.countDocuments({ status: "pending" });

        res.json({
            totalItems,
            totalUsers,
            totalBorrowRequests,
            pendingBorrowRequests
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to get admin stats" });
    }
});

// added route to get all items for admin dashboard
router.get("/items", async (req, res) => {
    try {
        const items = await Item.find().sort({ createdAt: -1 });
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: "Failed to get admin items" });
    }
});

// added route to get all users for admin dashboard
router.get("/users", async (req, res) => {
    try {
        const users = await User.find()
            .select("-passwordHash")
            .sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Failed to get admin users" });
    }
});

// added route to get all borrow requests for admin dashboard
router.get("/borrow-requests", async (req, res) => {
    try {
        const requests = await BorrowRequest.find()
            .populate("item")
            .sort({ createdAt: -1 });

        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: "Failed to get admin borrow requests" });
    }
});

// added route to delete an item from admin dashboard
router.delete("/items/:id", async (req, res) => {
    try {
        const deletedItem = await Item.findByIdAndDelete(req.params.id);

        if (!deletedItem) {
            return res.status(404).json({ message: "Item not found" });
        }
        res.json({ message: "Admin deleted item successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete admin item" });
    }
});

// added route to delete a user from admin dashboard
router.delete("/users/:id", async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);

        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "Admin deleted user successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete admin user" });
    }
});

module.exports = router;