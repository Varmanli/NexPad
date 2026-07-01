import { FC, ReactNode } from "react";
import clsx from "clsx";

interface Props {
  children: ReactNode;
  active?: boolean;
  onClick?(): void;
  type?: "button" | "submit" | "reset";
  title?: string;
}

const ToolButton: FC<Props> = ({
  children,
  active,
  onClick,
  type = "button",
  title,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      title={title}
      className={clsx(
        "p-1.5 rounded-lg transition-all text-sm",
        active
          ? "bg-primary/15 text-primary"
          : "text-text-muted hover:bg-surface-hover hover:text-text"
      )}
    >
      {children}
    </button>
  );
};

export default ToolButton;
