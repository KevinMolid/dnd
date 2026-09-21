// Components
import Header from "./components/Header";
import AuthModal from "./components/AuthModal";

// Pages
import Home from "./pages/Home";
import Tips from "./pages/Tips";
import Reglene from "./pages/Reglene";
import Karakterer from "./pages/Karakterer";
import Stats from "./pages/Stats";
import Encounter from "./pages/Encounter";
import Quests from "./pages/Quests";
import Login from "./pages/Login";
import LandingPage from "./pages/LandingPage";
import NewCharacter from "./pages/NewCharacter.tsx";
import CharacterSheet from "./pages/CharacterSheet";
import NewCampaign from "./pages/NewCampaign";
import CampaignPage from "./pages/CampaignPage";
import CampaignLayout from "./pages/CampaignLayout";
import InvitePage from "./pages/InvitePage";
import CampaignMembersPage from "./pages/CampaignMembersPage";
import CampaignCharactersPage from "./pages/CampaignCharactersPage";
import CampaignSettingsPage from "./pages/CampaignSettingsPage";
import CampaignMapsPage from "./pages/CampaignMapsPage";
import MapViewerPage from "./pages/MapViewerPage";
import CampaignJournalPage from "./pages/CampaignJournalPage";
import HandoutsPage from "./pages/HandoutsPage";
import ProfileSettingsPage from "./pages/ProfileSettingsPage";
import NPCsPage from "./pages/NPCsPage";
import NpcDetailPage from "./pages/NpcDetailPage";
import ItemsPage from "./pages/ItemsPage";
import MonstersPage from "./pages/MonstersPage";
import EditCharacter from "./pages/EditCharacter";
import DMWorkspacePage from "./pages/DMWorkspacePage";

import CampaignGmOutlet from "./features/campaigns/components/CampaignGmOutlet";

// Context
import { EncounterProvider } from "./context/EncounterContext";

import { useMemo, useState, type ReactNode } from "react";

import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
  useParams,
} from "react-router-dom";

import { useAuth } from "./context/AuthContext";

import { WorkspaceProvider } from "./features/workspace/WorkspaceContext";

type AuthModalMode = "login" | "signup";

function CampaignEncounterScope({ children }: { children: ReactNode }) {
  const { campaignId } = useParams<{
    campaignId: string;
  }>();

  if (!campaignId) {
    return <div className="p-6 text-rose-400">No campaign selected.</div>;
  }

  return (
    <EncounterProvider key={campaignId} campaignId={campaignId}>
      {children}
    </EncounterProvider>
  );
}

type AppRoutesProps = {
  user: ReturnType<typeof useAuth>["user"];

  openLoginModal: () => void;

  openSignupModal: () => void;
};

function AppRoutes({ user, openLoginModal, openSignupModal }: AppRoutesProps) {
  if (!user) {
    return (
      <Routes>
        <Route
          index
          element={
            <LandingPage
              onOpenLogin={openLoginModal}
              onOpenSignup={openSignupModal}
            />
          }
        />

        <Route path="/invite/:inviteToken" element={<InvitePage />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route index element={<Home />} />

      <Route path="/profile" element={<ProfileSettingsPage />} />

      <Route path="tips" element={<Tips />} />

      <Route path="reglene" element={<Reglene />} />

      <Route path="karakterer" element={<Karakterer />} />

      <Route path="stats" element={<Stats />} />

      <Route path="/quests" element={<Quests />} />

      <Route path="/characters/new" element={<NewCharacter />} />

      <Route path="/characters/:characterId" element={<CharacterSheet />} />

      <Route path="/characters/:characterId/edit" element={<EditCharacter />} />

      <Route path="/campaigns/new" element={<NewCampaign />} />

      <Route path="/invite/:inviteToken" element={<InvitePage />} />

      {/* Player-facing campaign shell */}

      <Route path="/campaigns/:campaignId" element={<CampaignLayout />}>
        <Route index element={<CampaignPage />} />

        <Route path="handouts" element={<HandoutsPage />} />

        <Route path="characters" element={<CampaignCharactersPage />} />

        <Route path="journal" element={<CampaignJournalPage />} />

        <Route element={<CampaignGmOutlet />}>
          <Route path="maps" element={<CampaignMapsPage />} />

          <Route
            path="maps/:mapId"
            element={
              <CampaignEncounterScope>
                <MapViewerPage />
              </CampaignEncounterScope>
            }
          />

          <Route path="members" element={<CampaignMembersPage />} />
        </Route>
      </Route>

      {/* Full-page campaign tools */}

      <Route
        path="/campaigns/:campaignId/settings"
        element={<CampaignSettingsPage />}
      />

      <Route
        path="/campaigns/:campaignId/encounter"
        element={
          <CampaignEncounterScope>
            <Encounter />
          </CampaignEncounterScope>
        }
      />

      <Route path="/campaigns/:campaignId/npcs" element={<NPCsPage />} />

      <Route
        path="/campaigns/:campaignId/npcs/:npcId"
        element={<NpcDetailPage />}
      />

      <Route
        path="/campaigns/:campaignId/monsters"
        element={<MonstersPage />}
      />

      <Route path="/campaigns/:campaignId/items" element={<ItemsPage />} />

      <Route
        path="/campaigns/:campaignId/workspace"
        element={
          <CampaignEncounterScope>
            <WorkspaceProvider>
              <DMWorkspacePage />
            </WorkspaceProvider>
          </CampaignEncounterScope>
        }
      />
    </Routes>
  );
}

type AppShellProps = {
  user: ReturnType<typeof useAuth>["user"];

  authModalOpen: boolean;

  authModalTitle: string;

  authMode: AuthModalMode;

  setAuthModalOpen: (open: boolean) => void;

  setAuthMode: (mode: AuthModalMode) => void;

  openLoginModal: () => void;

  openSignupModal: () => void;
};

function AppShell({
  user,
  authModalOpen,
  authModalTitle,
  authMode,
  setAuthModalOpen,
  setAuthMode,
  openLoginModal,
  openSignupModal,
}: AppShellProps) {
  const location = useLocation();

  /*
   * Workspace gets its own compact application shell.
   *
   * The ordinary Lorebound header is intentionally
   * omitted here to maximize usable DM screen space.
   */
  const isWorkspaceRoute = /^\/campaigns\/[^/]+\/workspace\/?$/.test(
    location.pathname,
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {!isWorkspaceRoute ? (
        <Header onOpenLogin={openLoginModal} onOpenSignup={openSignupModal} />
      ) : null}

      <main>
        <AppRoutes
          user={user}
          openLoginModal={openLoginModal}
          openSignupModal={openSignupModal}
        />
      </main>

      <AuthModal
        open={authModalOpen}
        title={authModalTitle}
        mode={authMode}
        onClose={() => setAuthModalOpen(false)}
        onSwitchMode={(mode) => setAuthMode(mode)}
      >
        <Login mode={authMode} onSuccess={() => setAuthModalOpen(false)} />
      </AuthModal>
    </div>
  );
}

function App() {
  const { user, loading } = useAuth();

  const [authModalOpen, setAuthModalOpen] = useState(false);

  const [authMode, setAuthMode] = useState<AuthModalMode>("login");

  const authModalTitle = useMemo(() => {
    return authMode === "login" ? "Log in to Lorebound" : "Create your account";
  }, [authMode]);

  const openLoginModal = () => {
    setAuthMode("login");

    setAuthModalOpen(true);
  };

  const openSignupModal = () => {
    setAuthMode("signup");

    setAuthModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 p-6 text-white">Loading...</div>
    );
  }

  return (
    <BrowserRouter>
      <AppShell
        user={user}
        authModalOpen={authModalOpen}
        authModalTitle={authModalTitle}
        authMode={authMode}
        setAuthModalOpen={setAuthModalOpen}
        setAuthMode={setAuthMode}
        openLoginModal={openLoginModal}
        openSignupModal={openSignupModal}
      />
    </BrowserRouter>
  );
}

export default App;
