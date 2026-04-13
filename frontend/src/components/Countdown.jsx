import { useState, useEffect } from 'react'

export default function Countdown({ date }) {
  const [timeLeft, setTimeLeft] = useState(null)

  useEffect(() => {
    const calc = () => {
      const diff = new Date(date) - new Date()
      if (diff <= 0) return setTimeLeft(null)
      setTimeLeft({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      })
    }
    calc()
    const interval = setInterval(calc, 1000)
    return () => clearInterval(interval)
  }, [date])

  if (!timeLeft) return null

  return (
    <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-[#0f1629] border border-white/8 rounded-lg px-3 py-1.5">
      <svg className="w-3.5 h-3.5 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>Inicia en </span>
      {timeLeft.d > 0 && <span className="text-white font-semibold">{timeLeft.d}d</span>}
      <span className="text-white font-semibold">{String(timeLeft.h).padStart(2,'0')}h</span>
      <span className="text-white font-semibold">{String(timeLeft.m).padStart(2,'0')}m</span>
      <span className="text-white font-semibold">{String(timeLeft.s).padStart(2,'0')}s</span>
    </div>
  )
}
