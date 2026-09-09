import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Layout from '../components/Layout'
import Confetti from '../components/Confetti'
import {
  boxGameHint,
  generateBoxes,
  school,
  type Box as BoxT,
} from '../data/teachers'

/**
 * 单个盒子 — 三种形态:
 *   closed  → 关闭态(可点击)
 *   fake    → 空盒:原位翻面显示调侃文案,不弹层
 *   lifted  → 中奖盒被弹出居中展示时,原格留暗色轮廓
 */
function GiftBox({
  index,
  mode,
  hint,
  onFlip,
}: {
  index: number
  mode: 'closed' | 'fake' | 'lifted'
  hint?: string
  onFlip: () => void
}) {
  return (
    <motion.div
      className="box-cell"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
    >
      {mode === 'fake' ? (
        // 空盒 — 原位翻面,灰色调 + 文案,不可再点
        <motion.div
          className="box box-opened box-fake"
          role="region"
          aria-label="已翻开的礼物盒"
          initial={{ rotateY: 90, opacity: 0 }}
          animate={{ rotateY: 0, opacity: 1 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <div className="fake-content">
            <div className="fake-icon">📦</div>
            <div className="fake-hint">{hint}</div>
          </div>
        </motion.div>
      ) : (
        <button
          type="button"
          className={`box box-closed${mode === 'lifted' ? ' is-lifted' : ''}`}
          onClick={onFlip}
          aria-label={`第 ${index + 1} 号礼物盒,点击翻面`}
        >
          <span className="ribbon ribbon-v" />
          <span className="ribbon ribbon-h" />
          <span className="box-knot">🎁</span>
          <span className="box-number">No. {index + 1}</span>
        </button>
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
  // 翻过的盒子集合(pill 计数 + fake 盒原位翻面)
  const [openedSet, setOpenedSet] = useState<Set<number>>(new Set())
  // 弹层展示的中奖盒下标;null = 关闭弹层
  const [activeIdx, setActiveIdx] = useState<number | null>(null)
  // 每次翻中"自己"盒子,key++ 触发一次撒心
  const [confettiKey, setConfettiKey] = useState(-1)
  const active = activeIdx !== null ? boxes[activeIdx] : null
  const flippedCount = openedSet.size

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
          <img src="/images/kindergarten.webp" alt={`${school.kindergarten} ${school.className}`} />
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
              index={i}
              mode={
                activeIdx === i
                  ? 'lifted'
                  : openedSet.has(i) && b.kind === 'fake'
                    ? 'fake'
                    : 'closed'
              }
              hint={b.kind === 'fake' ? b.hint : undefined}
              onFlip={() => {
                if (openedSet.has(i)) return
                const next = new Set(openedSet)
                next.add(i)
                setOpenedSet(next)
                // 空盒 → 原位翻面即可;中奖盒 → 弹出居中大卡片
                if (b.kind === 'real') {
                  setConfettiKey((k) => k + 1)
                  setActiveIdx(i)
                }
              }}
            />
          ))}
        </section>

        {/* 中奖弹层 — 背景为不透明页面底色,无"礼盒复制"感 */}
        <AnimatePresence>
          {active && (
            <motion.div
              className="box-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveIdx(null)}
              role="dialog"
              aria-modal
              aria-label="礼物盒打开结果"
            >
              <motion.div
                className={`box-pop box-${active.kind}`}
                initial={{ scale: 0.5, opacity: 0, y: 30 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.6, opacity: 0, y: 20 }}
                transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  className="box-pop-close"
                  onClick={() => setActiveIdx(null)}
                  aria-label="关闭"
                >
                  ✕
                </button>
                {active.kind === 'real' ? (
                  <div className="real-content">
                    <div className="real-avatar">
                      <img
                        src={active.teacher.avatar}
                        alt="礼物插画"
                        onError={(e) => {
                          ;(e.currentTarget as HTMLImageElement).style.display = 'none'
                        }}
                      />
                    </div>
                    <button
                      type="button"
                      className="open-btn"
                      onClick={() => {
                        navigate(`/teacher/${active.teacher.id}/thanks`)
                      }}
                    >
                      进入感谢页 →
                    </button>
                  </div>
                ) : (
                  <div className="fake-content">
                    <div className="fake-icon">📦</div>
                    <div className="fake-hint">{active.hint}</div>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

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