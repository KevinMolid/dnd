type Props = {
  children: React.ReactNode;
};

const CsLabel = ({ children }: Props) => {
  return (
    <p
      className="leading-none text-xs uppercase text-neutral-300
  "
    >
      {children}
    </p>
  );
};

export default CsLabel;
