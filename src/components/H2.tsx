type H2Props = {
  children: React.ReactNode;
};

const H2 = ({ children }: H2Props) => {
  return (
    <h2 className="font-serif font-semibold text-slate-200 text-xl lg:text-3xl border-b-2 border-slate-400 mb-4">
      {children}
    </h2>
  );
};

export default H2;
