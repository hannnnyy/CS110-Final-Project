const mongoose = require("mongoose");

// added item schema for storing user-created listings in MongoDB
const itemSchema = new mongoose.Schema(
    {
        // added owner field so each listing belongs to a user
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        title: {
            type: String,
            required: true,
            trim: true
        },
        category: {
            type: String,
            required: true
        },
        condition: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        borrowingConditions: {
            type: String
        },
        availabilityStart: {
            type: Date,
            required: true
        },
        availabilityEnd: {
            type: Date,
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
        imageUrl: {
            type: String
        },
        status: {
            type: String,
            default: "available"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Item", itemSchema);