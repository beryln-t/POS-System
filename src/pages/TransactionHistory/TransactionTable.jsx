export default function ({ transactions, voidTransaction }) {
  return (
    <div className="container flex flex-col bg-neutral-50 shadow-xl w-10/12 h-full overflow-hidden p-5">
      <h1 className="text-xl font-black text-center my-2 underline underline-offset-8">
        Transaction History
      </h1>
      <div className="overflow-x-auto overflow-y-auto max-h-full">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>Purchased Items</th>
              <th>Total Amount</th>

              <th>Transaction Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction._id}>
                <td>{transaction._id}</td>
                <td>
                  {transaction.purchasedItems.map((item) => (
                    <div key={item._id}>
                      {item.item.name} (${item.purchasedUnitPrice}) x{" "}
                      {item.purchasedQuantity}
                    </div>
                  ))}
                </td>
                <td>
                  {transaction.totalAmount.toLocaleString("en-US", {
                    style: "currency",
                    currency: "SGD",
                  })}
                </td>
                <td>
                  {transaction.transactionStatus === 1
                    ? "Completed"
                    : transaction.transactionStatus === 0
                    ? "Voided"
                    : "Unknown"}
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-error"
                    onClick={() => voidTransaction(transaction._id)}
                    disabled={transaction.transactionStatus === 0}
                  >
                    Void Transaction
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
