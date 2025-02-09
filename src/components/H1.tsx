type H1Props = {
  children: React.ReactNode;
};

const H1 = ({ children }: H1Props) => {
  return (
    <h1 className="font-serif text-red-900 font-bold text-3xl md:text-4xl mb-2">
      {children}
    </h1>
  );
};

export default H1;
