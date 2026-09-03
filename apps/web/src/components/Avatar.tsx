/**
 * 头像组件 — 如果 src 不存在或加载失败,显示斜纹底 + "待上传"占位
 */
export default function Avatar({
  src,
  size = 90,
  label = '卡通形象 待上传',
}: {
  src: string
  size?: number
  label?: string
}) {
  return (
    <div
      className="avatar"
      style={{ width: size, height: size, position: 'relative' }}
      aria-label={label}
    >
      <img
        src={src}
        alt={label}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
        onError={(e) => {
          ;(e.currentTarget as HTMLImageElement).style.display = 'none'
        }}
      />
      {/* 占位文字 — 图片成功加载时由 img 覆盖显示 */}
      <span style={{ position: 'relative', zIndex: 0 }}>{label}</span>
    </div>
  )
}