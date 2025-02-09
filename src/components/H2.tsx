type H2Props = {
  children: React.ReactNode;
};

const H2 = ({ children }: H2Props) => {
  return (
    <h2 className="font-serif font-semibold text-red-900 text-xl lg:text-3xl border-b-2 border-gold-400 mb-1">
      {children}
    </h2>
  );
};

export default H2;
