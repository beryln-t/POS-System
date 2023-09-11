export default function ({ products, handleOnClickItem }) {
  return (
    <div className="container bg-neutral-50 shadow-xl w-2/3 h-full overflow-hidden">
      <div className="grid grid-cols-4 gap-4 p-4 overflow-y-auto max-h-full">
        {products.map((product) => (
          <div
            key={product._id}
            className="stats shadow"
            onClick={(e) => handleOnClickItem(product._id)}
          >
            <div
              className={`stat ${
                product.status === "Active"
                  ? "bg-teal-200"
                  : product.status === "Out of Stock"
                  ? "bg-red-300"
                  : "" // default class or you can provide another class
              }`}
            >
              <div className="stat-value">{product.name}</div>
              <div className="stat-title">
                {product.unitPrice.toLocaleString("en-US", {
                  style: "currency",
                  currency: "SGD",
                })}
              </div>
              <div className="stat-desc">Stock count: {product.stockCount}</div>
              <div className="stat-desc">Status: {product.status}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
