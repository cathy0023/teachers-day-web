import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import Layout from '../components/Layout'
import Header from '../components/Header'
import { teachers } from '../data/teachers'

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
        <Header background="/images/classroom.jpeg" tone="dark" />
        <div style={{ padding: 40, textAlign: 'center' }}>
          <p>没有找到这一页。</p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout backTo="/">
      <Header background="/images/classroom.jpeg" tone="dark" />
      <motion.section
        className="teacher-page"
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="top">
          <img className="teacher-avatar" src={teacher.avatar} alt={teacher.name} />
          <h2>致 {teacher.name}</h2>
        </div>

        <div className="greeting">{teacher.greeting}</div>

        {/* 录音区 — 图图给老师的语音 */}
        <div className="audio-section">
          <div className="audio-label">
            <img className="audio-kid-avatar" src="/images/kid/tutu.png" alt="图图" />
            <span>图图想对你说</span>
          </div>
          <audio controls preload="metadata" src={teacher.audio} className="audio-player">
            您的浏览器不支持音频播放。
          </audio>
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
