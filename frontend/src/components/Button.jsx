import React from "react";

export function Button({
  children,
  variant = "primary",
  size = "md",
  icon: Icon,
  disabled = false,
  onClick,
  id,
  type = "button",
  style = {},
}) {
  const variantClass = variant === "secondary" ? "btn-secondary" : "btn-primary";

  return (
    <button
      id={id}
      type={type}
      className={`btn ${variantClass}`}
      disabled={disabled}
      onClick={onClick}
      style={{
        opacity: disabled ? 0.6 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
        ...style,
      }}
    >
      {Icon && <Icon size={16} />}
      {children}
    </button>
  );
}

export default Button;
