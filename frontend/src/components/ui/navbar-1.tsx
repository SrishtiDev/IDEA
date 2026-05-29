"use client"

import * as React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Menu, X } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { GlassButton } from "@/components/ui/glass-button"

const navItems = [
  { name: 'Features', href: '/#features' },
  { name: 'How it works', href: '/#how' },
  { name: 'Pricing', href: '/#pricing' },
]

const Navbar1 = () => {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const toggleMenu = () => setIsOpen(!isOpen)

  return (
    <div className="flex justify-center w-full py-5 px-4 fixed top-0 left-0 right-0 z-50">
      {/* Floating glass pill */}
      <div className="navbar-glass flex items-center justify-between px-5 py-2.5 rounded-full w-full max-w-3xl relative">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="w-7 h-7 flex items-center justify-center"
          >
            <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <g className="origin-center animate-[spin_8s_linear_infinite] group-hover:[animation-duration:2s]">
                <path d="M12 28 C 12 16, 24 12, 32 16" stroke="#7C6FF7" strokeWidth="3" strokeLinecap="round" />
                <path d="M12 28 C 12 16, 24 12, 32 16" stroke="white" strokeOpacity="0.6" strokeWidth="2" strokeLinecap="round" transform="rotate(120 20 20)" />
                <path d="M12 28 C 12 16, 24 12, 32 16" stroke="#a855f7" strokeOpacity="0.4" strokeWidth="1.5" strokeLinecap="round" transform="rotate(240 20 20)" />
              </g>
              <circle cx="20" cy="20" r="2" fill="#7C6FF7" />
            </svg>
          </motion.div>
          <motion.span
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: 0.05 }}
            className="font-semibold text-sm text-zinc-800 dark:text-white tracking-tight"
          >
            HireOrbit
          </motion.span>
        </Link>

        {/* Desktop nav links */}
        <nav className="hidden md:flex items-center gap-7">
          {navItems.map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, delay: 0.08 + i * 0.05 }}
              whileHover={{ y: -1 }}
            >
              <Link
                href={item.href}
                className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors font-medium"
              >
                {item.name}
              </Link>
            </motion.div>
          ))}
        </nav>

        {/* Right side: CTA */}
        <div className="hidden md:flex items-center gap-2">

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.25 }}
          >
            <GlassButton
              size="sm"
              onClick={() => window.location.href = pathname === '/analyze' ? '/' : '/analyze'}
              contentClassName="flex items-center gap-1.5"
            >
              {pathname === '/analyze' ? (
                <>← Home</>
              ) : (
                <>Try Free <span className="text-violet-600 dark:text-violet-300">→</span></>
              )}
            </GlassButton>
          </motion.div>
        </div>

        {/* Mobile: hamburger */}
        <div className="flex md:hidden items-center gap-2">
          <motion.button
            className="flex items-center text-zinc-700 dark:text-white p-1"
            onClick={toggleMenu}
            whileTap={{ scale: 0.88 }}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </motion.button>
        </div>
      </div>

      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 md:hidden flex flex-col pt-28 px-8"
            style={{
              background: 'rgba(255,255,255,0.88)',
              backdropFilter: 'blur(32px) saturate(2)',
              WebkitBackdropFilter: 'blur(32px) saturate(2)',
            }}
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
          >
            <motion.button
              className="absolute top-6 right-6 p-2 text-zinc-700"
              onClick={toggleMenu}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <X className="h-6 w-6" />
            </motion.button>

            <div className="flex flex-col space-y-8">
              {navItems.map((item, i) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 + 0.1, type: "spring", stiffness: 300, damping: 24 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <Link
                    href={item.href}
                    className="text-2xl font-semibold text-zinc-800 tracking-tight"
                    onClick={toggleMenu}
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, type: "spring", stiffness: 280 }}
                exit={{ opacity: 0, y: 16 }}
                className="pt-4"
              >
                <GlassButton
                  size="lg"
                  onClick={() => { window.location.href = '/analyze'; toggleMenu() }}
                  contentClassName="flex items-center justify-center gap-2"
                  className="w-full"
                >
                  Analyze Free →
                </GlassButton>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export { Navbar1 }
