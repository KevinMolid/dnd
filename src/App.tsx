// Components
import Header from "./components/Header";

// Pages
import Home from "./pages/Home";
import Historien from "./pages/Historien";
import Tips from "./pages/Tips";
import Reglene from "./pages/Reglene";
import Spillerne from "./pages/Spillerne";
import NPCene from "./pages/NPCene";

import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <main className="pt-6">
          <Routes>
            <Route index element={<Home />} />
            <Route path="historien" element={<Historien />} />
            <Route path="tips" element={<Tips />} />
            <Route path="reglene" element={<Reglene />} />
            <Route path="spillerne" element={<Spillerne />} />
            <Route path="npcene" element={<NPCene />} />
          </Routes>
        </main>
      </BrowserRouter>
    </>
  );
}

export default App;
