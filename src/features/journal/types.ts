export type JournalEntryType =
  | "session"
  | "lore"
  | "quest"
  | "npc"
  | "location"
  | "handout"
  | "custom";

export type JournalVisibility =
  | "dm"
  | "allPlayers"
  | "selectedPlayers";

export type JournalEntry = {
  id: string;
  title: string;
  content: string;

  type: JournalEntryType;
  visibility: JournalVisibility;
  visibleToPlayerIds: string[];

  published: boolean;
  pinned: boolean;

  sessionNumber: number | null;
  sessionDate: string | null;
  tags: string[];

  relatedQuestIds?: string[];
  relatedNpcIds?: string[];
  relatedLocationIds?: string[];
  relatedMapId?: string | null;
  relatedRoomId?: string | number | null;

  createdAt: number;
  updatedAt: number;
  createdByUid: string;
  createdByName?: string;
};

export type JournalEntryInput = Omit<
  JournalEntry,
  "id" | "createdAt" | "updatedAt"
>;

export type JournalEntryFormState = {
  title: string;
  content: string;
  type: JournalEntryType;
  visibility: JournalVisibility;
  visibleToPlayerIds: string[];
  published: boolean;
  pinned: boolean;
  sessionNumber: number | null;
  sessionDate: string | null;
  tagsText: string;
};

export type CampaignPlayer = {
  id: string;
  name: string;
  userUid?: string | null;
};

export const JOURNAL_ENTRY_TYPES: JournalEntryType[] = [
  "session",
  "lore",
  "quest",
  "npc",
  "location",
  "handout",
  "custom",
];

export const JOURNAL_VISIBILITY_OPTIONS: JournalVisibility[] = [
  "dm",
  "allPlayers",
  "selectedPlayers",
];

export function createEmptyJournalFormState(
  nextSessionNumber?: number | null,
): JournalEntryFormState {
  return {
    title: "",
    content: "",
    type: "session",
    visibility: "allPlayers",
    visibleToPlayerIds: [],
    published: false,
    pinned: false,
    sessionNumber: nextSessionNumber ?? null,
    sessionDate: new Date().toISOString().slice(0, 10),
    tagsText: "",
  };
}

export function formStateToJournalEntryInput(params: {
  form: JournalEntryFormState;
  createdByUid: string;
  createdByName?: string;
}): JournalEntryInput {
  const { form, createdByUid, createdByName } = params;

  return {
    title: form.title.trim(),
    content: form.content.trim(),
    type: form.type,
    visibility: form.visibility,
    visibleToPlayerIds:
      form.visibility === "selectedPlayers" ? form.visibleToPlayerIds : [],
    published: form.published,
    pinned: form.pinned,
    sessionNumber: form.sessionNumber ?? null,
    sessionDate: form.sessionDate?.trim() ? form.sessionDate : null,
    tags: form.tagsText
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean),
    createdByUid,
    createdByName,
  };
}

export function journalEntryToFormState(
  entry: JournalEntry,
): JournalEntryFormState {
  return {
    title: entry.title,
    content: entry.content,
    type: entry.type,
    visibility: entry.visibility,
    visibleToPlayerIds: entry.visibleToPlayerIds ?? [],
    published: entry.published,
    pinned: entry.pinned,
    sessionNumber: entry.sessionNumber ?? null,
    sessionDate: entry.sessionDate ?? null,
    tagsText: (entry.tags ?? []).join(", "),
  };
}

export function validateJournalEntryForm(
  form: JournalEntryFormState,
): string | null {
  if (!form.title.trim()) return "Title is required.";
  if (!form.content.trim()) return "Content is required.";

  if (
    form.visibility === "selectedPlayers" &&
    form.visibleToPlayerIds.filter(Boolean).length === 0
  ) {
    return "Select at least one player.";
  }

  return null;
}

export function canReadJournalEntry(params: {
  entry: JournalEntry;
  isDm: boolean;
  currentPlayerId?: string | null;
}) {
  const { entry, isDm, currentPlayerId } = params;

  if (isDm) return true;
  if (!entry.published) return false;

  if (entry.visibility === "dm") return false;
  if (entry.visibility === "allPlayers") return true;

  if (entry.visibility === "selectedPlayers") {
    return !!currentPlayerId &&
      entry.visibleToPlayerIds.includes(currentPlayerId);
  }

  return false;
}

export function getJournalVisibilityLabel(visibility: JournalVisibility) {
  switch (visibility) {
    case "dm":
      return "DM only";
    case "allPlayers":
      return "All players";
    case "selectedPlayers":
      return "Selected players";
    default:
      return visibility;
  }
}

export function getJournalTypeLabel(type: JournalEntryType) {
  switch (type) {
    case "session":
      return "Session";
    case "lore":
      return "Lore";
    case "quest":
      return "Quest";
    case "npc":
      return "NPC";
    case "location":
      return "Location";
    case "handout":
      return "Handout";
    case "custom":
      return "Custom";
    default:
      return type;
  }
}