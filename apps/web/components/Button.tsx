import React from "react";

interface Button {
  onClick?: () => void;
  children: React.ReactNode | string;
  className?: string;
  type: "submit" | "button" | "reset";
}

const Button = ({ onClick, children, type, className }: Button) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`inline-flex text-lg items-center justify-center gap-2 rounded-md bg-linear-to-br from-orange-400 to-orange-600 px-5 py-1.5 cursor-pointer children-sm font-semibold children-ink-950 shadow-glow transition hover:from-orange-300 hover:to-orange-500 hover:-translate-y-0.5 active:translate-y-0 ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
