type Props = {
  children: React.ReactNode;
};

const Paragraph = ({ children }: Props) => {
  return <p className="mb-4">{children}</p>;
};

export default Paragraph;
