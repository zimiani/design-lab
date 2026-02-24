import { motion } from 'framer-motion'

export default function LibraryPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="min-h-screen bg-background"
    >
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-text-secondary">Component Library — Coming soon</p>
      </div>
    </motion.div>
  )
}
