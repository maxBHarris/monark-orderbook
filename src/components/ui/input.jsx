import React from "react";

// input.js
export const Input = ({ ...props }) => (
  <input
    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    {...props}
  />
);
