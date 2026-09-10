type StatCardProps = {
  label: string;
  value: string | number;
  subValue?: string;
};

const StatCard = ({ label, value, subValue }: StatCardProps) => {
  return (
    <div className="min-w-0 rounded-xl border border-white/10 bg-zinc-900/70 px-3 py-2.5">
      <p className="truncate text-[9px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
        {label}
      </p>

      <p className="mt-1 text-lg font-bold leading-none text-white">{value}</p>

      {subValue ? (
        <p className="mt-1 truncate text-[10px] leading-4 text-zinc-500">
          {subValue}
        </p>
      ) : null}
    </div>
  );
};

export default StatCard;
