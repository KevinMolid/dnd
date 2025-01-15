type H2Props = {
  children: React.ReactNode;
};

const H2 = ({ children }: H2Props) => {
  return <h2 className="text-xl lg:text-3xl">{children}</h2>;
};

export default H2;
