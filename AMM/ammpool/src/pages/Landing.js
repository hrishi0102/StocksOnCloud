import React, { useEffect, useState } from "react";
import abi from "../contracts/AMMPool.json";
import address from "../contracts/address.json";
import Loader from './Loader';
import { Bar, Line, Pie } from "react-chartjs-2";
// import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
// import axios from "axios";
const ethers = require("ethers");

// ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);
ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend);

const stocks = [
  { value: "ETH", label: "Ethereum" },
  { value: "USDC", label: "USDC Token" },
];
const desiredChainId = 11155111;

export const Landing = () => {
  const [selectedStock, setSelectedStock] = useState(stocks[0].value);
  const [price, setPrice] = useState("");
  const [buyquantity, setbuyQuantity] = useState(1);
  const [sellquantity, setsellQuantity] = useState(1);
  const [isConnected, setConnected] = useState(false);
  const [connectedMsg, setConnectedMsg] = useState("Please connect your wallet");
  const [provider, setProvider] = useState("");
  const [signer, setSigner] = useState("");
  const [buyAmount, setbuyAmount] = useState(0);
  const [sellAmount, setsellAmount] = useState(0);
  const [constant_product, setConstantProduct] = useState();
  const [getDataFeedETH, setDataFeedETH] = useState();
  const [getDataFeedUSDC, setDataFeedUSDC] = useState();
  const [contract, setContract] = useState();
  const [contractwithsigner, setContractwithsigner] = useState();
  const [txncomplete, setTxnComplete] = useState(false);
  const [liquidityAmount, setLiquidityAmount] = useState(0);
//   const email = localStorage.getItem("Email");
  const [constantProductHistory, setConstantProductHistory] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [usdc_balance, setUSDCBalance] = useState(0);
  const [eth_balance, setETHBalance] = useState(0);

  useEffect(() => {
    if (isConnected) {
      const interval = setInterval(() => {
        updateData();
      }, 10000); // Update every 10 seconds

      return () => clearInterval(interval);
    }
  }, [isConnected]);


  const pieChartData = {
    labels: ['ETH', 'USDC'],
    datasets: [
      {
        data: [eth_balance, usdc_balance],
        backgroundColor: ['rgba(75, 192, 192, 0.8)', 'rgba(255, 99, 132, 0.8)'],
        borderColor: ['rgb(75, 192, 192)', 'rgb(255, 99, 132)'],
        borderWidth: 1
      }
    ]
  };
  
  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'white'
        }
      },
      title: {
        display: true,
        text: 'Total Value Locked Distribution',
        color: 'white'
      },
    },
  };

  const updateData = async () => {
    if (contract) {
      await readValuesfromContract();
      setConstantProductHistory(prev => [...prev, constant_product].slice(-20));
    }
  };

  const priceChartData = {
    labels: ['ETH', 'USDC'],
    datasets: [
      {
        label: 'Current Price',
        data: [getDataFeedETH, getDataFeedUSDC],
        backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)'],
        borderColor: ['rgb(75, 192, 192)', 'rgb(255, 99, 132)'],
        borderWidth: 1
      }
    ]
  };

  const priceChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Current Token Prices',
        color: 'white'
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { color: 'white' }
      },
      x: {
        ticks: { color: 'white' }
      }
    },
  };

  const readValuesfromContract = async() => {
    const contract = new ethers.Contract(
      address.address,
      abi.abi,
      provider
    );
    let val = await contract.getConstantProduct();
    setConstantProduct(parseInt(val));
    val= await contract.getDataFeedETH();
    let decimals = 10**(parseInt(val[1]))
    setDataFeedETH(parseInt(val[0])/decimals);
    val = await contract.getDataFeedUSDC();
    decimals = 10**(parseInt(val[1]))
    setDataFeedUSDC(parseInt(val[0])/decimals);
    val = await contract.getbuyAssetAmt(1);
    setbuyAmount(parseInt(val));
    val = await contract.getsellAssetAmt(1);
    setsellAmount(parseInt(val));
    val = await contract.USDC_BALANCE();
    setUSDCBalance(parseInt(val));
    val = await contract.ETH_BALANCE();
    setETHBalance(parseInt(val));
  }

  const buyAsset = async() => {
    setIsProcessing(true);
    try {
      const contractdeployed = new ethers.Contract(
        address.address,
        abi.abi,
        signer
      );
      const tx = await contractdeployed.buyAsset(buyquantity);
      await tx.wait();
      setTxnComplete(true);
      await readValuesfromContract();
    } catch {
      setTxnComplete(false);
      console.log("something went wrong");
      setIsProcessing(false);
    } finally {
      setIsProcessing(false);
    }
  }

  const addLiquidityETH = async() => {
    if(liquidityAmount < 0){
      return false;
    }
    setIsProcessing(true);
    try{
      const contractdeployed = new ethers.Contract(
        address.address,
        abi.abi,
        signer
      );
      const tx = await contractdeployed.addLiquidityETH(liquidityAmount);
      await tx.wait();
      setTxnComplete(true);
      await readValuesfromContract();
    } catch{
      setTxnComplete(false);
      console.log("something went wrong");
      setIsProcessing(false);
    } finally {
      setIsProcessing(false);
    }
}

  const addLiquidityUSDC = async() => {
    if(liquidityAmount < 0){
      return false;
    }
    setIsProcessing(true);
    try{
      const contractdeployed = new ethers.Contract(
        address.address,
        abi.abi,
        signer
      );
      const tx = await contractdeployed.addLiquidityUSDC(liquidityAmount);
      await tx.wait();
      setTxnComplete(true);
      await readValuesfromContract();
    } catch{
      setTxnComplete(false);
      console.log("something went wrong");
      setIsProcessing(false);
    } finally {
      setIsProcessing(false);
    }
}

  const sellAsset = async() => {
    setIsProcessing(true);
    try{
      const contractwsigner = new ethers.Contract(
        address.address,
        abi.abi,
        signer
      )
      const tx = await contractwsigner.sellAsset(sellquantity);
      await tx.wait();
      setTxnComplete(true);
      await readValuesfromContract();
    } catch{
      console.log("something went wrong");
      setTxnComplete(false);
      setIsProcessing(false);
    } finally {
      setIsProcessing(false);
    }
    
  }

  const resetBalance = async() => {
    setIsProcessing(true);
    try{
      const contract = new ethers.Contract(
        address.address,
        abi.abi,
        signer
      )
      const tx = await contract.resetBal();
      await tx.wait();
      setTxnComplete(true);
      await readValuesfromContract();
    } catch{
      console.log("something went wrong")
      setTxnComplete(false);
      setIsProcessing(false);
    } finally{
      setIsProcessing(false);
    }
    
  } 

  const setbuyChangeQuantity = async(value) => {
    if(value<=0){
      setbuyQuantity(1);
      return ;
    }
    setbuyQuantity(value);
    const contract = new ethers.Contract(
      address.address,
      abi.abi,
      provider
    )
    let val = await contract.getbuyAssetAmt(value);
    setbuyAmount(parseInt(val));
  }

  const setsellChangeQuantity = async(value) => {
    if(value<=0){
      setbuyQuantity(1);
      return ;
    }
    setsellQuantity(value);
    const contract = new ethers.Contract(
      address.address,
      abi.abi,
      provider
    )
    let val = await contract.getsellAssetAmt(value);
    setsellAmount(parseInt(val));
  }


  const connectWallet = async() => {
    if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const account = accounts[0];
        const provider = new ethers.BrowserProvider(window.ethereum);
        setProvider(provider);
        const network = await provider.getNetwork();
        console.log(network.chainId);
        console.log(address.address);
        if(network.chainId != desiredChainId){
          try {
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: `0x${desiredChainId.toString(16)}` }], // Convert ID to hex string
            });

          } catch (switchError) {
            // Handle errors (e.g., user rejection, unsupported network)
            if (switchError.code === 4902) {
              console.log('User rejected network switch');
            } else if (switchError.code === -32602) {
              console.log('Network switch not supported');
            } else {
              console.error('Error switching network:', switchError);
            }
          }
        }
        const signer = await provider.getSigner();
        setSigner(signer);
        const contract = new ethers.Contract(
            address.address, 
            abi.abi,
            provider
        )
        const contractwithsigner = contract.connect(signer);
        setConnectedMsg(account);
        setConnected(true);
        setContract(contract);
        setContractwithsigner(contractwithsigner);
        // const contractwithsigner = contract.connect(signer);
        let val = await contract.getConstantProduct();
        setConstantProduct(parseInt(val));
        val= await contract.getDataFeedETH();
        let decimals = 10**(parseInt(val[1]))
        setDataFeedETH(parseInt(val[0])/decimals);
        val = await contract.getDataFeedUSDC();
        decimals = 10**(parseInt(val[1]))
        setDataFeedUSDC(parseInt(val[0])/decimals);
        val = await contract.getbuyAssetAmt(1);
        setbuyAmount(parseInt(val));
        val = await contract.getsellAssetAmt(1);
        setsellAmount(parseInt(val));
    }

  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Trade Crypto</h1>
          <button
            onClick={connectWallet}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
          >
            {isConnected ? "Connected" : "Connect Wallet"}
          </button>
        </header>

        {isConnected && (
          <div className="space-y-8">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <p className="text-lg mb-2">Connected Address: <span className="font-mono">{connectedMsg}</span></p>
              {txncomplete && <p className="text-green-400 mt-2">Transaction completed!</p>}
              <p className="text-xl font-semibold mt-4">Total Value Locked: {constant_product}</p>
              <p>Current ETH Price: ${getDataFeedETH?.toFixed(2)}</p>
              <p>Current USDC Price: ${getDataFeedUSDC?.toFixed(2)}</p>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-4">Pool Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Token Price Chart</h3>
                  <Bar data={priceChartData} options={priceChartOptions} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Total Value Locked: {constant_product}</h3>
                  <Pie data={pieChartData} options={pieChartOptions} />
                </div>
              </div>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-4">Buy Asset</h2>
              <input
                type="number"
                placeholder="Price"
                value={buyAmount}
                disabled
                className="w-full bg-gray-700 text-white p-3 rounded-lg mb-4"
              />
              <input
                type="number"
                placeholder="Quantity"
                value={buyquantity}
                onChange={(e) => setbuyChangeQuantity(e.target.value)}
                className="w-full bg-gray-700 text-white p-3 rounded-lg mb-4"
              />
              <button onClick={buyAsset} disabled={isProcessing} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center">
                {isProcessing ? <Loader /> : 'Buy'}
              </button>
              
            </div>

            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-4">Sell Asset</h2>
              <input
                type="number"
                placeholder="Price"
                value={sellAmount}
                disabled
                className="w-full bg-gray-700 text-white p-3 rounded-lg mb-4"
              />
              <input
                type="number"
                placeholder="Quantity"
                value={sellquantity}
                onChange={(e) => setsellChangeQuantity(e.target.value)}
                className="w-full bg-gray-700 text-white p-3 rounded-lg mb-4"
              />
              <button onClick={sellAsset} disabled={isProcessing} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center">
                {isProcessing ? <Loader /> : 'Sell'}
              </button>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-4">Add Liquidity</h2>
              <input
                type="number"
                placeholder="Quantity"
                value={liquidityAmount}
                onChange={(e) => setLiquidityAmount(e.target.value)}
                className="w-full bg-gray-700 text-white p-3 rounded-lg mb-4"
              />
              <div className="grid grid-cols-2 gap-4">
              <button onClick={addLiquidityETH} disabled={isProcessing} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center">
                {isProcessing ? <Loader /> : 'Add ETH Liquidity'}
              </button>
              <button onClick={addLiquidityUSDC} disabled={isProcessing} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center">
                {isProcessing ? <Loader /> : 'Add USDC Liquidity'}
              </button>
              </div>
            </div>

            <button onClick={resetBalance} disabled={isProcessing} className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center">
                {isProcessing ? <Loader /> : 'Reset Pool'}
              </button>
          </div>
        )}
      </div>
    </div>
  );
};