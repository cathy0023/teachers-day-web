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
    ? ({
        '--header-img': `url(${background})`,
      } as React.CSSProperties)
    : {}

  return (
    <header
      className={`header header-with-bg${tone === 'dark' ? ' header-dark' : ''}`}
      style={style}
    >
      <h1 className="header-title">
        <span className="header-sun header-sun-left" aria-hidden>
          🌻
        </span>
        <span className="header-title-text">{school.festival}</span>
        <span className="header-sun header-sun-right" aria-hidden>
          🌻
        </span>
      </h1>
      <div className="subtitle">— 中五班 · 专属礼物 —</div>
    </header>
  )
}
