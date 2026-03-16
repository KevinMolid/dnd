import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { EncounterProvider } from "./context/EncounterContext";
import { PartyInventoryProvider } from "./context/PartyInventoryContext";
import { AuthProvider } from "./context/AuthContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <EncounterProvider>
        <PartyInventoryProvider>
          <App />
        </PartyInventoryProvider>
      </EncounterProvider>
    </AuthProvider>
  </StrictMode>,
);
