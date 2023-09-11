const Inventory = require("../models/Inventory");
const Product = require("../models/Product");

const showInventory = async (req, res) => {
  try {
    const inventory = await Inventory.find().populate("product", "name");
    res.status(200).json(inventory);
  } catch (error) {
    res.status(400).json({ error: error.message });
    return;
  }
};

const editStock = async (req, res) => {
  try {
    const inventoryId = req.params.inventoryId;
    const stockCount = req.body.stockCount;

    const item = await Inventory.findById(inventoryId);

    if (!item) {
      res.status(404).json({ error: "Inventory item not found." });
      return;
    }
    if (stockCount < 0) {
      res.status(400).json({ error: "Stock count cannot be negative." });
      return;
    }

    item.stockCount = stockCount;
    await item.save();

    res.status(200).json(item);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const showNewProducts = async (req, res) => {
  try {
    const inventoryProductIds = await Inventory.find().distinct("product");

    const productsNotInInventory = await Product.find({
      _id: { $nin: inventoryProductIds },
    });
    res.status(200).json(productsNotInInventory);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const addToInventory = async (req, res) => {
  try {
    const { productId, stockCount } = req.body;

    const existingInventoryItem = await Inventory.findOne({
      product: productId,
    });
    if (existingInventoryItem) {
      res.status(400).json({ error: "Product is already in the inventory." });
      return;
    }
    if (stockCount < 1) {
      res.status(400).json({ error: "Stock count must be at least 1." });
      return;
    }
    const newInventoryItem = await Inventory.create({
      product: productId,
      stockCount: stockCount,
    });
    res.status(201).json(newInventoryItem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const inventoryId = req.params.inventoryId;

    const removedItem = await Inventory.deleteOne({ _id: inventoryId });

    res.status(200).json(removedItem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  showInventory,
  editStock,
  showNewProducts,
  addToInventory,
  remove,
};
