import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Bracket from "./pages/Bracket";
import Results from "./pages/Results";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/bracket" element={<Bracket />} />
        <Route path="/results" element={<Results />} />
      </Routes>
    </Router>
  );
}
