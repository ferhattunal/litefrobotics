import type { ReactNode } from "react";

type IconProps = { className?: string };

function Svg({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className ?? "h-4 w-4"}
    >
      {children}
    </svg>
  );
}

export const Icons = {
  layers: (props: IconProps) => (
    <Svg {...props}>
      <path d="M12 3 3 8l9 5 9-5-9-5Z" />
      <path d="M3 12l9 5 9-5" />
      <path d="M3 16l9 5 9-5" />
    </Svg>
  ),
  grid: (props: IconProps) => (
    <Svg {...props}>
      <rect x="4" y="4" width="6" height="6" />
      <rect x="14" y="4" width="6" height="6" />
      <rect x="4" y="14" width="6" height="6" />
      <rect x="14" y="14" width="6" height="6" />
    </Svg>
  ),
  box: (props: IconProps) => (
    <Svg {...props}>
      <path d="M21 8H3v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8Z" />
      <path d="M3 8 12 3l9 5" />
      <path d="M12 3v18" />
    </Svg>
  ),
  tag: (props: IconProps) => (
    <Svg {...props}>
      <path d="M20 13 11 4H4v7l9 9 7-7Z" />
      <circle cx="7.5" cy="7.5" r="1" />
    </Svg>
  ),
  handshake: (props: IconProps) => (
    <Svg {...props}>
      <path d="M8 13 5 10 3 12l4 4 5-1" />
      <path d="m16 13 3-3 2 2-4 4-3-1" />
      <path d="m9 16 2 2 2-2 2 2" />
    </Svg>
  ),
  pin: (props: IconProps) => (
    <Svg {...props}>
      <path d="M12 21s7-5.3 7-11a7 7 0 1 0-14 0c0 5.7 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2" />
    </Svg>
  ),
  file: (props: IconProps) => (
    <Svg {...props}>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" />
      <path d="M14 3v5h5" />
      <path d="M9 13h6M9 17h6" />
    </Svg>
  ),
  key: (props: IconProps) => (
    <Svg {...props}>
      <circle cx="8" cy="15" r="4" />
      <path d="M12 15h9v3M17 15v3" />
    </Svg>
  ),
  image: (props: IconProps) => (
    <Svg {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <circle cx="9" cy="10" r="1.5" />
      <path d="m21 16-5-5-8 8" />
    </Svg>
  ),
  news: (props: IconProps) => (
    <Svg {...props}>
      <path d="M4 5h12v14H6a2 2 0 0 1-2-2V5Z" />
      <path d="M16 8h4v9a2 2 0 0 1-2 2h-2" />
      <path d="M7 9h6M7 13h6" />
    </Svg>
  ),
  award: (props: IconProps) => (
    <Svg {...props}>
      <circle cx="12" cy="9" r="5" />
      <path d="m9 13-1 8 4-2 4 2-1-8" />
    </Svg>
  ),
  help: (props: IconProps) => (
    <Svg {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9a2.5 2.5 0 1 1 3.6 2.2c-.8.4-1.1 1-1.1 1.8V14" />
      <path d="M12 17h.01" />
    </Svg>
  ),
  slides: (props: IconProps) => (
    <Svg {...props}>
      <rect x="3" y="5" width="5" height="14" rx="1" />
      <rect x="10" y="5" width="5" height="14" rx="1" />
      <rect x="17" y="5" width="4" height="14" rx="1" />
    </Svg>
  ),
  folder: (props: IconProps) => (
    <Svg {...props}>
      <path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" />
    </Svg>
  ),
  users: (props: IconProps) => (
    <Svg {...props}>
      <circle cx="9" cy="8" r="3" />
      <circle cx="17" cy="9" r="2.5" />
      <path d="M3 19a6 6 0 0 1 12 0M14 19a5 5 0 0 1 7 0" />
    </Svg>
  ),
  gear: (props: IconProps) => (
    <Svg {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4" />
    </Svg>
  ),
  menu: (props: IconProps) => (
    <Svg {...props}>
      <path d="M4 7h16M4 12h16M4 17h10" />
    </Svg>
  ),
};
