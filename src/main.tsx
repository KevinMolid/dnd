import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { EncounterProvider } from "./context/EncounterContext.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <EncounterProvider>
        <App />
      </EncounterProvider>
    </AuthProvider>
  </StrictMode>,
);
