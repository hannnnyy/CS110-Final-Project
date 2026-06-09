const express = require("express");
const Review = require("../models/Review");

const router = express.Router();

// added route to get all reviews
router.get("/", async (req, res) => {
    try {
        const reviews = await Review.find()
            .populate("item")
            .sort({ createdAt: -1 });

        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: "Failed to get reviews" });
    }
});

// added route to get reviews for one item
router.get("/item/:itemId", async (req, res) => {
    try {
        const reviews = await Review.find({ item: req.params.itemId })
            .populate("item")
            .sort({ createdAt: -1 });

        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: "Failed to get item reviews" });
    }
});

// added route to create a new review
router.post("/", async (req, res) => {
    try {
        const newReview = new Review(req.body);
        const savedReview = await newReview.save();

        res.status(201).json(savedReview);
    } catch (error) {
        res.status(400).json({ message: "Failed to create review", error: error.message });
    }
});

// added route to delete a review
router.delete("/:id", async (req, res) => {
    try {
        const deletedReview = await Review.findByIdAndDelete(req.params.id);

        if (!deletedReview) {
            return res.status(404).json({ message: "Review not found" });
        }

        res.json({ message: "Review deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete review" });
    }
});

module.exports = router;