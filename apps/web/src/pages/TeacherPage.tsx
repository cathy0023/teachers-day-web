import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import Layout from '../components/Layout'
import Header from '../components/Header'
import Avatar from '../components/Avatar'
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
      <Layout>
        <Header background="/images/classroom.jpeg" tone="dark" />
        <div style={{ padding: 40, textAlign: 'center' }}>
          <p>没有找到这位老师。</p>
          <button className="back-btn" onClick={() => navigate(-1)}>
            ← 返回
          </button>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <Header background="/images/classroom.jpeg" tone="dark" />
      <motion.section
        className="teacher-page"
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="top">
          <Avatar
            src={teacher.avatar}
            size={120}
            label={`${teacher.role}老师 卡通 待上传`}
          />
          <div>
            <h2>致 {teacher.role}老师</h2>
            <div className="role">
              中五班 · {teacher.role}老师
              <span style={{ marginLeft: 8, opacity: 0.6 }}>
                ({teacher.name})
              </span>
            </div>
          </div>
        </div>

        <div className="greeting">{teacher.greeting}</div>

        {/* 录音区 — 占位 */}
        <div className="audio-placeholder">
          <span className="dot" />
          🎤 孩子录音占位 — 把音频放进 public/audio/ 后接入
        </div>
        {/* 真实录音接入示例(后续启用):
        <audio controls src={teacher.audio} preload="none" />
        */}

        <div style={{ marginTop: 24 }}>
          <button className="back-btn" onClick={() => navigate(-1)}>
            ← 回到中五班
          </button>
        </div>
      </motion.section>
    </Layout>
  )
}