type DescriptionProps = {
  children: React.ReactNode;
};

const Description = ({ children }: DescriptionProps) => {
  return (
    <div className="border-l-2 border-cyan-500/50 p-2 pl-4 bg-blue-300/15 mb-4">
      {children}
    </div>
  );
};

export default Description;
