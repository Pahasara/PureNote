import React from "react";
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
  isLoading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  isLoading = false,
  disabled,
  children,
  className = "",
  ...props
}) => {
  const variantStyles = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    danger:
      "bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-2.5 rounded-full transition-colors duration-200",
  };

  return (
    <button
      className={`${variantStyles[variant]} ${className} disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
};
