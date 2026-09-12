import React from "react";

export function Badge({ children, variant = "low", id }) {
  return (
    <span id={id} className={`badge badge-${variant}`}>
      {children}
    </span>
  );
}

export default Badge;
