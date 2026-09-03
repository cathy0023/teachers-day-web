import { school } from '../data/teachers'

interface HeaderProps {
  /** 顶背景图(可选)— 不传则用纯色渐变 */
  background?: string
  /** 主题色调提示 — 暗底 vs 亮底,影响文字对比度 */
  tone?: 'light' | 'dark'
}

/** 顶部学校标题区 — 接收背景图 prop */
export default function Header({ background, tone = 'light' }: HeaderProps) {
  const style: React.CSSProperties = background
    ? {
        backgroundImage: `linear-gradient(${
          tone === 'dark'
            ? 'rgba(0,0,0,0.25), rgba(0,0,0,0.4)'
            : 'rgba(255,255,255,0.35), rgba(255,255,255,0.15)'
        }), url(${background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    : {}

  return (
    <header className="header header-with-bg" style={style}>
      <div className="kindergarten-tag">中五班</div>
      <h1>🌻 {school.festival} 🌻</h1>
      <div className="class-tag">
        {school.className} · 三位老师的专属礼物
      </div>
      <div className="subtitle">— {school.subtitle} —</div>
    </header>
  )
}