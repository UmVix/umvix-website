"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Menu, X } from "lucide-react";
import BrandLogo from "./BrandLogo";
import Button from "./Button";
import MagneticButton from "./motion/MagneticButton";
import { useReducedMotion } from "@/lib/hooks";

const navLinks = [
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Contact", href: "/contact" },
];

const SCROLL_THRESHOLD = 72;
const SCROLL_DELTA = 10;

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const reduced = useReducedMotion();
  const { scrollY } = useScroll();
  const lastY = useRef(0);

  useMotionValueEvent(scrollY, "change", (y) => {
    if (mobileOpen) {
      setHidden(false);
      lastY.current = y;
      return;
    }

    const delta = y - lastY.current;

    if (y < SCROLL_THRESHOLD) {
      setHidden(false);
    } else if (delta > SCROLL_DELTA) {
      setHidden(true);
    } else if (delta < -SCROLL_DELTA) {
      setHidden(false);
    }

    lastY.current = y;
  });

  useEffect(() => {
    if (mobileOpen) setHidden(false);
  }, [mobileOpen]);

  const isHidden = hidden && !mobileOpen;

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-50 overflow-visible bg-black/5 backdrop-blur-sm"
      initial={false}
      animate={{
        y: isHidden ? "-100%" : "0%",
        opacity: isHidden ? 0 : 1,
      }}
      transition={
        reduced ? { duration: 0 } : { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
      }
      style={{ pointerEvents: isHidden ? "none" : "auto" }}
    >
      <nav className="site-container grid grid-cols-[1fr_auto] items-center gap-4 py-3 md:grid-cols-[1fr_auto_1fr] md:py-4">
        <div className="flex items-center justify-self-start overflow-visible">
          <BrandLogo variant="nav" priority />
        </div>

        {/* Desktop nav — true center */}
        <ul className="hidden items-center justify-center gap-10 lg:gap-12 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="group relative inline-block py-1 text-sm leading-none text-brand-gray transition-colors hover:text-brand-white"
              >
                {link.label}
                <span
                  aria-hidden
                  className="absolute -bottom-1 left-0 h-[2px] w-full origin-left scale-x-0 rounded-full bg-brand-gradient transition-transform duration-300 ease-out group-hover:scale-x-100"
                />
              </Link>
            </li>
          ))}
        </ul>

        {/* Right — CTA / mobile menu */}
        <div className="flex items-center justify-self-end gap-3">
          <div className="hidden md:block">
            <MagneticButton href="/contact" className="px-6 py-2">
              Get a Quote
            </MagneticButton>
          </div>

          <button
            type="button"
            className="flex items-center justify-center text-brand-white md:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="border-t border-white/10 bg-black/80 py-4 backdrop-blur-md md:hidden">
          <ul className="site-container flex flex-col gap-4">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block text-sm text-brand-gray hover:text-brand-white"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Button href="/contact" className="w-full text-center">
                Get a Quote
              </Button>
            </li>
          </ul>
        </div>
      )}
    </motion.header>
  );
}
