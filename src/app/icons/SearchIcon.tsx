import React from 'react';

interface SearchIconProps {
  className?: string; 
}

const SearchIcon: React.FC<SearchIconProps> = ({ className }) => (
  <svg
    width="19"
    height="19"
    viewBox="0 0 19 19"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{marginTop: '2px', marginLeft: '2px'}}

  >
    <g id="tabler:search">
      <path
        id="Vector"
        d="M15 16L11.2648 12.2298M13.0808 8.58292C13.0808 11.114 11.048 13.1658 8.54042 13.1658C6.03282 13.1658 4 11.114 4 8.58292C4 6.05184 6.03282 4 8.54042 4C11.048 4 13.0808 6.05184 13.0808 8.58292Z"
        stroke="#008AFC"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </g>
  </svg>
);

export default SearchIcon;

