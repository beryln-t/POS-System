const Product = require("../models/Product");
const Inventory = require("../models/Inventory");

const showAllProducts = async (req, res) => {
  try {
    const productsInCents = await Product.find().sort({ name: 1 });

    const products = productsInCents.map((product) => ({
      ...product.toObject(),
      unitPrice: product.unitPrice / 100,
    }));

    res.status(200).json(products);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const productExists = await Product.findOne({ name: req.body.name });
    if (productExists) {
      res
        .status(409)
        .json({ message: "Product with the same name already exists." });
      return;
    }
    const priceInCents = Math.round(req.body.unitPrice * 100);
    const newProduct = await Product.create({
      ...req.body,
      unitPrice: priceInCents,
    });
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.productId;

    const productExists = await Product.exists({ _id: productId });
    if (!productExists) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    await Inventory.deleteOne({ product: productId });

    const deletedProduct = await Product.deleteOne({ _id: productId });
    res.status(200).json(deletedProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { showAllProducts, createProduct, deleteProduct };
