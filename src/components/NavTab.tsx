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
        (isActive
          ? "border-amber-400 text-white"
          : "text-slate-300 hover:text-white border-transparent")
      }
    >
      {children}
    </li>
  );
};

export default Tab;
