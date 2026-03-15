import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { EncounterProvider } from "./context/EncounterContext";
import { PartyInventoryProvider } from "./context/PartyInventoryContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <EncounterProvider>
      <PartyInventoryProvider>
        <App />
      </PartyInventoryProvider>
    </EncounterProvider>
  </StrictMode>,
);
