import { createContext, useContext, type ReactNode } from 'react'

const ScreenDataContext = createContext<Record<string, unknown>>({})

export function ScreenDataProvider({
  data,
  children,
}: {
  data: Record<string, unknown>
  children: ReactNode
}) {
  return (
    <ScreenDataContext.Provider value={data}>
      {children}
    </ScreenDataContext.Provider>
  )
}

export function useScreenData<T extends Record<string, unknown>>(): T {
  return useContext(ScreenDataContext) as T
}
