import { ShoppingBagIcon } from "@heroicons/react/24/solid";
import { type ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "disabled";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  icon?: ReactNode;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  onClick,
  className = "",
}: ButtonProps) {
  const baseClasses =
    "flex items-center justify-center gap-2 rounded-lg font-semibold transition-all shadow-lg whitespace-nowrap";

  const variantClasses = {
    primary:
      "bg-gradient-to-r from-primary to-teal-600 hover:brightness-90 text-white",
    secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800",
    disabled: "bg-gray-400 cursor-not-allowed text-white",
  };

  const sizeClasses = {
    sm: "px-3 py-2 text-xs",
    md: "px-4 py-3 text-sm",
    lg: "px-6 py-4 text-base",
  };

  const finalVariant = disabled ? "disabled" : variant;
  const classes = `${baseClasses} ${variantClasses[finalVariant]} ${sizeClasses[size]} ${className}`;

  return (
    <button
      className={classes}
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
    >
      <ShoppingBagIcon className="size-4" />
      {children}
    </button>
  );
}
