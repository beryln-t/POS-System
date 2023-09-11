import { useState, useEffect } from "react";
import InventoryTable from "./InventoryTable";
import EditQuantity from "./EditQuantity";

export default function () {
  const [inventory, setInventory] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  const openModal = (item) => {
    console.log("Opening modal for item:", item);

    setCurrentItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentItem(null);
  };

  const fetchInventory = async () => {
    const response = await fetch(`/api/inventory/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if (data) {
      setInventory(data);
    }
  };

  const handleSave = async (inventoryId, newQuantity) => {
    if (currentItem && currentItem.stockCount === newQuantity) {
      alert("Quantity is unchanged.");
      return;
    }
    try {
      const response = await fetch(`/api/inventory/${inventoryId}/stock`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ stockCount: newQuantity }), // assuming your endpoint expects a JSON with this format
      });

      if (response.ok) {
        alert("Quantity updated successfully!");
        fetchInventory();
      } else {
        const data = await response.json();
        alert(`Failed to update quantity: ${data.error}`);
      }
    } catch (error) {
      console.error("An error occurred:", error);
      alert("An unexpected error occurred. Please try again.");
    }

    closeModal();
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  return (
    <div className="flex justify-center bg-gray-100 gap-x-4 p-7 h-[calc(100vh-60px)]">
      <InventoryTable inventory={inventory} onEditQuantity={openModal} />
      {currentItem && (
        <EditQuantity
          isOpen={isModalOpen}
          item={currentItem}
          onSave={handleSave}
          onClose={closeModal}
          initialQuantity={currentItem.stockCount}
        />
      )}
    </div>
  );
}
