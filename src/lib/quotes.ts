/** Philosophical lines shown on the saju loading screen. */
export interface Quote {
  en: string
  ko: string
  by: string
}

export const QUOTES: Quote[] = [
  { en: 'You have power over your mind — not outside events. Realize this, and you will find strength.', ko: '너는 외부의 사건이 아니라 너의 마음을 다스릴 힘이 있다. 이를 깨달으면 힘을 얻으리라.', by: 'Marcus Aurelius' },
  { en: 'The journey of a thousand miles begins with a single step.', ko: '천 리 길도 한 걸음부터 시작된다.', by: 'Laozi' },
  { en: 'We suffer more often in imagination than in reality.', ko: '우리는 현실보다 상상 속에서 더 자주 고통받는다.', by: 'Seneca' },
  { en: 'Knowing yourself is the beginning of all wisdom.', ko: '자신을 아는 것이 모든 지혜의 시작이다.', by: 'Aristotle' },
  { en: 'He who has a why to live can bear almost any how.', ko: '살아야 할 이유가 있는 사람은 거의 모든 방법을 견딜 수 있다.', by: 'Nietzsche' },
  { en: 'The unexamined life is not worth living.', ko: '성찰하지 않는 삶은 살 가치가 없다.', by: 'Socrates' },
  { en: 'Nature does not hurry, yet everything is accomplished.', ko: '자연은 서두르지 않지만 모든 것을 이룬다.', by: 'Laozi' },
  { en: 'Very little is needed to make a happy life; it is all within yourself.', ko: '행복한 삶에 필요한 것은 아주 적으며, 그 모두가 네 안에 있다.', by: 'Marcus Aurelius' },
  { en: 'Waste no more time arguing about what a good person should be. Be one.', ko: '좋은 사람이 어떠해야 하는지 논쟁하느라 시간을 낭비하지 마라. 그저 되어라.', by: 'Marcus Aurelius' },
  { en: 'The obstacle is the way.', ko: '장애물이 곧 길이다.', by: 'Stoic maxim' },
  { en: 'Know the masculine, keep to the feminine, and be the ravine of the world.', ko: '강함을 알되 부드러움을 지키면 세상의 골짜기가 된다.', by: 'Laozi' },
  { en: 'What stands in the way becomes the way.', ko: '앞을 가로막는 것이 곧 나아갈 길이 된다.', by: 'Marcus Aurelius' },
  { en: 'Patience is bitter, but its fruit is sweet.', ko: '인내는 쓰지만 그 열매는 달다.', by: 'Aristotle' },
  { en: 'When I let go of what I am, I become what I might be.', ko: '내가 무엇인지를 내려놓을 때, 나는 될 수 있는 무언가가 된다.', by: 'Laozi' },
  { en: 'It is not death that a man should fear, but never beginning to live.', ko: '사람이 두려워해야 할 것은 죽음이 아니라, 한 번도 살기 시작하지 않는 것이다.', by: 'Marcus Aurelius' },
]

/** Deterministic quote of the day, so the same day always shows the same line. */
export function quoteOfDay(iso: string): Quote {
  let h = 0
  for (let i = 0; i < iso.length; i++) h = (h * 31 + iso.charCodeAt(i)) >>> 0
  return QUOTES[h % QUOTES.length]
}

export function randomQuote(): Quote {
  return QUOTES[Math.floor(Math.random() * QUOTES.length)]
}
