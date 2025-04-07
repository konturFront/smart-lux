// import { h } from 'preact';
//
// export const Rele = ({ size = 56, color = '#ffffff', strokeWidth = 1 }) => {
//   return (
//     <svg width={size} height={size} viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg">
//       <g stroke={color} stroke-width={strokeWidth} stroke-linecap="round" fill="none">
//         <line x1="2.106" y1="28.063" x2="11.893" y2="28.063" />
//         <line x1="15.610" y1="22.612" x2="11.708" y2="28.001" />
//         <line x1="16.911" y1="28.001" x2="26.947" y2="28.001" />
//       </g>
//     </svg>
//   );
// };

import { h } from 'preact';

export const Rele = ({ size = 100, color = '#ffffff', strokeWidth = 2 }) => {
  return (
    <svg
      width={size}
      height={(size * 56) / 100}
      viewBox="0 0 100 56"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g stroke={color} stroke-width={strokeWidth} stroke-linecap="round" fill="none">
        <line x1="2" y1="35" x2="30" y2="35" />
        <line x1="30" y1="35" x2="50" y2="17" />
        <line x1="56" y1="35" x2="95" y2="35" />
      </g>
    </svg>
  );
};
