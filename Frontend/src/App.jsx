import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import LandingPage from "./Components/LandingPage";
import TrendingPage from "./Components/TrendingPage";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar /> {/* single, global navbar */}
      <div className="">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/trending" element={<TrendingPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
