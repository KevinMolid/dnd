type StatCardProps = {
  label: string;
  value: string | number;
  subValue?: string;
};

const StatCard = ({ label, value, subValue }: StatCardProps) => {
  return (
    <div className="rounded-xl border border-white/10 bg-zinc-900/70 p-3 sm:rounded-2xl sm:p-4">
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500 sm:text-xs">
        {label}
      </p>

      <p className="mt-1 text-lg font-bold text-white sm:mt-2 sm:text-2xl">
        {value}
      </p>

      {subValue && (
        <p className="text-xs text-zinc-400 sm:mt-1 sm:text-sm">{subValue}</p>
      )}
    </div>
  );
};

export default StatCard;