import type { TraitGroupKey } from "../types";
import { getGroupMeta } from "../utils/traitHelpers";

type SourceBadgeProps = {
  groupKey: TraitGroupKey;
};

const SourceBadge = ({ groupKey }: SourceBadgeProps) => {
  const meta = getGroupMeta(groupKey);

  return (
    <div
      className={`inline-flex h-9 w-9 items-center justify-center rounded-xl border text-[11px] font-bold tracking-[0.18em] ${meta.className}`}
    >
      {meta.label}
    </div>
  );
};

export default SourceBadge;