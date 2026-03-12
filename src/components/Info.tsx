type InfoProps = {
  children: React.ReactNode;
};

const Info = ({ children }: InfoProps) => {
  return (
    <div className="border-l-2 border-green-500/50 p-2 pl-4 bg-green-300/15 mb-4">
      {children}
    </div>
  );
};

export default Info;
