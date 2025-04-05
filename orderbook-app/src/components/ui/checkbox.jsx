import React from "react";

export const Checkbox = ({ checked, onCheckedChange }) => (
  <input
    type="checkbox"
    className="checkbox"
    checked={checked}
    onChange={(e) => onCheckedChange(e.target.checked)}
  />
);
