import React from "react";
// select.js
export const Select = ({ value, onValueChange, children }) => (
  <select
    className="w-full p-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
