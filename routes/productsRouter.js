const express = require("express");
const router = express.Router();
const productsCtrl = require("../controllers/productsCtrl");

router.post("/", productsCtrl.createProduct);
router.get("/", productsCtrl.showAllProducts);
router.delete("/:productId", productsCtrl.deleteProduct);

module.exports = router;
