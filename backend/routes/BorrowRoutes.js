const express = require("express");
const BorrowRequest = require("../models/BorrowRequest");

const router = express.Router();

// added route to get all borrow requests
router.get("/", async (req, res) => {
    try {
        const requests = await BorrowRequest.find()
            .populate("item")
            .sort({ createdAt: -1 });

        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: "Failed to get borrow requests" });
    }
});

// added route to get borrow requests for one item
router.get("/item/:itemId", async (req, res) => {
    try {
        const requests = await BorrowRequest.find({ item: req.params.itemId })
            .populate("item")
            .sort({ createdAt: -1 });

        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: "Failed to get item borrow requests" });
    }
});

// added route to create a new borrow request
router.post("/", async (req, res) => {
    try {
        const newRequest = new BorrowRequest(req.body);
        const savedRequest = await newRequest.save();        res.status(201).json(savedRequest);
    } catch (error) {
        res.status(400).json({ message: "Failed to create borrow request", error: error.message });
    }
});

// added route to update borrow request status
router.put("/:id/status", async (req, res) => {
    try {
        const { status } = req.body || {};

        if (!status) {
            return res.status(400).json({ message: "Status is required" });
        }

        const updatedRequest = await BorrowRequest.findByIdAndUpdate(
            req.params.id,
            { status: status },
            { returnDocument: "after", runValidators: true }
        );

        if (!updatedRequest) {
            return res.status(404).json({ message: "Borrow request not found" });
        }

        res.json(updatedRequest);
    } catch (error) {
        res.status(400).json({ message: "Failed to update borrow request", error: error.message });
    }
});

// added route to delete a borrow request
router.delete("/:id", async (req, res) => {
    try {
        const deletedRequest = await BorrowRequest.findByIdAndDelete(req.params.id);

        if (!deletedRequest) {
            return res.status(404).json({ message: "Borrow request not found" });
        }

        res.json({ message: "Borrow request deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete borrow request" });
    }
});

module.exports = router;