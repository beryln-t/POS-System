import { useState } from "react";

export default function ({ isOpen, item, onSave, onClose, initialQuantity }) {
  const [newQuantity, setNewQuantity] = useState(initialQuantity);

  if (!isOpen) {
    return null;
  }

  const handleSave = () => {
    onSave(item._id, newQuantity);
  };

  return (
    <div className="fixed top-0 left- w-full h-full flex items-center justify-center">
      <div className="modal-content bg-gray-300 p-6 rounded shadow-lg text-center flex flex-col">
        <h2>
          Edit stock count for:
          <div className="font-black">{item.product.name}</div>
        </h2>
        <input
          type="number"
          min="0"
          value={newQuantity}
          onChange={(e) => setNewQuantity(e.target.value)}
          onBlur={(e) => {
            const value = Math.max(0, Number(e.target.value));
            setNewQuantity(value);
          }}
          className="my-4 text-center"
        />
        <div className="flex justify-center space-x-4">
          <button className="btn btn-sm btn-success" onClick={handleSave}>
            Save
          </button>
          <button className="btn btn-sm btn-error" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
