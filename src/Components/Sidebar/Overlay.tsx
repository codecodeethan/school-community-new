'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface OverlayProps {
  isOpen: boolean
  onClose: () => void
}

const Overlay: React.FC<OverlayProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-transparent z-40"
          onClick={onClose}
        />
      )}
    </AnimatePresence>
  )
}

export default Overlay 