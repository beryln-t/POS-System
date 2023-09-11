import React from "react";
import { useState, useEffect } from "react";
import OrderCart from "./OrderCart";
import ProductGrid from "./ProductGrid";

export default function () {
  const [products, setProducts] = useState([]);
  const [inventoryDetails, setInventoryDetails] = useState([]);
  const [purchaseItems, setPurchaseItems] = useState([]);

  const total = purchaseItems.reduce(
    (acc, purchaseItem) =>
      acc + purchaseItem.purchasedUnitPrice * purchaseItem.purchasedQuantity,
    0
  );

  const linkedProducts = products.reduce((acc, product) => {
    const inventoryItem = inventoryDetails.find(
      (detail) => detail.product._id.toString() === product._id.toString()
    );
    if (inventoryItem) {
      acc.push({
        ...product,
        stockCount: inventoryItem.stockCount,
        status: inventoryItem.stockCount > 0 ? "Active" : "Out of Stock",
      });
    }
    return acc;
  }, []);

  const getNewItemInformation = (item, newQuantity) => {
    return {
      ...item,
      purchasedQuantity: newQuantity,
      itemTotal: newQuantity * item.purchasedUnitPrice,
    };
  };

  const handleOnClickItem = (productId, addQuantity = 1) => {
    const productFromStock = linkedProducts.find(
      (product) => product._id === productId
    );

    if (productFromStock.stockCount <= 0) {
      alert("This product is out of stock!");
      return;
    }
    const purchasedItemsCopy = [...purchaseItems];
    const indexOfPurchasedBeforeItem = purchasedItemsCopy.findIndex(
      (item) => item.item === productId
    );

    if (indexOfPurchasedBeforeItem !== -1) {
      const purchasedBeforeItem =
        purchasedItemsCopy[indexOfPurchasedBeforeItem];
      const newItem = getNewItemInformation(
        purchasedBeforeItem,
        purchasedBeforeItem.purchasedQuantity + addQuantity
      );

      const newItemQuantity = newItem.purchasedQuantity;

      const stockQuantity = linkedProducts.find(
        (product) => product._id === newItem.item
      ).stockCount;

      if (newItemQuantity === 0) {
        handleRemoveItem(newItem.item);
        return;
      }

      if (newItemQuantity > stockQuantity) {
        alert("Order quantity is over stock limit.");
        return;
      }

      purchasedItemsCopy.splice(indexOfPurchasedBeforeItem, 1, newItem);
      setPurchaseItems(purchasedItemsCopy);
      return;
    }

    const purchasedItemPrice = products.find(
      (product) => product._id === productId
    );

    const newPurchasedItem = {
      item: productId,
      purchasedUnitPrice: purchasedItemPrice.unitPrice,
      purchasedQuantity: addQuantity,
      itemTotal: purchasedItemPrice.unitPrice * 1,
    };

    setPurchaseItems([...purchaseItems, newPurchasedItem]);
  };

  const fetchProducts = async () => {
    const response = await fetch(`/api/products/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if (data) {
      setProducts(data);
      console.log("data ", data);
    }
  };

  const fetchInventoryDetails = async () => {
    const response = await fetch(`/api/inventory/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if (data) {
      setInventoryDetails(data);
      console.log("inventoryData", data);
    }
  };

  const handleRemoveItem = (itemId) => {
    console.log("hello");
    const newPurchasedItemsAfterRemoval = purchaseItems.filter(
      (item) => item.item !== itemId
    );
    setPurchaseItems(newPurchasedItemsAfterRemoval);
  };

  const handleCancel = () => {
    setPurchaseItems([]);
  };

  const handleSave = async () => {
    const data = { purchasedItems: purchaseItems, totalAmount: total };
    console.log("purchaseitem", purchaseItems);
    console.log("totalamountis", total);
    try {
      const response = await fetch(`/api/transactions/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (response.ok) {
        console.log("Transaction saved successfully!", responseData);
        setPurchaseItems([]);
        fetchInventoryDetails();
        alert("Transaction recorded.");
      } else {
        alert("Failed to save transaction!");
        console.error("Failed to save transaction!", responseData);
      }
    } catch (error) {
      console.error("An error occurred while saving the transaction:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchInventoryDetails();
  }, []);

  return (
    <div className="flex items-center bg-gray-100 gap-x-4 p-7 h-[calc(100vh-60px)]">
      <ProductGrid
        products={linkedProducts}
        handleOnClickItem={handleOnClickItem}
      />
      <OrderCart
        purchaseItems={purchaseItems}
        products={linkedProducts}
        total={total}
        handleOnClickItem={handleOnClickItem}
        handleRemoveItem={handleRemoveItem}
        handleCancel={handleCancel}
        handleSave={handleSave}
      />
    </div>
  );
}
