import { useEffect, useState } from 'react'
import { create } from 'zustand'

// Store global de toasts
export const useToastStore = create((set) => ({
  toasts: [],
  add: (toast) => set((s) => ({
    toasts: [...s.toasts, { id: Date.now(), ...toast }]
  })),
  remove: (id) => set((s) => ({ toasts: s.toasts.filter(t => t.id !== id) })),
}))

// Helper para usar en cualquier parte
export const toast = {
  success: (msg) => useToastStore.getState().add({ type: 'success', message: msg }),
  error:   (msg) => useToastStore.getState().add({ type: 'error',   message: msg }),
  info:    (msg) => useToastStore.getState().add({ type: 'info',    message: msg }),
}

const icons = {
  success: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>,
  error:   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>,
  info:    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
}

const colors = {
  success: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
  error:   'bg-red-500/10 border-red-500/30 text-red-400',
  info:    'bg-sky-500/10 border-sky-500/30 text-sky-400',
}

function ToastItem({ id, type, message }) {
  const remove = useToastStore(s => s.remove)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setTimeout(() => setVisible(true), 10)
    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(() => remove(id), 300)
    }, 3500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium
      shadow-xl backdrop-blur-sm transition-all duration-300
      ${colors[type]} ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
      {icons[type]}
      <span>{message}</span>
      <button onClick={() => remove(id)} className="ml-2 opacity-60 hover:opacity-100">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}

export default function ToastContainer() {
  const toasts = useToastStore(s => s.toasts)
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 items-end">
      {toasts.map(t => <ToastItem key={t.id} {...t} />)}
    </div>
  )
}
