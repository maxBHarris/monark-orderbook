import React from "react";

// checkbox.js
export const Checkbox = ({ checked, onCheckedChange }) => (
  <input
    type="checkbox"
    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
    checked={checked}
    onChange={(e) => onCheckedChange(e.target.checked)}
  />
);
