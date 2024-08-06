import React, { useEffect, useRef } from 'react';
import { createChart } from 'lightweight-charts';

export const Candle = () => {
  const containerRef = useRef(null);
  const chartRef = useRef(null);
  const seriesRef = useRef(null);
  const intervalIdRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      const urlParams = new URLSearchParams(window.location.search);
      const stockSymbol = urlParams.get('key');
      
      let minValue, maxValue;
      if (stockSymbol === 'msft') {
        minValue = 410;
        maxValue = 430;
      } else if (stockSymbol === 'ibm') {
        minValue = 185;
        maxValue = 195;
      } else {
        // Default range if no valid stock symbol is provided
        minValue = 100;
        maxValue = 200;
      }

      const generateRandomPrice = () => {
        return minValue + Math.random() * (maxValue - minValue);
      };

      function generateInitialData(count) {
        const initialData = [];
        const now = new Date();
        for (let i = 0; i < count; i++) {
          const time = new Date(now.getTime() - (count - i) * 5000);
          const open = generateRandomPrice();
          const close = generateRandomPrice();
          const high = Math.max(open, close, generateRandomPrice());
          const low = Math.min(open, close, generateRandomPrice());
          initialData.push({ time: time.getTime() / 1000, open, high, low, close });
        }
        return initialData;
      }

      const chartOptions = {
        layout: {
          textColor: 'white',
          background: { type: 'solid', color: 'black' },
        },
        height: 300,
      };

      const chart = createChart(containerRef.current, chartOptions);



      seriesRef.current = chart.addCandlestickSeries({
        upColor: '#26a69a',
        downColor: '#ef5350',
        borderVisible: false,
        wickUpColor: '#26a69a',
        wickDownColor: '#ef5350',
      });



      const initialData = generateInitialData(60); // Start with 50 candles
      seriesRef.current.setData(initialData);

      seriesRef.current.priceScale().applyOptions({
        autoScale: false, // disables auto scaling based on visible content
        scaleMargins: {
          top: 0.3,
          bottom: 0.2,
        },
      });

      chart.timeScale().fitContent();


      intervalIdRef.current = setInterval(() => {
        const lastCandle = initialData[initialData.length - 1];
        const time = new Date(lastCandle.time * 1000 + 5000);
        const open = lastCandle.close;
        const close = generateRandomPrice();
        const high = Math.max(open, close, generateRandomPrice());
        const low = Math.min(open, close, generateRandomPrice());
        const newCandle = { time: time.getTime() / 1000, open, high, low, close };
        seriesRef.current.update(newCandle);
        initialData.push(newCandle);
        // if (initialData.length > 50) {
        //   initialData.shift(); // Remove the oldest candle if we have more than 50
        // }
      }, 2000);

      return () => {
        chart.remove();
      };;
    }
  }, []);

  return (
    <div className="w-full m-4">
      <div ref={containerRef} style={{ height: "520px", width: "100%", marginTop: 4 }} />
    </div>
  );
};
