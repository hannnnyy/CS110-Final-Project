const mongoose = require("mongoose");

// added user schema for storing registered users and profile information in mongodb
const userSchema = new mongoose.Schema(
    {
        displayName: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        passwordHash: {
            type: String,
            required: true
        },
        neighborhood: {
            type: String,
            required: true
        },
        zipcode: {
            type: String,
            required: true
        },
        bio: {
            type: String
        },
        profilePhoto: {
            type: String
        },
        trustScore: {
            type: Number,
            default: 0
        },
        itemsListed: {
            type: Number,
            default: 0
        },
        itemsBorrowed: {
            type: Number,
            default: 0
        },
        itemsLended: {
            type: Number,
            default: 0
        },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("User", userSchema);