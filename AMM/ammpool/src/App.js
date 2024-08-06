import { BrowserRouter, Route, Routes } from "react-router-dom";
import {Landing} from './pages/Landing';


function App() {
  return (
    <div>
      <BrowserRouter>
      
        <Routes>
          <Route path="/" element={<Landing />} />
          {/* <Route path="/" element={<Landing />} /> */}
          {/* <Route path="/ai" element={<AI />} />
          <Route path="/crypto" element={<Crypto/>} />
          <Route path="/portfolio" element={<Portfolio />} /> */}
          
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;