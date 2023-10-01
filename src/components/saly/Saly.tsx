import React from "react";

interface SalyProps {
  bei: string;
  className?: string;
}

const Saly: React.FC<SalyProps> = ({ bei, className }) => (
  <img src={bei} alt="Saly Image" className={className} />
);

export default Saly;
