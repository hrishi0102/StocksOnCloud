import React from "react";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

export const Landing = () => {
  const particlesInit = async (main) => {
    await loadFull(main);
  };

  const particlesOptions =
    {
      particles: {
        number: {
          value: 50,
          density: {
            enable: true,
            value_area: 800,
          },
        },
        color: {
          value: "#3b82f6",
        },
        shape: {
          type: "circle",
        },
        opacity: {
          value: 0.5,
          random: true,
        },
        size: {
          value: 3,
          random: true,
        },
        move: {
          enable: true,
          speed: 1,
          direction: "none",
          random: false,
          straight: false,
          out_mode: "out",
          bounce: false,
        },
      },
      interactivity: {
        detect_on: "canvas",
        events: {
          onhover: {
            enable: true,
            mode: "repulse",
          },
        },
      },
    };


  return (
    <div className="font-sans bg-black text-gray-100 min-h-screen overflow-x-hidden">  {/* This is the missing parent element */}
       <Particles
        id="tsparticles"
        init={particlesInit}
        options={particlesOptions}
        className="absolute inset-0 z-0"
      />
      <div className="relative z-10">
        <nav className="w-full bg-slate-900 bg-opacity-80 flex justify-between items-center p-4 fixed top-0 left-0 shadow-md">
          <div className="text-xl font-bold text-white">stocksOnCloud</div>
          <div className="flex gap-2">
            <a href="/signup" className="px-3 py-1 text-sm text-gray-900 bg-blue-500 rounded transition hover:bg-blue-600">
              Register
            </a>
            <a href="/signin" className="px-3 py-1 text-sm border border-blue-500 text-blue-500 rounded transition hover:bg-blue-500 hover:text-gray-900">
              Sign In
            </a>
          </div>
        </nav>
        <main>
        <div className="flex flex-col md:flex-row justify-between items-center min-h-screen px-6 md:px-10 pt-20">
            <div className="w-full md:w-1/2 text-left z-10 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-blue-500">
                StocksOnCloud
              </h1>
              <h2 className="text-2xl md:text-3xl font-semibold mb-4">
                Elevate Your Investment Strategy
              </h2>
              <p className="text-lg text-gray-400 mb-8">
                Experience the future of trading with stocksOnCloud. Our platform
                combines cutting-edge AI technology with real-time market data to
                provide unparalleled insights for stocks and crypto trading.
              </p>
              <a
                href="/signin"
                className="px-6 py-3 text-lg text-gray-900 bg-blue-500 rounded-full transition hover:bg-blue-600"
              >
                Get Started
              </a>
            </div>
            <div className="w-full md:w-1/2 flex justify-center items-center">
              <img
                src="https://www.pngall.com/wp-content/uploads/8/Forex-Trading-PNG-Image.png"
                alt="AI Trading Illustration"
                className="w-full max-w-md filter brightness-90"
              />
            </div>
          </div>

          <div className="bg-gray-800 py-12 px-6 md:px-10">
            <h3 className="text-2xl font-semibold mb-6 text-center">
              Why Choose stocksOnCloud?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-blue-500 text-4xl mb-2">🤖</div>
                <h4 className="text-xl font-semibold mb-2">AI-Driven Insights</h4>
                <p className="text-gray-400">
                  Harness the power of generative AI for smarter trading decisions.
                </p>
              </div>
              <div className="text-center">
                <div className="text-blue-500 text-4xl mb-2">📊</div>
                <h4 className="text-xl font-semibold mb-2">Real-Time Analytics</h4>
                <p className="text-gray-400">
                  Stay ahead with up-to-the-minute market data and analysis.
                </p>
              </div>
              <div className="text-center">
                <div className="text-blue-500 text-4xl mb-2">🔒</div>
                <h4 className="text-xl font-semibold mb-2">Secure Trading</h4>
                <p className="text-gray-400">
                  Trade with confidence using our state-of-the-art security measures.
                </p>
              </div>
            </div>
          </div>
        </main>
        <footer className="bg-gray-800 text-gray-400 py-4 px-6 text-center">
        <p>&copy; 2024 stocksOnCloud. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default Landing;