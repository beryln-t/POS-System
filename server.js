const express = require("express");
const path = require("path");
const logger = require("morgan");
require("dotenv").config();
require("./config/database");

//define routes
const productsRouter = require("./routes/productsRouter");
const inventoryRouter = require("./routes/inventoryRouter");
const transactionsRouter = require("./routes/transactionsRouter");

const app = express();
const port = process.env.PORT || 3000;

app.use(logger("dev"));
app.use(express.json());
app.use(express.static(path.join(__dirname, "dist")));

//use routes
app.use("/api/products", productsRouter);
app.use("/api/inventory", inventoryRouter);
app.use("/api/transactions", transactionsRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});
