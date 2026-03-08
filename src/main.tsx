import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { EncounterProvider } from "./context/EncounterContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <EncounterProvider>
      <App />
    </EncounterProvider>
  </StrictMode>,
);
