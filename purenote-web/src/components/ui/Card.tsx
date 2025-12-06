import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = "",
  onClick,
}) => {
  return (
    <div
      className={`glass rounded-xl p-6 ${
        onClick
          ? "cursor-pointer hover:bg-dark-hover transition-colors duration-200"
          : ""
      } ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
