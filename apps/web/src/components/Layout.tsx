import type { PropsWithChildren } from 'react'
import Confetti from './Confetti'
import Sunflower from './Sunflower'

/** 全局装饰 — 撒花层 + 两朵向日葵 */
export default function Layout({ children }: PropsWithChildren) {
  return (
    <>
      <Confetti />
      <div className="sunflower-deco left floaty">
        <Sunflower />
      </div>
      <div className="sunflower-deco right floaty delay">
        <Sunflower color="#ff8a00" />
      </div>
      {children}
      <footer>© {new Date().getFullYear()} 中五班 · 教师节 · 用心手作</footer>
    </>
  )
}