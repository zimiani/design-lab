/**
 * Visual-only iOS keyboard simulation for the PhoneFrame simulator.
 * Shows either a numeric pad or QWERTY text keyboard with dark theme styling.
 * Not functional — purely for reviewing how the keyboard affects screen layout.
 */

import { RiGlobalLine } from '@remixicon/react'

interface IOSKeyboardProps {
  type: 'numeric' | 'text'
  visible: boolean
  onDismiss?: () => void
}

/* ─── Shared styling ─── */

const KB_BG = '#1C1C1E'
const TOOLBAR_BG = '#2C2C2E'
const TOOLBAR_BORDER = '#3A3A3C'
const KEY_BG = '#3A3A3C'
const KEY_BG_SPECIAL = '#636366'
const KEY_TEXT = '#FFFFFF'
const KEY_RADIUS = 5
const TOOLBAR_HEIGHT = 44

/* ─── Input accessory bar (toolbar above keyboard) ─── */

function InputAccessoryBar({ onDone }: { onDone?: () => void }) {
  return (
    <div
      style={{
        height: TOOLBAR_HEIGHT,
        background: TOOLBAR_BG,
        borderBottom: `0.5px solid ${TOOLBAR_BORDER}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 12px',
        flexShrink: 0,
      }}
    >
      <button
        type="button"
        onClick={onDone}
        style={{
          background: 'none',
          border: 'none',
          color: '#0A84FF',
          fontSize: 16,
          fontWeight: 600,
          fontFamily: "-apple-system, 'SF Pro Text', system-ui, sans-serif",
          cursor: 'pointer',
          padding: '6px 4px',
        }}
      >
        OK
      </button>
    </div>
  )
}

function Key({
  label,
  width,
  flex,
  bg = KEY_BG,
  fontSize = 22,
}: {
  label: string
  width?: number
  flex?: number
  bg?: string
  fontSize?: number
}) {
  return (
    <div
      style={{
        width,
        flex,
        height: 42,
        background: bg,
        borderRadius: KEY_RADIUS,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: KEY_TEXT,
        fontSize,
        fontWeight: 400,
        fontFamily: "-apple-system, 'SF Pro Text', system-ui, sans-serif",
        userSelect: 'none',
        pointerEvents: 'none',
      }}
    >
      {label}
    </div>
  )
}

/* ─── Numeric pad (iPhone style) ─── */

const NUM_ROWS = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  [',', '0', '⌫'],
]

function NumericKeyboard() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        padding: '8px 3px 40px',
        background: KB_BG,
      }}
    >
      {NUM_ROWS.map((row, ri) => (
        <div key={ri} style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
          {row.map((key) => (
            <Key
              key={key}
              label={key}
              flex={1}
              fontSize={key === '⌫' ? 18 : 26}
              bg={key === '⌫' ? KEY_BG_SPECIAL : KEY_BG}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

/* ─── QWERTY text keyboard (iPhone dark style) ─── */

const TEXT_ROWS = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
]

function TextKeyboard() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        padding: '8px 3px 40px',
        background: KB_BG,
      }}
    >
      {/* Letter rows */}
      {TEXT_ROWS.map((row, ri) => (
        <div key={ri} style={{ display: 'flex', gap: 4, justifyContent: 'center', paddingInline: ri === 1 ? 16 : ri === 2 ? 2 : 0 }}>
          {ri === 2 && (
            <Key label="⇧" width={42} bg={KEY_BG_SPECIAL} fontSize={18} />
          )}
          {row.map((key) => (
            <Key key={key} label={key} flex={1} fontSize={20} />
          ))}
          {ri === 2 && (
            <Key label="⌫" width={42} bg={KEY_BG_SPECIAL} fontSize={18} />
          )}
        </div>
      ))}

      {/* Bottom row */}
      <div style={{ display: 'flex', gap: 4 }}>
        <Key label="123" width={52} bg={KEY_BG_SPECIAL} fontSize={15} />
        <div
          style={{
            width: 40,
            height: 42,
            background: KEY_BG_SPECIAL,
            borderRadius: KEY_RADIUS,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
          }}
        >
          <RiGlobalLine size={20} color={KEY_TEXT} />
        </div>
        <Key label="espaço" flex={1} fontSize={15} />
        <Key label="return" width={88} bg={KEY_BG_SPECIAL} fontSize={15} />
      </div>
    </div>
  )
}

/* ─── Main component ─── */

export default function IOSKeyboard({ type, visible, onDismiss }: IOSKeyboardProps) {
  // Heights: toolbar (44) + keys area
  const keysHeight = type === 'numeric' ? 240 : 266
  const totalHeight = TOOLBAR_HEIGHT + keysHeight

  return (
    <div
      style={{
        height: visible ? totalHeight : 0,
        overflow: 'hidden',
        transition: 'height 250ms ease-out',
        flexShrink: 0,
        background: KB_BG,
      }}
    >
      <InputAccessoryBar onDone={onDismiss} />
      {type === 'numeric' ? <NumericKeyboard /> : <TextKeyboard />}
    </div>
  )
}
