const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { protect } = require("../auth/auth");

const router = express.Router();

// added helper function to create login token
function generateToken(userId) {
    return jwt.sign(
        { id: userId },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );
}

// added route to register a new user
router.post("/register", async (req, res) => {
    try {
        const {
            displayName,
            email,
            password,
            neighborhood,
            zipcode,
            bio,
            profilePhoto,
            adminKey
        } = req.body;

        if (!displayName || !email || !password || !neighborhood || !zipcode) {
            return res.status(400).json({ message: "Please fill in all required fields" });
        }

        const existingUser = await User.findOne({ email: email });

        if (existingUser) {
            return res.status(400).json({ message: "Email already registered" });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        let role = "user";

        if (adminKey && adminKey === process.env.ADMIN_KEY) {
            role = "admin";
        }

        const newUser = new User({
            displayName,
            email,
            passwordHash,
            neighborhood,
            zipcode,
            bio,
            profilePhoto,
            role
        });

        const savedUser = await newUser.save();

        res.status(201).json({
            _id: savedUser._id,
            displayName: savedUser.displayName,
            email: savedUser.email,
            neighborhood: savedUser.neighborhood,
            zipcode: savedUser.zipcode,
            bio: savedUser.bio,
            profilePhoto: savedUser.profilePhoto,
            trustScore: savedUser.trustScore,
            itemsListed: savedUser.itemsListed,
            itemsBorrowed: savedUser.itemsBorrowed,
            itemsLended: savedUser.itemsLended,
            role: savedUser.role,
            token: generateToken(savedUser._id)
        });
    } catch (error) {
        res.status(400).json({ message: "Failed to register user", error: error.message });
    }
});

// added route to log in a user
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const passwordMatches = await bcrypt.compare(password, user.passwordHash);

        if (!passwordMatches) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        res.json({
            _id: user._id,
            displayName: user.displayName,
            email: user.email,
            neighborhood: user.neighborhood,
            zipcode: user.zipcode,
            bio: user.bio,
            profilePhoto: user.profilePhoto,
            trustScore: user.trustScore,
            itemsListed: user.itemsListed,
            itemsBorrowed: user.itemsBorrowed,
            itemsLended: user.itemsLended,
            role: user.role,
            token: generateToken(user._id)
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to log in user" });
    }
});

// added route to get one user profile by id
router.get("/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-passwordHash");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Failed to get user profile" });
    }
});

// added route to update one user profile by id
router.put("/:id", protect, async (req, res) => {
    try {
        if (req.user._id.toString() !== req.params.id && req.user.role !== "admin") {
            return res.status(403).json({ message: "You can only update your own profile" });
        }
        const allowedUpdates = {
            displayName: req.body.displayName,
            neighborhood: req.body.neighborhood,
            zipcode: req.body.zipcode,
            bio: req.body.bio,
            profilePhoto: req.body.profilePhoto
        };

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            allowedUpdates,
            { returnDocument: "after", runValidators: true }
        ).select("-passwordHash");

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(updatedUser);
    } catch (error) {
        res.status(400).json({ message: "Failed to update user profile", error: error.message });
    }
});

module.exports = router;