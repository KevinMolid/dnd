import { useEffect, useMemo, useState } from "react";
import { allItems } from "../../../rulesets/dnd/dnd2024/data/items";
import type {
  AbilityKey,
  AmmunitionType,
  ArmorCategory,
  CampaignItem,
  CampaignItemOverride,
  Currency,
  DamageType,
  EquipmentSlotId,
  Item,
  ItemCategory,
  WeaponKind,
  WeaponProperty,
  WieldMode,
} from "../../../rulesets/dnd/dnd2024/types";

type CreateCampaignItemPayload = {
  baseItemId?: string;
  customItem?: Item;
  name?: string;
  shortDescription?: string;
  description?: string;
  gmNotes?: string;
  imageUrl?: string;
  overrides?: CampaignItemOverride;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (payload: CreateCampaignItemPayload) => Promise<void> | void;
  editItem?: {
    campaignItem: CampaignItem;
    resolvedItem: Item;
  } | null;
};

const categories: ItemCategory[] = [
  "weapon",
  "armor",
  "shield",
  "tool",
  "gear",
  "container",
  "ammunition",
  "clothing",
  "consumable",
  "holy-symbol",
  "adventuring-gear",
  "misc",
];
const currencies: Currency[] = ["cp", "sp", "ep", "gp", "pp"];
const damageTypes: DamageType[] = [
  "acid",
  "bludgeoning",
  "cold",
  "fire",
  "force",
  "lightning",
  "necrotic",
  "piercing",
  "poison",
  "psychic",
  "radiant",
  "slashing",
  "thunder",
];
const weaponKinds: WeaponKind[] = [
  "simple-melee",
  "simple-ranged",
  "martial-melee",
  "martial-ranged",
];
const weaponProperties: WeaponProperty[] = [
  "ammunition",
  "finesse",
  "heavy",
  "light",
  "loading",
  "range",
  "reach",
  "thrown",
  "two-handed",
  "versatile",
];
const armorCategories: ArmorCategory[] = ["light", "medium", "heavy"];
const abilities: AbilityKey[] = ["str", "dex", "con", "int", "wis", "cha"];
const slots: EquipmentSlotId[] = [
  "head",
  "neck",
  "armor",
  "clothing",
  "cloak",
  "hands",
  "waist",
  "feet",
  "ring-left",
  "ring-right",
  "main-hand",
  "off-hand",
  "ranged-main-hand",
  "ranged-off-hand",
];
const wieldModes: WieldMode[] = ["main-hand", "off-hand", "two-handed"];
const ammunitionTypes: AmmunitionType[] = [
  "arrow",
  "crossbow-bolt",
  "firearm-bullet",
  "sling-bullet",
  "blowgun-needle",
];

const label = (value: string) =>
  value.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const Field = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <label className="block">
    <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
      {title}
    </span>
    {children}
  </label>
);

const inputClass =
  "h-10 w-full rounded-xl border border-white/10 bg-zinc-950 px-3 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-emerald-500/40";
const selectClass = inputClass;
const areaClass =
  "workspace-scrollbar w-full resize-y rounded-xl border border-white/10 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-emerald-500/40";

const Toggle = ({
  checked,
  onChange,
  children,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  children: React.ReactNode;
}) => (
  <button
    type="button"
    onClick={() => onChange(!checked)}
    className={`rounded-lg border px-2.5 py-1.5 text-xs font-medium transition ${
      checked
        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
        : "border-white/10 bg-white/[0.03] text-zinc-400 hover:bg-white/[0.06]"
    }`}
  >
    {children}
  </button>
);

const CreateCampaignItemModal = ({
  isOpen,
  onClose,
  onConfirm,
  editItem = null,
}: Props) => {
  const [mode, setMode] = useState<"new" | "copy">("new");
  const [search, setSearch] = useState("");
  const [baseId, setBaseId] = useState("");
  const [name, setName] = useState("");
  const [category, setCategory] = useState<ItemCategory>("gear");
  const [description, setDescription] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [gmNotes, setGmNotes] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [weight, setWeight] = useState("");
  const [costCurrency, setCostCurrency] = useState<Currency>("gp");
  const [cost, setCost] = useState("");
  const [stackable, setStackable] = useState(false);
  const [magical, setMagical] = useState(false);
  const [equippable, setEquippable] = useState(false);
  const [selectedSlots, setSelectedSlots] = useState<EquipmentSlotId[]>([]);
  const [selectedWieldModes, setSelectedWieldModes] = useState<WieldMode[]>([]);
  const [attackBonus, setAttackBonus] = useState("");
  const [damageBonus, setDamageBonus] = useState("");
  const [acBonus, setAcBonus] = useState("");

  const [weaponKind, setWeaponKind] = useState<WeaponKind>("simple-melee");
  const [damageCount, setDamageCount] = useState("1");
  const [damageDie, setDamageDie] = useState<1 | 4 | 6 | 8 | 10 | 12>(6);
  const [damageType, setDamageType] = useState<DamageType>("slashing");
  const [properties, setProperties] = useState<WeaponProperty[]>([]);
  const [rangeNormal, setRangeNormal] = useState("");
  const [rangeLong, setRangeLong] = useState("");
  const [versatileDie, setVersatileDie] = useState<1 | 4 | 6 | 8 | 10 | 12>(8);
  const [mastery, setMastery] = useState("");
  const [ammunitionType, setAmmunitionType] = useState<AmmunitionType | "">("");

  const [armorCategory, setArmorCategory] = useState<ArmorCategory>("light");
  const [baseAc, setBaseAc] = useState("11");
  const [dexCap, setDexCap] = useState("");
  const [stealthDisadvantage, setStealthDisadvantage] = useState(false);
  const [strengthRequirement, setStrengthRequirement] = useState("");

  const [toolAbility, setToolAbility] = useState<AbilityKey>("dex");
  const [containerWeight, setContainerWeight] = useState("");
  const [containerVolume, setContainerVolume] = useState("");
  const [bundleSize, setBundleSize] = useState("1");
  const [storageItemId, setStorageItemId] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const selectedBase = useMemo(
    () => allItems.find((item) => item.id === baseId) ?? null,
    [baseId],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return [...allItems]
      .sort((a, b) => a.name.localeCompare(b.name))
      .filter(
        (item) =>
          !q ||
          item.name.toLowerCase().includes(q) ||
          item.id.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q),
      )
      .slice(0, 100);
  }, [search]);

  useEffect(() => {
    if (!isOpen) return;

    const item = editItem?.resolvedItem ?? null;
    const campaignItem = editItem?.campaignItem ?? null;

    setMode(campaignItem?.baseItemId ? "copy" : "new");
    setSearch("");
    setBaseId(campaignItem?.baseItemId ?? "");

    setName(item?.name ?? "");
    setCategory(item?.category ?? "gear");
    setDescription(item?.description ?? "");
    setShortDescription(campaignItem?.shortDescription ?? "");
    setGmNotes(campaignItem?.gmNotes ?? "");
    setImageUrl(campaignItem?.imageUrl ?? "");

    setWeight(item?.weight?.toString() ?? "");

    const firstCost = Object.entries(item?.cost ?? {})[0];
    if (firstCost) {
      setCostCurrency(firstCost[0] as Currency);
      setCost(String(firstCost[1]));
    } else {
      setCostCurrency("gp");
      setCost("");
    }

    setStackable(item?.stackable ?? false);
    setMagical(item?.magical ?? false);
    setEquippable(Boolean(item?.equippable));
    setSelectedSlots(item?.equippable?.slots ?? []);
    setSelectedWieldModes(item?.equippable?.allowedWieldModes ?? []);

    setAttackBonus(
      typeof item?.attackBonus === "number" ? String(item.attackBonus) : "",
    );
    setDamageBonus(
      typeof item?.damageBonus === "number" ? String(item.damageBonus) : "",
    );
    setAcBonus(typeof item?.acBonus === "number" ? String(item.acBonus) : "");

    setWeaponKind(item?.weapon?.weaponKind ?? "simple-melee");
    setDamageCount(
      item?.weapon?.damage?.dice?.count
        ? String(item.weapon.damage.dice.count)
        : "1",
    );
    setDamageDie(
      (item?.weapon?.damage?.dice?.die ?? 6) as 1 | 4 | 6 | 8 | 10 | 12,
    );
    setDamageType(item?.weapon?.damage?.damageType ?? "slashing");
    setProperties(item?.weapon?.properties ?? []);
    setRangeNormal(
      typeof item?.weapon?.range?.normal === "number"
        ? String(item.weapon.range.normal)
        : "",
    );
    setRangeLong(
      typeof item?.weapon?.range?.long === "number"
        ? String(item.weapon.range.long)
        : "",
    );
    setVersatileDie(
      (item?.weapon?.versatileDamage?.dice?.die ?? 8) as
        | 1
        | 4
        | 6
        | 8
        | 10
        | 12,
    );
    setMastery(item?.weapon?.mastery ?? "");
    setAmmunitionType(item?.weapon?.ammunitionType ?? "");

    setArmorCategory(item?.armor?.armorCategory ?? "light");
    setBaseAc(
      typeof item?.armor?.baseAc === "number"
        ? String(item.armor.baseAc)
        : "11",
    );
    setDexCap(
      typeof item?.armor?.dexCap === "number" ? String(item.armor.dexCap) : "",
    );
    setStealthDisadvantage(item?.armor?.stealthDisadvantage ?? false);
    setStrengthRequirement(
      typeof item?.armor?.strengthRequirement === "number"
        ? String(item.armor.strengthRequirement)
        : "",
    );

    setToolAbility(item?.tool?.ability ?? "dex");
    setContainerWeight(
      typeof item?.container?.capacityWeight === "number"
        ? String(item.container.capacityWeight)
        : "",
    );
    setContainerVolume(item?.container?.capacityVolume ?? "");
    setBundleSize(
      typeof item?.ammunition?.bundleSize === "number"
        ? String(item.ammunition.bundleSize)
        : "1",
    );
    setStorageItemId(item?.ammunition?.storageItemId ?? "");

    setSubmitting(false);
  }, [isOpen, editItem]);

  useEffect(() => {
    if (editItem || mode !== "copy" || !selectedBase) return;
    setName(selectedBase.name);
    setCategory(selectedBase.category);
    setDescription(selectedBase.description ?? "");
    setWeight(selectedBase.weight?.toString() ?? "");
    setStackable(selectedBase.stackable ?? false);
    setMagical(selectedBase.magical ?? false);
    const firstCost = Object.entries(selectedBase.cost ?? {})[0];
    if (firstCost) {
      setCostCurrency(firstCost[0] as Currency);
      setCost(String(firstCost[1]));
    } else {
      setCost("");
    }
  }, [editItem, mode, selectedBase]);

  if (!isOpen) return null;

  const toggle = <T extends string>(
    value: T,
    values: T[],
    setter: (next: T[]) => void,
  ) =>
    setter(
      values.includes(value)
        ? values.filter((v) => v !== value)
        : [...values, value],
    );

  const buildItem = (): Item => {
    const item: Item = {
      id:
        editItem?.campaignItem.customItem?.id ??
        (slugify(name) || `custom-item-${Date.now()}`),
      name: name.trim(),
      category,
      ...(description.trim() ? { description: description.trim() } : {}),
      ...(weight !== "" ? { weight: Number(weight) } : {}),
      ...(cost !== "" ? { cost: { [costCurrency]: Number(cost) } } : {}),
      ...(stackable ? { stackable: true } : {}),
      ...(magical ? { magical: true } : {}),
      ...(attackBonus !== "" ? { attackBonus: Number(attackBonus) } : {}),
      ...(damageBonus !== "" ? { damageBonus: Number(damageBonus) } : {}),
      ...(acBonus !== "" ? { acBonus: Number(acBonus) } : {}),
    };

    if (equippable) {
      item.equippable = {
        slots: selectedSlots,
        ...(selectedWieldModes.length
          ? { allowedWieldModes: selectedWieldModes }
          : {}),
      };
    }

    if (category === "weapon") {
      item.weapon = {
        weaponKind,
        damage: {
          dice: { count: Number(damageCount) || 1, die: damageDie },
          damageType,
        },
        properties,
        ...(properties.includes("versatile")
          ? {
              versatileDamage: {
                dice: { count: 1, die: versatileDie },
                damageType,
              },
            }
          : {}),
        ...(rangeNormal !== ""
          ? {
              range: {
                normal: Number(rangeNormal),
                ...(rangeLong !== "" ? { long: Number(rangeLong) } : {}),
              },
            }
          : {}),
        ...(mastery.trim() ? { mastery: mastery.trim() } : {}),
        ...(ammunitionType ? { ammunitionType } : {}),
      };
    }

    if (category === "armor") {
      item.armor = {
        armorCategory,
        baseAc: Number(baseAc) || 10,
        ...(dexCap !== "" ? { dexCap: Number(dexCap) } : {}),
        ...(stealthDisadvantage ? { stealthDisadvantage: true } : {}),
        ...(strengthRequirement !== ""
          ? { strengthRequirement: Number(strengthRequirement) }
          : {}),
      };
    }

    if (category === "shield") {
      item.shield = { acBonus: Number(acBonus) || 2 };
    }

    if (category === "tool") {
      item.tool = { ability: toolAbility, utilize: [] };
    }

    if (category === "container") {
      item.container = {
        ...(containerWeight !== ""
          ? { capacityWeight: Number(containerWeight) }
          : {}),
        ...(containerVolume.trim()
          ? { capacityVolume: containerVolume.trim() }
          : {}),
      };
    }

    if (category === "ammunition") {
      item.ammunition = {
        bundleSize: Number(bundleSize) || 1,
        ...(storageItemId.trim()
          ? { storageItemId: storageItemId.trim() }
          : {}),
      };
    }

    return item;
  };

  const submit = async () => {
    if (!name.trim() || (mode === "copy" && !baseId)) return;

    const customItem = buildItem();
    setSubmitting(true);
    try {
      if (mode === "new") {
        await onConfirm({
          customItem,
          shortDescription: shortDescription.trim() || undefined,
          gmNotes: gmNotes.trim() || undefined,
          imageUrl: imageUrl.trim() || undefined,
        });
      } else {
        const overrides: CampaignItemOverride = {
          name: customItem.name,
          description: customItem.description,
          weight: customItem.weight,
          cost: customItem.cost,
          equippable: customItem.equippable,
          weapon: customItem.weapon,
          armor: customItem.armor,
          shield: customItem.shield,
          tool: customItem.tool,
          container: customItem.container,
          ammunition: customItem.ammunition,
          attackBonus: customItem.attackBonus,
          damageBonus: customItem.damageBonus,
          acBonus: customItem.acBonus,
          magical: customItem.magical,
        };

        await onConfirm({
          baseItemId: baseId,
          name: customItem.name,
          shortDescription: shortDescription.trim() || undefined,
          description: customItem.description,
          gmNotes: gmNotes.trim() || undefined,
          imageUrl: imageUrl.trim() || undefined,
          overrides,
        });
      }
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  const categoryPanel = (
    <>
      {category === "weapon" && (
        <section className="space-y-3">
          <SectionTitle>Weapon</SectionTitle>
          <div className="grid gap-3 sm:grid-cols-3">
            <Field title="Weapon kind">
              <select
                className={selectClass}
                value={weaponKind}
                onChange={(e) => setWeaponKind(e.target.value as WeaponKind)}
              >
                {weaponKinds.map((v) => (
                  <option key={v} value={v}>
                    {label(v)}
                  </option>
                ))}
              </select>
            </Field>
            <Field title="Damage dice">
              <div className="grid grid-cols-2 gap-2">
                <input
                  className={inputClass}
                  type="number"
                  min="1"
                  value={damageCount}
                  onChange={(e) => setDamageCount(e.target.value)}
                />
                <select
                  className={selectClass}
                  value={damageDie}
                  onChange={(e) =>
                    setDamageDie(
                      Number(e.target.value) as 1 | 4 | 6 | 8 | 10 | 12,
                    )
                  }
                >
                  {[1, 4, 6, 8, 10, 12].map((v) => (
                    <option key={v} value={v}>
                      d{v}
                    </option>
                  ))}
                </select>
              </div>
            </Field>
            <Field title="Damage type">
              <select
                className={selectClass}
                value={damageType}
                onChange={(e) => setDamageType(e.target.value as DamageType)}
              >
                {damageTypes.map((v) => (
                  <option key={v} value={v}>
                    {label(v)}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div>
            <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
              Properties
            </span>
            <div className="flex flex-wrap gap-1.5">
              {weaponProperties.map((v) => (
                <Toggle
                  key={v}
                  checked={properties.includes(v)}
                  onChange={() => toggle(v, properties, setProperties)}
                >
                  {label(v)}
                </Toggle>
              ))}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-4">
            <Field title="Normal range">
              <input
                className={inputClass}
                type="number"
                value={rangeNormal}
                onChange={(e) => setRangeNormal(e.target.value)}
              />
            </Field>
            <Field title="Long range">
              <input
                className={inputClass}
                type="number"
                value={rangeLong}
                onChange={(e) => setRangeLong(e.target.value)}
              />
            </Field>
            <Field title="Mastery">
              <input
                className={inputClass}
                value={mastery}
                onChange={(e) => setMastery(e.target.value)}
                placeholder="e.g. Topple"
              />
            </Field>
            <Field title="Ammunition">
              <select
                className={selectClass}
                value={ammunitionType}
                onChange={(e) =>
                  setAmmunitionType(e.target.value as AmmunitionType | "")
                }
              >
                <option value="">None</option>
                {ammunitionTypes.map((v) => (
                  <option key={v} value={v}>
                    {label(v)}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          {properties.includes("versatile") && (
            <Field title="Versatile die">
              <select
                className={selectClass}
                value={versatileDie}
                onChange={(e) =>
                  setVersatileDie(
                    Number(e.target.value) as 1 | 4 | 6 | 8 | 10 | 12,
                  )
                }
              >
                {[1, 4, 6, 8, 10, 12].map((v) => (
                  <option key={v} value={v}>
                    d{v}
                  </option>
                ))}
              </select>
            </Field>
          )}
        </section>
      )}

      {category === "armor" && (
        <section className="space-y-3">
          <SectionTitle>Armor</SectionTitle>
          <div className="grid gap-3 sm:grid-cols-4">
            <Field title="Armor category">
              <select
                className={selectClass}
                value={armorCategory}
                onChange={(e) =>
                  setArmorCategory(e.target.value as ArmorCategory)
                }
              >
                {armorCategories.map((v) => (
                  <option key={v} value={v}>
                    {label(v)}
                  </option>
                ))}
              </select>
            </Field>
            <Field title="Base AC">
              <input
                className={inputClass}
                type="number"
                value={baseAc}
                onChange={(e) => setBaseAc(e.target.value)}
              />
            </Field>
            <Field title="DEX cap">
              <input
                className={inputClass}
                type="number"
                value={dexCap}
                onChange={(e) => setDexCap(e.target.value)}
                placeholder="No cap"
              />
            </Field>
            <Field title="STR requirement">
              <input
                className={inputClass}
                type="number"
                value={strengthRequirement}
                onChange={(e) => setStrengthRequirement(e.target.value)}
              />
            </Field>
          </div>
          <Toggle
            checked={stealthDisadvantage}
            onChange={setStealthDisadvantage}
          >
            Stealth disadvantage
          </Toggle>
        </section>
      )}

      {category === "tool" && (
        <section>
          <SectionTitle>Tool</SectionTitle>
          <div className="mt-3 max-w-xs">
            <Field title="Primary ability">
              <select
                className={selectClass}
                value={toolAbility}
                onChange={(e) => setToolAbility(e.target.value as AbilityKey)}
              >
                {abilities.map((v) => (
                  <option key={v} value={v}>
                    {v.toUpperCase()}
                  </option>
                ))}
              </select>
            </Field>
          </div>
        </section>
      )}

      {category === "container" && (
        <section>
          <SectionTitle>Container</SectionTitle>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <Field title="Capacity weight">
              <input
                className={inputClass}
                type="number"
                value={containerWeight}
                onChange={(e) => setContainerWeight(e.target.value)}
              />
            </Field>
            <Field title="Capacity volume">
              <input
                className={inputClass}
                value={containerVolume}
                onChange={(e) => setContainerVolume(e.target.value)}
                placeholder="e.g. 1 cubic foot"
              />
            </Field>
          </div>
        </section>
      )}

      {category === "ammunition" && (
        <section>
          <SectionTitle>Ammunition</SectionTitle>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <Field title="Bundle size">
              <input
                className={inputClass}
                type="number"
                min="1"
                value={bundleSize}
                onChange={(e) => setBundleSize(e.target.value)}
              />
            </Field>
            <Field title="Storage item ID">
              <input
                className={inputClass}
                value={storageItemId}
                onChange={(e) => setStorageItemId(e.target.value)}
                placeholder="Optional"
              />
            </Field>
          </div>
        </section>
      )}
    </>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-3 sm:p-5">
      <div className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 text-zinc-100 shadow-2xl">
        <header className="flex shrink-0 items-center justify-between border-b border-white/10 px-5 py-4">
          <div>
            <h2 className="text-lg font-bold text-white">
              {editItem ? "Edit item" : "Create item"}
            </h2>
            <p className="mt-0.5 text-xs text-zinc-500">
              {editItem
                ? "Update this campaign item."
                : "Create from scratch or use an existing item as a starting point."}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-zinc-300 hover:bg-white/[0.08]"
          >
            Close
          </button>
        </header>

        {!editItem && (
          <div className="shrink-0 border-b border-white/10 px-5 py-3">
            <div className="inline-flex rounded-xl border border-white/10 bg-zinc-950 p-1">
              {(["new", "copy"] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setMode(value)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                    mode === value
                      ? "bg-white/10 text-white"
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  {value === "new" ? "Create new" : "Copy existing"}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="workspace-scrollbar min-h-0 flex-1 overflow-y-auto">
          {mode === "copy" && !editItem && (
            <section className="border-b border-white/10 p-5">
              <SectionTitle>Base item</SectionTitle>
              <input
                className={`${inputClass} mt-3`}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search items..."
              />
              <div className="workspace-scrollbar mt-2 max-h-44 overflow-y-auto rounded-xl border border-white/10 bg-zinc-950">
                {filtered.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setBaseId(item.id)}
                    className={`flex w-full items-center justify-between border-b border-white/5 px-3 py-2 text-left last:border-0 ${
                      baseId === item.id
                        ? "bg-emerald-500/10"
                        : "hover:bg-white/[0.04]"
                    }`}
                  >
                    <span className="text-sm font-medium text-zinc-200">
                      {item.name}
                    </span>
                    <span className="text-[10px] text-zinc-600">
                      {label(item.category)}
                    </span>
                  </button>
                ))}
              </div>
            </section>
          )}

          <div className="space-y-6 p-5">
            <section className="space-y-3">
              <SectionTitle>Basics</SectionTitle>
              <div className="grid gap-3 sm:grid-cols-[1fr_220px]">
                <Field title="Name">
                  <input
                    className={inputClass}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Item name"
                  />
                </Field>
                <Field title="Category">
                  <select
                    className={selectClass}
                    value={category}
                    onChange={(e) =>
                      setCategory(e.target.value as ItemCategory)
                    }
                  >
                    {categories.map((v) => (
                      <option key={v} value={v}>
                        {label(v)}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
              <Field title="Description">
                <textarea
                  className={areaClass}
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Rules, properties, lore, or other item description..."
                />
              </Field>
              <Field title="Short description">
                <input
                  className={inputClass}
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  placeholder="Optional short inventory text"
                />
              </Field>
            </section>

            <section className="space-y-3">
              <SectionTitle>Properties</SectionTitle>
              <div className="grid gap-3 sm:grid-cols-4">
                <Field title="Weight (lb.)">
                  <input
                    className={inputClass}
                    type="number"
                    min="0"
                    step="0.1"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                  />
                </Field>
                <Field title="Value">
                  <div className="grid grid-cols-[1fr_72px] gap-2">
                    <input
                      className={inputClass}
                      type="number"
                      min="0"
                      value={cost}
                      onChange={(e) => setCost(e.target.value)}
                    />
                    <select
                      className={selectClass}
                      value={costCurrency}
                      onChange={(e) =>
                        setCostCurrency(e.target.value as Currency)
                      }
                    >
                      {currencies.map((v) => (
                        <option key={v} value={v}>
                          {v.toUpperCase()}
                        </option>
                      ))}
                    </select>
                  </div>
                </Field>
                <Field title="Attack bonus">
                  <input
                    className={inputClass}
                    type="number"
                    value={attackBonus}
                    onChange={(e) => setAttackBonus(e.target.value)}
                  />
                </Field>
                <Field title="Damage / AC bonus">
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      className={inputClass}
                      type="number"
                      value={damageBonus}
                      onChange={(e) => setDamageBonus(e.target.value)}
                      placeholder="DMG"
                    />
                    <input
                      className={inputClass}
                      type="number"
                      value={acBonus}
                      onChange={(e) => setAcBonus(e.target.value)}
                      placeholder="AC"
                    />
                  </div>
                </Field>
              </div>
              <div className="flex flex-wrap gap-2">
                <Toggle checked={magical} onChange={setMagical}>
                  Magical
                </Toggle>
                <Toggle checked={stackable} onChange={setStackable}>
                  Stackable
                </Toggle>
                <Toggle checked={equippable} onChange={setEquippable}>
                  Equippable
                </Toggle>
              </div>
            </section>

            {equippable && (
              <section className="space-y-3">
                <SectionTitle>Equipment</SectionTitle>
                <div>
                  <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
                    Slots
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {slots.map((v) => (
                      <Toggle
                        key={v}
                        checked={selectedSlots.includes(v)}
                        onChange={() =>
                          toggle(v, selectedSlots, setSelectedSlots)
                        }
                      >
                        {label(v)}
                      </Toggle>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
                    Wield modes
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {wieldModes.map((v) => (
                      <Toggle
                        key={v}
                        checked={selectedWieldModes.includes(v)}
                        onChange={() =>
                          toggle(v, selectedWieldModes, setSelectedWieldModes)
                        }
                      >
                        {label(v)}
                      </Toggle>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {categoryPanel}

            <section className="space-y-3">
              <SectionTitle>Campaign</SectionTitle>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field title="Image URL">
                  <input
                    className={inputClass}
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="Optional"
                  />
                </Field>
                <Field title="GM notes">
                  <textarea
                    className={areaClass}
                    rows={3}
                    value={gmNotes}
                    onChange={(e) => setGmNotes(e.target.value)}
                    placeholder="Private GM notes..."
                  />
                </Field>
              </div>
            </section>
          </div>
        </div>

        <footer className="flex shrink-0 items-center justify-between gap-3 border-t border-white/10 px-5 py-4">
          <p className="text-xs text-zinc-600">
            {editItem
              ? "Editing campaign item"
              : mode === "copy"
                ? selectedBase
                  ? `Based on ${selectedBase.name}`
                  : "Choose a base item"
                : "New campaign item"}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-zinc-300 hover:bg-white/[0.08]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={submit}
              disabled={
                !name.trim() || submitting || (mode === "copy" && !baseId)
              }
              className="rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {submitting
                ? editItem
                  ? "Saving..."
                  : "Creating..."
                : editItem
                  ? "Save changes"
                  : "Create item"}
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-zinc-400">
    {children}
  </h3>
);

export default CreateCampaignItemModal;
