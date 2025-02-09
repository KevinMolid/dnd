type H1Props = {
  children: React.ReactNode;
};

const H1 = ({ children }: H1Props) => {
  return <h1 className="font-bold text-2xl lg:text-3xl">{children}</h1>;
};

export default H1;
