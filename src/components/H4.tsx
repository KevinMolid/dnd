type H3Props = {
  children: React.ReactNode;
  className?: string;
};

const H4 = ({ children, className }: H3Props) => {
  return (
    <h3 className={`font-semibold text-md lg:text-xl ${className ?? ""}`}>
      {children}
    </h3>
  );
};

export default H4;
