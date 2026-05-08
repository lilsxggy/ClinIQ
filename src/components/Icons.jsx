/* Minimal hand-drawn line icons. 1.25px stroke, currentColor. */
/* eslint-disable */

const icoProps = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.25,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

window.Ico = {
  // tab icons (18px)
  home: (p={}) => (
    <svg viewBox="0 0 22 22" width={p.s||18} height={p.s||18} {...icoProps}>
      <path d="M3 10.5L11 4l8 6.5V18a1 1 0 01-1 1h-4v-5h-6v5H4a1 1 0 01-1-1z"/>
    </svg>
  ),
  practice: (p={}) => (
    <svg viewBox="0 0 22 22" width={p.s||18} height={p.s||18} {...icoProps}>
      <path d="M5 3h9l4 4v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4a1 1 0 011-1z"/>
      <path d="M14 3v4h4"/>
      <path d="M7.5 11.5h7M7.5 14.5h5"/>
    </svg>
  ),
  progress: (p={}) => (
    <svg viewBox="0 0 22 22" width={p.s||18} height={p.s||18} {...icoProps}>
      <path d="M3 18h16"/>
      <path d="M6 18V12M10 18V8M14 18V14M18 18V5"/>
    </svg>
  ),
  tests: (p={}) => (
    <svg viewBox="0 0 22 22" width={p.s||18} height={p.s||18} {...icoProps}>
      <rect x="4" y="4" width="14" height="14" rx="1"/>
      <path d="M8 4v3M14 4v3"/>
      <path d="M7 11h8M7 14h5"/>
    </svg>
  ),
  profile: (p={}) => (
    <svg viewBox="0 0 22 22" width={p.s||18} height={p.s||18} {...icoProps}>
      <circle cx="11" cy="8.5" r="3.5"/>
      <path d="M4 19c1.5-3.5 4.5-5 7-5s5.5 1.5 7 5"/>
    </svg>
  ),

  // accent icons
  spark: (p={}) => (
    <svg viewBox="0 0 16 16" width={p.s||14} height={p.s||14} {...icoProps}>
      <path d="M8 1.5v4M8 10.5v4M1.5 8h4M10.5 8h4M3.5 3.5l2.5 2.5M10 10l2.5 2.5M3.5 12.5L6 10M10 6l2.5-2.5"/>
    </svg>
  ),
  bolt: (p={}) => (
    <svg viewBox="0 0 16 16" width={p.s||14} height={p.s||14} {...icoProps}>
      <path d="M9 1.5L3 9h4l-1 5.5L13 7H9l1-5.5z"/>
    </svg>
  ),
  alert: (p={}) => (
    <svg viewBox="0 0 16 16" width={p.s||14} height={p.s||14} {...icoProps}>
      <circle cx="8" cy="8" r="6"/>
      <path d="M8 5v3.5"/>
      <circle cx="8" cy="11" r="0.5" fill="currentColor"/>
    </svg>
  ),
  arrow: (p={}) => (
    <svg viewBox="0 0 16 16" width={p.s||14} height={p.s||14} {...icoProps}>
      <path d="M3 8h10M9 4l4 4-4 4"/>
    </svg>
  ),
  check: (p={}) => (
    <svg viewBox="0 0 16 16" width={p.s||14} height={p.s||14} {...icoProps}>
      <path d="M3 8.5l3.5 3.5L13 5"/>
    </svg>
  ),
  cross: (p={}) => (
    <svg viewBox="0 0 16 16" width={p.s||14} height={p.s||14} {...icoProps}>
      <path d="M4 4l8 8M12 4l-8 8"/>
    </svg>
  ),
  flame: (p={}) => (
    <svg viewBox="0 0 16 16" width={p.s||14} height={p.s||14} {...icoProps}>
      <path d="M8 1.5c1 2 3 3 3 5.5a3 3 0 01-6 0c0-1 0-2 1-3 0 2 2 2 2 0 0-1 0-1.5 0-2.5z"/>
    </svg>
  ),
  pulse: (p={}) => (
    <svg viewBox="0 0 22 16" width={p.s||20} height={p.s||14} {...icoProps}>
      <path d="M1 8h4l2-5 3 10 2-7 2 4 2-2h5"/>
    </svg>
  ),
  stack: (p={}) => (
    <svg viewBox="0 0 16 16" width={p.s||14} height={p.s||14} {...icoProps}>
      <path d="M2 5l6-3 6 3-6 3z"/>
      <path d="M2 8l6 3 6-3M2 11l6 3 6-3"/>
    </svg>
  ),
  target: (p={}) => (
    <svg viewBox="0 0 16 16" width={p.s||14} height={p.s||14} {...icoProps}>
      <circle cx="8" cy="8" r="6"/>
      <circle cx="8" cy="8" r="3"/>
      <circle cx="8" cy="8" r="0.6" fill="currentColor"/>
    </svg>
  ),
  loop: (p={}) => (
    <svg viewBox="0 0 16 16" width={p.s||14} height={p.s||14} {...icoProps}>
      <path d="M3 6a5 5 0 019-2M13 10a5 5 0 01-9 2"/>
      <path d="M9 4l3-1-1 3M7 12l-3 1 1-3"/>
    </svg>
  ),
  star: (p={}) => (
    <svg viewBox="0 0 16 16" width={p.s||14} height={p.s||14} {...icoProps}>
      <path d="M8 2l1.8 4 4.2.4-3.2 2.8 1 4.3L8 11.3 4.2 13.5l1-4.3L2 6.4 6.2 6z"/>
    </svg>
  ),
  diamond: (p={}) => (
    <svg viewBox="0 0 16 16" width={p.s||14} height={p.s||14} {...icoProps}>
      <path d="M8 2l5 6-5 6-5-6z"/>
    </svg>
  ),
  inf: (p={}) => (
    <svg viewBox="0 0 22 16" width={p.s||20} height={p.s||14} {...icoProps}>
      <path d="M5 8a3 3 0 116 0 3 3 0 116 0 3 3 0 11-6 0 3 3 0 11-6 0z"/>
    </svg>
  ),
  pi: (p={}) => (
    <svg viewBox="0 0 16 16" width={p.s||14} height={p.s||14} {...icoProps}>
      <path d="M3 5h10M5.5 5v8M10.5 5v6c0 1 .5 2 2 2"/>
    </svg>
  ),
  sigma: (p={}) => (
    <svg viewBox="0 0 16 16" width={p.s||14} height={p.s||14} {...icoProps}>
      <path d="M12 3H4l4 5-4 5h8"/>
    </svg>
  ),
  lock: (p={}) => (
    <svg viewBox="0 0 16 16" width={p.s||14} height={p.s||14} {...icoProps}>
      <rect x="3" y="7" width="10" height="7" rx="1"/>
      <path d="M5 7V5a3 3 0 016 0v2"/>
    </svg>
  ),
  clock: (p={}) => (
    <svg viewBox="0 0 16 16" width={p.s||14} height={p.s||14} {...icoProps}>
      <circle cx="8" cy="8" r="6"/>
      <path d="M8 4.5V8l2.5 1.5"/>
    </svg>
  ),
};
