import type { PropsWithChildren } from 'react'
import { useNavigate } from 'react-router-dom'
import Sunflower from './Sunflower'

interface LayoutProps {
  /** 传入时,左上角显示统一返回按钮,点击跳到该路径 */
  backTo?: string
}

/** 全局装饰 — 向日葵 + 统一返回按钮;撒心由各页面按需触发,见 Home 的 Confetti */
export default function Layout({ children, backTo }: PropsWithChildren<LayoutProps>) {
  const navigate = useNavigate()
  return (
    <>
      {backTo && (
        <button
          type="button"
          className="global-back"
          onClick={() => navigate(backTo)}
          aria-label="返回首页"
        >
          ← 首页
        </button>
      )}
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
