type H2Props = {
  children: React.ReactNode;
};

const H2 = ({ children }: H2Props) => {
  return (
    <h2 className=" font-semibold text-slate-200 text-xl lg:text-3xl border-b border-neutral-600 mb-4">
      {children}
    </h2>
  );
};

export default H2;
