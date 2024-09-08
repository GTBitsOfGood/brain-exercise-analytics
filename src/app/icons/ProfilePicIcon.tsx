const ProfilePicIcon = ({ className }: { className?: string }) => (
  <>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 96 92"
      className={className}
    >
      <defs>
        <clipPath id="clipCircle">
          <circle cx="48" cy="46" r="47" />
        </clipPath>
      </defs>
      <g clip-path="url(#clipCircle)">
        <g transform-origin="center" transform="translate(0, 10) scale(.8)">
          <path 
            d="M95.5076 90.1602C95.1834 90.7197 94.7172 91.1843 94.1557 91.5072C93.5942 91.8302 92.9573 92.0001 92.309 92H3.68872C3.04087 91.9993 2.4046 91.8288 1.8438 91.5056C1.28299 91.1824 0.817393 90.7179 0.493756 90.1586C0.170119 89.5994 -0.000166201 88.9651 1.21723e-07 88.3196C0.000166444 87.674 0.170778 87.0398 0.494703 86.4808C7.52432 74.3706 18.3572 65.687 30.9995 61.5705C24.746 57.861 19.8875 52.2084 17.17 45.481C14.4525 38.7536 14.0263 31.3232 15.9568 24.331C17.8873 17.3389 22.0678 11.1715 27.8563 6.77601C33.6448 2.38053 40.7212 0 47.9988 0C55.2765 0 62.3529 2.38053 68.1414 6.77601C73.9299 11.1715 78.1104 17.3389 80.0409 24.331C81.9714 31.3232 81.5452 38.7536 78.8277 45.481C76.1102 52.2084 71.2517 57.861 64.9982 61.5705C77.6405 65.687 88.4734 74.3706 95.503 86.4808C95.8278 87.0397 95.9992 87.674 96 88.3199C96.0008 88.9658 95.831 89.6005 95.5076 90.1602Z" 
            fill="#2B3674"/>
        </g>
      </g>

      <circle
        cx="48"
        cy="46"
        r="47"
        stroke="lightgrey"
        fill="none"
        stroke-width="2"
      />
    </svg>
  </>
);

export default ProfilePicIcon;
