import { CSSProperties } from "react";

interface Props {
  className?: string;
  style?: CSSProperties;
}

export default function LoadingIcon({ className, style }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="60"
      height="60"
      viewBox="0 0 60 60"
      fill="none"
      className={className}
      style={style}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M33 48C34.5913 48 36.1174 48.6321 37.2426 49.7574C38.3679 50.8826 39 52.4087 39 54C39 55.5913 38.3679 57.1174 37.2426 58.2426C36.1174 59.3679 34.5913 60 33 60C31.4087 60 29.8826 59.3679 28.7574 58.2426C27.6321 57.1174 27 55.5913 27 54C27 52.4087 27.6321 50.8826 28.7574 49.7574C29.8826 48.6321 31.4087 48 33 48ZM14.223 39C16.2121 39 18.1198 39.7902 19.5263 41.1967C20.9328 42.6032 21.723 44.5109 21.723 46.5C21.723 48.4891 20.9328 50.3968 19.5263 51.8033C18.1198 53.2098 16.2121 54 14.223 54C12.2339 54 10.3262 53.2098 8.9197 51.8033C7.51318 50.3968 6.723 48.4891 6.723 46.5C6.723 44.5109 7.51318 42.6032 8.9197 41.1967C10.3262 39.7902 12.2339 39 14.223 39ZM48.957 40.5C50.5483 40.5 52.0744 41.1321 53.1996 42.2574C54.3249 43.3826 54.957 44.9087 54.957 46.5C54.957 48.0913 54.3249 49.6174 53.1996 50.7426C52.0744 51.8679 50.5483 52.5 48.957 52.5C47.3657 52.5 45.8396 51.8679 44.7144 50.7426C43.5891 49.6174 42.957 48.0913 42.957 46.5C42.957 44.9087 43.5891 43.3826 44.7144 42.2574C45.8396 41.1321 47.3657 40.5 48.957 40.5ZM55.5 27.957C56.6935 27.957 57.8381 28.4311 58.682 29.275C59.5259 30.1189 60 31.2635 60 32.457C60 33.6505 59.5259 34.7951 58.682 35.639C57.8381 36.4829 56.6935 36.957 55.5 36.957C54.3065 36.957 53.1619 36.4829 52.318 35.639C51.4741 34.7951 51 33.6505 51 32.457C51 31.2635 51.4741 30.1189 52.318 29.275C53.1619 28.4311 54.3065 27.957 55.5 27.957ZM7.5 18C9.48912 18 11.3968 18.7902 12.8033 20.1967C14.2098 21.6032 15 23.5109 15 25.5C15 27.4891 14.2098 29.3968 12.8033 30.8033C11.3968 32.2098 9.48912 33 7.5 33C5.51088 33 3.60322 32.2098 2.1967 30.8033C0.790176 29.3968 0 27.4891 0 25.5C0 23.5109 0.790176 21.6032 2.1967 20.1967C3.60322 18.7902 5.51088 18 7.5 18ZM53.358 15.621C54.1536 15.621 54.9167 15.9371 55.4793 16.4997C56.0419 17.0623 56.358 17.8253 56.358 18.621C56.358 19.4166 56.0419 20.1797 55.4793 20.7423C54.9167 21.3049 54.1536 21.621 53.358 21.621C52.5623 21.621 51.7993 21.3049 51.2367 20.7423C50.6741 20.1797 50.358 19.4166 50.358 18.621C50.358 17.8253 50.6741 17.0623 51.2367 16.4997C51.7993 15.9371 52.5623 15.621 53.358 15.621ZM24 0C26.3869 0 28.6761 0.948211 30.364 2.63604C32.0518 4.32387 33 6.61305 33 9C33 11.3869 32.0518 13.6761 30.364 15.364C28.6761 17.0518 26.3869 18 24 18C21.6131 18 19.3239 17.0518 17.636 15.364C15.9482 13.6761 15 11.3869 15 9C15 6.61305 15.9482 4.32387 17.636 2.63604C19.3239 0.948211 21.6131 0 24 0ZM46.5 9C46.8978 9 47.2794 9.15804 47.5607 9.43934C47.842 9.72064 48 10.1022 48 10.5C48 10.8978 47.842 11.2794 47.5607 11.5607C47.2794 11.842 46.8978 12 46.5 12C46.1022 12 45.7206 11.842 45.4393 11.5607C45.158 11.2794 45 10.8978 45 10.5C45 10.1022 45.158 9.72064 45.4393 9.43934C45.7206 9.15804 46.1022 9 46.5 9Z"
        fill="#008AFC"
      />
    </svg>
  );
}
