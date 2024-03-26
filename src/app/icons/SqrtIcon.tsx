import React from "react";

interface SqrtIconProps {
  className?: string;
  isActive?: boolean;
}

const SqrtIcon = ({ className, isActive = true }: SqrtIconProps) => (
  <svg
    width="29"
    height="29"
    viewBox="0 0 29 29"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <g id="tabler:math">
      <path
        id="Vector"
        d="M22.9583 6.04297H14.5L9.66667 22.9596L6.04167 15.7096H3.625M16.9167 15.7096L24.1667 22.9596M16.9167 22.9596L24.1667 15.7096"
        stroke={isActive ? "#008AFC" : "#E3EAFC"}
        strokeWidth="2.41667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  </svg>
);

export default SqrtIcon;
