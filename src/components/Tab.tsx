type Props = {
  children: React.ReactNode;
  active: Boolean;
  onClick: () => void;
};

const Tab = ({ children, active, onClick }: Props) => {
  return (
    <li
      onClick={onClick}
      className={
        "bg-white flex-1 flex flex-col w-fit px-2 py-2 border-b-2 font-bold justify-center hover:cursor-pointer " +
        (active ? "border-black text-black" : "border-none text-gray-500")
      }
    >
      {children}
    </li>
  );
};

export default Tab;
