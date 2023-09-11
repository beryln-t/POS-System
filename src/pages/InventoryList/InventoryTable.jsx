export default function ({ inventory, onEditQuantity }) {
  return (
    <div className="container flex flex-col bg-neutral-50 shadow-xl w- h-full overflow-hidden p-5">
      <h1 className="text-xl font-black text-center my-2 underline underline-offset-8">
        Inventory
      </h1>
      <div className="overflow-x-auto overflow-y-auto max-h-full">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Stock Count</th>
              <th>Product Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((item) => (
              <tr key={item._id}>
                <td>{item.product.name}</td>
                <td>{item.stockCount}</td>
                <td>{item.status}</td>
                <td>
                  <button
                    className="btn btn-xs btn-info"
                    onClick={() => {
                      console.log("Button clicked for item:", item);
                      onEditQuantity(item);
                    }}
                  >
                    Edit Quantity
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
