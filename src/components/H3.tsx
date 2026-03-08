type H3Props = {
  children: React.ReactNode;
  className?: string;
};

const H3 = ({ children, className }: H3Props) => {
  return (
    <h3 className={`font-semibold text-lg lg:text-2xl mb-2 ${className ?? ""}`}>
      {children}
    </h3>
  );
};

export default H3;
