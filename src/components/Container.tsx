type Props = {
  children: React.ReactNode;
};

const Container = ({ children }: Props) => {
  return (
    <div
      className="px-12 py-4 flex justify-center
    "
    >
      <div className="flex-grow max-w-[1200px]">{children}</div>
    </div>
  );
};

export default Container;
