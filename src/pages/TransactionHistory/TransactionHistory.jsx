import { useState, useEffect } from "react";
import TransactionTable from "./TransactionTable";

export default function () {
  const [transactions, setTransactions] = useState([]);

  const fetchTransactions = async () => {
    const response = await fetch(`/api/transactions/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if (data) {
      setTransactions(data);
      console.log("transactionshistory ", data);
    }
  };

  const voidTransaction = async (transactionId) => {
    try {
      const response = await fetch(`/api/transactions/${transactionId}/void`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        alert("Transaction voided successfully!");
        fetchTransactions();
      } else {
        const data = await response.json();
        alert(`Failed to void transaction: ${data.error}`);
      }
    } catch (error) {
      console.error("An error occurred:", error);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div className="flex justify-center bg-gray-100 gap-x-4 p-7 h-[calc(100vh-60px)]">
      <TransactionTable
        transactions={transactions}
        voidTransaction={voidTransaction}
      />
    </div>
  );
}
