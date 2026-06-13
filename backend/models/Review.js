const mongoose = require("mongoose");

// added review schema for storing ratings and written feedback in mongodb
const reviewSchema = new mongoose.Schema(
    {
        item: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Item",
            required: true
        },
        reviewerName: {
            type: String,
            required: true,
            trim: true
        },
        reviewerEmail: {
            type: String,
            required: true,
            trim: true
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        comment: {
            type: String,
            required: true
        },
        reviewType: {
            type: String,
            enum: ["borrower-to-lender", "lender-to-borrower"],
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Review", reviewSchema);