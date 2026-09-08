import { useEffect, useRef } from 'react'

const COLORS = ['#ff4d6d', '#ff8a00', '#ffb84d', '#ff6b9d', '#ff99c8', '#e63946']

/** 撒心层 — 受控触发:仅当 `triggerKey` 变化时撒一次 */
export default function Confetti({ triggerKey }: { triggerKey: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const lastKey = useRef<number>(-1)

  useEffect(() => {
    if (triggerKey === lastKey.current) return
    lastKey.current = triggerKey
    if (triggerKey < 0) return
    const layer = ref.current
    if (!layer) return
    const petals: HTMLDivElement[] = []
    for (let i = 0; i < 36; i++) {
      const p = document.createElement('div')
      p.className = 'petal'
      const startX = Math.random() * 100
      p.style.left = `${startX}%`
      p.style.background = COLORS[Math.floor(Math.random() * COLORS.length)]
      const size = 16 + Math.random() * 18
      p.style.width = `${size}px`
      p.style.height = `${size}px`
      // 让爱心从中间上方爆开,而不是从顶部一整片
      p.style.top = `${20 + Math.random() * 30}%`
      // 横向漂移幅度
      p.style.setProperty('--drift', `${(Math.random() - 0.5) * 80}px`)
      p.style.animationDuration = `${2.4 + Math.random() * 1.6}s`
      p.style.animationDelay = `${Math.random() * 0.4}s`
      layer.appendChild(p)
      petals.push(p)
    }
    const t = window.setTimeout(() => {
      petals.forEach((p) => p.remove())
    }, 5000)
    return () => {
      window.clearTimeout(t)
      petals.forEach((p) => p.remove())
    }
  }, [triggerKey])

  return <div className="confetti" ref={ref} aria-hidden />
}
