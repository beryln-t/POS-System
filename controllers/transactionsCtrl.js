const Transaction = require("../models/Transaction");
const Inventory = require("../models/Inventory");
const Product = require("../models/Product");

const showHistory = async (req, res) => {
  try {
    const transactionsInCents = await Transaction.find().populate(
      "purchasedItems.item",
      "name"
    );

    const transactions = transactionsInCents.map((transaction) => {
      const purchasedItems = transaction.purchasedItems.map((purchasedItem) => {
        return {
          ...purchasedItem.toObject(),
          purchasedUnitPrice: purchasedItem.purchasedUnitPrice / 100,
          itemTotal: purchasedItem.itemTotal / 100,
        };
      });
      return {
        ...transaction.toObject(),
        purchasedItems,
        totalAmount: transaction.totalAmount / 100,
      };
    });

    res.status(200).json(transactions);
  } catch (error) {
    res.status(400).json({ error: error.message });
    return;
  }
};

const addTransaction = async (req, res) => {
  console.log("savingtransaction");
  try {
    const { purchasedItems, totalAmount } = req.body;

    //Check if product is in inventory
    let notInInventoryProducts = [];

    for (let purchasedItem of purchasedItems) {
      const inventoryItem = await Inventory.findOne({
        product: purchasedItem.item,
      });

      if (!inventoryItem) {
        // Product hasn't been added to inventory yet
        const product = await Product.findById(purchasedItem.item);
        notInInventoryProducts.push(product.name);
      }
    }

    if (notInInventoryProducts.length) {
      throw new Error(
        `The following products are not in the inventory: ${notInInventoryProducts.join(
          ", "
        )}`
      );
    }

    //Check if each item is in stock
    let outOfStockProducts = [];

    for (let purchasedItem of purchasedItems) {
      const inventoryItem = await Inventory.findOne({
        product: purchasedItem.item,
      });

      if (inventoryItem.stockCount < purchasedItem.purchasedQuantity) {
        // Product is out of stock
        const product = await Product.findById(purchasedItem.item);
        outOfStockProducts.push(product.name);
      }
    }

    if (outOfStockProducts.length) {
      throw new Error(
        `Not enough stock for products: ${outOfStockProducts.join(", ")}`
      );
    }

    const convertedPurchasedItems = purchasedItems.map((purchasedItem) => ({
      ...purchasedItem,
      purchasedUnitPrice: Math.round(purchasedItem.purchasedUnitPrice * 100),
      itemTotal: Math.round(purchasedItem.itemTotal * 100),
    }));

    // Attempt to create the transaction first
    const createdTransaction = await Transaction.create({
      purchasedItems: convertedPurchasedItems,
      totalAmount: Math.round(totalAmount * 100),
      transactionStatus: 1,
    });

    //Deduct purchasedQuantity from stockCount

    for (let purchasedItem of purchasedItems) {
      await Inventory.findOneAndUpdate(
        { product: purchasedItem.item },
        { $inc: { stockCount: -purchasedItem.purchasedQuantity } }
      );
    }
    res.status(200).json({ createdTransaction });
  } catch (error) {
    res.status(400).json({ error: error.message });
    return;
  }
};

const voidTransaction = async (req, res) => {
  try {
    const transactionId = req.params.transactionId;

    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      res.status(404).json({ error: "Transaction not found" });
      return;
    }

    if (transaction.transactionStatus === 0) {
      res.status(400).json({ error: "Transaction is already voided" });
      return;
    }

    transaction.purchasedItems.forEach((item) => (item.isVoiding = true));

    transaction.transactionStatus = 0;
    await transaction.save();

    for (let purchasedItem of transaction.purchasedItems) {
      await Inventory.findOneAndUpdate(
        { product: purchasedItem.item },
        { $inc: { stockCount: purchasedItem.purchasedQuantity } }
      );
    }

    res.status(200).json({ message: "Transaction voided successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
    return;
  }
};

module.exports = {
  showHistory,
  addTransaction,
  voidTransaction,
};
