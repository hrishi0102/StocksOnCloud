import React, { useState } from "react";
import OrderBook from "../components/OrderBook";
import TradeUI from "../components/TradeUIO";
import TransactionTable from "../components/TransactionTableO";
import { Appbar } from "@/components/Appbar";

export function Order() {
  const [orderBook, setOrderBook] = useState({ bids: [], asks: [] });
  const [transactions, setTransactions] = useState([]);

  const handleOrderFilled = (order) => {
    setOrderBook(order.orderBook);
    setTransactions([...transactions, ...order.fills]);
  };

  return (
    <div className="bg-black min-h-screen">
      <Appbar />
      <div className="container mx-auto p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Panel - TradeUI */}
          <div className="lg:w-1/3">
            <div className="bg-gray-800 rounded-lg shadow-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Trade</h2>
              <TradeUI onOrderFilled={handleOrderFilled} />
            </div>
          </div>

          {/* Right Panel - OrderBook and TransactionTable */}
          <div className="lg:w-2/3 flex flex-col gap-6">
            {/* OrderBook */}
            <div className="bg-gray-800 rounded-lg shadow-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Order Book</h2>
              <OrderBook orderBook={orderBook} />
            </div>

            {/* TransactionTable */}
            <div className="bg-gray-800 rounded-lg shadow-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Recent Transactions</h2>
              <TransactionTable transactions={transactions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}