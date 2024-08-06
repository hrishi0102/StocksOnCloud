import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

export const MarketBar = ({ data }) => {
  const navigate = useNavigate();
  const lastDataPoint = data[data.length - 1];
  const secondLastDataPoint = data.length > 1 ? data[data.length - 2] : null;
  const difference = secondLastDataPoint
    ? lastDataPoint.value - secondLastDataPoint.value
    : null;
  const percentageChange = secondLastDataPoint
    ? (difference / secondLastDataPoint.value) * 100
    : null;
  const textName = difference >= 0 ? "text-green-500" : "text-red-500";

  return (
    <div>
      <div className="p-2 pl-4 flex items-center flex-row relative w-full overflow-hidden border-b border-slate-800">
        <div className="flex items-center justify-between flex-row no-scrollbar overflow-auto pr-4">
          <div className="flex items-center flex-row space-x-8 pl-4">
            <div className="flex flex-col h-full justify-center">
              <p
                className={`font-medium tabular-nums text-greenText text-md text-green-500`}
              >
                Current Price
              </p>
              <p className="font-medium text-slate-200 text-sm text-sm tabular-nums">
                {lastDataPoint.value}
              </p>
            </div>
            <div className="flex flex-col">
              <p className={`font-medium text-xs text-slate-400 text-sm`}>
                Change
              </p>
              <p
                className={` text-sm font-medium tabular-nums leading-5 ${textName}`}
              >
                {difference.toFixed(2)} {percentageChange.toFixed(2)}%
              </p>
            </div>
            <div className="flex flex-col">
              <p className="font-medium text-xs text-slate-400 text-sm">
                24H High
              </p>
              <p className="text-sm font-medium tabular-nums leading-5 text-sm text-slate-200">
                401
              </p>
            </div>
            <div className="flex flex-col">
              <p className="font-medium text-xs text-slate-400 text-sm">
                24H Low
              </p>
              <p className="text-sm font-medium tabular-nums leading-5 text-sm text-slate-200">
                384
              </p>
            </div>
            
            <div className="flex flex-col">
                <p className="font-medium text-xs text-slate-400 text-sm">
                  24H Volume
                </p>
                <p className="mt-1 text-sm font-medium tabular-nums leading-5 text-sm text-slate-200">
                  298176
                </p>
            </div>
            <button
            onClick={() => {
              navigate(`/candle?key=msft`)
            }}
              type="button"
              className="text-center font-semibold rounded-lg focus:ring-blue-200 focus:none focus:outline-none hover:opacity-90 disabled:opacity-80 disabled:hover:opacity-80 relative overflow-hidden h-[32px] text-sm px-3 py-1.5 mr-4 "
            >
              <div className="absolute inset-0 bg-blue-500 opacity-[16%]"></div>
              <div className="flex flex-row items-center justify-center gap-4">
                <p className="text-blue-500">Go to candlestick</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
