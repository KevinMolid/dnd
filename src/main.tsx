import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { EncounterProvider } from "./context/EncounterContext.tsx";
import { PartyInventoryProvider } from "./context/PartyInventoryContext.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";

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
