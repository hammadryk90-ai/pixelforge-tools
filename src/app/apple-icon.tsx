import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
          borderRadius: "40px",
        }}
      >
        <svg
          width="132"
          height="132"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="8" y="8" width="10" height="10" rx="3" fill="white" fillOpacity="0.35" />
          <rect x="21" y="8" width="10" height="10" rx="3" fill="white" fillOpacity="0.6" />
          <path
            d="M14 52V26C14 23.7909 15.7909 22 18 22H32C38.6274 22 44 27.3726 44 34C44 40.6274 38.6274 46 32 46H22V52C22 54.2091 20.2091 56 18 56H18C15.7909 56 14 54.2091 14 52ZM22 29V39H31.5C34.5376 39 37 36.7614 37 34C37 31.2386 34.5376 29 31.5 29H22Z"
            fill="white"
          />
          <path
            d="M49 8L51.3 14.2L57.5 16.5L51.3 18.8L49 25L46.7 18.8L40.5 16.5L46.7 14.2L49 8Z"
            fill="#FDE047"
          />
        </svg>
      </div>
    ),
    { ...size }
  );
}
