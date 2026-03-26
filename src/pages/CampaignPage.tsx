import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import InvitePlayersModal from "../components/InvitePlayersModal";
import CreateHandoutModal from "../components/CreateHandoutModal";
import LevelUpModal from "../components/levelUpModal";
import AwardXpModal from "../components/awardXpModal";

import CampaignHeader from "../features/campaigns/components/CampaignHeader";
import CampaignMembersSection from "../features/campaigns/components/CampaignMembersSection";
import CampaignQuickActions from "../features/campaigns/components/CampaignQuickActions";
import PartyControlSection from "../features/campaigns/components/PartyControlSection";
import CampaignRecentActivitySection from "../features/campaigns/components/CampaignRecentActivitySection";
import ClaimableCharactersSection from "../features/campaigns/components/ClaimableCharactersSection";
import InactiveOwnedCharactersSection from "../features/campaigns/components/InactiveOwnedCharactersSection";
import useCampaignPageData, {
  type CampaignCharacter,
} from "../features/campaigns/hooks/useCampaignPageData";

const CampaignPage = () => {
  const { campaignId } = useParams<{ campaignId: string }>();
  const navigate = useNavigate();

  const {
    user,
    pageState,
    campaign,
    membership,
    isGm,
    systemLabel,
    campaignCharacters,
    members,
    membersLoading,
    latestJournalEntry,
    latestJournalEntryLoading,
    updateCharacter,
    updateCharacterXp,
    toggleCondition,
    handleLevelUp,
    handleClaimCharacter,
    handleSetCharacterActive,
  } = useCampaignPageData(campaignId);

  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [createHandoutOpen, setCreateHandoutOpen] = useState(false);
  const [xpModalOpen, setXpModalOpen] = useState(false);
  const [levelUpCharacter, setLevelUpCharacter] =
    useState<CampaignCharacter | null>(null);
  const claimableCharacters = useMemo(
    () => campaignCharacters.filter((character) => character.ownerUid === null),
    [campaignCharacters],
  );

  const activeCampaignCharacters = useMemo(
    () =>
      campaignCharacters.filter(
        (character) => character.campaignStatus === "active",
      ),
    [campaignCharacters],
  );

  const myInactiveCampaignCharacters = useMemo(
    () =>
      campaignCharacters.filter(
        (character) =>
          character.ownerUid === (user?.uid ?? null) &&
          character.campaignStatus === "inactive",
      ),
    [campaignCharacters, user?.uid],
  );

  if (pageState === "loading") {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100">
        <div className="mx-auto max-w-7xl py-6 sm:py-8">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
            <p className="text-sm text-zinc-400">Loading campaign...</p>
          </div>
        </div>
      </div>
    );
  }

  if (pageState === "not-found") {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100">
        <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
            <h1 className="text-2xl font-bold text-white">
              Campaign not found
            </h1>
            <p className="mt-3 text-sm text-zinc-400">
              The campaign you tried to open does not exist.
            </p>
            <div className="mt-6">
              <Link
                to="/"
                className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200"
              >
                Back to home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (pageState === "forbidden") {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100">
        <div className="mx-auto max-w-4xl py-6 sm:py-8">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
            <h1 className="text-2xl font-bold text-white">Access denied</h1>
            <p className="mt-3 text-sm text-zinc-400">
              You do not have access to this campaign.
            </p>
            <div className="mt-6">
              <Link
                to="/"
                className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200"
              >
                Back to home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (pageState === "error" || !campaign || !membership) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100">
        <div className="mx-auto max-w-4xl py-6 sm:py-8">
          <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-8 text-center">
            <h1 className="text-2xl font-bold text-white">
              Something went wrong
            </h1>
            <p className="mt-3 text-sm text-red-200/80">
              We could not load this campaign right now.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <button
                onClick={() => window.location.reload()}
                className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200"
              >
                Retry
              </button>

              <Link
                to="/"
                className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Back to home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const playerOptions = members
    .filter((member) => member.role === "player")
    .map((member) => ({
      uid: member.uid,
      displayName:
        member.displayName?.trim() || member.email?.trim() || "Unnamed player",
    }));

  const awardXpCharacters = activeCampaignCharacters.map((character) => ({
    id: character.id,
    name: character.name,
    level: character.level ?? 1,
  }));

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto w-full max-w-7xl py-6 sm:py-8">
        <CampaignHeader
          campaign={campaign}
          membership={membership}
          systemLabel={systemLabel}
          isGm={isGm}
          onOpenSettings={() => navigate(`/campaigns/${campaign.id}/settings`)}
        />

        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div className="space-y-6">
            {isGm && (
              <CampaignQuickActions
                campaignId={campaign.id}
                isGm={isGm}
                onCreateHandout={() => setCreateHandoutOpen(true)}
              />
            )}

            <PartyControlSection
              characters={activeCampaignCharacters}
              isGm={isGm}
              currentUserId={user?.uid ?? null}
              onOpenLevelUp={setLevelUpCharacter}
              onOpenAwardXpModal={() => setXpModalOpen(true)}
              onUpdateCharacter={updateCharacter}
              onUpdateCharacterXp={updateCharacterXp}
              onToggleCondition={toggleCondition}
            />

            {claimableCharacters.length > 0 && (
              <ClaimableCharactersSection
                characters={claimableCharacters}
                loading={false}
                isGm={isGm}
                onClaimCharacter={handleClaimCharacter}
              />
            )}

            {myInactiveCampaignCharacters.length > 0 && (
              <InactiveOwnedCharactersSection
                characters={myInactiveCampaignCharacters}
                loading={false}
                onActivateCharacter={handleSetCharacterActive}
              />
            )}
          </div>

          <aside className="space-y-6">
            <CampaignRecentActivitySection
              campaignId={campaign.id}
              loading={latestJournalEntryLoading}
              latestJournalEntry={latestJournalEntry}
            />

            <CampaignMembersSection
              members={members}
              loading={membersLoading}
              isGm={isGm}
              onInvitePlayers={() => setInviteModalOpen(true)}
            />
          </aside>
        </div>
      </div>

      {campaign && isGm && (
        <InvitePlayersModal
          campaignId={campaign.id}
          campaignName={campaign.name}
          isOpen={inviteModalOpen}
          onClose={() => setInviteModalOpen(false)}
        />
      )}

      {levelUpCharacter && (
        <LevelUpModal
          character={levelUpCharacter}
          onClose={() => setLevelUpCharacter(null)}
          onConfirm={async (updates) => {
            await handleLevelUp(levelUpCharacter, updates);
            setLevelUpCharacter(null);
          }}
        />
      )}

      {isGm && (
        <AwardXpModal
          isOpen={xpModalOpen}
          onClose={() => setXpModalOpen(false)}
          characters={awardXpCharacters}
        />
      )}

      {campaignId ? (
        <CreateHandoutModal
          campaignId={campaignId}
          open={createHandoutOpen}
          onClose={() => setCreateHandoutOpen(false)}
          players={playerOptions}
        />
      ) : null}
    </div>
  );
};

export default CampaignPage;
