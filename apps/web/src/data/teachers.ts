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
    id: 'momo',
    name: '墨墨老师',
    role: '主班',
    greeting:
      '墨墨老师,这一年你用专业和爱,带孩子们认识了第一次规则、第一次合作、第一次勇敢。谢谢你。',
    avatar: '/images/teachers/momo.jpg',
    audio: '/audio/momo.m4a',
  },
  {
    id: 'xiaoyun',
    name: '小芸老师',
    role: '配班',
    greeting:
      '小芸老师,谢谢你每一个细节里的耐心,在每一次小情绪里的温柔接住。',
    avatar: '/images/teachers/xiaoyun.png',
    audio: '/audio/xiaoyun.m4a',
  },
  {
    id: 'zhanglaoshi',
    name: '张老师',
    role: '生活',
    greeting:
      '张老师,谢谢你每一个午饭、每一次午睡、每一双洗干净的小手上的那份温暖。',
    avatar: '/images/teachers/zhanglaoshi.jpg',
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
    '感谢墨墨老师的专业、小芸老师的细致、张老师对孩子日常起居的温柔守护。我们看到的每一个孩子的笑容,背后都有你们的用心。',
    '向日葵永远追着太阳走,而你们就像孩子们的太阳。这一年,有你们真好。教师节快乐,你们辛苦了。',
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