import type { ReactNode, Ref } from 'react'

export const DESKTOP_DIMENSIONS = {
  width: 1200,
  height: 760,
} as const

interface DesktopFrameProps {
  children?: ReactNode
  /** iframe src URL — when provided, renders an iframe instead of children. */
  iframeSrc?: string
  /** Ref for the iframe element. */
  iframeRef?: Ref<HTMLIFrameElement>
}

export default function DesktopFrame({ children, iframeSrc, iframeRef }: DesktopFrameProps) {
  return (
    <div
      className="relative flex flex-col w-[1200px] h-[760px] bg-background text-content-primary rounded-xl overflow-hidden"
      style={{
        boxShadow: '0 0 0 1px rgba(0,0,0,0.08), 0 8px 40px rgba(0,0,0,0.12)',
      }}
    >
      {/* Browser chrome */}
      <div className="flex items-center h-[40px] bg-[#f0f0f0] border-b border-[#d4d4d4] px-3 gap-2 shrink-0">
        {/* Window controls */}
        <div className="flex items-center gap-[6px]">
          <div className="w-[12px] h-[12px] rounded-full bg-[#ff5f57]" />
          <div className="w-[12px] h-[12px] rounded-full bg-[#febc2e]" />
          <div className="w-[12px] h-[12px] rounded-full bg-[#28c840]" />
        </div>
        {/* Address bar */}
        <div className="flex-1 flex justify-center">
          <div className="flex items-center h-[26px] px-3 bg-white rounded-md border border-[#d4d4d4] min-w-[320px]">
            <span className="text-[12px] text-[#999] select-none">app.usepicnic.com</span>
          </div>
        </div>
        {/* Spacer to balance controls */}
        <div className="w-[54px]" />
      </div>

      {/* Content area */}
      <div className="flex-1 overflow-hidden">
        {iframeSrc ? (
          <iframe
            ref={iframeRef}
            src={iframeSrc}
            className="w-full h-full border-0"
            title="Preview"
          />
        ) : (
          children
        )}
      </div>
    </div>
  )
}
