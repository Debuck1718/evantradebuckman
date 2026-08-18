import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#06131f",
          borderRadius: "8px",
          border: "1px solid rgba(230, 178, 74, 0.4)",
        }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 100 100"
          fill="none"
        >
          <path
            d="M50 8 L85 24 V52 C85 71.5 70 87 50 93 C30 87 15 71.5 15 52 V24 L50 8 Z"
            fill="#092033"
            stroke="#e6b24a"
            strokeWidth="5"
          />
          <path
            d="M50 22 L72 35 L50 48 L28 35 Z"
            fill="#fae59a"
          />
          <path
            d="M28 39 L48 51 V76 L28 62 Z"
            fill="#e6b24a"
          />
          <path
            d="M72 39 L72 62 L52 76 V51 Z"
            fill="#c99322"
          />
        </svg>
      </div>
    ),
    {
      ...size,
    },
  );
}
