const express = require("express");
const router = express.Router();
const transactionsCtrl = require("../controllers/transactionsCtrl");

router.get("/", transactionsCtrl.showHistory);
router.post("/", transactionsCtrl.addTransaction);
router.put("/:transactionId/void", transactionsCtrl.voidTransaction);

module.exports = router;
