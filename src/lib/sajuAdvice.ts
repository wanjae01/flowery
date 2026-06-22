import type { TenGod } from './saju'

export interface Advice {
  title: string
  focus: string
  caution: string
  action: string
}

type Localized = Record<TenGod, Advice>

/** Daily guidance per Ten God relationship. en + ko are authored in full. */
export const ADVICE: Record<'en' | 'ko', Localized> = {
  en: {
    'bi-gyeon': {
      title: 'Companion (비견)',
      focus: 'Your own footing is strong today. Trust your judgment and move on your own initiative.',
      caution: 'Stubbornness and going it alone where help is offered.',
      action: 'Start the thing you keep waiting for permission to start.',
    },
    'geop-jae': {
      title: 'Rival (겁재)',
      focus: 'Competitive energy — useful if pointed at a goal, costly if pointed at people.',
      caution: 'Impulse spending and friction over shared resources.',
      action: 'Channel the drive into one contest with yourself, not others.',
    },
    'sik-sin': {
      title: 'Creativity (식신)',
      focus: 'A day for making and enjoying. Ideas flow with ease; output feels light.',
      caution: 'Comfort tipping into indulgence or drift.',
      action: 'Ship one small creative thing and savour something good.',
    },
    'sang-gwan': {
      title: 'Expression (상관)',
      focus: 'Bold, brilliant, unfiltered. Talent wants to break the usual rules.',
      caution: 'Sharp words and overstepping authority you still need.',
      action: 'Show your work — but soften the edge before you hit send.',
    },
    'pyeon-jae': {
      title: 'Opportunity (편재)',
      focus: 'Wealth in motion: chances, contacts, and openings appear at the edges.',
      caution: 'Overreaching and spreading yourself too thin.',
      action: 'Say yes to one new connection; let two distractions go.',
    },
    'jeong-jae': {
      title: 'Steady Gain (정재)',
      focus: 'Reward for diligence. Practical, patient effort compounds today.',
      caution: 'Being so careful you miss a fair risk.',
      action: 'Finish the unglamorous task that quietly pays off later.',
    },
    'pyeon-gwan': {
      title: 'Pressure (편관)',
      focus: 'Challenge sharpens you. Discipline under stress is the whole lesson.',
      caution: 'Confrontation and burning out by forcing things.',
      action: 'Meet one hard thing head-on, then deliberately rest.',
    },
    'jeong-gwan': {
      title: 'Order (정관)',
      focus: 'Structure and responsibility favour you; reputation is built today.',
      caution: 'Rigidity and over-pleasing authority.',
      action: 'Keep one promise precisely; tidy one system you rely on.',
    },
    'pyeon-in': {
      title: 'Insight (편인)',
      focus: 'Intuition and unconventional learning run deep. Good for quiet study.',
      caution: 'Overthinking and withdrawing too far inward.',
      action: 'Learn one odd, useful thing — then write down what it means to you.',
    },
    'jeong-in': {
      title: 'Support (정인)',
      focus: 'You are held up today — by mentors, knowledge, and rest. Receive it.',
      caution: 'Leaning so hard on support that you stall.',
      action: 'Ask for the help you avoid asking for; protect time to recover.',
    },
  },
  ko: {
    'bi-gyeon': {
      title: '비견 (比肩)',
      focus: '오늘은 자기 중심이 단단합니다. 판단을 믿고 스스로 움직이기 좋은 날.',
      caution: '도움을 마다하는 고집과 혼자 떠안기.',
      action: '허락을 기다리던 그 일을 오늘 시작하세요.',
    },
    'geop-jae': {
      title: '겁재 (劫財)',
      focus: '경쟁의 기운. 목표를 향하면 유용하고, 사람을 향하면 손해입니다.',
      caution: '충동 소비와 공동 자원을 둘러싼 마찰.',
      action: '경쟁심을 남이 아닌 어제의 나와의 시합에 쓰세요.',
    },
    'sik-sin': {
      title: '식신 (食神)',
      focus: '만들고 누리기 좋은 날. 아이디어가 수월하게 흐릅니다.',
      caution: '편안함이 게으름과 방종으로 기우는 것.',
      action: '작은 창작물 하나를 완성하고, 좋은 것을 음미하세요.',
    },
    'sang-gwan': {
      title: '상관 (傷官)',
      focus: '대담하고 빛나는 표현력. 재능이 틀을 깨고 싶어 합니다.',
      caution: '날선 말과 아직 필요한 권위에 대한 월권.',
      action: '결과물을 보여주되, 보내기 전에 날을 다듬으세요.',
    },
    'pyeon-jae': {
      title: '편재 (偏財)',
      focus: '움직이는 재물. 기회와 인연, 틈새가 가장자리에서 나타납니다.',
      caution: '욕심을 부려 너무 넓게 벌이는 것.',
      action: '새 인연 하나에 ‘예’ 하고, 산만함 둘은 흘려보내세요.',
    },
    'jeong-jae': {
      title: '정재 (正財)',
      focus: '성실함의 보상. 꾸준하고 실용적인 노력이 쌓이는 날.',
      caution: '지나친 신중함으로 합당한 기회를 놓치는 것.',
      action: '화려하지 않지만 나중에 보답할 그 일을 끝내세요.',
    },
    'pyeon-gwan': {
      title: '편관 (偏官)',
      focus: '도전이 당신을 벼립니다. 압박 속의 절제가 오늘의 교훈.',
      caution: '대립과, 무리하게 밀어붙여 지치는 것.',
      action: '어려운 일 하나를 정면으로 맞고, 의식적으로 쉬세요.',
    },
    'jeong-gwan': {
      title: '정관 (正官)',
      focus: '질서와 책임이 유리한 날. 평판이 쌓입니다.',
      caution: '경직됨과 윗사람에게 과하게 맞추는 것.',
      action: '약속 하나를 정확히 지키고, 의지하는 체계 하나를 정돈하세요.',
    },
    'pyeon-in': {
      title: '편인 (偏印)',
      focus: '직관과 색다른 배움이 깊어집니다. 조용한 공부에 좋습니다.',
      caution: '생각이 과하고 너무 안으로 움츠러드는 것.',
      action: '쓸모 있는 낯선 지식 하나를 익히고, 의미를 적어두세요.',
    },
    'jeong-in': {
      title: '정인 (正印)',
      focus: '오늘은 지지받는 날 — 스승, 지식, 휴식이 받쳐줍니다. 받아들이세요.',
      caution: '지원에 너무 기대어 멈춰 서는 것.',
      action: '미루던 도움을 청하고, 회복할 시간을 지키세요.',
    },
  },
}

export function adviceFor(locale: string, god: TenGod): Advice {
  const lang = locale.startsWith('ko') ? 'ko' : 'en'
  return ADVICE[lang][god]
}
