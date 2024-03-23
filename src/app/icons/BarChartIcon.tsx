// const BarChartIcon = () => (
//   <>
//     <svg
//       width="49"
//       height="48"
//       viewBox="0 0 49 48"
//       fill="none"
//       xmlns="http://www.w3.org/2000/svg"
//     >
//       <circle cx="24.411" cy="23.9003" r="23.9003" fill="#F4F7FE" />
//       <g clipPath="url(#clip0_941_6382)">
//         <path
//           d="M17.8252 20.7534H18.0588C18.9582 20.7534 19.6941 21.4893 19.6941 22.3887V30.565C19.6941 31.4644 18.9582 32.2003 18.0588 32.2003H17.8252C16.9258 32.2003 16.1899 31.4644 16.1899 30.565V22.3887C16.1899 21.4893 16.9258 20.7534 17.8252 20.7534ZM24.3663 15.8477C25.2656 15.8477 26.0015 16.5835 26.0015 17.4829V30.565C26.0015 31.4644 25.2656 32.2003 24.3663 32.2003C23.4669 32.2003 22.731 31.4644 22.731 30.565V17.4829C22.731 16.5835 23.4669 15.8477 24.3663 15.8477ZM30.9073 25.192C31.8067 25.192 32.5426 25.9279 32.5426 26.8273V30.565C32.5426 31.4644 31.8067 32.2003 30.9073 32.2003C30.0079 32.2003 29.272 31.4644 29.272 30.565V26.8273C29.272 25.9279 30.0079 25.192 30.9073 25.192Z"
//           fill="#008AFC"
//         />
//       </g>
//       <defs>
//         <clipPath id="clip0_941_6382">
//           <rect
//             width="28.0331"
//             height="28.0331"
//             fill="white"
//             transform="translate(10.3497 10.0078)"
//           />
//         </clipPath>
//       </defs>
//     </svg>
//   </>
// );

// export default BarChartIcon;

// import React from 'react';
// import styles from '../../components/NavigationPanel/NavigationPanel.module.css'; 
// interface BarChartIconProps {
//   className?: string; // Define className as an optional prop
// }

import React from 'react';

interface BarChartIconProps {
  className?: string; 
}

const BarChartIcon: React.FC<BarChartIconProps> = ({ className }) => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M2.0039 4.19823H2.16029C2.76239 4.19823 3.25501 4.69086 3.25501 5.29295V10.7666C3.25501 11.3687 2.76239 11.8613 2.16029 11.8613H2.0039C1.4018 11.8613 0.90918 11.3687 0.90918 10.7666V5.29295C0.90918 4.69086 1.4018 4.19823 2.0039 4.19823ZM6.38279 0.914062C6.98489 0.914062 7.47751 1.40669 7.47751 2.00879V10.7666C7.47751 11.3687 6.98489 11.8613 6.38279 11.8613C5.78069 11.8613 5.28807 11.3687 5.28807 10.7666V2.00879C5.28807 1.40669 5.78069 0.914062 6.38279 0.914062ZM10.7617 7.16962C11.3638 7.16962 11.8564 7.66224 11.8564 8.26434V10.7666C11.8564 11.3687 11.3638 11.8613 10.7617 11.8613C10.1596 11.8613 9.66696 11.3687 9.66696 10.7666V8.26434C9.66696 7.66224 10.1596 7.16962 10.7617 7.16962Z"
      fill={`${className=="icon-active" ? "#008afc" : "#E3EAFC"}`}
      // fill="#E3EAFC"
    />
  </svg>
);

export default BarChartIcon;

