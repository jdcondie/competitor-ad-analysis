/**
 * ReportGeneratingOverlay.tsx
 * Full-screen premium loading animation shown while the competitor ad report
 * is being generated. Features:
 *  - Animated progress steps that tick off sequentially
 *  - Pulsing Scout logo mark
 *  - Cycling status messages synced to real server progress
 *  - Subtle noise + radial glow background
 */

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── STEP DEFINITIONS ─────────────────────────────────────────────────────────

const STEPS = [
  { id: 1, label: "Identifying brand & competitors", durationMs: 5000 },
  { id: 2, label: "Fetching ads from Meta Ads Library", durationMs: 14000 },
  { id: 3, label: "Analysing ad copy with AI", durationMs: 10000 },
  { id: 4, label: "Extracting angles & hooks", durationMs: 8000 },
  { id: 5, label: "Synthesising key takeaways", durationMs: 8000 },
  { id: 6, label: "Building report", durationMs: 5000 },
];

// ─── ANIMATED STEP ROW ────────────────────────────────────────────────────────

function StepRow({
  label,
  state,
}: {
  label: string;
  state: "pending" | "active" | "done";
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center gap-3"
    >
      {/* Icon */}
      <div className="relative w-5 h-5 shrink-0 flex items-center justify-center">
        {state === "done" && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="w-5 h-5 rounded-full flex items-center justify-center"
            style={{ background: "oklch(0.72 0.15 145 / 0.15)", border: "1px solid oklch(0.72 0.15 145 / 0.4)" }}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M2 5l2.5 2.5L8 3" stroke="oklch(0.72 0.15 145)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.div>
        )}
        {state === "active" && (
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
            className="w-5 h-5 rounded-full"
            style={{ background: "oklch(0.72 0.15 55 / 0.15)", border: "1px solid #C2714F" }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className="w-full h-full rounded-full"
              style={{
                background: "conic-gradient(from 0deg, transparent 60%, #C2714F 100%)",
                borderRadius: "50%",
              }}
            />
          </motion.div>
        )}
        {state === "pending" && (
          <div
            className="w-5 h-5 rounded-full"
            style={{ background: "oklch(0.14 0 0)", border: "1px solid oklch(0.22 0 0)" }}
          />
        )}
      </div>

      {/* Label */}
      <span
        className="text-sm transition-colors duration-300"
        style={{
          color:
            state === "done"
              ? "oklch(0.72 0.15 145)"
              : state === "active"
              ? "oklch(0.9 0 0)"
              : "oklch(0.38 0 0)",
          fontWeight: state === "active" ? 500 : 400,
        }}
      >
        {label}
      </span>

      {/* Active pulse dot */}
      {state === "active" && (
        <motion.span
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 1.2, repeat: Infinity }}
          className="text-xs"
          style={{ color: "#C2714F" }}
        >
          ●
        </motion.span>
      )}
    </motion.div>
  );
}

// ─── MAIN OVERLAY ─────────────────────────────────────────────────────────────

interface Props {
  /** Whether the overlay is visible */
  visible: boolean;
  /** Current status message from the server (passed in from Wizard) */
  statusMsg?: string;
  /** Competitor names to personalise step labels */
  competitors?: string[];
}

export default function ReportGeneratingOverlay({ visible, statusMsg, competitors }: Props) {
  const [activeStep, setActiveStep] = useState(0);
  const [elapsed, setElapsed] = useState(0);

  // Reset and auto-advance steps when overlay becomes visible
  useEffect(() => {
    if (!visible) {
      setActiveStep(0);
      setElapsed(0);
      return;
    }

    let totalMs = 0;
    const timers: ReturnType<typeof setTimeout>[] = [];

    STEPS.forEach((step, idx) => {
      const t = setTimeout(() => {
        setActiveStep(idx);
      }, totalMs);
      timers.push(t);
      totalMs += step.durationMs;
    });

    // Elapsed counter (updates every second for the timer display)
    const interval = setInterval(() => setElapsed(e => e + 1), 1000);

    return () => {
      timers.forEach(clearTimeout);
      clearInterval(interval);
    };
  }, [visible]);

  // Build personalised step labels if competitor names are available
  const steps = STEPS.map((s, i) => {
    if (i === 1 && competitors && competitors.length > 0) {
      return { ...s, label: `Fetching ads for ${competitors.slice(0, 2).join(" & ")}` };
    }
    return s;
  });

  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;
  const elapsedStr = minutes > 0
    ? `${minutes}m ${seconds}s`
    : `${seconds}s`;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="report-generating-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "oklch(0.06 0 0 / 0.97)", backdropFilter: "blur(12px)" }}
        >
          {/* Ambient glow */}
          <div
            className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] rounded-full blur-[100px] pointer-events-none"
            style={{ background: "oklch(0.55 0.12 55 / 0.1)" }}
          />

          {/* Card */}
          <motion.div
            initial={{ scale: 0.96, y: 12 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.96, y: 12 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="relative w-full max-w-md mx-6 rounded-3xl p-8 flex flex-col gap-8"
            style={{
              background: "oklch(0.1 0 0)",
              border: "1px solid oklch(0.18 0 0)",
              boxShadow: "0 40px 80px oklch(0 0 0 / 0.6)",
            }}
          >
            {/* Header */}
            <div className="flex flex-col items-center text-center gap-4">
              {/* Pulsing Scout icon */}
              <div className="relative">
                <motion.div
                  animate={{ scale: [1, 1.08, 1], opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 rounded-2xl blur-md"
                  style={{ background: "oklch(0.72 0.15 55 / 0.3)" }}
                />
                <div
                  className="relative w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
                  style={{
                    background: "linear-gradient(135deg, oklch(0.14 0 0), oklch(0.18 0.03 55))",
                    border: "1px solid oklch(0.25 0.05 55)",
                  }}
                >
                  ✦
                </div>
              </div>

              <div>
                <h2
                  className="text-xl font-bold leading-tight mb-1"
                  style={{ fontFamily: "'DM Serif Display', Georgia, serif", color: "oklch(0.97 0 0)" }}
                >
                  Scouting the Competition
                </h2>
                <p className="text-sm" style={{ color: "oklch(0.45 0 0)" }}>
                  Pulling real ads from Meta Ads Library and running AI analysis
                </p>
              </div>
            </div>

            {/* Progress steps */}
            <div className="flex flex-col gap-3.5">
              {steps.map((step, idx) => (
                <StepRow
                  key={step.id}
                  label={step.label}
                  state={idx < activeStep ? "done" : idx === activeStep ? "active" : "pending"}
                />
              ))}
            </div>

            {/* Animated progress bar */}
            <div className="space-y-2">
              <div
                className="w-full h-1.5 rounded-full overflow-hidden"
                style={{ background: "oklch(0.16 0 0)" }}
              >
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: "linear-gradient(90deg, #C2714F, oklch(0.78 0.18 60))" }}
                  animate={{
                    width: `${Math.min(((activeStep + 1) / steps.length) * 100, 95)}%`,
                  }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>

              <div className="flex items-center justify-between">
                {/* Live status message */}
                <AnimatePresence mode="wait">
                  <motion.p
                    key={statusMsg}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.3 }}
                    className="text-xs"
                    style={{ color: "oklch(0.42 0 0)" }}
                  >
                    {statusMsg || "Starting…"}
                  </motion.p>
                </AnimatePresence>

                {/* Elapsed timer */}
                <p className="text-xs tabular-nums" style={{ color: "oklch(0.32 0 0)" }}>
                  {elapsedStr}
                </p>
              </div>
            </div>

            {/* Footer note */}
            <p className="text-xs text-center" style={{ color: "oklch(0.3 0 0)" }}>
              This usually takes 30–60 seconds
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
