import { ColorType, createChart, CrosshairMode } from "lightweight-charts";
import React, { useEffect, useRef, useState } from "react";

export const Chart = ({ data }) => {
  const chartContainerRef = useRef();
  useEffect(() => {
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: "#0e0f14",
        color: "white",
        textColor: "white",
      },
      grid: {
        vertLines: { color: "#606160" },
        horzLines: { color: "#606160" },
      },
      autoSize: true,
      crosshair: {
        mode: CrosshairMode.Normal,
      },
      overlayPriceScales: {
        ticksVisible: true,
        borderVisible: true,
      },
      rightPriceScale: {
        visible: true,
        ticksVisible: true,
        entireTextOnly: true,
      },
    });

    const newSeries = chart.addAreaSeries({
      lineColor: "#2962FF",
      topColor: "#2962FF",
      bottomColor: "rgba(41,98,255,0.28)",
    });

    newSeries.setData(data);
    chart.timeScale().fitContent();

    return () => {
      chart.remove();
    };
  }, [data]);

  return (
    <div
      ref={chartContainerRef}
      style={{ height: "520px", width: "100%", marginTop: 4 }}
    ></div>
  );
};
