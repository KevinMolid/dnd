import type { ReactNode } from "react";

type SectionCardProps = {
  title: string;
  children: ReactNode;
  right?: ReactNode;
};

const SectionCard = ({ title, children, right }: SectionCardProps) => {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl sm:p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <h2 className="text-xl font-semibold text-white sm:text-2xl">
          {title}
        </h2>
        {right}
      </div>
      {children}
    </section>
  );
};

export default SectionCard;