import { Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard/Dashboard";
import Fleet from "./pages/Fleet/Fleet";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/fleet" element={<Fleet />} />
    </Routes>
  );
}

export default App;