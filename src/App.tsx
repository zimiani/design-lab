import { Routes, Route, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import LibraryPage from './pages/LibraryPage'
import SimulatorPage from './pages/SimulatorPage'

export default function App() {
  return (
    <AnimatePresence mode="wait">
      <Routes>
        <Route path="/library/*" element={<LibraryPage />} />
        <Route path="/simulator/*" element={<SimulatorPage />} />
        <Route path="*" element={<Navigate to="/library" replace />} />
      </Routes>
    </AnimatePresence>
  )
}
