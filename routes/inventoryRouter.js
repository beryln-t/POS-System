const express = require("express");
const router = express.Router();
const inventoryCtrl = require("../controllers/inventoryCtrl");

router.get("/", inventoryCtrl.showInventory);
router.patch("/:inventoryId/stock", inventoryCtrl.editStock);
router.get("/new", inventoryCtrl.showNewProducts);
router.post("/", inventoryCtrl.addToInventory);
router.delete("/:inventoryId", inventoryCtrl.remove);

module.exports = router;
