import React, { useState, useEffect } from "react";
import axios from "axios";
import { ArrowUpCircle, ArrowDownCircle, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

export const Watchlist = () => {
  const [stocks, setStocks] = useState({});
  const [activeCategory, setActiveCategory] = useState("top_gainers");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStocks = async () => {
      setLoading(true);
      try {
        // const response = await axios.get(
        //   "https://www.alphavantage.co/query?function=TOP_GAINERS_LOSERS&apikey=QCGYT3S83M52SL5L"
        // );
        const limitedStocks = Object.fromEntries(
          Object.entries(response.data).map(([key, value]) => [
            key,
            value.slice(0, 8),
          ])
        );
        setStocks(limitedStocks);
        setError(null);
      } catch (err) {
        setError("Failed to fetch stock data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchStocks();
  }, []);

  const renderStockList = () => {
    if (loading) {
      return <p className="text-center py-2">Loading...</p>;
    }

    if (error) {
      return (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      );
    }

    return stocks[activeCategory]?.map((stock) => (
      <div
        key={stock.ticker}
        className="flex justify-between items-center py-1 border-b last:border-b-0"
      >
        <div>
          <h3 className="text-sm text-slate-200 font-semibold">
            {stock.ticker}
          </h3>
          <p className="text-xs text-gray-500">${stock.price}</p>
        </div>
        <div className="text-right">
          <p
            className={`text-xs ${
              stock.change_amount.startsWith("-")
                ? "text-red-500"
                : "text-green-500"
            }`}
          >
            {stock.change_amount} ({stock.change_percentage})
          </p>
          <p className="text-xs text-gray-400">Vol: {stock.volume}</p>
        </div>
      </div>
    ));
  };

  return (
    <Card className="w-full bg-black">
      <CardHeader className="space-y-2 pb-2">
        <CardTitle className="text-lg font-bold text-white mb-2">
          Stock Watchlist
        </CardTitle>
        <div className="flex flex-col gap-2">
          <Button
            variant={activeCategory === "top_gainers" ? "default" : "outline"}
            onClick={() => setActiveCategory("top_gainers")}
            className="w-full text-xs py-1 px-2 justify-start"
          >
            <ArrowUpCircle className="mr-2 h-4 w-4" />
            Top Gainers
          </Button>
          <Button
            variant={activeCategory === "top_losers" ? "default" : "outline"}
            onClick={() => setActiveCategory("top_losers")}
            className="w-full text-xs py-1 px-2 justify-start"
          >
            <ArrowDownCircle className="mr-2 h-4 w-4" />
            Top Losers
          </Button>
          <Button
            variant={
              activeCategory === "most_actively_traded" ? "default" : "outline"
            }
            onClick={() => setActiveCategory("most_actively_traded")}
            className="w-full text-xs py-1 px-2 justify-start"
          >
            <TrendingUp className="mr-2 h-4 w-4" />
            Most Active
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-2">{renderStockList()}</CardContent>
    </Card>
  );
};
