import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';
import TermsAndConditionsModal from '@/components/TermsAndConditionsModal';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export const Portfolio = () => {
  const navigate = useNavigate();
  const [portfolioData, setPortfolioData] = useState([]);
  const [portfolioValue, setPortfolioValue] = useState(0);
  const [todayGainLoss, setTodayGainLoss] = useState({ value: 0, percentage: 0 });
  const [overallGainLoss, setOverallGainLoss] = useState({ value: 0, percentage: 0 });
  const [chartData, setChartData] = useState([]);
  const [pieChartData, setPieChartData] = useState([]);
  const [showTerms, setShowTerms] = useState(true);
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");

  const parseDate = (dateString) => {
    const [datePart, timePart] = dateString.split(' ');
    const [day, month, year] = datePart.split('/');
    const [hour, minute, second] = timePart.split(':');
    return new Date(year, month - 1, day, hour, minute, second);
  };

  useEffect(() => {
    fetchPortfolioData();
  }, []);

  const handleAcceptTerms = () => {
    setShowTerms(false);
  };

  const fetchPortfolioData = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:5000/getOrderBook?email=${email}`);
      const data = response.data.map(item => ({
        ...item,
        time: parseDate(item.time)
      }));
      setPortfolioData(data);
      calculatePortfolioMetrics(data);
    } catch (error) {
      console.error("Error fetching portfolio data:", error);
    }
  };

  const calculatePortfolioMetrics = (data) => {
    let totalValue = 0;
    let stockHoldings = {};

    data.forEach(transaction => {
      const { name, quantity, current_price, action } = transaction;
      const transactionValue = current_price * quantity;

      if (action === "BUY") {
        totalValue += transactionValue;
        stockHoldings[name] = (stockHoldings[name] || 0) + quantity;
      } else if (action === "SELL") {
        totalValue -= transactionValue;
        stockHoldings[name] = (stockHoldings[name] || 0) - quantity;
      }
    });

    setPortfolioValue(totalValue);

    // Update chart data
    updateChartData(data);

    // Update pie chart data
    const pieData = Object.entries(stockHoldings)
      .filter(([_, quantity]) => quantity > 0)
      .map(([name, quantity]) => ({ name, value: quantity }));
    setPieChartData(pieData);

    // Calculate today's gain/loss (assuming the last transaction is today's)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayTransactions = data.filter(t => t.time >= today);

    let todayValue = 0;
    todayTransactions.forEach(t => {
      todayValue += t.action === "BUY" ? t.current_price * t.quantity : -t.current_price * t.quantity;
    });

    const todayPercentage = totalValue !== 0 ? (todayValue / totalValue) * 100 : 0;

    setTodayGainLoss({
      value: todayValue,
      percentage: todayPercentage,
    });

    // Calculate overall gain/loss (simplified, assuming first buy price as cost basis)
    const firstBuyPrices = {};
    data.forEach(t => {
      if (t.action === "BUY" && !firstBuyPrices[t.name]) {
        firstBuyPrices[t.name] = t.current_price;
      }
    });

    let overallGain = 0;
    Object.entries(stockHoldings).forEach(([name, quantity]) => {
      if (quantity > 0) {
        const currentPrice = data.find(t => t.name === name).current_price;
        overallGain += (currentPrice - firstBuyPrices[name]) * quantity;
      }
    });

    const overallPercentage = totalValue !== 0 ? (overallGain / totalValue) * 100 : 0;

    setOverallGainLoss({
      value: overallGain,
      percentage: overallPercentage,
    });
  };

  const updateChartData = (data) => {
    const dailyData = data.reduce((acc, transaction) => {
      const date = transaction.time.toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = 0;
      }

      if (transaction.action === "BUY") {
        acc[date] += transaction.quantity * transaction.current_price;
      } else if (transaction.action === "SELL") {
        acc[date] -= transaction.quantity * transaction.current_price;
      }

      return acc;
    }, {});

    let cumulativeValue = 0;
    const newChartData = Object.entries(dailyData).map(([date, value]) => {
      cumulativeValue += value;
      return {
        date,
        value: cumulativeValue,
      };
    });

    newChartData.sort((a, b) => new Date(a.date) - new Date(b.date));

    setChartData(newChartData);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  };

  const handleDownload = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/download-report');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'reports.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  return (
    <div className="bg-black text-foreground p-4 min-h-screen">
      <TermsAndConditionsModal isOpen={showTerms} onAccept={handleAcceptTerms} />
      <Card className="mb-6 mt-4 bg-black border border-gray-100 text-slate-200">
        <CardHeader>
          <div className="flex justify-between">
            <CardTitle>Portfolio Value</CardTitle>
            <div className="flex gap-2">
              <Button size="sm" variant="ghost" onClick={() => navigate('/home')}>Home</Button>
              <Button size="sm" variant="download" onClick={handleDownload}>Generate Reports</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">
            {formatCurrency(portfolioValue)}
          </div>
          <div className="flex justify-between mt-4">
            <div>
              <div className="text-sm text-muted-foreground">
                Today's Gain/Loss
              </div>
              <div className={`flex items-center ${todayGainLoss.value >= 0 ? "text-green-500" : "text-red-500"}`}>
                {todayGainLoss.value >= 0 ? (
                  <ArrowUpIcon className="mr-1" size={16} />
                ) : (
                  <ArrowDownIcon className="mr-1" size={16} />
                )}
                <span>
                  {formatCurrency(Math.abs(todayGainLoss.value))} (
                  {todayGainLoss.percentage.toFixed(2)}%)
                </span>
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">
                Overall Gain/Loss
              </div>
              <div className={`flex items-center ${overallGainLoss.value >= 0 ? "text-green-500" : "text-red-500"}`}>
                {overallGainLoss.value >= 0 ? (
                  <ArrowUpIcon className="mr-1" size={16} />
                ) : (
                  <ArrowDownIcon className="mr-1" size={16} />
                )}
                <span>
                  {formatCurrency(Math.abs(overallGainLoss.value))} (
                  {overallGainLoss.percentage.toFixed(2)}%)
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6 bg-black border border-gray-100 text-slate-200">
        <CardHeader>
          <CardTitle>Portfolio Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis dataKey="date" stroke="#ffffff" />
                <YAxis stroke="#ffffff" />
                <Tooltip
                  formatter={(value) => formatCurrency(value)}
                  contentStyle={{ backgroundColor: "#333", border: "none" }}
                  labelStyle={{ color: "#fff" }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#8884d8"
                  strokeWidth={2}
                  dot={{ r: 4, fill: "#8884d8" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-black border border-gray-100 text-white">
          <CardHeader>
            <CardTitle>Stock Holdings</CardTitle>
          </CardHeader>
          <CardContent>
            {pieChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p>Loading chart data...</p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-black border border-gray-100 text-slate-200">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Stock</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {portfolioData.slice(-5).reverse().map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{transaction.name}</TableCell>
                    <TableCell
                      className={
                        transaction.action === "BUY"
                          ? "text-green-500"
                          : "text-red-500"
                      }
                    >
                      {transaction.action}
                    </TableCell>
                    <TableCell>{transaction.quantity}</TableCell>
                    <TableCell>
                      {formatCurrency(transaction.current_price)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};