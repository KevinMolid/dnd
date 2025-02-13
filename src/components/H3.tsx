type H3Props = {
  children: React.ReactNode;
};

const H3 = ({ children }: H3Props) => {
  return (
    <h3 className="font-semibold text-white text-lg lg:text-2xl mb-2">
      {children}
    </h3>
  );
};

export default H3;
