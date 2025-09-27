import React, { forwardRef } from "react";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  /** Large | medium | small */
  size?: "sm" | "md" | "lg";
  /** Full width button */
  block?: boolean;
  /** Extra classes to merge */
  className?: string;
};

/**
 * Reusable Button component built with TypeScript + TailwindCSS
 * Accent color: #00FF99
 * Accessible, supports ref forwarding and all native button props
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { children, size = "md", block = false, className = "", disabled, ...rest },
    ref
  ) => {
    const sizeClasses = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-base",
      lg: "px-6 py-3 text-lg",
    }[size];

    return (
      <button
        ref={ref}
        disabled={disabled}
        {...rest}
        className={
          `${
            block ? "w-full" : "inline-flex"
          } items-center justify-center gap-2 rounded-2xl font-medium transition-all focus:outline-none ` +
          `bg-[#00FF99] text-black shadow-lg shadow-[#00FF9975] ${sizeClasses} ` +
          `hover:scale-[1.01] active:scale-95 hover:translate-y-0.5 hover:brightness-95 disabled:opacity-50 disabled:cursor-not-allowed ` +
          `focus:ring-4 focus:ring-[#00FF99]/30 ${className}`
        }
      >
        {/* Decorative floating highlight */}
        <span className="absolute -inset-px rounded-2xl pointer-events-none opacity-0 transition-opacity group-hover:opacity-100" />
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
