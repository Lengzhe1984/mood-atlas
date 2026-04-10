const CELL = 4
const VIEWBOX = 96

const skinTones = ['#f2cfb6', '#e4b18a', '#c98a62', '#8f5e45']
const hairColors = ['#2f241f', '#4b3a30', '#6a4b3a', '#857b74', '#603d54', '#4d6074', '#6f6b44', '#25384a']
const outfitPalettes = [
  { base: '#c56743', accent: '#f1c6a9', dark: '#7c4028' },
  { base: '#607c70', accent: '#b6d2c3', dark: '#33463f' },
  { base: '#4c6689', accent: '#b8cbe2', dark: '#293b57' },
  { base: '#84608a', accent: '#d8c2db', dark: '#523b59' },
  { base: '#a46e4b', accent: '#e5ccb3', dark: '#64422b' },
  { base: '#53626d', accent: '#c5d0d7', dark: '#334049' },
  { base: '#8e5056', accent: '#efc3c7', dark: '#5a3035' },
  { base: '#7a7247', accent: '#dfd7a6', dark: '#4b472e' },
]
const backgroundPalettes = [
  { outer: '#fff4ea', inner: '#f7e4d3', dot: '#e9c1a5' },
  { outer: '#eef8f2', inner: '#dceee3', dot: '#a9d2b9' },
  { outer: '#eef3fb', inner: '#d7e4f4', dot: '#adc4e2' },
  { outer: '#f6eef9', inner: '#e5d8f0', dot: '#c8afd9' },
  { outer: '#fff6e8', inner: '#f1e2c4', dot: '#dbbf82' },
  { outer: '#f3f2ef', inner: '#e0ddd5', dot: '#bfb9ab' },
]

const familyStyles = {
  lowkey: { symbol: 'ellipsis', pose: 'slouch', outfit: 'hoodie', expression: 'half', hairStyle: 'messy', accessory: 'none' },
  giver: { symbol: 'heart', pose: 'open', outfit: 'cardigan', expression: 'soft', hairStyle: 'bob', accessory: 'blush' },
  guarded: { symbol: 'shell', pose: 'guarded', outfit: 'coat', expression: 'flat', hairStyle: 'long', accessory: 'scarf' },
  overthink: { symbol: 'spiral', pose: 'upright', outfit: 'sweater', expression: 'sharp', hairStyle: 'side', accessory: 'glasses' },
  night: { symbol: 'moon', pose: 'slouch', outfit: 'hoodie', expression: 'tired', hairStyle: 'wave', accessory: 'clip' },
  lowBattery: { symbol: 'battery', pose: 'slouch', outfit: 'hoodie', expression: 'tired', hairStyle: 'crop', accessory: 'bandage' },
  resilient: { symbol: 'sprout', pose: 'open', outfit: 'jacket', expression: 'smile', hairStyle: 'short', accessory: 'bandage' },
  heavy: { symbol: 'shield', pose: 'upright', outfit: 'coat', expression: 'flat', hairStyle: 'crop', accessory: 'none' },
  loud: { symbol: 'spark', pose: 'lean', outfit: 'tee', expression: 'wide', hairStyle: 'spike', accessory: 'blush' },
  driver: { symbol: 'crown', pose: 'upright', outfit: 'blazer', expression: 'sharp', hairStyle: 'side', accessory: 'ear' },
  boundary: { symbol: 'stop', pose: 'guarded', outfit: 'jacket', expression: 'flat', hairStyle: 'bun', accessory: 'glasses' },
  direct: { symbol: 'arrow', pose: 'lean', outfit: 'jacket', expression: 'smirk', hairStyle: 'crop', accessory: 'brow' },
  heart: { symbol: 'rose', pose: 'open', outfit: 'sweater', expression: 'soft', hairStyle: 'wave', accessory: 'clip' },
  spirit: { symbol: 'lotus', pose: 'calm', outfit: 'robe', expression: 'closed', hairStyle: 'bun', accessory: 'none' },
  glow: { symbol: 'shine', pose: 'open', outfit: 'vest', expression: 'smile', hairStyle: 'wave', accessory: 'star' },
  alarm: { symbol: 'siren', pose: 'guarded', outfit: 'hoodie', expression: 'wide', hairStyle: 'messy', accessory: 'sweat' },
  soft: { symbol: 'droplet', pose: 'open', outfit: 'cardigan', expression: 'soft', hairStyle: 'bob', accessory: 'blush' },
}

const codeFamilyMap = makeCodeFamilyMap({
  lowkey: ['OJBK', 'FINE', 'NPC', 'GREYY', 'CHILL'],
  giver: ['ATMR', 'CARE', 'MUMM', 'SWEET', 'SAVER', 'SPOIL'],
  guarded: ['SOLO', 'FAKE', 'COLD', 'GONE', 'MUTE', 'SHELL', 'FADE', 'DODGE'],
  overthink: ['LOOP', 'WHYY', 'GLASS', 'BUBU', 'NERDY', 'XREC', 'LEDGR', 'WORTH'],
  night: ['EMOO', 'MOODY', 'DIZZY'],
  lowBattery: ['ZZZZ', 'DEAD', 'TIRED', 'STUCK', 'BROKE'],
  resilient: ['HEAL', 'ALIVE'],
  heavy: ['HOLD', 'TANK'],
  loud: ['CRYZ', 'JOKR', 'WILD', 'DRAMA', 'YAYAY', 'HAHA'],
  driver: ['BOSS', 'CTRL', 'PUSHY', 'HURRY'],
  boundary: ['NOPE'],
  direct: ['SHIT', 'FWORD', 'BLUNT', 'RUDEY', 'RISKY'],
  heart: ['LOVER', 'KIDDO', 'CLING'],
  spirit: ['MONK'],
  glow: ['GLOW'],
  alarm: ['PANIC'],
  soft: ['SORRY', 'GUILT', 'SMILE'],
})

const outfitLabels = {
  hoodie: '连帽卫衣',
  cardigan: '针织开衫',
  coat: '长外套',
  sweater: '圆领毛衣',
  jacket: '短夹克',
  tee: '短袖上衣',
  blazer: '利落外套',
  robe: '宽松长袍',
  vest: '叠穿背心',
}

const poseLabels = {
  slouch: '松垮站姿',
  open: '张手站姿',
  guarded: '防守站姿',
  upright: '站直姿态',
  lean: '前倾姿态',
  calm: '安静站姿',
}

const symbolLabels = {
  ellipsis: '省略号徽章',
  heart: '心形徽章',
  shell: '冰壳徽章',
  spiral: '脑内旋涡',
  moon: '夜色月亮',
  battery: '低电量图标',
  sprout: '回弹嫩芽',
  shield: '扛事盾牌',
  spark: '情绪火花',
  crown: '控场王冠',
  stop: '边界标牌',
  arrow: '直球箭头',
  rose: '感情玫瑰',
  lotus: '看破莲花',
  shine: '氛围星芒',
  siren: '预警警灯',
  droplet: '内疚水滴',
}

function makeCodeFamilyMap(groups) {
  const map = {}

  Object.entries(groups).forEach(([family, codes]) => {
    codes.forEach((code) => {
      map[code] = family
    })
  })

  return map
}

function hashCode(code) {
  return [...code].reduce((acc, char) => acc * 31 + char.charCodeAt(0), 17) >>> 0
}

function pick(list, seed, offset = 0) {
  return list[(seed + offset) % list.length]
}

function rect(x, y, w, h, fill, extra = '') {
  return `<rect x="${x * CELL}" y="${y * CELL}" width="${w * CELL}" height="${h * CELL}" fill="${fill}" shape-rendering="crispEdges"${extra} />`
}

function strokeRect(x, y, w, h, stroke, fill = 'none') {
  return `<rect x="${x * CELL}" y="${y * CELL}" width="${w * CELL}" height="${h * CELL}" fill="${fill}" stroke="${stroke}" stroke-width="${CELL}" shape-rendering="crispEdges" />`
}

function groupSvg(parts, x = 0, y = 0) {
  return `<g transform="translate(${x * CELL} ${y * CELL})">${parts.join('')}</g>`
}

function buildSpec(code) {
  const seed = hashCode(code)
  const family = codeFamilyMap[code] ?? 'lowkey'
  const familyStyle = familyStyles[family]
  const outfitPalette = pick(outfitPalettes, seed)
  const background = pick(backgroundPalettes, seed, 2)

  return {
    code,
    family,
    background,
    outfitPalette,
    hairColor: pick(hairColors, seed, 1),
    skinTone: pick(skinTones, seed, 3),
    ...familyStyle,
  }
}

function renderBackground(spec) {
  const { outer, inner, dot } = spec.background
  const frame = '#e5d1bc'

  return [
    rect(0, 0, 24, 24, outer),
    rect(1, 1, 22, 22, inner),
    rect(2, 2, 20, 20, outer),
    rect(0, 0, 24, 1, frame),
    rect(0, 23, 24, 1, frame),
    rect(0, 0, 1, 24, frame),
    rect(23, 0, 1, 24, frame),
    rect(3, 3, 1, 1, dot),
    rect(20, 4, 1, 1, dot),
    rect(5, 19, 1, 1, dot),
    rect(18, 18, 1, 1, dot),
  ].join('')
}

function renderHead(spec) {
  const skin = spec.skinTone
  return [
    rect(8, 5, 8, 1, skin),
    rect(7, 6, 10, 4, skin),
    rect(8, 10, 8, 2, skin),
    rect(9, 12, 6, 1, skin),
    rect(10, 13, 4, 1, skin),
  ].join('')
}

function renderHair(spec) {
  const hair = spec.hairColor
  const styles = {
    messy: [
      rect(7, 4, 10, 1, hair),
      rect(6, 5, 3, 2, hair),
      rect(9, 5, 8, 2, hair),
      rect(7, 7, 2, 2, hair),
      rect(15, 7, 2, 2, hair),
    ],
    bob: [
      rect(7, 4, 10, 2, hair),
      rect(6, 6, 3, 5, hair),
      rect(15, 6, 3, 5, hair),
      rect(8, 6, 8, 1, hair),
    ],
    long: [
      rect(7, 4, 10, 2, hair),
      rect(6, 6, 3, 7, hair),
      rect(15, 6, 3, 7, hair),
      rect(8, 6, 8, 1, hair),
    ],
    side: [
      rect(7, 4, 10, 2, hair),
      rect(6, 5, 4, 3, hair),
      rect(14, 6, 2, 4, hair),
      rect(8, 6, 8, 1, hair),
    ],
    wave: [
      rect(7, 4, 10, 2, hair),
      rect(6, 6, 2, 6, hair),
      rect(15, 6, 2, 6, hair),
      rect(8, 6, 8, 1, hair),
      rect(7, 11, 2, 1, hair),
      rect(14, 11, 2, 1, hair),
    ],
    crop: [
      rect(8, 4, 8, 2, hair),
      rect(7, 6, 2, 2, hair),
      rect(15, 6, 2, 2, hair),
    ],
    spike: [
      rect(9, 3, 2, 1, hair),
      rect(12, 3, 2, 1, hair),
      rect(7, 4, 10, 2, hair),
      rect(6, 6, 2, 2, hair),
      rect(16, 6, 1, 2, hair),
    ],
    bun: [
      rect(10, 2, 4, 2, hair),
      rect(8, 4, 8, 2, hair),
      rect(7, 6, 2, 3, hair),
      rect(15, 6, 2, 3, hair),
    ],
    short: [
      rect(7, 4, 10, 1, hair),
      rect(7, 5, 10, 1, hair),
      rect(7, 6, 2, 2, hair),
      rect(15, 6, 2, 2, hair),
    ],
  }

  return (styles[spec.hairStyle] ?? styles.crop).join('')
}

function renderFace(spec) {
  const ink = '#2d2622'
  const blush = '#d98a8d'
  const accent = spec.outfitPalette.accent
  const parts = []

  const eyesByExpression = {
    half: [rect(9, 8, 2, 1, ink), rect(13, 8, 2, 1, ink)],
    tired: [rect(9, 9, 2, 1, ink), rect(13, 9, 2, 1, ink)],
    soft: [rect(9, 8, 1, 1, ink), rect(14, 8, 1, 1, ink)],
    sharp: [rect(9, 8, 2, 1, ink), rect(13, 8, 2, 1, ink), rect(8, 7, 2, 1, ink), rect(14, 7, 2, 1, ink)],
    wide: [rect(9, 8, 2, 2, ink), rect(13, 8, 2, 2, ink)],
    smile: [rect(9, 8, 2, 1, ink), rect(13, 8, 2, 1, ink)],
    flat: [rect(9, 8, 2, 1, ink), rect(13, 8, 2, 1, ink)],
    smirk: [rect(9, 8, 2, 1, ink), rect(13, 8, 2, 1, ink)],
    closed: [rect(9, 8, 2, 1, ink), rect(13, 8, 2, 1, ink)],
  }

  const mouthsByExpression = {
    half: rect(11, 10, 2, 1, ink),
    tired: rect(10, 11, 3, 1, ink),
    soft: rect(11, 10, 2, 1, ink),
    sharp: rect(11, 10, 2, 1, ink),
    wide: rect(10, 10, 4, 1, ink),
    smile: rect(10, 10, 4, 1, ink),
    flat: rect(10, 10, 4, 1, ink),
    smirk: rect(11, 10, 3, 1, ink),
    closed: rect(10, 10, 4, 1, accent),
  }

  parts.push(...(eyesByExpression[spec.expression] ?? eyesByExpression.soft))
  parts.push(mouthsByExpression[spec.expression] ?? mouthsByExpression.soft)

  if (spec.accessory === 'blush') {
    parts.push(rect(8, 10, 1, 1, blush), rect(15, 10, 1, 1, blush))
  }

  if (spec.accessory === 'brow') {
    parts.push(rect(9, 7, 2, 1, ink), rect(13, 7, 2, 1, ink))
  }

  if (spec.accessory === 'sweat') {
    parts.push(rect(16, 6, 1, 2, '#7cc9df'))
  }

  return parts.join('')
}

function renderAccessory(spec) {
  const ink = '#2d2622'
  const accent = spec.outfitPalette.accent

  const accessories = {
    glasses: [strokeRect(8, 7, 3, 3, ink), strokeRect(13, 7, 3, 3, ink), rect(11, 8, 2, 1, ink)],
    scarf: [rect(8, 13, 8, 2, accent), rect(12, 15, 2, 3, accent)],
    bandage: [rect(14, 6, 2, 1, '#e8d9ae'), rect(15, 5, 1, 3, '#c6b277')],
    clip: [rect(15, 4, 2, 1, accent), rect(16, 3, 1, 1, accent)],
    star: [rect(15, 4, 1, 3, accent), rect(14, 5, 3, 1, accent)],
    ear: [rect(17, 8, 1, 2, accent)],
    none: [],
    blush: [],
    brow: [],
    sweat: [],
  }

  return (accessories[spec.accessory] ?? []).join('')
}

function renderBody(spec) {
  const { base, accent, dark } = spec.outfitPalette
  const skin = spec.skinTone
  const parts = []

  const poses = {
    slouch: [
      rect(9, 14, 6, 5, base),
      rect(8, 15, 2, 4, base),
      rect(15, 15, 2, 4, base),
      rect(10, 19, 2, 3, dark),
      rect(13, 19, 2, 3, dark),
    ],
    open: [
      rect(9, 14, 6, 5, base),
      rect(7, 15, 2, 4, base),
      rect(15, 15, 2, 4, base),
      rect(10, 19, 2, 3, dark),
      rect(13, 19, 2, 3, dark),
    ],
    guarded: [
      rect(9, 14, 6, 5, base),
      rect(8, 15, 3, 2, base),
      rect(13, 15, 3, 2, base),
      rect(10, 19, 2, 3, dark),
      rect(13, 19, 2, 3, dark),
    ],
    upright: [
      rect(9, 14, 6, 5, base),
      rect(8, 14, 2, 4, base),
      rect(15, 14, 2, 4, base),
      rect(10, 19, 2, 3, dark),
      rect(13, 19, 2, 3, dark),
    ],
    lean: [
      rect(9, 14, 6, 5, base),
      rect(8, 15, 2, 4, base),
      rect(15, 14, 2, 5, base),
      rect(10, 19, 2, 3, dark),
      rect(13, 19, 2, 3, dark),
    ],
    calm: [
      rect(9, 14, 6, 7, base),
      rect(8, 15, 2, 4, base),
      rect(15, 15, 2, 4, base),
      rect(10, 21, 2, 1, dark),
      rect(13, 21, 2, 1, dark),
    ],
  }

  const outfitDetails = {
    hoodie: [rect(10, 15, 4, 1, accent), rect(11, 16, 1, 3, accent), rect(13, 16, 1, 3, accent)],
    cardigan: [rect(11, 14, 1, 5, accent), rect(13, 14, 1, 5, accent), rect(12, 15, 1, 1, dark)],
    coat: [rect(11, 14, 1, 6, accent), rect(13, 14, 1, 6, accent)],
    sweater: [rect(10, 14, 4, 1, accent)],
    jacket: [rect(10, 14, 1, 5, accent), rect(14, 14, 1, 5, accent)],
    tee: [rect(8, 15, 2, 2, accent), rect(15, 15, 2, 2, accent)],
    blazer: [rect(11, 14, 1, 5, accent), rect(13, 14, 1, 5, accent), rect(10, 15, 1, 1, accent), rect(14, 15, 1, 1, accent)],
    robe: [rect(11, 14, 2, 7, accent)],
    vest: [rect(10, 15, 4, 3, accent)],
  }

  parts.push(...(poses[spec.pose] ?? poses.upright))
  parts.push(...(outfitDetails[spec.outfit] ?? []))
  parts.push(rect(10, 13, 4, 1, skin))
  parts.push(rect(7, 18, 2, 1, skin))
  parts.push(rect(16, 18, 2, 1, skin))
  parts.push(rect(9, 22, 3, 1, '#2b2b31'))
  parts.push(rect(13, 22, 3, 1, '#2b2b31'))

  return parts.join('')
}

function renderSymbol(spec) {
  const fill = spec.outfitPalette.base
  const accent = spec.outfitPalette.accent
  const dark = spec.outfitPalette.dark

  const symbolMatrix = {
    ellipsis: ['.....', '.X.X.', '..X..', '.....', '.....'],
    heart: ['.X.X.', 'XXXXX', 'XXXXX', '.XXX.', '..X..'],
    shell: ['.XXX.', 'X...X', 'XXXXX', '.XXX.', '..X..'],
    spiral: ['XXXXX', '....X', '.XXX.', '.X...', '.XXXX'],
    moon: ['..XX.', '.XX..', '.XX..', '.XX..', '..XX.'],
    battery: ['.XXX.', 'X...X', 'XXXX.', 'X...X', '.XXX.'],
    sprout: ['..X..', '.XXX.', '..X..', '.X.X.', 'X...X'],
    shield: ['.XXX.', 'XXXXX', 'XXXXX', '.XXX.', '..X..'],
    spark: ['..X..', 'XXXXX', '..X..', '.X.X.', 'X...X'],
    crown: ['X.X.X', 'XXXXX', '.XXX.', '.XXX.', '.....'],
    stop: ['XXXXX', 'X...X', 'X...X', 'X...X', 'XXXXX'],
    arrow: ['..X..', '.XX..', 'XXXXX', '.XX..', '..X..'],
    rose: ['.XXX.', 'XXXXX', '.XXX.', '..X..', '.X.X.'],
    lotus: ['.X.X.', 'XXXXX', '.XXX.', '..X..', '.X.X.'],
    shine: ['X...X', '.X.X.', '..X..', '.X.X.', 'X...X'],
    siren: ['.XXX.', 'XXXXX', '.XXX.', 'XXXXX', '..X..'],
    droplet: ['..X..', '.XXX.', '.XXX.', '.XXX.', '..X..'],
  }

  const rows = symbolMatrix[spec.symbol] ?? symbolMatrix.ellipsis
  const palette = { X: fill, Y: accent, Z: dark }
  const parts = []

  rows.forEach((row, y) => {
    row.split('').forEach((char, x) => {
      if (!palette[char]) {
        return
      }

      parts.push(rect(18 + x, 3 + y, 1, 1, palette[char]))
    })
  })

  return parts.join('')
}

function buildSvg(spec) {
  const shadow = rect(7, 23, 10, 1, 'rgba(68, 48, 34, 0.18)')

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${VIEWBOX} ${VIEWBOX}" role="img" aria-hidden="true">
      ${renderBackground(spec)}
      ${shadow}
      ${renderHead(spec)}
      ${renderHair(spec)}
      ${renderBody(spec)}
      ${renderFace(spec)}
      ${renderAccessory(spec)}
      ${renderSymbol(spec)}
    </svg>
  `
}

function toDataUri(svg) {
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg.replace(/\s+/g, ' ').trim())}`
}

function getCaption(spec) {
  return `${outfitLabels[spec.outfit]} / ${poseLabels[spec.pose]} / ${symbolLabels[spec.symbol]}`
}

const cache = new Map()

export function getCharacterArt(code, name = '') {
  if (!cache.has(code)) {
    const spec = buildSpec(code)
    cache.set(code, {
      src: toDataUri(buildSvg(spec)),
      alt: `${name || code} 的像素风角色造型`,
      caption: getCaption(spec),
      family: spec.family,
    })
  }

  return cache.get(code)
}
