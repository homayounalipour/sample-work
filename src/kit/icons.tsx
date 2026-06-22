import React from 'react';

type IconProps = {className?: string};

export function IconSearch(props: IconProps) {
  const {className = 'h-4 w-4'} = props;
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
      />
    </svg>
  );
}

export function IconUpload(props: IconProps) {
  const {className = 'h-6 w-6'} = props;
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 16V4m0 0l-4 4m4-4l4 4M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2"
      />
    </svg>
  );
}

export function IconChevronDown(props: IconProps) {
  const {className = 'h-4 w-4'} = props;
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
    </svg>
  );
}

export function IconArrowRight(props: IconProps) {
  const {className = 'h-4 w-4'} = props;
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 12h14M13 6l6 6-6 6"
      />
    </svg>
  );
}

export function IconDownload(props: IconProps) {
  const {className = 'h-3 md:h-4 w-3 md:w-4'} = props;
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 4v12m0 0l-4-4m4 4l4-4M4 20h16"
      />
    </svg>
  );
}

export function IconHistory(props: IconProps) {
  const {className = 'h-4 w-4'} = props;
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

export function IconMenu(props: IconProps) {
  const {className = 'h-5 w-5'} = props;
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 6h16M4 12h16M4 18h16"
      />
    </svg>
  );
}

export function IconClose(props: IconProps) {
  const {className = 'h-4 w-4'} = props;
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
}

export function IconCheck(props: IconProps) {
  const {className = 'h-4 w-4'} = props;
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

export function IconCopy(props: IconProps) {
  const {className = 'h-4 w-4'} = props;
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
      />
    </svg>
  );
}

export function IconSwap(props: IconProps) {
  const {className = 'h-4 w-4'} = props;
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4"
      />
    </svg>
  );
}

export function IconLogo(props: IconProps) {
  const {className = 'h-8 w-8'} = props;
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none">
      <rect
        width="32"
        height="32"
        rx="8"
        fill="rgb(var(--primary-emphasis-rgb))"
      />
      <path
        d="M10 12h12v2H10v-2zm0 4h8v2h-8v-2zm0 4h10v2H10v-2z"
        fill="white"
        opacity="0.9"
      />
      <circle cx="22" cy="10" r="4" fill="rgb(var(--primary-default-rgb))" />
    </svg>
  );
}

export function IconPlus(props: IconProps) {
  const {className = 'h-4 w-4'} = props;
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function IconMinus(props: IconProps) {
  const {className = 'h-4 w-4'} = props;
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
    </svg>
  );
}

export function IconRotate(props: IconProps) {
  const {className = 'h-4 w-4'} = props;
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 4v6h6M20 20v-6h-6M5 19a9 9 0 0014-7M19 5a9 9 0 00-14 7"
      />
    </svg>
  );
}

export function IconFlip(props: IconProps) {
  const {className = 'h-4 w-4'} = props;
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 7h12M8 12h12M8 17h12M4 7v10"
      />
    </svg>
  );
}

export function IconStar(props: IconProps & {filled?: boolean}) {
  const {className = 'h-4 w-4', filled = false} = props;
  return (
    <svg
      className={className}
      fill={filled ? 'currentColor' : 'none'}
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.48 3.499a1.5 1.5 0 013.04 0l1.518 4.674a1.5 1.5 0 001.465 1.037h4.908a1.5 1.5 0 01.832 2.715l-3.968 2.883a1.5 1.5 0 00-.544 1.674l1.518 4.674a1.5 1.5 0 01-2.316 1.674l-3.968-2.883a1.5 1.5 0 00-1.76 0l-3.968 2.883a1.5 1.5 0 01-2.316-1.674l1.518-4.674a1.5 1.5 0 00-.544-1.674L2.342 11.925a1.5 1.5 0 01.832-2.715h4.908a1.5 1.5 0 001.465-1.037L11.48 3.499z"
      />
    </svg>
  );
}

export function IconTrash(props: IconProps) {
  const {className = 'h-4 w-4'} = props;
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
      />
    </svg>
  );
}

export function IconDotsVertical(props: IconProps) {
  const {className = 'h-4 w-4'} = props;
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 5v.01M12 12v.01M12 19v.01"
      />
    </svg>
  );
}
