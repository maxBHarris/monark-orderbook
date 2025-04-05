import React from "react";

// button.js
export const Button = ({
  children,
  className = "",
  variant = "default",
  ...props
}) => {
  const base = "px-4 py-2 rounded-md font-semibold";
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    destructive: "bg-red-600 text-white hover:bg-red-700",
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};
