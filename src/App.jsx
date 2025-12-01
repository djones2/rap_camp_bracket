import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Bracket from "./pages/Bracket.jsx";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/bracket" element={<Bracket />} />
      </Routes>
    </Router>
  );
}
