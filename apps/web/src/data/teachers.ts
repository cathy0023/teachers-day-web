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
  /** 孩子录音路径(放在 public/audio/ 下) */
  audio: string
}

/** 三位老师真实数据 */
export const teachers: Teacher[] = [
  {
    id: 'main',
    name: '老师姓名待填',
    role: '主班',
    greeting:
      '老师,这一年你用专业和爱,带孩子们认识了第一次规则、第一次合作、第一次勇敢。谢谢你。',
    avatar: '/images/main.svg',
    audio: '/audio/main.mp3',
  },
  {
    id: 'assistant',
    name: '老师姓名待填',
    role: '配班',
    greeting:
      '老师,谢谢你在每一个细节里的耐心,在每一次小情绪里的温柔接住。',
    avatar: '/images/assistant.svg',
    audio: '/audio/assistant.mp3',
  },
  {
    id: 'life',
    name: '老师姓名待填',
    role: '生活',
    greeting:
      '老师,谢谢你在每一个午饭、每一次午睡、每一双洗干净的小手上的那份温暖。',
    avatar: '/images/life.svg',
    audio: '/audio/life.mp3',
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
  '这个盒子打开会变成数学题 🧮',
  '里面是一只会说话的向日葵 🌻',
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
  title: '致中五班的三位老师',
  paragraphs: [
    '感谢主班老师的专业、配班老师的细致、生活老师对孩子日常起居的温柔守护。我们看到的每一个孩子的笑容,背后都有你们的用心。',
    '向日葵永远追着太阳走,而你们就像孩子们的太阳。这一年,有你们真好。教师节快乐,你们辛苦了。',
  ],
  signature: '中五班 ××小朋友 一家',
}

/** 学校 / 班级信息 */
export const school = {
  kindergarten: '朝花幼儿园 · 来广营',
  className: '中五班',
  festival: '教师节快乐',
  /** 主页欢迎词 */
  welcome: '中五班 · 三位老师的专属礼物',
  /** 调皮副标题 */
  teaseHint: boxGameHint,
}

/**
 * 关键工具:给定当前老师 id,生成 9 个盒子
 * - 1 个"自己"放在某个位置(用 id 哈希保证同一老师位置稳定)
 * - 8 个"非自己"用 fakeBoxHints 调侃
 */
export function generateBoxes(currentTeacherId: string) {
  const t = teachers.find((x) => x.id === currentTeacherId)
  if (!t) throw new Error(`teacher ${currentTeacherId} not found`)
  // 稳定哈希:基于 id 字符码求和 mod 9
  const hash = [...currentTeacherId].reduce((s, c) => s + c.charCodeAt(0), 0)
  const realIndex = hash % 9
  return Array.from({ length: 9 }, (_, i) => {
    if (i === realIndex) {
      return { kind: 'real' as const, teacher: t }
    }
    return {
      kind: 'fake' as const,
      hint: fakeBoxHints[(i + hash) % fakeBoxHints.length],
    }
  })
}