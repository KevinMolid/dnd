// Components
import Header from "./components/Header";

// Pages
import Home from "./pages/Home";
import Historien from "./pages/Historien";
import Tips from "./pages/Tips";
import Reglene from "./pages/Reglene";
import Karakterer from "./pages/Karakterer";
import Stats from "./pages/Stats";
import Encounter from "./pages/Encounter";
import Players from "./pages/Players";
import Handouts from "./pages/Handouts";
import Quests from "./pages/Quests";

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
            <Route path="karakterer" element={<Karakterer />} />
            <Route path="Stats" element={<Stats />} />
            <Route path="/kamp" element={<Encounter />} />
            <Route path="/spillere" element={<Players />} />
            <Route path="/handouts" element={<Handouts />} />
            <Route path="/quests" element={<Quests />} />
          </Routes>
        </main>
      </BrowserRouter>
    </>
  );
}

export default App;
