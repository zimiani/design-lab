import { createContext, useContext, useSyncExternalStore, type ReactNode } from 'react'
import type { BreadcrumbItem } from '../navigation/Breadcrumb'

export interface LayoutContextValue {
  isDesktop: boolean
  level: number
  breadcrumbs: BreadcrumbItem[]
}

const LayoutContext = createContext<LayoutContextValue>({
  isDesktop: false,
  level: 1,
  breadcrumbs: [],
})

function subscribeMediaQuery(callback: () => void) {
  const mql = window.matchMedia('(min-width: 768px)')
  mql.addEventListener('change', callback)
  return () => mql.removeEventListener('change', callback)
}

function getMediaQuerySnapshot() {
  return window.matchMedia('(min-width: 768px)').matches
}

function getServerSnapshot() {
  return false
}

function useMediaQuery(): boolean {
  return useSyncExternalStore(subscribeMediaQuery, getMediaQuerySnapshot, getServerSnapshot)
}

interface LayoutProviderProps {
  children: ReactNode
  isDesktop?: boolean
  level?: number
  breadcrumbs?: BreadcrumbItem[]
}

export function LayoutProvider({
  children,
  isDesktop: isDesktopProp,
  level = 1,
  breadcrumbs = [],
}: LayoutProviderProps) {
  const mediaIsDesktop = useMediaQuery()
  const isDesktop = isDesktopProp ?? mediaIsDesktop

  return (
    <LayoutContext.Provider value={{ isDesktop, level, breadcrumbs }}>
      {children}
    </LayoutContext.Provider>
  )
}

export function useLayout(): LayoutContextValue {
  return useContext(LayoutContext)
}
