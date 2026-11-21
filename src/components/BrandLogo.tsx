export default function BrandLogo({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="pf-bg" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#4F46E5" />
          <stop offset="100%" stopColor="#7C3AED" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="16" fill="url(#pf-bg)" />
      {/* Pixel grid accent */}
      <rect x="13" y="13" width="9" height="9" rx="2.5" fill="white" fillOpacity="0.35" />
      <rect x="25" y="13" width="9" height="9" rx="2.5" fill="white" fillOpacity="0.6" />
      {/* Crisp P/lens emblem + spark */}
      <path
        d="M18 48V28C18 25.7909 19.7909 24 22 24H33C38.5228 24 43 28.4772 43 34C43 39.5228 38.5228 44 33 44H25V48C25 49.6569 23.6569 51 22 51H21C19.3431 51 18 49.6569 18 48ZM25 30V38H32.5C34.9853 38 37 36.2091 37 34C37 31.7909 34.9853 30 32.5 30H25Z"
        fill="white"
      />
      <path
        d="M47 13L48.9 18.1L54 20L48.9 21.9L47 27L45.1 21.9L40 20L45.1 18.1L47 13Z"
        fill="#FDE047"
      />
    </svg>
  );
}
