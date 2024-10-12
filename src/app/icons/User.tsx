import { CSSProperties } from "react";

interface Props {
  className?: string;
  style?: CSSProperties;
  fill?: string;
}

function User({ className, style, fill }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="26"
      height="26"
      fill="none"
      viewBox="0 0 26 26"
      className={className}
      style={style}
    >
      <path
        fill={fill ?? "#008AFC"}
        d="M23.051 21.983a.78.78 0 01-.677.39H3.624a.782.782 0 01-.676-1.171c1.488-2.571 3.78-4.415 6.455-5.29a7.031 7.031 0 117.193 0c2.675.875 4.967 2.719 6.454 5.29a.78.78 0 01.001.781z"
      ></path>
    </svg>
  );
}

export default User;
