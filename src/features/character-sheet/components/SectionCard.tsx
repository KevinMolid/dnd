import type { ReactNode } from "react";

type SectionCardProps = {
  title: string;
  children: ReactNode;
  right?: ReactNode;
};

const SectionCard = ({ title, children, right }: SectionCardProps) => {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      <div className="mb-3 flex items-start justify-between gap-3">
        <h2 className="text-base font-semibold text-white sm:text-lg">
          {title}
        </h2>

        {right}
      </div>

      {children}
    </section>
  );
};

export default SectionCard;
