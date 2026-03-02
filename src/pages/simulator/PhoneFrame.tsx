import { useState, useCallback, type ReactNode, type FocusEvent } from 'react'
import IOSKeyboard from './iOSKeyboard'

type KeyboardType = 'numeric' | 'text'

interface PhoneFrameProps {
  children: ReactNode
}

/**
 * iPhone 17 / 17 Pro status bar (402×874pt viewport).
 *
 * Reference (useyourloaf.com/blog/iphone-17-screen-sizes):
 *   - Viewport: 402 × 874 pt (@3x)
 *   - Safe area top: 62pt, bottom: 34pt
 *   - Dynamic Island: 126×37pt, centered, top 12pt
 *   - Time: SF Pro Semibold 17pt, left 34pt
 *   - Right cluster: cellular + wifi + battery, right 15pt
 *   - Scale: 0.75 to approximate real-world physical size on screen
 */

const SCALE = 0.75

function StatusBar() {
  const now = new Date()
  const time = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: false })

  return (
    <div className="absolute top-0 left-0 right-0 h-[62px] z-40 pointer-events-none">
      {/* Time — left of Dynamic Island */}
      <span
        className="absolute text-[15px] text-content-primary leading-none"
        style={{
          left: 48,
          top: 23,
          fontFamily: "-apple-system, 'SF Pro Text', system-ui, sans-serif",
          fontWeight: 600,
          letterSpacing: '-0.08px',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {time}
      </span>

      {/* Right cluster — cellular, wifi, battery */}
      <div
        className="absolute flex items-center gap-[6px]"
        style={{ right: 30, top: 23 }}
      >
        {/* Cellular — 4 graduated bars, full signal */}
        <svg width="17" height="11" viewBox="0 0 17 11" fill="none">
          <rect x="0" y="7.5" width="3" height="3.5" rx="1.2" fill="currentColor" />
          <rect x="4.5" y="5.5" width="3" height="5.5" rx="1.2" fill="currentColor" />
          <rect x="9" y="3" width="3" height="8" rx="1.2" fill="currentColor" />
          <rect x="13.5" y="0" width="3" height="11" rx="1.2" fill="currentColor" />
        </svg>

        {/* WiFi */}
        <svg width="17" height="17" viewBox="0 0 512 512" fill="currentColor">
          <path d="M256 96c-81.5 0-163 33.6-221.5 88.3-3.3 3-3.4 8.1-.3 11.4l26.7 27.9c3.1 3.3 8.3 3.4 11.6.3 23.3-21.6 49.9-38.8 79.3-51 33-13.8 68.1-20.7 104.3-20.7s71.3 7 104.3 20.7c29.4 12.3 56 29.4 79.3 51 3.3 3.1 8.5 3 11.6-.3l26.7-27.9c3.1-3.2 3-8.3-.3-11.4C419 129.6 337.5 96 256 96z" />
          <path d="M113.2 277.5l28.6 28.3c3.1 3 8 3.2 11.2.3 28.3-25.1 64.6-38.9 102.9-38.9s74.6 13.7 102.9 38.9c3.2 2.9 8.1 2.7 11.2-.3l28.6-28.3c3.3-3.3 3.2-8.6-.3-11.7-37.5-33.9-87.6-54.6-142.5-54.6s-105 20.7-142.5 54.6c-3.3 3.1-3.4 8.4-.1 11.7z" />
          <path d="M256 324.2c-23.4 0-44.6 9.8-59.4 25.5-3 3.2-2.9 8.1.2 11.2l53.4 52.7c3.2 3.2 8.4 3.2 11.6 0l53.4-52.7c3.1-3.1 3.2-8 .2-11.2-14.8-15.6-36-25.5-59.4-25.5z" />
        </svg>

        {/* Battery — outline + inner fill + right cap */}
        <svg width="27" height="12" viewBox="0 0 27 12" fill="none">
          <rect x="0.5" y="0.5" width="22" height="11" rx="2.5" stroke="currentColor" strokeOpacity="0.35" />
          <rect x="2" y="2" width="19" height="8" rx="1.5" fill="currentColor" />
          <path d="M24 4.25a1.75 1.75 0 0 1 0 3.5V4.25z" fill="currentColor" fillOpacity="0.4" />
        </svg>
      </div>
    </div>
  )
}

function HomeIndicator() {
  return (
    <div className="absolute bottom-[8px] left-1/2 -translate-x-1/2 w-[134px] h-[5px] bg-content-primary/30 rounded-full z-40 pointer-events-none" />
  )
}

function getKeyboardType(el: HTMLElement): KeyboardType | null {
  if (el.tagName !== 'INPUT' && el.tagName !== 'TEXTAREA') return null
  const input = el as HTMLInputElement
  if (input.readOnly || input.disabled) return null
  const mode = input.inputMode || input.getAttribute('inputmode')
  return mode === 'numeric' || mode === 'decimal' ? 'numeric' : 'text'
}

export default function PhoneFrame({ children }: PhoneFrameProps) {
  const [keyboardType, setKeyboardType] = useState<KeyboardType | null>(null)

  const dismissKeyboard = useCallback(() => {
    setKeyboardType(null)
    // Blur the active element so the browser input loses focus too
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }
  }, [])

  const handleFocus = useCallback((e: FocusEvent) => {
    const type = getKeyboardType(e.target as HTMLElement)
    if (type) setKeyboardType(type)
  }, [])

  const handleBlur = useCallback((e: FocusEvent) => {
    const container = e.currentTarget
    const next = e.relatedTarget as HTMLElement | null
    if (!next || !container.contains(next)) {
      setKeyboardType(null)
    } else {
      const type = getKeyboardType(next)
      if (type) setKeyboardType(type)
      else setKeyboardType(null)
    }
  }, [])

  return (
    <div
      style={{
        width: 402 * SCALE,
        height: 874 * SCALE,
      }}
    >
      <div
        className="relative bg-background text-content-primary rounded-[55px] overflow-hidden flex flex-col origin-top-left"
        style={{
          width: 402,
          height: 874,
          transform: `scale(${SCALE})`,
          '--safe-area-top': '62px',
          '--safe-area-bottom': keyboardType ? '0px' : '34px',
          boxShadow: '0 0 0 2px #1a1a1a, 0 0 0 6px #333, 0 0 0 7px #1a1a1a, 0 4px 24px rgba(0,0,0,0.35)',
        } as React.CSSProperties}
      >
        {/* Dynamic Island */}
        <div className="absolute top-[12px] left-1/2 -translate-x-1/2 w-[126px] h-[37px] bg-neutral-900 rounded-[20px] z-50" />

        {/* Side buttons */}
        <div className="absolute -right-[3px] top-[180px] w-[3px] h-[80px] bg-[#2a2a2a] rounded-r-sm z-50" />
        <div className="absolute -left-[3px] top-[160px] w-[3px] h-[36px] bg-[#2a2a2a] rounded-l-sm z-50" />
        <div className="absolute -left-[3px] top-[206px] w-[3px] h-[36px] bg-[#2a2a2a] rounded-l-sm z-50" />
        <div className="absolute -left-[3px] top-[120px] w-[3px] h-[20px] bg-[#2a2a2a] rounded-l-sm z-50" />

        <StatusBar />
        <div
          className="flex-1 overflow-hidden"
          onFocusCapture={handleFocus}
          onBlurCapture={handleBlur}
        >
          {children}
        </div>
        <IOSKeyboard type={keyboardType ?? 'text'} visible={!!keyboardType} onDismiss={dismissKeyboard} />
        {!keyboardType && <HomeIndicator />}
      </div>
    </div>
  )
}
