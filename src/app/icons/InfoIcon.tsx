import React from "react";

interface InfoIconProps {
  className?: string;
}

const InfoIcon: React.FC<InfoIconProps> = ({ className }) => (
  <svg
    width="17"
    height="17"
    viewBox="0 0 17 17"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      cx="8.5"
      cy="8.5"
      r="8"
      transform="rotate(-180 8.5 8.5)"
      stroke="#C8C8C8"
    />
    <path
      d="M8.55859 11.9023L8.55438 7.91469"
      stroke="#B3B3B3"
      strokeWidth="1.51111"
      strokeLinecap="round"
    />
    <circle
      cx="8.55403"
      cy="5.51888"
      r="0.797531"
      transform="rotate(-180 8.55403 5.51888)"
      fill="#B3B3B3"
    />
  </svg>
);

export default InfoIcon;
