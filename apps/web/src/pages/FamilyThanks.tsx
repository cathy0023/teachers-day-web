import { motion } from 'framer-motion'
import Layout from '../components/Layout'
import { closingText } from '../data/teachers'

/**
 * 全家感谢信页 — 图图一家写给中五班的一封完整感谢信
 * 路由 /family-thanks
 */
export default function FamilyThanks() {
  return (
    <Layout backTo="/">
      <motion.article
        className="family-letter"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="letter-tape" aria-hidden>From 图图一家</div>

        <h2 className="letter-title">🌻 {closingText.title} 🌻</h2>

        <div className="letter-body">
          <p className="letter-opening">亲爱的中五班老师们:</p>
          {closingText.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        <div className="letter-sign">
          <div className="letter-sign-line">祝老师们教师节快乐 🌻</div>
          <div className="signature">—— {closingText.signature}</div>
        </div>
      </motion.article>
    </Layout>
  )
}
