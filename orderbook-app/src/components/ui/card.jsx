// card.js
export const Card = ({ children }) => (
  <div className="bg-slate-700 rounded-lg shadow-md mb-4">{children}</div>
);

export const CardContent = ({ children, className = "" }) => (
  <div className={`p-4 ${className}`}>{children}</div>
);
