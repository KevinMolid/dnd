type Props = {
  children: React.ReactNode;
};

const Container = ({ children }: Props) => {
  return <div className="px-12 py-4">{children}</div>;
};

export default Container;
