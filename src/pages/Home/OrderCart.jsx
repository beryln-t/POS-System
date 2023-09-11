export default function ({
  purchaseItems,
  handleOnClickItem,
  products,
  handleRemoveItem,
  handleCancel,
  handleSave,
  total,
}) {
  return (
    <div className="container bg-neutral-50 shadow-xl w-2/5 h-full overflow-hidden">
      <div className="flex flex-col">
        <h1 className="text-xl font-black text-center my-2 underline underline-offset-8">
          Shopping Cart
        </h1>
        <div className="overflow-x-auto">
          <table className="table table-sm my-2 table-zebra">
            <thead>
              <tr>
                <th>Product name</th>
                <th>Order Quantity</th>
                <th>Unit Price</th>
                <th>Subtotal</th>
                <th>action button</th>
              </tr>
            </thead>
            <tbody>
              {purchaseItems.map((purchaseItem) => {
                const product = products.find(
                  (prod) => prod._id === purchaseItem.item
                );
                const stockCount = product.stockCount;

                return (
                  <tr key={purchaseItem.item}>
                    <th>{product.name}</th>
                    <td>
                      <div className="flex items-center">
                        <button
                          onClick={() =>
                            handleOnClickItem(purchaseItem.item, -1)
                          }
                          className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-1 px-2 rounded-l text-xs"
                          disabled={purchaseItem.purchasedQuantity === 0}
                        >
                          -
                        </button>
                        <input
                          disabled
                          className="text-center w-16 py-1 px-2 border-t border-b border-r border-gray-300 text-xs"
                          value={purchaseItem.purchasedQuantity}
                        ></input>
                        <button
                          onClick={() =>
                            handleOnClickItem(purchaseItem.item, 1)
                          }
                          className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-1 px-2 rounded-r text-xs"
                          disabled={
                            purchaseItem.purchasedQuantity >= stockCount
                          }
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td>
                      {purchaseItem.purchasedUnitPrice.toLocaleString("en-US", {
                        style: "currency",
                        currency: "SGD",
                      })}
                    </td>
                    <td>
                      {(
                        purchaseItem.purchasedUnitPrice *
                        purchaseItem.purchasedQuantity
                      ).toLocaleString("en-US", {
                        style: "currency",
                        currency: "SGD",
                      })}
                    </td>
                    <td>
                      <button
                        className="btn btn-xs btn-error"
                        onClick={() => handleRemoveItem(purchaseItem.item)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <div className="divider"></div>

      <div className="flex justify-end pr-4 mr-2 mt-6 text-2xl font-black">
        Total:
        {total.toLocaleString("en-US", {
          style: "currency",
          currency: "SGD",
        })}
      </div>
      <div className="flex justify-end mt-6 pr-4 text-xl font-black gap-x-4">
        <button className="btn btn-md btn-success" onClick={handleSave}>
          Checkout
        </button>
        <button className="btn btn-md btn-error" onClick={handleCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}
