"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { animate, motion, useInView } from "framer-motion";
import {
  Bell,
  Briefcase,
  Calendar,
  FileCheck,
  FileText,
  Flag,
  LayoutGrid,
  MessageSquare,
  Newspaper,
  Search,
  Settings,
  Store,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import { useReducedMotion } from "@/lib/hooks";

/**
 * "The Umvix Transformation" — drag-to-reveal comparison of the
 * Phamenterprises client dashboard.
 *
 *  - BEFORE: the old flat services dashboard (navy sidebar, tile grid)
 *  - AFTER:  the Umvix redesign — cream/orange premium analytics dashboard
 *
 * The before layer is clipped with clip-path so its content stays pinned
 * full-width — nothing reflows or mis-aligns at the drag boundary.
 */

const easeOut = [0.22, 1, 0.36, 1] as const;

/* ================================ BEFORE — old Phamenterprises dashboard ================================ */

// Same project as the redesign — identical modules & numbers, dated presentation.
const oldSidebar = [
  { icon: LayoutGrid, label: "Dashboard", active: true },
  { icon: Briefcase, label: "Projects" },
  { icon: MessageSquare, label: "Inquiries" },
  { icon: FileCheck, label: "Tasks" },
  { icon: Users, label: "Contacts" },
  { icon: FileText, label: "Reports" },
  { icon: Settings, label: "Settings" },
];

const oldTopCards = [
  { icon: Briefcase, label: "Projects", count: "932", bg: "linear-gradient(135deg,#9a9cf0,#7b7de0)" },
  { icon: MessageSquare, label: "Inquiries", count: "1,032", bg: "linear-gradient(135deg,#f2c66b,#e8b04c)" },
  { icon: TrendingUp, label: "Investment", count: "102k", bg: "linear-gradient(135deg,#6db4ee,#4d9de4)" },
  { icon: Wallet, label: "Assets", count: "32k", bg: "linear-gradient(135deg,#ecA8ee,#dd8ce2)" },
];

const oldTiles = [
  { icon: FileCheck, label: "Tasks" },
  { icon: MessageSquare, label: "Email" },
  { icon: TrendingUp, label: "Statistic" },
  { icon: Wallet, label: "Balance" },
  { icon: Settings, label: "Servers" },
  { icon: Store, label: "Market" },
  { icon: Users, label: "Contacts" },
  { icon: Calendar, label: "Calendar" },
  { icon: FileText, label: "Reports" },
  { icon: Flag, label: "Goals" },
  { icon: Bell, label: "Alerts" },
  { icon: Newspaper, label: "News" },
];

function OldDashboard() {
  return (
    <div className="flex h-full bg-[#eef0f4]">
      {/* navy sidebar */}
      <div className="flex w-11 shrink-0 flex-col items-center gap-1 bg-[#1e2142] py-1.5 sm:w-14">
        <p className="mb-1 px-1 text-center text-[5px] font-bold leading-tight text-white/90 sm:text-[6px]">
          Pham
          <br />
          enterprises
        </p>
        {oldSidebar.map(({ icon: Icon, label, active }) => (
          <div
            key={label}
            className={`flex w-9 flex-col items-center gap-0.5 rounded-sm py-1 sm:w-11 ${
              active ? "bg-[#eef0f4] text-[#1e2142]" : "text-white/70"
            }`}
          >
            <Icon size={10} />
            <span className="text-[4.5px] font-medium sm:text-[5.5px]">{label}</span>
          </div>
        ))}
      </div>

      {/* content */}
      <div className="flex min-w-0 flex-1 flex-col p-2.5 sm:p-4">
        <p className="text-sm font-bold text-[#23253a] sm:text-lg">Dashboard</p>
        <p className="text-[7px] text-[#9aa0ae] sm:text-[9px]">Welcome back, Nella Vita</p>

        {/* colorful feature cards */}
        <div className="mt-2 grid grid-cols-4 gap-1.5 sm:mt-3 sm:gap-2.5">
          {oldTopCards.map(({ icon: Icon, label, count, bg }) => (
            <div key={label} className="flex flex-col rounded-lg p-1.5 sm:rounded-xl sm:p-2.5" style={{ background: bg }}>
              <div className="mx-auto flex h-6 w-6 items-center justify-center rounded-full bg-white sm:h-9 sm:w-9">
                <Icon size={12} className="text-[#7b7de0]" />
              </div>
              <div className="mt-1.5 flex items-center justify-between sm:mt-2.5">
                <span className="text-[6.5px] font-semibold text-white sm:text-[9px]">{label}</span>
                <span className="flex items-center gap-0.5 text-[6px] font-bold text-white/90 sm:text-[8px]">
                  {count}
                  <Bell size={7} className="fill-white/30" />
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* white tile grid */}
        <div className="mt-1.5 grid flex-1 grid-cols-6 gap-1.5 sm:mt-2.5 sm:gap-2.5">
          {oldTiles.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex flex-col items-center justify-center gap-1 rounded-lg bg-white shadow-[0_1px_3px_rgba(30,33,66,0.08)] sm:gap-1.5 sm:rounded-xl"
            >
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#8b8ce8] sm:h-8 sm:w-8">
                <Icon size={10} className="text-white" />
              </div>
              <span className="px-0.5 text-center text-[5px] font-semibold leading-tight text-[#23253a] sm:text-[7px]">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ================================ AFTER — Umvix redesign (cream/orange) ================================ */

const ORANGE = "#e8734a";
const AMBER = "#f2b143";
const NAVY = "#2b2d52";

function NewDashboard({ inView, reduced }: { inView: boolean; reduced: boolean }) {
  const show = reduced || inView;

  const stats = [
    { icon: Briefcase, value: "932", label: "Projects" },
    { icon: MessageSquare, value: "1,032", label: "Inquiries" },
    { icon: TrendingUp, value: "102k", label: "Investment" },
    { icon: Wallet, value: "32k", label: "Assets" },
  ];

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-[#faf6f1] text-[#2d2a26]">
      {/* decorative orange blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-10 top-1/4 h-40 w-40 rounded-[2.5rem] opacity-90 sm:h-56 sm:w-56"
        style={{ background: `linear-gradient(135deg, ${ORANGE}, #f0925f)`, transform: "rotate(12deg)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-8 right-[22%] h-24 w-24 rounded-3xl opacity-70"
        style={{ background: `linear-gradient(135deg, ${AMBER}, #f5c76b)`, transform: "rotate(-14deg)" }}
      />

      {/* header */}
      <div className="relative z-10 m-1.5 mb-0 flex items-center gap-2 rounded-xl bg-white/90 px-2.5 py-1.5 shadow-[0_2px_12px_rgba(45,42,38,0.06)] backdrop-blur sm:m-2.5 sm:gap-3 sm:px-4 sm:py-2">
        <p className="text-[9px] font-extrabold tracking-tight sm:text-xs">
          Phamenterprises<span style={{ color: ORANGE }}>.</span>
        </p>
        <div className="flex flex-1 items-center gap-1.5 rounded-full bg-[#f3eee7] px-2 py-1 sm:max-w-[38%] sm:px-2.5">
          <Search size={8} style={{ color: ORANGE }} />
          <span className="text-[6.5px] text-[#b0a89d] sm:text-[8px]">Search here...</span>
        </div>
        <div className="ml-auto flex items-center gap-1.5 sm:gap-2.5">
          <Bell size={9} className="hidden text-[#8d867b] sm:block" />
          <Settings size={9} className="hidden text-[#8d867b] sm:block" />
          <span className="h-4.5 flex items-center gap-1 sm:gap-1.5">
            <span
              className="h-4 w-4 rounded-full ring-2 ring-white sm:h-5 sm:w-5"
              style={{ background: `linear-gradient(135deg, ${NAVY}, #4a4d7d)` }}
            />
            <span className="hidden flex-col sm:flex">
              <span className="text-[7px] font-bold leading-tight">Nella Vita</span>
              <span className="text-[6px] leading-tight text-[#b0a89d]">Admin</span>
            </span>
          </span>
        </div>
      </div>

      {/* body */}
      <div className="relative z-10 flex min-h-0 flex-1 gap-1.5 p-1.5 sm:gap-2.5 sm:p-2.5">
        {/* main column */}
        <div className="flex min-w-0 flex-[1.65] flex-col gap-1.5 sm:gap-2.5">
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 10 }}
            animate={show ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.15, ease: easeOut }}
            className="flex items-center justify-between px-0.5"
          >
            <p className="text-[11px] font-extrabold sm:text-sm">Dashboard</p>
            <span className="flex items-center gap-1 rounded-lg bg-white px-1.5 py-0.5 text-[6px] text-[#8d867b] shadow-sm sm:px-2 sm:py-1 sm:text-[7.5px]">
              <Calendar size={7} style={{ color: ORANGE }} />
              Change Period · Aug – Oct 2026
            </span>
          </motion.div>

          {/* stat cards */}
          <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
            {stats.map(({ icon: Icon, value, label }, i) => (
              <motion.div
                key={label}
                initial={reduced ? false : { opacity: 0, y: 14, scale: 0.94 }}
                animate={show ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.25 + i * 0.1, ease: easeOut }}
                className="flex items-center gap-1.5 rounded-xl bg-white p-1.5 shadow-[0_2px_10px_rgba(45,42,38,0.06)] sm:gap-2 sm:p-2"
              >
                <span
                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded-lg sm:h-7 sm:w-7"
                  style={{ background: `${ORANGE}1a` }}
                >
                  <Icon size={10} style={{ color: ORANGE }} />
                </span>
                <span className="min-w-0">
                  <span className="block text-[9px] font-extrabold leading-tight sm:text-[11px]">{value}</span>
                  <span className="block truncate text-[6px] text-[#a39b8f] sm:text-[7.5px]">{label}</span>
                </span>
              </motion.div>
            ))}
          </div>

          {/* charts row */}
          <div className="grid min-h-0 flex-[1.25] grid-cols-[1.6fr_1fr] gap-1.5 sm:gap-2.5">
            {/* project statistic — animated line chart */}
            <motion.div
              initial={reduced ? false : { opacity: 0, y: 16 }}
              animate={show ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: 0.5, ease: easeOut }}
              className="flex min-h-0 flex-col rounded-xl bg-white p-2 shadow-[0_2px_10px_rgba(45,42,38,0.06)] sm:p-2.5"
            >
              <div className="flex items-center justify-between">
                <p className="text-[8px] font-bold sm:text-[10px]">Project Statistic</p>
                <span className="rounded-md bg-[#f3eee7] px-1.5 py-0.5 text-[6px] text-[#8d867b] sm:text-[7px]">
                  This Month
                </span>
              </div>
              <div className="mt-0.5 flex items-center gap-2 text-[6px] text-[#a39b8f] sm:text-[7px]">
                <span className="flex items-center gap-0.5">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: ORANGE }} />
                  This Week <b className="text-[#2d2a26]">1,982</b>
                </span>
                <span className="flex items-center gap-0.5">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: AMBER }} />
                  Last Week <b className="text-[#2d2a26]">1,345</b>
                </span>
              </div>
              <div className="relative mt-1 min-h-0 flex-1">
                <svg viewBox="0 0 220 80" className="h-full w-full" preserveAspectRatio="none">
                  {[16, 36, 56].map((y) => (
                    <line key={y} x1="0" y1={y} x2="220" y2={y} stroke="#eee7dc" strokeWidth="1" strokeDasharray="3 4" />
                  ))}
                  <motion.path
                    d="M8 62 L42 40 L76 52 L110 26 L144 44 L178 30 L212 38"
                    fill="none"
                    stroke={AMBER}
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={reduced ? false : { pathLength: 0 }}
                    animate={show ? { pathLength: 1 } : {}}
                    transition={{ duration: 1.3, delay: 0.8, ease: "easeInOut" }}
                  />
                  <motion.path
                    d="M8 68 L42 56 L76 60 L110 34 L144 52 L178 20 L212 28"
                    fill="none"
                    stroke={ORANGE}
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={reduced ? false : { pathLength: 0 }}
                    animate={show ? { pathLength: 1 } : {}}
                    transition={{ duration: 1.3, delay: 1, ease: "easeInOut" }}
                  />
                  {[
                    [8, 68],
                    [42, 56],
                    [76, 60],
                    [110, 34],
                    [144, 52],
                    [178, 20],
                    [212, 28],
                  ].map(([cx, cy], i) => (
                    <motion.circle
                      key={i}
                      cx={cx}
                      cy={cy}
                      r="2.2"
                      fill="white"
                      stroke={ORANGE}
                      strokeWidth="1.4"
                      initial={reduced ? false : { opacity: 0, scale: 0 }}
                      animate={show ? { opacity: 1, scale: 1 } : {}}
                      transition={{ delay: 1.1 + i * 0.08, duration: 0.25 }}
                    />
                  ))}
                </svg>
                {/* tooltip chip */}
                <motion.span
                  initial={reduced ? false : { opacity: 0, y: 6, scale: 0.9 }}
                  animate={show ? { opacity: 1, y: 0, scale: 1 } : {}}
                  transition={{ delay: 1.7, duration: 0.4, ease: easeOut }}
                  className="absolute left-[44%] top-[18%] rounded-md px-1.5 py-0.5 text-center text-white shadow-lg"
                  style={{ background: NAVY }}
                >
                  <span className="block text-[7px] font-extrabold leading-tight">24%</span>
                  <span className="block text-[5px] leading-tight text-white/70">592 Visitors</span>
                </motion.span>
              </div>
              <div className="flex justify-between px-1 text-[5.5px] text-[#b0a89d] sm:text-[6.5px]">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                  <span key={d}>{d}</span>
                ))}
              </div>
            </motion.div>

            {/* email donut */}
            <motion.div
              initial={reduced ? false : { opacity: 0, y: 16 }}
              animate={show ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: 0.62, ease: easeOut }}
              className="flex min-h-0 flex-col rounded-xl bg-white p-2 shadow-[0_2px_10px_rgba(45,42,38,0.06)] sm:p-2.5"
            >
              <div className="flex items-center justify-between">
                <p className="text-[8px] font-bold sm:text-[10px]">Email</p>
                <span className="text-[7px] text-[#b0a89d]">•••</span>
              </div>
              <div className="relative mx-auto mt-1 aspect-square w-[52%] min-w-0 flex-shrink">
                <svg viewBox="0 0 60 60" className="h-full w-full -rotate-90">
                  <circle cx="30" cy="30" r="23" fill="none" stroke="#f3eee7" strokeWidth="9" />
                  {[
                    { color: AMBER, len: 0.42, offset: 0, delay: 0.9 },
                    { color: ORANGE, len: 0.3, offset: 0.42, delay: 1.1 },
                    { color: NAVY, len: 0.18, offset: 0.72, delay: 1.3 },
                  ].map((seg, i) => (
                    <motion.circle
                      key={i}
                      cx="30"
                      cy="30"
                      r="23"
                      fill="none"
                      stroke={seg.color}
                      strokeWidth="9"
                      strokeDasharray={`${seg.len * 144.5} 144.5`}
                      strokeDashoffset={-seg.offset * 144.5}
                      initial={reduced ? false : { opacity: 0 }}
                      animate={show ? { opacity: 1 } : {}}
                      transition={{ delay: seg.delay, duration: 0.5 }}
                    />
                  ))}
                </svg>
                <motion.span
                  initial={reduced ? false : { opacity: 0, scale: 0 }}
                  animate={show ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 1.5, duration: 0.3 }}
                  className="absolute inset-0 flex items-center justify-center text-[8px] font-extrabold sm:text-[10px]"
                >
                  11%
                </motion.span>
              </div>
              <div className="mt-auto flex flex-col gap-0.5">
                {[
                  { label: "Primary (27%)", val: "763", c: NAVY },
                  { label: "Promotion (19%)", val: "321", c: ORANGE },
                  { label: "Socials (15%)", val: "154", c: AMBER },
                ].map((l) => (
                  <div key={l.label} className="flex items-center gap-1 text-[5.5px] text-[#8d867b] sm:text-[6.5px]">
                    <span className="h-1.5 w-1.5 rounded-[2px]" style={{ background: l.c }} />
                    <span className="truncate">{l.label}</span>
                    <span className="ml-auto font-bold text-[#2d2a26]">{l.val}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* bottom row: statistic bars + tasks */}
          <div className="grid min-h-0 flex-1 grid-cols-2 gap-1.5 sm:gap-2.5">
            {/* statistic — animated bar chart */}
            <motion.div
              initial={reduced ? false : { opacity: 0, y: 16 }}
              animate={show ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: 0.75, ease: easeOut }}
              className="flex min-h-0 flex-col rounded-xl bg-white p-2 shadow-[0_2px_10px_rgba(45,42,38,0.06)] sm:p-2.5"
            >
              <div className="flex items-center justify-between">
                <p className="text-[8px] font-bold sm:text-[10px]">Statistic</p>
                <span className="rounded-md bg-[#f3eee7] px-1.5 py-0.5 text-[6px] text-[#8d867b] sm:text-[7px]">
                  This Year
                </span>
              </div>
              <div className="mt-1 flex min-h-0 flex-1 items-end gap-1 px-0.5 sm:gap-1.5">
                {[
                  { h: 42, m: "Jan" },
                  { h: 68, m: "Feb" },
                  { h: 35, m: "Mar" },
                  { h: 80, m: "Apr" },
                  { h: 55, m: "May" },
                  { h: 100, m: "Jun" },
                  { h: 62, m: "Jul" },
                  { h: 48, m: "Aug" },
                  { h: 90, m: "Sep" },
                  { h: 70, m: "Oct" },
                ].map((b, i) => (
                  <div key={b.m} className="flex h-full flex-1 flex-col justify-end gap-0.5">
                    <motion.div
                      className="w-full rounded-t-[3px]"
                      style={{
                        background:
                          b.h === 100
                            ? `linear-gradient(180deg, ${ORANGE}, ${AMBER})`
                            : i % 2 === 0
                              ? "#f0e9df"
                              : `${AMBER}55`,
                      }}
                      initial={reduced ? false : { height: 0 }}
                      animate={show ? { height: `${b.h}%` } : {}}
                      transition={{ duration: 0.7, delay: 0.95 + i * 0.06, ease: easeOut }}
                    />
                    <span className="hidden text-center text-[5px] text-[#b0a89d] sm:block">{b.m}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* tasks — animated progress */}
            <motion.div
              initial={reduced ? false : { opacity: 0, y: 16 }}
              animate={show ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: 0.85, ease: easeOut }}
              className="flex min-h-0 flex-col rounded-xl bg-white p-2 shadow-[0_2px_10px_rgba(45,42,38,0.06)] sm:p-2.5"
            >
              <div className="flex items-center justify-between">
                <p className="text-[8px] font-bold sm:text-[10px]">Tasks</p>
                <span
                  className="rounded-md px-1.5 py-0.5 text-[6px] font-bold text-white sm:text-[7px]"
                  style={{ background: ORANGE }}
                >
                  8 open
                </span>
              </div>
              <div className="mt-1.5 flex min-h-0 flex-1 flex-col justify-center gap-1.5 sm:gap-2">
                {[
                  { label: "To Do", count: 5, w: "40%", c: AMBER },
                  { label: "In Progress", count: 3, w: "65%", c: ORANGE },
                  { label: "Completed", count: 12, w: "90%", c: "#5cb87a" },
                ].map((t, i) => (
                  <div key={t.label}>
                    <div className="flex items-center justify-between text-[6px] sm:text-[7px]">
                      <span className="font-semibold text-[#2d2a26]">{t.label}</span>
                      <span className="font-bold" style={{ color: t.c }}>
                        {t.count} tasks
                      </span>
                    </div>
                    <div className="mt-0.5 h-1.5 overflow-hidden rounded-full bg-[#f3eee7]">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: t.c }}
                        initial={reduced ? false : { width: 0 }}
                        animate={show ? { width: t.w } : {}}
                        transition={{ duration: 0.9, delay: 1.05 + i * 0.15, ease: easeOut }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* right rail */}
        <div className="hidden min-h-0 flex-1 flex-col gap-2 sm:flex">
          {/* balance card */}
          <motion.div
            initial={reduced ? false : { opacity: 0, x: 18 }}
            animate={show ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.45, ease: easeOut }}
            className="rounded-xl p-2.5 text-white shadow-[0_6px_18px_rgba(43,45,82,0.35)]"
            style={{ background: `linear-gradient(135deg, ${NAVY}, #3d4070)` }}
          >
            <div className="flex items-center justify-between text-[6.5px] text-white/60">
              <span>Balance</span>
              <span>12/24</span>
            </div>
            <p className="mt-0.5 text-[13px] font-extrabold tracking-tight">$ 12,568.60</p>
            <div className="mt-1.5 flex gap-1">
              <span
                className="rounded-md px-2 py-0.5 text-[6.5px] font-bold text-white"
                style={{ background: ORANGE }}
              >
                Confirm
              </span>
              <span className="rounded-md border border-white/25 px-2 py-0.5 text-[6.5px] font-semibold text-white/80">
                Exchange
              </span>
            </div>
            <svg viewBox="0 0 100 20" className="mt-1.5 h-4 w-full" preserveAspectRatio="none">
              <motion.path
                d="M0 16 L14 12 L28 14 L42 8 L56 11 L70 5 L84 8 L100 3"
                fill="none"
                stroke="rgba(255,255,255,0.6)"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={reduced ? false : { pathLength: 0 }}
                animate={show ? { pathLength: 1 } : {}}
                transition={{ duration: 1.1, delay: 0.85, ease: "easeInOut" }}
              />
              <motion.circle
                cx="100"
                cy="3"
                r="2"
                fill="#fff"
                initial={reduced ? false : { opacity: 0, scale: 0 }}
                animate={show ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 1.9, duration: 0.3 }}
              />
            </svg>
          </motion.div>

          {/* server status */}
          <motion.div
            initial={reduced ? false : { opacity: 0, x: 18 }}
            animate={show ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.58, ease: easeOut }}
            className="rounded-xl bg-white p-2.5 shadow-[0_2px_10px_rgba(45,42,38,0.06)]"
          >
            <p className="text-[8px] font-bold sm:text-[9px]">Server Status</p>
            <div className="mt-1.5 flex flex-col gap-1.5">
              {[
                { t: "10 AM", w: "85%" },
                { t: "8 AM", w: "62%" },
                { t: "6 AM", w: "74%" },
                { t: "4 AM", w: "40%" },
              ].map((r, i) => (
                <div key={r.t} className="flex items-center gap-1.5">
                  <span className="w-6 text-[6px] text-[#b0a89d]">{r.t}</span>
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#f3eee7]">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: `linear-gradient(90deg, #7bc96f, ${AMBER}, ${ORANGE})` }}
                      initial={reduced ? false : { width: 0 }}
                      animate={show ? { width: r.w } : {}}
                      transition={{ duration: 0.9, delay: 0.9 + i * 0.12, ease: easeOut }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* market previews */}
          <motion.div
            initial={reduced ? false : { opacity: 0, x: 18 }}
            animate={show ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.7, ease: easeOut }}
            className="flex flex-col rounded-xl bg-white p-2.5 shadow-[0_2px_10px_rgba(45,42,38,0.06)]"
          >
            <div className="flex items-center justify-between">
              <p className="text-[8px] font-bold sm:text-[9px]">Market Previews</p>
              <span className="text-[7px] text-[#b0a89d]">•••</span>
            </div>
            <div className="mt-1.5 flex flex-col gap-1.5 overflow-hidden">
              {[
                { s: "LTC/USD", n: "March", v: "120.45", d: "+0.45%", up: true, c: "#4bc0b5" },
                { s: "BTC/USD", n: "January", v: "149.50", d: "-2.24%", up: false, c: AMBER },
                { s: "ETH/USD", n: "January", v: "148.50", d: "+1.12%", up: true, c: NAVY },
                { s: "RPL/USD", n: "January", v: "149.50", d: "-2.24%", up: false, c: ORANGE },
              ].map((m, i) => (
                <motion.div
                  key={m.s}
                  initial={reduced ? false : { opacity: 0, y: 8 }}
                  animate={show ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.95 + i * 0.1, ease: easeOut }}
                  className="flex items-center gap-1.5"
                >
                  <span
                    className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-md text-[6px] font-extrabold text-white"
                    style={{ background: m.c }}
                  >
                    {m.s[0]}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-[6.5px] font-bold leading-tight">{m.s}</span>
                    <span className="block text-[5.5px] leading-tight text-[#b0a89d]">{m.n}</span>
                  </span>
                  <span className="ml-auto text-right">
                    <span className="block text-[6.5px] font-extrabold leading-tight">{m.v}</span>
                    <span
                      className="block text-[5.5px] font-bold leading-tight"
                      style={{ color: m.up ? "#4caf6e" : ORANGE }}
                    >
                      {m.d}
                    </span>
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* calendar */}
          <motion.div
            initial={reduced ? false : { opacity: 0, x: 18 }}
            animate={show ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.82, ease: easeOut }}
            className="flex min-h-0 flex-1 flex-col rounded-xl bg-white p-2.5 shadow-[0_2px_10px_rgba(45,42,38,0.06)]"
          >
            <div className="flex items-center justify-between">
              <span className="text-[8px] font-bold text-[#b0a89d]">‹</span>
              <p className="text-[8px] font-extrabold tracking-[0.15em] sm:text-[9px]">JANUARY</p>
              <span className="text-[8px] font-bold text-[#b0a89d]">›</span>
            </div>
            <div className="mt-1 grid min-h-0 flex-1 grid-cols-7 content-evenly gap-y-0.5 text-center">
              {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                <span key={`${d}-${i}`} className="text-[5.5px] font-bold text-[#b0a89d]">
                  {d}
                </span>
              ))}
              {Array.from({ length: 28 }, (_, i) => i + 1).map((day) => {
                const isPrimary = day === 5;
                const isSecondary = day === 17;
                const isWeekend = day % 7 === 6 || day % 7 === 0;
                return (
                  <motion.span
                    key={day}
                    initial={reduced ? false : { opacity: 0, scale: 0.6 }}
                    animate={show ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: 1.05 + day * 0.02, duration: 0.25 }}
                    className="mx-auto flex h-3 w-3 items-center justify-center rounded-full text-[5.5px] font-semibold sm:h-3.5 sm:w-3.5 sm:text-[6px]"
                    style={
                      isPrimary
                        ? { background: ORANGE, color: "white", boxShadow: `0 2px 6px ${ORANGE}66` }
                        : isSecondary
                          ? { background: AMBER, color: "white", boxShadow: `0 2px 6px ${AMBER}66` }
                          : { color: isWeekend ? ORANGE : "#5c564d" }
                    }
                  >
                    {day}
                  </motion.span>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

/* ================================ slider shell ================================ */

export default function TransformationShowcase({ className = "" }: { className?: string }) {
  const reduced = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { once: true, margin: "-100px" });
  const [pos, setPos] = useState(100);
  const dragging = useRef(false);
  const interacted = useRef(false);
  const sweep = useRef<ReturnType<typeof animate> | null>(null);

  // Intro sweep: start fully on the old dashboard, then reveal the redesign.
  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setPos(50);
      return;
    }
    sweep.current = animate(100, 50, {
      duration: 1.6,
      delay: 0.4,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        if (!interacted.current) setPos(v);
      },
    });
    return () => sweep.current?.stop();
  }, [inView, reduced]);

  const updateFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.max(0, Math.min(100, pct)));
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    interacted.current = true;
    sweep.current?.stop();
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    updateFromClientX(e.clientX);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    updateFromClientX(e.clientX);
  };
  const onPointerUp = () => {
    dragging.current = false;
  };

  return (
    <div className={`group relative ${className}`}>
      {/* ambient glow behind the frame */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-8 -z-10 rounded-[2.5rem] opacity-70 blur-3xl"
        style={{
          background:
            "radial-gradient(ellipse 55% 60% at 72% 45%, rgba(255,31,61,0.14), transparent 65%), radial-gradient(ellipse 45% 55% at 25% 55%, rgba(139,140,232,0.12), transparent 65%)",
        }}
      />

      <div
        ref={containerRef}
        className="relative aspect-[4/3] w-full cursor-ew-resize select-none overflow-hidden rounded-3xl border border-white/10 shadow-[0_30px_90px_-20px_rgba(0,0,0,0.85)] ring-1 ring-inset ring-white/5 sm:aspect-[16/10]"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        role="slider"
        aria-valuenow={Math.round(pos)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Phamenterprises dashboard — before and after comparison"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
            interacted.current = true;
            sweep.current?.stop();
          }
          if (e.key === "ArrowLeft") setPos((p) => Math.max(0, p - 4));
          if (e.key === "ArrowRight") setPos((p) => Math.min(100, p + 4));
        }}
      >
        {/* AFTER — clipped to the right of the divider (1px overlap avoids a seam;
            the before layer paints on top of the overlap) */}
        <div
          className="absolute inset-0"
          style={{ clipPath: `inset(0 0 0 calc(${pos}% - 1px))` }}
        >
          <NewDashboard inView={inView} reduced={reduced} />
          <span className="pointer-events-none absolute bottom-3 right-3 z-20 flex items-center gap-1.5 rounded-full bg-brand-gradient px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-[0_8px_24px_rgba(255,31,61,0.45)] ring-1 ring-white/25 sm:right-4 sm:text-xs">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8z" />
            </svg>
            {/* short label on mobile — both pills together don't fit at 390px */}
            <span className="sm:hidden">After</span>
            <span className="hidden sm:inline">After · Umvix Redesign</span>
          </span>
        </div>

        {/* BEFORE — clipped layer (clip-path keeps content pinned, no reflow) */}
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          <OldDashboard />
          {/* dated veil */}
          <div className="pointer-events-none absolute inset-0 bg-[#1e2142]/[0.05]" />
          <span className="pointer-events-none absolute bottom-3 left-3 z-20 rounded-full bg-[#1e2142]/85 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white/85 ring-1 ring-white/15 backdrop-blur sm:left-4 sm:text-xs">
            <span className="sm:hidden">Before</span>
            <span className="hidden sm:inline">Before · Old Dashboard</span>
          </span>
        </div>

        {/* divider + handle */}
        <div
          className="absolute top-0 z-30 h-full w-px bg-white/80 shadow-[0_0_20px_2px_rgba(255,31,61,0.6)]"
          style={{ left: `${pos}%`, transform: "translateX(-50%)" }}
        >
          <div className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-brand-gradient shadow-[0_8px_28px_rgba(255,31,61,0.5)] ring-4 ring-black/30 transition-transform duration-200 group-hover:scale-110">
            <span className="absolute inset-0 animate-ping rounded-full bg-brand-red/40" />
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="relative text-white">
              <path
                d="M9 7 L5 12 L9 17 M15 7 L19 12 L15 17"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>

      <p className="mt-4 text-center text-xs text-brand-gray-muted">Drag · or use ← → keys</p>
    </div>
  );
}
