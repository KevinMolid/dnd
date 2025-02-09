import { useLocation, useNavigate } from "react-router-dom";

type Props = {
  children: React.ReactNode;
  to: string;
};

const Tab = ({ children, to }: Props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = location.pathname === to;

  return (
    <li
      onClick={() => navigate(to)}
      className={
        "flex-1 flex flex-col px-2 pt-2 border-b-2 text-sm md:text-base font-medium justify-center hover:cursor-pointer " +
        (isActive ? "border-black text-black" : "border-none text-gray-500")
      }
    >
      {children}
    </li>
  );
};

export default Tab;
