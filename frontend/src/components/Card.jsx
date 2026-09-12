import React from "react";

export function Card({ title, subtitle, action, children, className = "", style = {}, id }) {
  return (
    <div
      id={id}
      className={`glass-panel ${className}`}
      style={{
        padding: "1.5rem",
        ...style,
      }}
    >
      {(title || subtitle || action) && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "1rem",
            paddingBottom: "0.75rem",
            borderBottom: "1px solid var(--border-subtle)",
          }}
        >
          <div>
            {title && <h3 style={{ fontSize: "1.1rem", fontWeight: "600" }}>{title}</h3>}
            {subtitle && <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "0.2rem" }}>{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div>{children}</div>
    </div>
  );
}

export default Card;
