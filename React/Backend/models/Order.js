const mongoose = require("mongoose");


const orderItemSchema =
  new mongoose.Schema(
    {
      food: {
        type:
          mongoose.Schema.Types.ObjectId,

        ref: "Food",

        required: true
      },

      name: {
        type: String,
        required: true
      },

      price: {
        type: Number,
        required: true
      },

      quantity: {
        type: Number,
        required: true,
        min: 1
      }
    },

    {
      _id: false
    }
  );


const orderSchema =
  new mongoose.Schema(
    {
      user: {
        type:
          mongoose.Schema.Types.ObjectId,

        ref: "User",

        required: true
      },

      items: {
        type: [orderItemSchema],

        required: true
      },

      totalAmount: {
        type: Number,

        required: true
      },

      status: {
        type: String,

        enum: [
          "PLACED",
          "CONFIRMED",
          "PREPARING",
          "READY",
          "COMPLETED",
          "CANCELLED"
        ],

        default: "PLACED"
      }
    },

    {
      timestamps: true
    }
  );


module.exports = mongoose.model(
  "Order",
  orderSchema
);