type SectionProps = {
  children: React.ReactNode;
};

const Section = ({ children }: SectionProps) => {
  return <div className="mb-12">{children}</div>;
};

export default Section;
