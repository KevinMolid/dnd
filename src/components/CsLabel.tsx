type Props = {
  children: String;
};

const CsLabel = ({ children }: Props) => {
  return (
    <p
      className="leading-none text-xs uppercase
  "
    >
      {children}
    </p>
  );
};

export default CsLabel;
