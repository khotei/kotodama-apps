/** Two-digit mono ordinal — `3` → `03`. */
export function pad2(n: number) {
  return String(n).padStart(2, '0')
}
