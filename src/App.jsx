// Current imports
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Bracket from "./pages/Bracket.jsx";

// Proposed addition: Results page
import Results from "./pages/Results.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/bracket" element={<Bracket />} />
        {/* New route for results */}
        <Route path="/results" element={<Results />} />
      </Routes>
    </Router>
  );
}

export default App;
