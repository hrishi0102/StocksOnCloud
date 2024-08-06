import React, { useState } from "react";
import axios from "axios";

const TradeUI = ({ onOrderFilled }) => {
  const [formData, setFormData] = useState({
    baseAsset: "",
    price: "",
    quantity: "",
    side: "buy",
    type: "limit",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const orderData = {
      ...formData,
      price: parseFloat(formData.price),
      quantity: parseFloat(formData.quantity),
    };

    try {
      const response = await axios.post(
        "http://localhost:3002/api/v1/order",
        orderData
      );
      onOrderFilled(response.data);
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="baseAsset" className="block text-sm font-medium text-gray-300 mb-1">
            Base Asset
          </label>
          <input
            type="text"
            id="baseAsset"
            name="baseAsset"
            value={formData.baseAsset}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            placeholder="e.g. APPLE"
          />
        </div>
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-300 mb-1">
            Price
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            placeholder="Enter price"
            step="0.01"
          />
        </div>
        <div>
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-300 mb-1">
            Quantity
          </label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            placeholder="Enter quantity"
            step="0.0001"
          />
        </div>
        <div className="flex space-x-4">
          <div className="w-1/2">
            <label htmlFor="side" className="block text-sm font-medium text-gray-300 mb-1">
              Side
            </label>
            <select
              id="side"
              name="side"
              value={formData.side}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            >
              <option value="buy">Buy</option>
              <option value="sell">Sell</option>
            </select>
          </div>
          <div className="w-1/2">
            <label htmlFor="type" className="block text-sm font-medium text-gray-300 mb-1">
              Type
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            >
              <option value="limit">Limit</option>
              <option value="market">Market</option>
            </select>
          </div>
        </div>
      </div>
      <button
        type="submit"
        className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition duration-200"
      >
        Place Order
      </button>
    </form>
  );
};

export default TradeUI;