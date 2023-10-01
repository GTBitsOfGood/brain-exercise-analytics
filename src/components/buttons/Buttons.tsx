import React from "react";

interface ButtonProps {
  className?: string;
  divClassName?: string;
  leftIcon?: boolean;
  rightIcon?: boolean;
  size?: string;
  text: string;
  variant?: string;
  onClick: () => void;
}

const Button: React.FC<ButtonProps> = ({
  className,
  divClassName,
  leftIcon,
  rightIcon,
  size,
  text,
  variant,
  onClick,
}) => (
  <button className={`${className} ${variant} ${size}`} onClick={onClick}>
    {leftIcon && <span className="icon-left">{leftIcon}</span>}
    <span className={divClassName}>{text}</span>
    {rightIcon && <span className="icon-right">{rightIcon}</span>}
  </button>
);

export default Button;
