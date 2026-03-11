import { Routes, Route, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import LibraryPage from './pages/LibraryPage'
import SimulatorPage from './pages/SimulatorPage'
import FlowMapPage from './pages/FlowMapPage'
import PageGalleryPage from './pages/PageGalleryPage'
import PreviewPage from './pages/PreviewPage'

export default function App() {
  return (
    <AnimatePresence mode="wait">
      <Routes>
        <Route path="/preview/:flowId" element={<PreviewPage />} />
        <Route path="/components/*" element={<LibraryPage />} />
        <Route path="/flows/*" element={<SimulatorPage />} />
        <Route path="/map/*" element={<FlowMapPage />} />
        <Route path="/pages/*" element={<PageGalleryPage />} />
        {/* Legacy redirects */}
        <Route path="/library/*" element={<Navigate to="/components" replace />} />
        <Route path="/simulator/*" element={<Navigate to="/flows" replace />} />
        <Route path="*" element={<Navigate to="/components" replace />} />
      </Routes>
    </AnimatePresence>
  )
}
