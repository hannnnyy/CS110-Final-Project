const express = require("express");
const Item = require("../models/items");
const { protect } = require("../auth/auth");

const router = express.Router();

// added route to get all item listings with optional search filters
router.get("/", async (req, res) => {
    try {
        const { search, category, zipcode, status } = req.query;

        const filter = {};

        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
                { category: { $regex: search, $options: "i" } }
            ];
        }

        if (category) {
            filter.category = { $regex: category, $options: "i" };
        }

        if (zipcode) {
            filter.zipcode = zipcode;
        }

        if (status) {
            filter.status = status;
        }

        const items = await Item.find(filter)
            .populate("owner", "displayName email neighborhood zipcode")
            .sort({ createdAt: -1 });

        res.json(items);
    } catch (error) {
        res.status(500).json({ message: "Failed to get items" });
    }
});

// added route to get one item listing by id
router.get("/:id", async (req, res) => {
    try {
        const item = await Item.findById(req.params.id)
            .populate("owner", "displayName email neighborhood zipcode");

        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }

        res.json(item);
    } catch (error) {
        res.status(500).json({ message: "Failed to get item" });
    }
});

// added protected route to create a new item listing
router.post("/", protect, async (req, res) => {
    try {
        const newItem = new Item({
            ...req.body,
            owner: req.user._id
        });

        const savedItem = await newItem.save();

        res.status(201).json(savedItem);
    } catch (error) {
        res.status(400).json({ message: "Failed to create item", error: error.message });
    }
});

// added protected route to update an item listing by id
router.put("/:id", protect, async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);

        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }

        if (!item.owner && req.user.role !== "admin") {
            return res.status(403).json({ message: "Only an admin can update listings without an owner" });
        }

        if (item.owner && item.owner.toString() !== req.user._id.toString() && req.user.role !== "admin") {
            return res.status(403).json({ message: "You can only update your own listing" });
        }

        const allowedUpdates = {
            title: req.body.title,
            category: req.body.category,
            condition: req.body.condition,
            description: req.body.description,
            borrowingConditions: req.body.borrowingConditions,
            availabilityStart: req.body.availabilityStart,
            availabilityEnd: req.body.availabilityEnd,
            neighborhood: req.body.neighborhood,
            zipcode: req.body.zipcode,
            imageUrl: req.body.imageUrl,
            status: req.body.status
        };

        const updatedItem = await Item.findByIdAndUpdate(
            req.params.id,
            allowedUpdates,
            { returnDocument: "after", runValidators: true }
        );

        res.json(updatedItem);
    } catch (error) {
        res.status(400).json({ message: "Failed to update item", error: error.message });
    }
});

// added protected route to delete an item listing by id
router.delete("/:id", protect, async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);

        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }

        if (!item.owner && req.user.role !== "admin") {
            return res.status(403).json({ message: "Only an admin can delete listings without an owner" });
        }

        if (item.owner && item.owner.toString() !== req.user._id.toString() && req.user.role !== "admin") {
            return res.status(403).json({ message: "You can only delete your own listing" });
        }

        await Item.findByIdAndDelete(req.params.id);

        res.json({ message: "Item deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete item" });
    }
});

module.exports = router;