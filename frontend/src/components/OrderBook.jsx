import React from "react";

const OrderBook = ({ orderBook }) => {
  const sortedBids = [...orderBook.bids].sort((a, b) => b.price - a.price);
  const sortedAsks = [...orderBook.asks].sort((a, b) => a.price - b.price);

  const TableHeader = ({ title, textColor }) => (
    <div className={`text-center ${textColor} text-lg font-bold mb-2`}>{title}</div>
  );

  const TableRow1 = ({ price, quantity, bgColor }) => (
    <div className={`flex justify-between py-2 px-4 ${bgColor} bg-opacity-10`}>
      <span>{quantity.toFixed(2)}</span>
      <span>{price.toFixed(4)}</span>
    </div>
  );

  const TableRow2 = ({ price, quantity, bgColor }) => (
    <div className={`flex justify-between py-2 px-4 ${bgColor} bg-opacity-10`}>
      <span>{price.toFixed(4)}</span>
      <span>{quantity.toFixed(2)}</span>
    </div>
  );

  return (
    <div className="flex bg-gray-900 text-white p-6 rounded-lg shadow-xl">
      <div className="w-1/2 pr-4 border-r border-gray-700">
        <TableHeader title="Bids" textColor="text-green-400" />
        <div className="font-semibold mb-2 flex justify-between px-4 text-gray-400">
          <span>Quantity</span>
          <span>Price</span>
        </div>
        {sortedBids.map((bid, index) => (
          <TableRow1 key={index} quantity={bid.quantity} price={bid.price} bgColor="bg-green-500" />
        ))}
      </div>
      <div className="w-1/2 pl-4">
        <TableHeader title="Asks" textColor="text-red-400" />
        <div className="font-semibold mb-2 flex justify-between px-4 text-gray-400">
          <span>Price</span>
          <span>Quantity</span>
        </div>
        {sortedAsks.map((ask, index) => (
          <TableRow2 key={index} price={ask.price} quantity={ask.quantity} bgColor="bg-red-800" />
        ))}
      </div>
    </div>
  );
};

export default OrderBook;