export function Crest({ className = "h-12 w-auto" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 120"
      className={className}
      role="img"
      aria-label="Lambang Keuskupan Agung ROBLOX"
    >
      <path
        d="M50 3.5 92 18.5v39.2c0 27.1-17.7 46.5-42 56.8C25.7 104.2 8 84.8 8 57.7V18.5L50 3.5Z"
        fill="#4a1620"
        stroke="#c7913a"
        strokeWidth="3"
      />
      <path
        d="M50 10.5 85 23v34.7c0 23.8-15.1 41.1-35 50.5-19.9-9.4-35-26.7-35-50.5V23L50 10.5Z"
        fill="none"
        stroke="#e3c47f"
        strokeOpacity=".55"
        strokeWidth="1"
      />
      <path d="M46.5 23h7v15h14v7h-14v27h-7V45h-14v-7h14V23Z" fill="#d8aa53" />
      <circle cx="50" cy="93" r="2.1" fill="#e3c47f" />
      <path d="M28 82c7 2.2 14 2.2 22 0 8 2.2 15 2.2 22 0" fill="none" stroke="#c7913a" strokeWidth="1.4" />
      <path d="M32 88c6 1.8 12 1.8 18 0 6 1.8 12 1.8 18 0" fill="none" stroke="#c7913a" strokeOpacity=".55" strokeWidth="1" />
      <circle cx="34" cy="32" r="1.8" fill="#e7d3a6" />
      <circle cx="66" cy="32" r="1.8" fill="#e7d3a6" />
    </svg>
  );
}
