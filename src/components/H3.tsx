type H3Props = {
  children: React.ReactNode;
};

const H3 = ({ children }: H3Props) => {
  return <h3 className="text-lg lg:text-2xl">{children}</h3>;
};

export default H3;
