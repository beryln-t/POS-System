const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Inventory = require("./Inventory");

const purchasedItemSchema = new Schema({
  item: {
    type: Schema.Types.ObjectId,
    ref: "Product",
  },
  purchasedUnitPrice: {
    type: Number,
    required: true,
    min: 1,
  },

  purchasedQuantity: {
    type: Number,
    required: true,
    min: 1,
    validate: {
      validator: async function (value) {
        if (this.isVoiding) {
          return true;
        }

        const inventory = await Inventory.findOne({
          product: this.item,
        });
        return inventory && inventory.stockCount >= value;
      },
      message: (props) =>
        `Available stock (${props.value}) is less than the purchase quantity`,
    },
  },
  itemTotal: {
    type: Number,
    required: true,
    min: 1,
  },
});

const transactionSchema = new Schema(
  {
    purchasedItems: [purchasedItemSchema],
    totalAmount: { type: Number, required: true, min: 1 },
    transactionStatus: { type: Number, required: true, enum: [0, 1] },
  },
  {
    timestamps: true,
  }
);

const Transaction = mongoose.model("Transaction", transactionSchema);
module.exports = Transaction;
