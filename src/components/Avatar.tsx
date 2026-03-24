type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

type AvatarShape = "rounded" | "circle";

type AvatarProps = {
  name?: string;
  src?: string | null;
  size?: AvatarSize;
  shape?: AvatarShape;
  fallbackText?: string;
  className?: string;
};

const sizeClasses: Record<AvatarSize, string> = {
  xs: "h-6 w-6 text-xs",
  sm: "h-8 w-8 text-sm",
  md: "h-12 w-12 text-base",
  lg: "h-20 w-20 text-xl",
  xl: "h-32 w-32 text-3xl",
};

const shapeClasses: Record<AvatarShape, string> = {
  rounded: "rounded-2xl",
  circle: "rounded-full",
};

const Avatar = ({
  name,
  src,
  size = "md",
  shape = "rounded",
  fallbackText,
  className = "",
}: AvatarProps) => {
  const cleanedSrc = src?.trim() || "";
  const initial =
    fallbackText?.trim() || name?.trim().charAt(0).toUpperCase() || "?";

  return (
    <div
      className={`relative shrink-0 overflow-hidden border border-white/10 bg-white/5 ${sizeClasses[size]} ${shapeClasses[shape]} ${className}`}
    >
      {cleanedSrc ? (
        <img
          src={cleanedSrc}
          alt={`${name ?? "Avatar"} avatar`}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-zinc-800 to-zinc-900 font-semibold text-zinc-400">
          {initial}
        </div>
      )}
    </div>
  );
};

export default Avatar;
