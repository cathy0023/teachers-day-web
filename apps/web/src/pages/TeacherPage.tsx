import { useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import Layout from '../components/Layout'
import Header from '../components/Header'
import { teachers } from '../data/teachers'

/**
 * 极简音频播放器 — 只有播放/暂停按钮 + 进度条,
 * 不显示时间/音量等原生控件;点进度条可跳转
 */
function MiniPlayer({ src }: { src: string }) {
  const ref = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0) // 0~1

  const toggle = () => {
    const a = ref.current
    if (!a) return
    if (a.paused) {
      a.play()
      setPlaying(true)
    } else {
      a.pause()
      setPlaying(false)
    }
  }
  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const a = ref.current
    if (!a || !a.duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    const ratio = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1)
    a.currentTime = ratio * a.duration
    setProgress(ratio)
  }

  return (
    <div className="mini-player">
      {/* 隐形原生 audio 只作数据源,不渲染任何控件 */}
      <audio
        ref={ref}
        src={src}
        preload="metadata"
        onTimeUpdate={() => {
          const a = ref.current
          if (a && a.duration) setProgress(a.currentTime / a.duration)
        }}
        onEnded={() => {
          setPlaying(false)
          setProgress(0)
        }}
      />
      <button
        type="button"
        className="mini-player-btn"
        onClick={toggle}
        aria-label={playing ? '暂停' : '播放'}
      >
        {playing ? '⏸' : '▶'}
      </button>
      <div
        className="mini-player-bar"
        onClick={seek}
        role="slider"
        aria-label="播放进度"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress * 100)}
      >
        <div className="mini-player-fill" style={{ width: `${progress * 100}%` }} />
      </div>
    </div>
  )
}

/**
 * 个人感谢页 — 通过 URL :teacherId 找到对应老师
 * 路由 /teacher/:teacherId/thanks
 */
export default function TeacherPage({
  teacherId: propTeacherId,
}: {
  teacherId?: string
}) {
  const params = useParams<{ teacherId?: string; id?: string }>()
  const navigate = useNavigate()
  const id = propTeacherId ?? params.teacherId ?? params.id
  const teacher = teachers.find((t) => t.id === id)

  if (!teacher) {
    return (
      <Layout backTo="/">
        <Header background="/images/classroom.webp" tone="dark" />
        <div style={{ padding: 40, textAlign: 'center' }}>
          <p>没有找到这一页。</p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout backTo="/">
      <Header background="/images/classroom.webp" tone="dark" />
      <motion.section
        className="teacher-page"
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="top">
          <div className="teacher-avatar">
            <img src={teacher.avatar} alt={teacher.name} />
          </div>
          <h2>致 {teacher.name}</h2>
        </div>

        <div className="greeting">{teacher.greeting}</div>

        {/* 录音区 — 图图给老师的语音 */}
        <div className="audio-section">
          <div className="audio-label">
            <img className="audio-kid-avatar" src="/images/kid/tutu.webp" alt="图图" />
            <span>图图想对你说</span>
          </div>
          <MiniPlayer src={teacher.audio} />
        </div>
      </motion.section>

      {/* 全家感谢信入口 — 置于个人感谢区底部 */}
      <motion.section
        className="family-entry"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
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
    </Layout>
  )
}
