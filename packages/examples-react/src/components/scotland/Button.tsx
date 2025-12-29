import type React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  children: React.ReactNode;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}
const Button = ({
  variant = "primary",
  children = "Button",
  icon,
  fullWidth = true,
  className = "",
  disabled = false,
  ...props
}: ButtonProps) => {
  const baseStyles =
    "relative inline-flex items-center justify-center h-[48px] px-8 py-0 rounded-[4px] font-['Montserrat'] text-[14px] uppercase tracking-[0.1em] transition-all duration-400 ease-out active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer overflow-hidden";
  const variantStyles = {
    primary: "bg-[#1B263B] text-[#E0E1DD] hover:bg-[#151d2d] border border-transparent shadow-[0_4px_20px_rgba(27,38,59,0.15)]",
    secondary: "bg-transparent border border-[#778DA9] text-[#415A77] hover:border-[#1B263B] hover:text-[#1B263B]",
    ghost: "bg-transparent text-[#778DA9] hover:text-[#1B263B] hover:bg-[#E0E1DD]/30",
  };
  const widthStyles = fullWidth ? "w-full" : "w-auto";
  return (
    <button className={`${baseStyles} ${variantStyles[variant]} ${widthStyles} ${className}`} disabled={disabled} {...props}>
      {}
      <span
        className="pointer-events-none absolute inset-0 bg-white/0 transition-colors duration-400 hover:bg-white/5"
        data-node-id="button[0]>span[0]"
      />

      <div className="relative mt-px flex items-center gap-2" data-node-id="button[0]>div[1]">
        {children}
        {icon && (
          <span className="flex h-4 w-4 shrink-0 items-center justify-center opacity-80" data-node-id="button[0]>div[1]>span[0]">
            {icon}
          </span>
        )}
      </div>
    </button>
  );
};
export default Button;
