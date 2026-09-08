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
          <p>
            这一年里,图图回家总会念叨学校的点点滴滴 —— 新学会的儿歌、
            和小伙伴的小矛盾、还有被你们抱起来安慰的那个下午。
            这些瞬间我们做家长的都记在心里。
          </p>
          <p>
            教育是一场温柔的接力,你们接住了孩子们最柔软的开始,
            也把信任交到了我们手上。愿你们在往后的日子里,
            被同样温柔地对待,被孩子们记得,被这个世界善待。
          </p>
        </div>

        <div className="letter-sign">
          <div className="letter-sign-line">祝老师们教师节快乐 🌻</div>
          <div className="signature">—— {closingText.signature}</div>
        </div>
      </motion.article>
    </Layout>
  )
}
