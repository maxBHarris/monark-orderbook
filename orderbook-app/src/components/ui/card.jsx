import React from "react";

export const Card = ({ children }) => <div className="card">{children}</div>;

export const CardContent = ({ children, className = "" }) => (
  <div className={`card-content ${className}`}>{children}</div>
);
