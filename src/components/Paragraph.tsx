type Props = {
  children: React.ReactNode;
};

const Paragraph = ({ children }: Props) => {
  return <p className="mb-4 text-slate-300">{children}</p>;
};

export default Paragraph;
