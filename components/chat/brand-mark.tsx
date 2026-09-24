export function BrandMark() {
  return (
    <div className="flex items-center gap-3">
      <span className="relative inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary shadow-soft">
        <RobotIcon className="h-8 w-8 text-primary-foreground" />
        <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-foreground/80 ring-2 ring-background" />
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-display text-2xl tracking-tight text-foreground">
          <span className="font-800">Groq</span>
          <span className="font-500">Chat</span>
        </span>
        <span className="mt-1.5 text-[11px] font-500 uppercase tracking-[0.18em] text-muted-foreground">
          Prototipo · Groq
        </span>
      </span>
    </div>
  )
}

function RobotIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* antenna */}
      <path d="M12 3.5v2" />
      <circle cx="12" cy="2.6" r="1" fill="currentColor" stroke="none" />
      {/* head */}
      <rect x="4.5" y="5.5" width="15" height="12" rx="4.5" />
      {/* ears */}
      <path d="M4.5 10.5H3.2M19.5 10.5h1.3" />
      {/* eyes */}
      <circle cx="9.2" cy="11" r="1.15" fill="currentColor" stroke="none" />
      <circle cx="14.8" cy="11" r="1.15" fill="currentColor" stroke="none" />
    </svg>
  )
}
