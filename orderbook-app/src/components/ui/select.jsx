import React from "react";

export const Select = ({ value, onValueChange, children }) => (
  <select
    className="select"
    value={value}
    onChange={(e) => onValueChange(e.target.value)}
  >
    {children}
  </select>
);

export const SelectTrigger = ({ children }) => <>{children}</>;
export const SelectContent = ({ children }) => <>{children}</>;
export const SelectItem = ({ value, children }) => (
  <option value={value}>{children}</option>
);
export const SelectValue = ({ placeholder }) => (
  <option disabled>{placeholder}</option>
);
