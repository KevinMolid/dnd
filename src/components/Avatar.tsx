type Props = {
  name?: string;
  email?: string;
  uid: string;
  size?: "sm" | "md" | "lg";
};

const SIZE_MAP: Record<string, string> = {
  sm: "h-7 w-7 text-xs",
  md: "h-9 w-9 text-sm",
  lg: "h-12 w-12 text-base",
};

const COLORS = [
  "bg-red-500/20 text-red-300",
  "bg-blue-500/20 text-blue-300",
  "bg-emerald-500/20 text-emerald-300",
  "bg-purple-500/20 text-purple-300",
  "bg-amber-500/20 text-amber-300",
  "bg-pink-500/20 text-pink-300",
  "bg-cyan-500/20 text-cyan-300",
];

const getColor = (uid: string) => {
  let hash = 0;
  for (let i = 0; i < uid.length; i++) {
    hash = uid.charCodeAt(i) + ((hash << 5) - hash);
  }
  return COLORS[Math.abs(hash) % COLORS.length];
};

const getInitials = (name?: string, email?: string, uid?: string) => {
  if (name && name.trim().length > 0) {
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }

  if (email) return email[0].toUpperCase();

  return uid?.slice(0, 2).toUpperCase() ?? "?";
};

const Avatar = ({ name, email, uid, size = "md" }: Props) => {
  const initials = getInitials(name, email, uid);
  const color = getColor(uid);

  const className =
    "flex items-center justify-center rounded-full font-semibold border border-white/10 transition-transform hover:scale-105 " +
    SIZE_MAP[size] +
    " " +
    color;

  return (
    <div className={className} title={name || email || uid}>
      {initials}
    </div>
  );
};

export default Avatar;