import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Layout from '../components/Layout'
import Confetti from '../components/Confetti'
import {
  boxGameHint,
  generateBoxes,
  school,
  type Box as BoxT,
} from '../data/teachers'

/**
 * 单个盒子 — 翻面动画
 * 关键改动:不再用 CSS 3D 翻转,改用条件渲染 —
 *   flipped=false → 显示关闭的盒子
 *   flipped=true  → 显示翻开后的内容(可正常点击)
 * 这样 .open-btn 始终在文档流顶层,不会被 3D 反向或 backface 遮挡。
 */
function GiftBox({
  box,
  index,
  flipped,
  onFlip,
  onRealOpen,
}: {
  box: BoxT
  index: number
  flipped: boolean
  onFlip: () => void
  onRealOpen: (teacherId: string) => void
}) {
  return (
    <motion.div
      className="box-cell"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
    >
      {!flipped ? (
        // 关闭的盒子 — 整体可点击翻面
        <button
          type="button"
          className="box box-closed"
          onClick={onFlip}
          aria-label={`第 ${index + 1} 号礼物盒,点击翻面`}
        >
          <span className="ribbon ribbon-v" />
          <span className="ribbon ribbon-h" />
          <span className="box-knot">🎁</span>
          <span className="box-number">No. {index + 1}</span>
        </button>
      ) : (
        // 翻开后的内容 — 不再被 3D 翻转,按钮正常可点
        <motion.div
          className={`box box-opened box-${box.kind}`}
          role="region"
          aria-label="已翻开的礼物盒"
          initial={{ rotateY: 90, opacity: 0 }}
          animate={{ rotateY: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          {box.kind === 'real' ? (
            <div className="real-content">
              <div className="real-avatar">
                <img
                  src={box.teacher.avatar}
                  alt="礼物头像"
                  onError={(e) => {
                    ;(e.currentTarget as HTMLImageElement).style.display = 'none'
                  }}
                />
              </div>
              <button
                type="button"
                className="open-btn"
                onClick={() => onRealOpen(box.teacher.id)}
              >
                <span className="open-btn-spark" aria-hidden>✨</span>
                <span className="open-btn-text">进入感谢页</span>
                <span className="open-btn-arrow" aria-hidden>→</span>
              </button>
              <div className="open-hint" aria-hidden>👆 这是为您准备的专属礼物</div>
            </div>
          ) : (
            <div className="fake-content">
              <div className="fake-icon">📦</div>
              <div className="fake-hint">{box.hint}</div>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  )
}

/**
 * 主页 — 9 盒抽盒 + 整体感谢信浮层入口
 */
export default function Home({
  currentTeacherId,
}: {
  currentTeacherId: string
}) {
  const navigate = useNavigate()
  // 盒阵只在进入时生成一次(不再提供重新打乱)
  const [boxes] = useState<BoxT[]>(() => generateBoxes(currentTeacherId))
  const [flippedSet, setFlippedSet] = useState<Set<number>>(new Set())
  // 每次翻中"自己"盒子,key++ 触发一次撒心
  const [confettiKey, setConfettiKey] = useState(-1)
  const flippedCount = flippedSet.size

  return (
    <Layout>
      {/* 撒心层 — 仅在 confettiKey 变化时触发一次 */}
      <Confetti triggerKey={confettiKey} />

      {/* 浮动进度 pill — 翻页过程中永远可见,不再依赖滚到底 */}
      {flippedCount > 0 && (
        <div className="progress-pill" aria-live="polite">
          <span className="progress-pill-num">{flippedCount}</span>
          <span className="progress-pill-divider">/</span>
          <span className="progress-pill-total">6</span>
          <span className="progress-pill-label">已翻开</span>
        </div>
      )}

      {/* 首页 hero — 拍立得照片 + 模切贴纸标题,不再有绿色班级标签 */}
      <section className="home-hero">
        <div className="hero-photo">
          <img src="/images/kindergarten.jpg" alt={`${school.kindergarten} ${school.className}`} />
        </div>
        <h1 className="hero-title">
          <span className="hero-sun hero-sun-left" aria-hidden>🌻</span>
          {school.festival}
          <span className="hero-sun hero-sun-right" aria-hidden>🌻</span>
        </h1>
        <p className="hero-sub">{school.welcome}</p>
      </section>

      <main className="box-page">
        <p className="tease-hint">{boxGameHint}</p>

        <section className="box-grid" aria-label="6 个礼物盒">
          {boxes.map((b, i) => (
            <GiftBox
              key={`${currentTeacherId}-${i}`}
              box={b}
              index={i}
              flipped={flippedSet.has(i)}
              onFlip={() => {
                const next = new Set(flippedSet)
                next.add(i)
                setFlippedSet(next)
                // 翻中"自己"盒子 → 撒心
                if (b.kind === 'real') setConfettiKey((k) => k + 1)
              }}
              onRealOpen={(teacherId) => {
                // 命中"自己"盒子 → 跳个人感谢页
                navigate(`/teacher/${teacherId}/thanks`)
              }}
            />
          ))}
        </section>

        <div className="box-progress">
          <span>
            已翻开 <strong>{flippedCount}</strong> / 6
          </span>
        </div>

        {/* 全家感谢信入口 — 置于首页底部 */}
        <motion.section
          className="family-entry"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          onClick={() => navigate('/family-thanks')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') navigate('/family-thanks')
          }}
          aria-label="打开图图一家致中五班的感谢信"
        >
          <div className="family-entry-icon">💌</div>
          <div className="family-entry-text">
            <div className="family-entry-title">图图一家 · 致中五班的感谢信</div>
            <div className="family-entry-sub">一封完整的信 · 家长的心里话</div>
          </div>
          <div className="family-entry-arrow">→</div>
        </motion.section>
      </main>
    </Layout>
  )
}