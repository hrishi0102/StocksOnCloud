import React, { useEffect, useRef, useState } from "react";
import { Chart } from "../components/Chart";
import { Watchlist } from "../components/Watchlist";
import { MarketBar } from "../components/MarketBar";
import { Trade } from "../components/Trade";
import { Appbar } from "../components/Appbar";

export const Home = () => {
  // const apiUrl = `http://127.0.0.1:5000/echios?symbol=msft`;
  const [data, setData] = useState([
    { time: 1690761600, value: 403.87 },
    { time: 1690848000, value: 403.45 },
    { time: 1690934400, value: 403.4 },
    { time: 1691020800, value: 403.21 },
    { time: 1691107200, value: 403.38 },
    { time: 1691193600, value: 403.54 },
    { time: 1691280000, value: 403.32 },
    { time: 1691366400, value: 402.96 },
    { time: 1691452800, value: 403.05 },
    { time: 1691539200, value: 403.41 },
    { time: 1691625600, value: 403.73 },
    { time: 1691712000, value: 403.42 },
    { time: 1691798400, value: 402.99 },
    { time: 1691884800, value: 402.88 },
    { time: 1691971200, value: 402.34 },
    { time: 1692057600, value: 402.76 },
    { time: 1692144000, value: 403.12 },
    { time: 1692230400, value: 402.89 },
    { time: 1692316800, value: 403.45 },
    { time: 1692403200, value: 403.21 },
  ]);

  const fetchData = async () => {
    try {
      const response = await fetch(apiUrl);
      const result = await response.json();
      if (result) {
        const newDataPoint = {
          time: result.time,
          value: parseFloat(result.price),
        };
        setData((prevData) => [...prevData, newDataPoint]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // useEffect(() => {
  //   const intervalId = setInterval(fetchData, 3000);
  //   return () => clearInterval(intervalId);
  // }, []);

  useEffect(() => {
    if (data) {
      console.log("Updated stock data:", data);
    }
  }, [data]);

  return (
    <div className="bg-black">
      <Appbar />
      <div className="flex flex-row flex-1">
        <div className="flex flex-col flex-1">
          <MarketBar data={data} />
          <div className="flex flex-row h-[920px] border-y border-slate-800">
            <div className="flex flex-col w-[250px] overflow-hidden border-r border-slate-800">
              <Watchlist />
            </div>
            <div className="flex flex-col flex-1">
              <Chart className="mt-2" data={data} />
            </div>
          </div>
        </div>
        <div className="w-[10px] flex-col border-slate-800 border-l"></div>
        <div>
          <div className="flex flex-col w-[250px]">
            <Trade data={data} />
          </div>
        </div>
      </div>
    </div>
  );
};
