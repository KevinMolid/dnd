import { NavLink } from "react-router-dom";

type Props = {
  children: React.ReactNode;
  to: string;
};

const NavTab = ({ children, to }: Props) => {
  return (
    <li className="shrink-0">
      <NavLink
        to={to}
        className={({ isActive }) =>
          [
            "inline-flex items-center rounded-xl px-4 py-2 text-sm font-medium transition-colors sm:text-base",
            isActive
              ? "bg-white text-zinc-950"
              : "text-zinc-300 hover:bg-white/10 hover:text-white",
          ].join(" ")
        }
      >
        {children}
      </NavLink>
    </li>
  );
};

export default NavTab;
