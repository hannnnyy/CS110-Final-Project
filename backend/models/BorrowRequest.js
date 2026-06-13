const mongoose = require("mongoose");

// added borrow request schema for storing item borrowing requests in MongoDB
const borrowRequestSchema = new mongoose.Schema(
    {
        item: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Item",
            required: true
        },
        borrowerName: {
            type: String,
            required: true,
            trim: true
        },
        borrowerEmail: {
            type: String,
            required: true,
            trim: true
        },
        pickupDate: {
            type: Date,
            required: true
        },
        returnDate: {
            type: Date,
            required: true
        },
        message: {
            type: String
        },
        status: {
            type: String,
            enum: ["pending", "approved", "denied", "returned"],
            default: "pending"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("BorrowRequest", borrowRequestSchema);