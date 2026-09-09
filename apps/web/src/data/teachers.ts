export type TeacherRole = '主班' | '配班' | '生活'

export interface Teacher {
  /** 路由 id */
  id: string
  /** 老师姓名(待用户填) */
  name: string
  /** 职位 */
  role: TeacherRole
  /** 调皮占位文案 — 给到 9 盒里"非本老师"的那 8 个盒子翻面后显示 */
  /** 感谢语 — 进个人页后显示 */
  greeting: string
  /** 卡通形象图片路径(放在 public/images/ 下) */
  avatar: string
  /** 头像取景 — 人脸在原图中的位置(transform-origin,百分比) */
  avatarOrigin: string
  /** 头像取景 — 放大倍数(以脸为中心裁切) */
  avatarZoom: number
  /** 孩子录音路径(放在 public/audio/ 下) */
  audio: string
}

/**
 * 头像取景样式 — 图片是 2048x2048 场景图而非证件照,
 * cover + 按老师配置的 origin/zoom 裁出脸部特写
 */
import type { CSSProperties } from 'react'
export function avatarStyle(t: Teacher): CSSProperties {
  return {
    objectFit: 'cover',
    transformOrigin: t.avatarOrigin,
    transform: `scale(${t.avatarZoom})`,
  }
}

/** 三位老师真实数据 */
export const teachers: Teacher[] = [
  {
    id: 'momo',
    name: '墨墨老师',
    role: '主班',
    greeting:
      '墨墨老师,这一年图图的每一点成长,背后都有你的专业和用心 —— 比之前自信了,也比之前愿意表达了。图图能遇见你,是我们全家的幸运。千言万语,唯有感谢。',
    avatar: '/images/teachers/momo.webp',
    // 人脸偏图右上(约 55%, 24%),持灯笼在中下 — 取景略偏上
    avatarOrigin: '55% 30%',
    avatarZoom: 2.1,
    audio: '/audio/momo.m4a',
  },
  {
    id: 'xiaoyun',
    name: '小芸老师',
    role: '配班',
    greeting:
      '小芸老师,图图对你说的话虽然还很笨拙,但那份藏不住的温柔,相信你一定感受到了。谢谢你每一个细节里的耐心。',
    avatar: '/images/teachers/xiaoyun.webp',
    // 坐姿半身,脸在中上(约 50%, 30%)
    avatarOrigin: '50% 32%',
    avatarZoom: 1.9,
    audio: '/audio/xiaoyun.m4a',
  },
  {
    id: 'zhanglaoshi',
    name: '张老师',
    role: '生活',
    greeting:
      '张老师,谢谢你每一个午饭、每一次午睡、每一双洗干净的小手上的那份温暖。',
    avatar: '/images/teachers/zhanglaoshi.webp',
    // 半身特写,脸约(50%, 32%)
    avatarOrigin: '50% 34%',
    avatarZoom: 1.7,
    audio: '/audio/zhanglaoshi.m4a',
  },
]

/**
 * 9 盒抽盒游戏的占位语 — 每个老师主页的 8 个"非自己"盒子
 * 翻开后用这些话调侃一下,营造"抽不到"的小遗憾
 */
export const fakeBoxHints: string[] = [
  '这里是你不认识的小朋友的礼物 🎁',
  '哎呀,这个盒子是隔壁班的 📦',
  '再试一次吧,你的礼物躲起来了 😜',
  '轻轻晃了晃,里面传来一声叹气 — 它说"你还没抽中哦" 🥲',
  '谜语从盒缝里冒出来:"这次也不是你,再翻一个吧" 🎭',
  '空盒,但摸到了好运 ✨',
  '这个是园长妈妈的特别收藏 🧑‍🏫',
  '小嘿!这不是你的,继续找 🔍',
]

/**
 * 主页的调皮引导语(每位老师看到的同一句)
 */
export const boxGameHint = '挑一个盒子,看看能不能抽中属于你的惊喜 🎁'

/** 整体感谢页文案 — 家长视角 */
export const closingText = {
  title: '致中五班的一封感谢信',
  paragraphs: [
    '感谢墨墨老师的专业、小芸老师的细致、张老师对孩子们日常起居的温柔守护。我们看到的每一个中五班孩子的笑容,背后都有你们的用心。',
    '这一年里,图图回家总会念叨幼儿园的点点滴滴 —— 新学会的儿歌、突然喊出小五班时的口号、和小朋友之间发生的各种趣事,嘴边总挂着中五班的各种好。我们能深切地感受到,他在五班过得很开心。',
    '更让我们感动的是你们对图图的耐心引导 —— 让他好好吃饭,陪他勇敢表达,哄他安心入睡……这些事,你们比我们做家长的做得还好。上幼儿园之后,他各方面能力的进步我们都看在眼里,这与三位老师专业、温暖、又有耐心的引导分不开。很庆幸,图图能遇到你们,能在中五班这样温暖的集体里长大。',
    '向日葵永远追着太阳走,而你们,就是孩子们的太阳。这一年,有你们真好。',
    '再次感谢老师们这一年的辛苦付出。愿你们往后的日子,被温柔地对待,被孩子们记得,被这个世界善待。',
  ],
  signature: '中五班 图图小朋友 一家',
}

/** 学校 / 班级信息 */
export const school = {
  kindergarten: '朝花幼儿园 · 来广营',
  className: '中五班',
  festival: '教师节快乐',
  /** 主页欢迎词 */
  welcome: '中五班 · 专属的感谢礼物',
  /** 调皮副标题 */
  teaseHint: boxGameHint,
}

/** 盒子类型:real = 抽中本老师,fake = 调皮占位 */
export type Box =
  | { kind: 'real'; teacher: Teacher }
  | { kind: 'fake'; hint: string }

/**
 * 关键工具:给定当前老师 id,生成 6 个盒子
 * - 2 个"自己"(位置用 id 哈希保证同一老师稳定,且互不重叠)
 * - 4 个"非自己"用 fakeBoxHints 调侃
 */
export function generateBoxes(currentTeacherId: string): Box[] {
  const t = teachers.find((x) => x.id === currentTeacherId)
  if (!t) throw new Error(`teacher ${currentTeacherId} not found`)
  // 稳定哈希:基于 id 字符码求和 mod 6
  const hash = [...currentTeacherId].reduce((s, c) => s + c.charCodeAt(0), 0)
  const realA = hash % 6
  // 偏移 1~5,保证第二个中奖盒与第一个不同位
  const realB = (realA + 1 + (hash % 5)) % 6
  return Array.from({ length: 6 }, (_, i) => {
    if (i === realA || i === realB) {
      return { kind: 'real' as const, teacher: t }
    }
    return {
      kind: 'fake' as const,
      hint: fakeBoxHints[(i + hash) % fakeBoxHints.length],
    }
  })
}