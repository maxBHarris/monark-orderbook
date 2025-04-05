import React from "react";

export const Button = ({
  children,
  className = "",
  variant = "default",
  ...props
}) => {
  const variantClass = {
    default: "btn-default",
    destructive: "btn-destructive",
  }[variant];

  return (
    <button className={`btn-base ${variantClass} ${className}`} {...props}>
      {children}
    </button>
  );
};
