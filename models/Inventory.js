const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const inventorySchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      unique: true,
    },
    stockCount: {
      type: Number,
      required: true,
      min: 0,
      validate: {
        validator: Number.isInteger,
        message: "{VALUE} must be an integer",
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

inventorySchema.virtual("status").get(function () {
  return this.stockCount > 0 ? "Active" : "Out of Stock";
});

const Inventory = mongoose.model("Inventory", inventorySchema);
module.exports = Inventory;
