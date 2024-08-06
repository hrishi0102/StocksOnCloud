import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export const Appbar = () => {
  const navigate = useNavigate();
  const email = localStorage.getItem("Email");

  return (
    <div className="text-white border-b border-slate-800">
      <div className="flex justify-between items-center p-2">
        <div className="flex">
          <div className="text-xl pl-4 flex flex-col justify-center cursor-pointer text-white">
            <Link
              className="pointer pl-1 cursor-pointer relative group"
              to="/home"
            >
              <span className="relative">
                StocksOnCloud
                <span className="absolute left-0 -bottom-1.5 w-0 h-0.5 bg-current transition-all duration-300 group-hover:w-full"></span>
              </span>
            </Link>
          </div>
          <div className="text-sm pt-1 flex flex-col justify-center pl-8 cursor-pointer text-slate-500">
            <Link
              className="pointer pl-1 cursor-pointer relative group hover:text-white transition duration-300"
              to="/ai"
            >
              <span className="relative">
                AI
                <span className="absolute left-0 -bottom-1.5 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
              </span>
            </Link>
          </div>
          <div className="text-sm pt-1 flex flex-col justify-center pl-8 cursor-pointer text-slate-500">
            <Link
              className="pointer pl-1 cursor-pointer relative group hover:text-white transition duration-300"
              to="http://localhost:3000"
            >
              <span className="relative">
                Crypto
                <span className="absolute left-0 -bottom-1.5 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
              </span>
            </Link>
          </div>
          <div className="text-sm pt-1 flex flex-col justify-center pl-8 cursor-pointer text-slate-500">
            <Link
              className="pointer pl-1 cursor-pointer relative group hover:text-white transition duration-300"
              to="/order"
            >
              <span className="relative">
                Orderbook
                <span className="absolute left-0 -bottom-1.5 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
              </span>
            </Link>
          </div>
        </div>

        <div className="flex">
          <div className="p-2 mr-2">
            <button
            onClick={() => {
              navigate(`/portfolio?email=${email}`)
            }}
              type="button"
              className="text-center font-semibold rounded-lg focus:ring-green-200 focus:none focus:outline-none hover:opacity-90 disabled:opacity-80 disabled:hover:opacity-80 relative overflow-hidden h-[32px] text-sm px-3 py-1.5 mr-4 "
            >
              <div className="absolute inset-0 bg-green-500 opacity-[16%]"></div>
              <div className="flex flex-row items-center justify-center gap-4">
                <p className="text-green-500">Portfolio</p>
              </div>
            </button>
            <button
              type="button"
              className="text-center font-semibold rounded-lg focus:ring-blue-200 focus:none focus:outline-none hover:opacity-90 disabled:opacity-80 disabled:hover:opacity-80 relative overflow-hidden h-[32px] text-sm px-3 py-1.5 mr-4"
              onClick={() => {
                localStorage.removeItem("Email");
                navigate("/signin");
              }}
            >
              <div className="absolute inset-0 bg-blue-500 opacity-[16%]"></div>
              <div className="flex flex-row items-center justify-center gap-4">
                <p className="text-blue-500">Logout</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
