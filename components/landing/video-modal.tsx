"use client"

import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"

interface VideoModalProps {
  isOpen: boolean
  onClose: () => void
  videoSrc: string
}

export function VideoModal({ isOpen, onClose, videoSrc }: VideoModalProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const navbar = document.getElementById("main-navbar")
    if (isOpen) {
      document.body.style.overflow = "hidden"
      if (navbar) {
        navbar.style.opacity = "0"
        navbar.style.pointerEvents = "none"
      }
    } else {
      document.body.style.overflow = ""
      if (navbar) {
        navbar.style.opacity = "1"
        navbar.style.pointerEvents = "auto"
      }
    }
    return () => {
      document.body.style.overflow = ""
      if (navbar) {
        navbar.style.opacity = "1"
        navbar.style.pointerEvents = "auto"
      }
    }
  }, [isOpen])

  if (!mounted) return null

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/90 px-4 md:px-12 py-12"
          onClick={onClose}
        >
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 md:top-10 md:right-10 text-white/50 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-8 h-8 md:w-10 md:h-10" />
          </button>
          
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-7xl aspect-video rounded-2xl overflow-hidden shadow-2xl shadow-black/50 bg-black cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <video
              className="w-full h-full object-cover outline-none"
              controls
              autoPlay
              controlsList="nodownload"
            >
              <source src={videoSrc} type="video/mp4" />
            </video>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}
