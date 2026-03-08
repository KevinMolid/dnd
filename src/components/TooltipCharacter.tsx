type TooltipCharacterProps = {
  children: React.ReactNode;
  tooltip: string;
};

export const TooltipCharacter = ({
  children,
  tooltip,
}: TooltipCharacterProps) => {
  return (
    <span className="tooltip-wrapper">
      <span className="font-bold text-slate-200">{children}</span>
      <span className="tooltip-box">{tooltip}</span>
    </span>
  );
};
