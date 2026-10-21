type Props = {
  className?: string;
};

export default function PPGLogo({ className = 'w-8 h-8' }: Props) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Book base */}
      <path
        d="M8 14C8 11.7909 9.79086 10 12 10H28C30.2091 10 32 11.7909 32 14V52C32 49.7909 30.2091 48 28 48H12C9.79086 48 8 46.2091 8 44V14Z"
        fill="#d6e4f5"
        stroke="#2b6cb0"
        strokeWidth="2"
      />
      <path
        d="M32 14C32 11.7909 33.7909 10 36 10H52C54.2091 10 56 11.7909 56 14V44C56 46.2091 54.2091 48 52 48H36C33.7909 48 32 49.7909 32 52V14Z"
        fill="#b3cdea"
        stroke="#2b6cb0"
        strokeWidth="2"
      />
      {/* Book spine */}
      <line x1="32" y1="14" x2="32" y2="52" stroke="#2b6cb0" strokeWidth="2" />
      {/* Graduation cap on top */}
      <path
        d="M32 4L20 10L32 16L44 10L32 4Z"
        fill="#1e5494"
        stroke="#1a4677"
        strokeWidth="1.5"
      />
      <path
        d="M26 12.5V18C26 18 28 20 32 20C36 20 38 18 38 18V12.5"
        fill="none"
        stroke="#1a4677"
        strokeWidth="1.5"
      />
      <path d="M44 10V15" stroke="#1a4677" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="44" cy="16" r="1.5" fill="#1e5494" />
    </svg>
  );
}
