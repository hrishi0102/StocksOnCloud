import React from "react";

const TransactionTable = ({ transactions }) => {
  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold text-white text-center mb-4">Recent Transactions</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-300">
          <thead className="text-xs uppercase bg-gray-800 text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">Trade ID</th>
              <th scope="col" className="px-6 py-3">Price</th>
              <th scope="col" className="px-6 py-3">Quantity</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction, index) => (
              <tr 
                key={index} 
                className="bg-gray-800 border-b border-gray-700 hover:bg-gray-700 transition-colors duration-200"
              >
                <td className="px-6 py-4 font-medium text-white">{transaction.tradeId}</td>
                <td className="px-6 py-4">
                  <span className={transaction.side === 'buy' ? 'text-green-400' : 'text-red-400'}>
                    ${parseFloat(transaction.price).toFixed(4)}
                  </span>
                </td>
                <td className="px-6 py-4">{parseFloat(transaction.qty).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionTable;