// const PersonIcon = () => (
//   <>
//     <svg
//       width="45"
//       height="44"
//       viewBox="0 0 45 44"
//       fill="none"
//       xmlns="http://www.w3.org/2000/svg"
//     >
//       <circle cx="22.6386" cy="22.2167" r="21.7597" fill="#F4F7FE" />
//       <g clipPath="url(#clip0_1598_13671)">
//         <path
//           d="M23.0008 23.375C18.2648 23.375 15.8008 26 15.8008 27.5V28.25H30.2008V27.5C30.2008 26 27.7368 23.375 23.0008 23.375Z"
//           fill="#008AFC"
//         />
//         <path
//           d="M23 22.25C25.2091 22.25 27 20.5711 27 18.5C27 16.4289 25.2091 14.75 23 14.75C20.7909 14.75 19 16.4289 19 18.5C19 20.5711 20.7909 22.25 23 22.25Z"
//           fill="#008AFC"
//         />
//       </g>
//       <defs>
//         <clipPath id="clip0_1598_13671">
//           <rect
//             width="16"
//             height="15"
//             fill="white"
//             transform="translate(15 14)"
//           />
//         </clipPath>
//       </defs>
//     </svg>
//   </>
// );

// export default PersonIcon;

import React from 'react';

interface PersonIconProps {
  className?: string; 
}

const PersonIcon: React.FC<PersonIconProps> = ({ className }) => (
  <svg
    width="12"
    height="16"
    viewBox="0 0 12 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ verticalAlign: 'middle', marginLeft: '2px'}}

  >
    <g id="tabler:search">
      <path
        id="Vector"
        d="M10.2 8.32C10.6774 8.32 11.1352 8.52228 11.4728 8.88235C11.8104 9.24242 12 9.73078 12 10.24V10.88C12 13.4029 9.768 16 6 16C2.232 16 0 13.4029 0 10.88V10.24C0 9.73078 0.189642 9.24242 0.527208 8.88235C0.864773 8.52228 1.32261 8.32 1.8 8.32H10.2ZM6 0C6.87521 0 7.71458 0.370856 8.33345 1.03098C8.95232 1.69111 9.3 2.58644 9.3 3.52C9.3 4.45356 8.95232 5.34889 8.33345 6.00902C7.71458 6.66914 6.87521 7.04 6 7.04C5.12479 7.04 4.28542 6.66914 3.66655 6.00902C3.04768 5.34889 2.7 4.45356 2.7 3.52C2.7 2.58644 3.04768 1.69111 3.66655 1.03098C4.28542 0.370856 5.12479 0 6 0Z"
        fill="#008AFC"
        // stroke="#008AFC"
        // strokeWidth="2"
        // strokeLinecap="round"
      />
    </g>
  </svg>
);

export default PersonIcon;

