import { Routes, Route } from "react-router";
import React from "react";

//Components
import NavBar from "../components/NavBar/NavBar";

//Pages
import Home from "../pages/Home/Home";
import InventoryList from "../pages/InventoryList/InventoryList";
import TransactionHistory from "../pages/TransactionHistory/TransactionHistory";

function App() {
  return (
    <main className="h-screen flex flex-col h-screen">
      <NavBar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/transactions" element={<TransactionHistory />} />
        <Route path="/inventory" element={<InventoryList />} />
      </Routes>
    </main>
  );
}

export default App;
