type DescriptionProps = {
  children: React.ReactNode;
};

const Description = ({ children }: DescriptionProps) => {
  return (
    <div className="border-l-2 border-r-2 border-cyan-500/50 py-2 px-6 bg-blue-300/15 mb-4">
      {children}
    </div>
  );
};

export default Description;
