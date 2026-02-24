import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useSearchParams } from 'react-router-dom'

/* Force side-effect registration of all components */
import '../library/foundations'
import '../library/inputs'
import '../library/display'
import '../library/feedback'
import '../library/navigation'
import '../library/layout'

import AppHeader from '../components/AppHeader'
import ComponentSidebar from './library/ComponentSidebar'
import ComponentDetail from './library/ComponentDetail'
import TokenEditor from './library/TokenEditor'
import { getAllComponents } from '../library/registry'

export default function LibraryPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [selected, setSelected] = useState<string | null>(null)

  /* Pick first component as default on mount, or use ?selected= param */
  useEffect(() => {
    const fromParam = searchParams.get('selected')
    if (fromParam) {
      setSelected(fromParam)
      // Clear the param from the URL after consuming it
      setSearchParams({}, { replace: true })
      return
    }
    if (!selected) {
      const all = getAllComponents()
      if (all.length > 0) {
        setSelected(all[0].name)
      }
    }
  }, [selected, searchParams, setSearchParams])

  const handleSelect = (name: string) => {
    setSelected(name)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="h-screen flex flex-col bg-shell-bg"
    >
      <AppHeader />

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        <ComponentSidebar selected={selected} onSelect={handleSelect} />
        {selected ? (
          <ComponentDetail componentName={selected} />
        ) : (
          <div className="flex-1 flex items-center justify-center text-shell-text-tertiary">
            Select a component
          </div>
        )}
        <TokenEditor />
      </div>
    </motion.div>
  )
}
