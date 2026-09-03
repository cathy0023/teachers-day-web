import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, useParams, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import TeacherPage from './pages/TeacherPage'
import './styles/global.css'

/** 路由包装:从 URL :teacherId 拿到当前老师 id,传给 Home */
function HomeRoute() {
  const { teacherId } = useParams<{ teacherId: string }>()
  if (!teacherId) return <Navigate to="/teacher/main" replace />
  return <Home currentTeacherId={teacherId} />
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* 入口默认重定向到主班老师 — 实际部署时每个老师拿到不同链接 */}
        <Route path="/" element={<Navigate to="/teacher/main" replace />} />
        {/* 主页(9 盒抽盒)— 通过 URL 决定盒阵内容 */}
        <Route path="/teacher/:teacherId" element={<HomeRoute />} />
        {/* 个人感谢页 — 翻到自己的盒子点开后进入 */}
        <Route path="/teacher/:teacherId/thanks" element={<TeacherPage />} />
        {/* 旧路由兼容 */}
        <Route path="/teacher/:id" element={<TeacherPage />} />
        <Route path="/closing" element={<TeacherPage teacherId="main" />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)