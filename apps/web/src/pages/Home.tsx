import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Layout from '../components/Layout'
import Header from '../components/Header'
import {
  boxGameHint,
  closingText,
  generateBoxes,
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
                  alt={box.teacher.name}
                  onError={(e) => {
                    ;(e.currentTarget as HTMLImageElement).style.display = 'none'
                  }}
                />
                <span className="avatar-fallback">
                  {box.teacher.role}老师<br />卡通 待上传
                </span>
              </div>
              <div className="real-name">{box.teacher.name}</div>
              <div className="real-role">{box.teacher.role}老师</div>
              <button
                type="button"
                className="open-btn"
                onClick={() => onRealOpen(box.teacher.id)}
              >
                打开盒子 ✨
              </button>
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
  const [boxes, setBoxes] = useState<BoxT[]>(() => generateBoxes(currentTeacherId))
  const [flippedSet, setFlippedSet] = useState<Set<number>>(new Set())
  const [showClosing, setShowClosing] = useState(false)
  const flippedCount = flippedSet.size

  return (
    <Layout>
      <Header background="/images/kindergarten.jpg" />

      <main className="box-page">
        <p className="tease-hint">{boxGameHint}</p>

        <section className="box-grid" aria-label="9 个礼物盒">
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
            已翻开 <strong>{flippedCount}</strong> / 9
          </span>
          <button
            className="reset-btn"
            onClick={() => {
              setBoxes(generateBoxes(currentTeacherId))
              setFlippedSet(new Set())
            }}
          >
            🔄 重新打乱
          </button>
        </div>

        {/* 整体感谢信入口 */}
        <motion.section
          className="closing-entry"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          onClick={() => setShowClosing(true)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') setShowClosing(true)
          }}
          aria-label="打开图图一家对三位老师的整体感谢信"
        >
          <div className="closing-entry-icon">✉️</div>
          <div className="closing-entry-text">
            <div className="closing-entry-title">
              图图一家 · 致三位老师的感谢信
            </div>
            <div className="closing-entry-sub">家长视角 · 不止是孩子的声音</div>
          </div>
          <div className="closing-entry-arrow">→</div>
        </motion.section>
      </main>

      {/* 整体感谢信浮层 */}
      <AnimatePresence>
        {showClosing && (
          <motion.div
            className="modal-mask"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowClosing(false)}
            role="dialog"
            aria-modal
          >
            <motion.div
              className="modal-card"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="modal-banner"
                style={{
                  backgroundImage:
                    'linear-gradient(rgba(255,255,255,0.4), rgba(255,255,255,0.6)), url(/images/classroom.jpeg)',
                }}
              >
                <span className="modal-banner-tag">中五班 · 整体感谢</span>
              </div>
              <h2>🌻 {closingText.title} 🌻</h2>
              {closingText.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
              <div className="signature">—— {closingText.signature}</div>
              <button
                className="back-btn"
                onClick={() => setShowClosing(false)}
              >
                ← 关闭
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  )
}