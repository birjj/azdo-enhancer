import React from "react";

export const LogoIcon = (
  props: React.SVGProps<SVGSVGElement> & { size?: string | number }
) => {
  const { size, ...restProps } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlSpace="preserve"
      width={size ?? props.width ?? "25"}
      height={size ?? props.height ?? "24.956"}
      viewBox="0.093 0.027 25 24.956"
      {...restProps}
    >
      <g>
        <path
          d="M0 8.877 2.247 5.91l8.405-3.416V.022l7.37 5.393L2.966 8.338v8.225L0 15.707zm24-4.45v14.651l-5.753 4.9-9.303-3.057v3.056l-5.978-7.416 15.057 1.798V5.415z"
          style={{
            stroke: "none",
            strokeWidth: 1,
            strokeDasharray: "none",
            strokeLinecap: "butt",
            strokeDashoffset: 0,
            strokeLinejoin: "miter",
            strokeMiterlimit: 4,
            fill: "#0078d7",
            fillRule: "nonzero",
            opacity: 1,
          }}
          transform="translate(.593 .505)"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M-3.486 2.67V.891l-1.817.014V-.402l1.817-.106v-1.686l1.313-.149v1.76l1.816-.1v1.55l-1.816.016v1.849zm5.659.272V.846L.356.866V-.737l1.817-.101v-2.015l1.313-.153v2.1l1.817-.1V.815L3.486.83v2.176z"
          style={{
            stroke: "none",
            strokeWidth: 1,
            strokeDasharray: "none",
            strokeLinecap: "butt",
            strokeDashoffset: 0,
            strokeLinejoin: "miter",
            strokeMiterlimit: 4,
            fill: "#000",
            fillRule: "nonzero",
            opacity: 1,
          }}
          transform="translate(10.896 12.703)"
          vectorEffect="non-scaling-stroke"
        />
      </g>
    </svg>
  );
};
