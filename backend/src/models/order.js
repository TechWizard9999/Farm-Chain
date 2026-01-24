const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, unique: true },
    type: { type: String, enum: ["direct", "from_bid"], default: "direct" },
    business: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
      required: true,
    },
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: { type: Number, required: true },
    pricePerKg: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "shipped",
        "delivered",
        "completed",
        "cancelled",
      ],
      default: "pending",
    },
    confirmedAt: { type: Date },
    shippedAt: { type: Date },
    deliveredAt: { type: Date },
  },
  { timestamps: true },
);

orderSchema.pre("save", async function () {
  if (!this.orderId) {
    const date = new Date();
    const year = date.getFullYear();
    const count = await mongoose.model("Order").countDocuments();
    this.orderId = `ORD-${year}-${String(count + 1).padStart(4, "0")}`;
  }
});

module.exports = mongoose.model("Order", orderSchema);
