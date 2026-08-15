"use client"

import * as React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Menu, X, ChevronDown } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { ThemeToggle } from "@/components/theme-toggle"
import type { ProductTypeDef } from "@/lib/product-types"

const homeItem = { label: "Home", href: "/" }
const afterProductsItems = [
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
]

const Navbar1 = ({
  isAuthed = false,
  productTypes = [],
}: {
  isAuthed?: boolean
  productTypes?: ProductTypeDef[]
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isProductsOpen, setIsProductsOpen] = useState(false)
  const [isMobileProductsOpen, setIsMobileProductsOpen] = useState(false)

  const toggleMenu = () => setIsOpen(!isOpen)

  return (
    <div className="sticky top-0 z-40 flex justify-center w-full py-3 px-4">
      <div className="flex items-center justify-between px-5 py-1.5 border border-foreground/25 bg-white/10 backdrop-blur-md rounded-full shadow-lg w-full max-w-6xl relative z-10 dark:border-white/20 dark:bg-white/5">
        <div className="flex items-center shrink-0">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <Link href="/" aria-label="Vilva" className="flex items-center shrink-0 mr-4 sm:mr-8">
              <Image
                src="/logo.svg"
                alt="Vilva"
                width={325}
                height={80}
                priority
                className="h-9 w-auto sm:h-11"
              />
            </Link>
          </motion.div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.05 }}
          >
            <Link
              href={homeItem.href}
              className="text-base text-foreground hover:text-primary transition-colors font-medium"
            >
              {homeItem.label}
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="relative"
            onMouseEnter={() => setIsProductsOpen(true)}
            onMouseLeave={() => setIsProductsOpen(false)}
          >
            <Link
              href="/products"
              className="flex items-center gap-1 text-base text-foreground hover:text-primary transition-colors font-medium"
            >
              Products
              <ChevronDown className="h-4 w-4" />
            </Link>

            <AnimatePresence>
              {isProductsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 top-full pt-3 w-56"
                >
                  <div className="rounded-2xl border border-foreground/15 bg-background/95 backdrop-blur-md shadow-lg py-2 dark:border-white/10">
                    <Link
                      href="/products"
                      className="block px-4 py-2 text-sm text-foreground hover:bg-foreground/5 hover:text-primary transition-colors"
                    >
                      All Products
                    </Link>
                    {productTypes.map((type) => (
                      <Link
                        key={type.name}
                        href={`/products?type=${encodeURIComponent(type.name)}`}
                        className="block px-4 py-2 text-sm text-foreground hover:bg-foreground/5 hover:text-primary transition-colors"
                      >
                        {type.name}
                      </Link>
                    ))}
                    <div className="my-1 border-t border-foreground/10 dark:border-white/10" />
                    <Link
                      href="/custom-product"
                      className="block px-4 py-2 text-sm text-foreground hover:bg-foreground/5 hover:text-primary transition-colors"
                    >
                      Custom Product
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {afterProductsItems.map((item) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.05 }}
            >
              <Link
                href={item.href}
                className="text-base text-foreground hover:text-primary transition-colors font-medium"
              >
                {item.label}
              </Link>
            </motion.div>
          ))}
        </nav>

        {/* Desktop CTA + Theme Toggle */}
        <div className="hidden md:flex items-center gap-2 shrink-0">
          <ThemeToggle className="flex items-center justify-center h-9 w-9 rounded-full text-foreground hover:bg-foreground/10 transition-colors" />
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
          >
            <Link
              href="/admin"
              className="inline-flex items-center justify-center px-5 py-2 text-sm text-primary-foreground bg-primary rounded-full hover:bg-primary/90 transition-colors"
            >
              {isAuthed ? "Admin" : "Login"}
            </Link>
          </motion.div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-1">
          <ThemeToggle className="flex items-center justify-center h-9 w-9 rounded-full text-foreground hover:bg-foreground/10 transition-colors" />
          <motion.button className="flex items-center" onClick={toggleMenu} whileTap={{ scale: 0.9 }}>
            <Menu className="h-6 w-6 text-foreground" />
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-background z-50 pt-24 px-6 md:hidden overflow-y-auto"
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <motion.button
              className="absolute top-6 right-6 p-2"
              onClick={toggleMenu}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <X className="h-6 w-6 text-foreground" />
            </motion.button>
            <div className="flex flex-col space-y-6 pb-10">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <Link href={homeItem.href} className="text-base text-foreground font-medium" onClick={toggleMenu}>
                  {homeItem.label}
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <div className="flex items-center justify-between">
                  <Link
                    href="/products"
                    className="text-base text-foreground font-medium"
                    onClick={toggleMenu}
                  >
                    Products
                  </Link>
                  <button
                    type="button"
                    aria-label="Toggle product types"
                    onClick={() => setIsMobileProductsOpen((v) => !v)}
                    className="p-1"
                  >
                    <ChevronDown
                      className={`h-4 w-4 text-foreground transition-transform ${
                        isMobileProductsOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                </div>
                <AnimatePresence>
                  {isMobileProductsOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex flex-col space-y-4 pl-4 pt-4 overflow-hidden"
                    >
                      {productTypes.map((type) => (
                        <Link
                          key={type.name}
                          href={`/products?type=${encodeURIComponent(type.name)}`}
                          className="text-sm text-muted-foreground hover:text-primary transition-colors"
                          onClick={toggleMenu}
                        >
                          {type.name}
                        </Link>
                      ))}
                      <Link
                        href="/custom-product"
                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                        onClick={toggleMenu}
                      >
                        Custom Product
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {afterProductsItems.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 + 0.2 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <Link href={item.href} className="text-base text-foreground font-medium" onClick={toggleMenu}>
                    {item.label}
                  </Link>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                exit={{ opacity: 0, y: 20 }}
                className="pt-6"
              >
                <Link
                  href="/admin"
                  className="inline-flex items-center justify-center w-full px-5 py-3 text-base text-primary-foreground bg-primary rounded-full hover:bg-primary/90 transition-colors"
                  onClick={toggleMenu}
                >
                  {isAuthed ? "Admin" : "Login"}
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export { Navbar1 }
