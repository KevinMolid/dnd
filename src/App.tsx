// Components
import Header from "./components/Header";

// Pages
import Home from "./pages/Home";
import Historien from "./pages/Historien";

import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route index element={<Home />} />
          <Route path="historien" element={<Historien />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
