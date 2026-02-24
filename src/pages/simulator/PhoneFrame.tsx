import type { ReactNode } from 'react'

interface PhoneFrameProps {
  children: ReactNode
}

function StatusBar() {
  const now = new Date()
  const time = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: false })

  return (
    <div className="h-[54px] flex items-end justify-between px-[var(--token-spacing-lg)] pb-[var(--token-spacing-2)] bg-surface-primary">
      <span className="text-[length:var(--token-font-size-body-sm)] font-semibold text-text-primary">
        {time}
      </span>
      <div className="flex items-center gap-[var(--token-spacing-1)]">
        {/* Signal */}
        <svg width="17" height="12" viewBox="0 0 17 12" fill="none">
          <rect x="0" y="8" width="3" height="4" rx="0.5" fill="var(--token-text-primary)" />
          <rect x="4.5" y="5" width="3" height="7" rx="0.5" fill="var(--token-text-primary)" />
          <rect x="9" y="2" width="3" height="10" rx="0.5" fill="var(--token-text-primary)" />
          <rect x="13.5" y="0" width="3" height="12" rx="0.5" fill="var(--token-text-primary)" />
        </svg>
        {/* WiFi */}
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
          <path d="M8 10.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z" fill="var(--token-text-primary)" />
          <path d="M4.5 8.5C5.5 7.2 6.7 6.5 8 6.5s2.5.7 3.5 2" stroke="var(--token-text-primary)" strokeWidth="1.2" strokeLinecap="round" fill="none" />
          <path d="M2 5.5C3.8 3.5 5.8 2.5 8 2.5s4.2 1 6 3" stroke="var(--token-text-primary)" strokeWidth="1.2" strokeLinecap="round" fill="none" />
        </svg>
        {/* Battery */}
        <svg width="27" height="13" viewBox="0 0 27 13" fill="none">
          <rect x="0.5" y="0.5" width="22" height="12" rx="2" stroke="var(--token-text-primary)" strokeOpacity="0.35" />
          <rect x="2" y="2" width="18" height="9" rx="1" fill="var(--token-text-primary)" />
          <path d="M24 4.5v4a2 2 0 0 0 0-4z" fill="var(--token-text-primary)" fillOpacity="0.35" />
        </svg>
      </div>
    </div>
  )
}

export default function PhoneFrame({ children }: PhoneFrameProps) {
  return (
    <div className="relative w-[393px] h-[852px] bg-background rounded-[48px] border-[6px] border-neutral-800 overflow-hidden shadow-lg flex flex-col">
      {/* Dynamic Island */}
      <div className="absolute top-[10px] left-1/2 -translate-x-1/2 w-[126px] h-[36px] bg-neutral-900 rounded-[20px] z-50" />
      <StatusBar />
      <div className="flex-1 overflow-hidden">{children}</div>
    </div>
  )
}
