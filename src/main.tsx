import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
import { SpotifyPlayerProvider } from "./features/spotify/SpotifyPlayerContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <SpotifyPlayerProvider>
        <App />
      </SpotifyPlayerProvider>
    </AuthProvider>
  </StrictMode>,
);
