import { useEffect, useRef } from 'react'

const COLORS = ['#ffb84d', '#ff8a00', '#79b34d', '#ffe066', '#fff7e0']

/** 全局撒花层 — 32 片错峰飘落 */
export default function Confetti() {
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const layer = ref.current
    if (!layer) return
    const petals: HTMLDivElement[] = []
    for (let i = 0; i < 32; i++) {
      const p = document.createElement('div')
      p.className = 'petal'
      p.style.left = `${Math.random() * 100}%`
      p.style.background =
        COLORS[Math.floor(Math.random() * COLORS.length)]
      p.style.animationDuration = `${6 + Math.random() * 6}s`
      p.style.animationDelay = `${Math.random() * 8}s`
      const size = 10 + Math.random() * 14
      p.style.width = `${size}px`
      p.style.height = `${size}px`
      layer.appendChild(p)
      petals.push(p)
    }
    return () => {
      petals.forEach((p) => p.remove())
    }
  }, [])

  return <div className="confetti" ref={ref} aria-hidden />
}