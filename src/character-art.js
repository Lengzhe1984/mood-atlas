const CELL = 8
const GRID = 32
const VIEWBOX = CELL * GRID

const skinPalettes = [
  { base: '#f0d7c2', light: '#faeadf', shadow: '#d4b39a', deep: '#bc977b' },
  { base: '#e2bf9b', light: '#f0d2b7', shadow: '#c89c73', deep: '#ab7d58' },
  { base: '#bf8f67', light: '#d7a782', shadow: '#9a6947', deep: '#7f5538' },
  { base: '#8d6248', light: '#ab7a5c', shadow: '#6a4532', deep: '#563525' },
]

const hairPalettes = [
  { base: '#3d342d', light: '#65564a', shadow: '#241e1a' },
  { base: '#676546', light: '#8e8b63', shadow: '#474631' },
  { base: '#6c7b8f', light: '#8ea2bc', shadow: '#4a5665' },
  { base: '#6f4d67', light: '#97718e', shadow: '#4d3648' },
  { base: '#a98040', light: '#d2aa63', shadow: '#7a5c2f' },
  { base: '#4e624c', light: '#70896b', shadow: '#334032' },
]

const outfitPalettes = [
  { base: '#4e6d92', light: '#7391b4', shadow: '#2f4660', accent: '#c8d8e8' },
  { base: '#6f8249', light: '#95aa69', shadow: '#4d5a33', accent: '#dce7ba' },
  { base: '#77536a', light: '#9d7390', shadow: '#52384b', accent: '#e0c4d6' },
  { base: '#5f5f68', light: '#84848e', shadow: '#3b3b42', accent: '#d6d7dd' },
  { base: '#8b653c', light: '#b38a59', shadow: '#5e4326', accent: '#ecd5b3' },
  { base: '#2f6d66', light: '#4f948c', shadow: '#1f4a45', accent: '#c6ebe5' },
  { base: '#9b4f4c', light: '#c26d67', shadow: '#693533', accent: '#efd0cb' },
  { base: '#c28d2f', light: '#ddb45b', shadow: '#855f1e', accent: '#f4e2b1' },
]

const themePalettes = [
  { accent: '#d8ead3', soft: '#f1f8ec', deep: '#6d8e63', ground: '#d4e0bf', shadow: '#b9c8a4', sparkle: '#97af8a' },
  { accent: '#dbe6f0', soft: '#eff5fb', deep: '#6c87a2', ground: '#d3dfec', shadow: '#b6c6d9', sparkle: '#8ea6bf' },
  { accent: '#efe1d5', soft: '#faf4ef', deep: '#a07d66', ground: '#ead6c5', shadow: '#d0bea9', sparkle: '#b79883' },
  { accent: '#e8ddf1', soft: '#f6f1fb', deep: '#8c74a7', ground: '#ddd1eb', shadow: '#c4b5d9', sparkle: '#ab95c6' },
  { accent: '#f1ebd4', soft: '#fcf9ef', deep: '#a69056', ground: '#e7ddb2', shadow: '#cbbf8f', sparkle: '#bea966' },
]

const familyStyles = {
  lowkey: { hairStyle: 'messy', outfitStyle: 'hoodie', pose: 'slouch', expression: 'flat', accessory: 'none' },
  giver: { hairStyle: 'bob', outfitStyle: 'cardigan', pose: 'open', expression: 'soft', accessory: 'blush' },
  guarded: { hairStyle: 'hood', outfitStyle: 'coat', pose: 'guard', expression: 'flat', accessory: 'none' },
  overthink: { hairStyle: 'side', outfitStyle: 'sweater', pose: 'idle', expression: 'tense', accessory: 'glasses' },
  night: { hairStyle: 'wave', outfitStyle: 'hoodie', pose: 'slouch', expression: 'tired', accessory: 'none' },
  lowBattery: { hairStyle: 'crop', outfitStyle: 'hoodie', pose: 'slouch', expression: 'tired', accessory: 'bandage' },
  resilient: { hairStyle: 'lift', outfitStyle: 'jacket', pose: 'stride', expression: 'smile', accessory: 'bandage' },
  heavy: { hairStyle: 'crop', outfitStyle: 'coat', pose: 'guard', expression: 'flat', accessory: 'none' },
  loud: { hairStyle: 'spike', outfitStyle: 'tee', pose: 'wave', expression: 'open', accessory: 'none' },
  driver: { hairStyle: 'slick', outfitStyle: 'blazer', pose: 'command', expression: 'sharp', accessory: 'earpiece' },
  boundary: { hairStyle: 'bun', outfitStyle: 'jacket', pose: 'guard', expression: 'flat', accessory: 'glasses' },
  direct: { hairStyle: 'crop', outfitStyle: 'jacket', pose: 'lean', expression: 'smirk', accessory: 'brow' },
  heart: { hairStyle: 'wave', outfitStyle: 'cardigan', pose: 'open', expression: 'soft', accessory: 'clip' },
  spirit: { hairStyle: 'bun', outfitStyle: 'robe', pose: 'calm', expression: 'calm', accessory: 'none' },
  glow: { hairStyle: 'wave', outfitStyle: 'vest', pose: 'open', expression: 'smile', accessory: 'star' },
  alarm: { hairStyle: 'messy', outfitStyle: 'hoodie', pose: 'lean', expression: 'open', accessory: 'sweat' },
  soft: { hairStyle: 'bob', outfitStyle: 'cardigan', pose: 'open', expression: 'soft', accessory: 'blush' },
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

const codeProfiles = {
  OJBK: { prop: 'ellipsis', pose: 'slouch', propSide: 'left' },
  ATMR: { prop: 'coin', propSide: 'left' },
  SOLO: { prop: 'shell', propSide: 'left' },
  FAKE: { prop: 'mask', accessory: 'visor' },
  LOOP: { prop: 'spiral', accessory: 'glasses', propSide: 'right' },
  EMOO: { prop: 'moon', propSide: 'right' },
  ZZZZ: { prop: 'pillow', propSide: 'left' },
  DEAD: { prop: 'battery', propSide: 'right' },
  HOLD: { prop: 'shield', propSide: 'right' },
  COLD: { prop: 'snow', propSide: 'right' },
  CRYZ: { prop: 'tear', propSide: 'left' },
  JOKR: { prop: 'mic', pose: 'wave', propSide: 'right' },
  WILD: { prop: 'spark', pose: 'wave', propSide: 'right' },
  BOSS: { prop: 'clipboard', accessory: 'crown', pose: 'command', propSide: 'right' },
  HEAL: { prop: 'sprout', pose: 'stride', propSide: 'left' },
  GONE: { prop: 'ghost', pose: 'lean', propSide: 'left' },
  SHIT: { prop: 'speech', accessory: 'brow', pose: 'command', propSide: 'left' },
  FINE: { prop: 'ellipsis', pose: 'calm', propSide: 'right' },
  NOPE: { prop: 'stop', pose: 'guard', propSide: 'right' },
  WHYY: { prop: 'question', accessory: 'glasses', propSide: 'right' },
  SORRY: { prop: 'note', pose: 'open', propSide: 'left' },
  TIRED: { prop: 'mug', pose: 'slouch', propSide: 'left' },
  PANIC: { prop: 'alarm', accessory: 'sweat', propSide: 'right' },
  DRAMA: { prop: 'spotlight', pose: 'open', propSide: 'left' },
  NPC: { prop: 'tag', pose: 'idle', propSide: 'left' },
  GLOW: { prop: 'star', accessory: 'star', propSide: 'right' },
  CARE: { prop: 'umbrella', propSide: 'right' },
  KIDDO: { prop: 'lollipop', accessory: 'clip', propSide: 'left' },
  MONK: { prop: 'lotus', outfitStyle: 'robe', pose: 'calm', propSide: 'right' },
  FWORD: { prop: 'censor', accessory: 'brow', propSide: 'left' },
  GLASS: { prop: 'heartcrack', propSide: 'right' },
  STUCK: { prop: 'loading', pose: 'slouch', propSide: 'right' },
  CTRL: { prop: 'lever', accessory: 'headband', pose: 'command', propSide: 'left' },
  LEDGR: { prop: 'book', accessory: 'glasses', propSide: 'right' },
  LOVER: { prop: 'rose', pose: 'open', propSide: 'left' },
  XREC: { prop: 'photo', pose: 'calm', propSide: 'right' },
  MUMM: { prop: 'medkit', accessory: 'clip', propSide: 'left' },
  TANK: { prop: 'armor', accessory: 'helmet', outfitStyle: 'armor', pose: 'guard', propSide: 'right' },
  FADE: { prop: 'smoke', pose: 'lean', propSide: 'left' },
  BLUNT: { prop: 'arrow', pose: 'command', propSide: 'right' },
  MOODY: { prop: 'weather', pose: 'slouch', propSide: 'right' },
  DIZZY: { prop: 'stars', pose: 'lean', propSide: 'right' },
  CHILL: { prop: 'drink', pose: 'calm', propSide: 'left' },
  HURRY: { prop: 'rocket', pose: 'stride', propSide: 'right' },
  DODGE: { prop: 'dodge', pose: 'lean', propSide: 'left' },
  SWEET: { prop: 'candy', propSide: 'right' },
  RUDEY: { prop: 'scratch', accessory: 'brow', propSide: 'right' },
  NERDY: { prop: 'knot', accessory: 'glasses', propSide: 'left' },
  YAYAY: { prop: 'firework', pose: 'wave', propSide: 'right' },
  BROKE: { prop: 'crack', pose: 'slouch', propSide: 'left' },
  SMILE: { prop: 'smilemask', pose: 'calm', propSide: 'right' },
  BUBU: { prop: 'thought', accessory: 'glasses', propSide: 'right' },
  GUILT: { prop: 'weight', pose: 'slouch', propSide: 'left' },
  PUSHY: { prop: 'megaphone', pose: 'command', propSide: 'right' },
  SPOIL: { prop: 'gift', pose: 'open', propSide: 'left' },
  RISKY: { prop: 'dice', pose: 'stride', propSide: 'right' },
  WORTH: { prop: 'scale', accessory: 'glasses', propSide: 'left' },
  MUTE: { prop: 'mute', accessory: 'headphones', propSide: 'right' },
  SHELL: { prop: 'shell', accessory: 'visor', propSide: 'left' },
  CLING: { prop: 'magnet', pose: 'open', propSide: 'right' },
  HAHA: { prop: 'laugh', pose: 'wave', propSide: 'left' },
  SAVER: { prop: 'extinguisher', pose: 'command', propSide: 'right' },
  GREYY: { prop: 'fog', pose: 'calm', propSide: 'left' },
  ALIVE: { prop: 'revive', pose: 'stride', propSide: 'right' },
}

const propPaletteByKind = {
  neutral: { a: '#8b8f98', b: '#d9dde4', c: '#4b4f56' },
  warm: { a: '#c97355', b: '#f1c1a9', c: '#8e4630' },
  gold: { a: '#d1a447', b: '#f3de98', c: '#8e6a22' },
  green: { a: '#67a25f', b: '#c7e7bd', c: '#41713b' },
  blue: { a: '#5b88c6', b: '#c5dcf8', c: '#325885' },
  pink: { a: '#cf6b8c', b: '#f3c4d5', c: '#8d4560' },
  alert: { a: '#d45646', b: '#f5b3ad', c: '#8f2f2f' },
  purple: { a: '#8a6ac0', b: '#d5c5f0', c: '#5d4586' },
}

const propPatterns = {
  ellipsis: { kind: 'neutral', rows: ['.....', '.aaa.', '.....', '.aaa.', '.....'] },
  coin: { kind: 'gold', rows: ['..a..', '.aba.', '.aba.', '.aba.', '..a..'] },
  shell: { kind: 'blue', rows: ['.aaa.', 'a...a', 'aaaaa', '.aaa.', '..a..'] },
  mask: { kind: 'neutral', rows: ['.aaa.', 'ab.ba', 'aaaaa', '.a.a.', '.....'] },
  spiral: { kind: 'purple', rows: ['aaaaa', '....a', '.aaa.', '.a...', '.aaaa'] },
  moon: { kind: 'gold', rows: ['..aa.', '.aa..', '.aa..', '.aa..', '..aa.'] },
  pillow: { kind: 'blue', rows: ['aaaaa', 'abbbb', 'abbbb', 'abbbb', 'aaaaa'] },
  battery: { kind: 'green', rows: ['.aaa.', 'a...a', 'aaaa.', 'a...a', '.aaa.'] },
  shield: { kind: 'blue', rows: ['.aaa.', 'aaaaa', 'aaaaa', '.aaa.', '..a..'] },
  snow: { kind: 'blue', rows: ['..a..', 'a.a.a', '.aaa.', 'a.a.a', '..a..'] },
  tear: { kind: 'blue', rows: ['..a..', '.aba.', '..a..', '.....', '.....'] },
  mic: { kind: 'neutral', rows: ['..a..', '..a..', '.aaa.', '..b..', '..b..'] },
  spark: { kind: 'gold', rows: ['..a..', 'a.a.a', '.aaa.', 'a.a.a', '..a..'] },
  clipboard: { kind: 'neutral', rows: ['.aaa.', 'abbba', 'abbba', 'abbba', '.aaa.'] },
  sprout: { kind: 'green', rows: ['..a..', '.aba.', '..a..', '.b.b.', 'b...b'] },
  ghost: { kind: 'neutral', rows: ['.aaa.', 'a...a', 'aaaaa', 'a.a.a', '.....'] },
  speech: { kind: 'alert', rows: ['aaaaa', 'a...a', 'aaaaa', '..a..', '.a...'] },
  stop: { kind: 'alert', rows: ['aaaaa', 'a...a', 'a...a', 'a...a', 'aaaaa'] },
  question: { kind: 'purple', rows: ['.aaa.', 'a...a', '..aa.', '.....', '..a..'] },
  note: { kind: 'neutral', rows: ['aaaaa', 'abbba', 'abbba', 'aaaaa', '..a..'] },
  mug: { kind: 'warm', rows: ['.aaa.', 'a...a', 'aaaaa', 'a...a', '.aaa.'] },
  alarm: { kind: 'alert', rows: ['..a..', '.aaa.', 'aaaaa', '.aaa.', 'a...a'] },
  spotlight: { kind: 'purple', rows: ['a....', 'aa...', 'aaa..', '..bbb', '..bbb'] },
  tag: { kind: 'neutral', rows: ['aaa..', 'a..a.', 'aaa..', '.a...', '..aaa'] },
  star: { kind: 'gold', rows: ['..a..', 'a.a.a', '.aaa.', 'a.a.a', '..a..'] },
  umbrella: { kind: 'blue', rows: ['aaaaa', '.aaa.', '..a..', '..a..', '.a.a.'] },
  lollipop: { kind: 'pink', rows: ['..a..', '.aaa.', '..a..', '..a..', '..a..'] },
  lotus: { kind: 'green', rows: ['a.a.a', '.aaa.', '..a..', '.a.a.', 'a...a'] },
  censor: { kind: 'alert', rows: ['aaaaa', 'ababa', 'aaaaa', '.....', '.....'] },
  heartcrack: { kind: 'pink', rows: ['a.a.a', 'aaaaa', '.aaa.', '..aa.', '..a.a'] },
  loading: { kind: 'neutral', rows: ['aaaaa', '....a', '...a.', '..a..', '.a...'] },
  lever: { kind: 'blue', rows: ['..a..', '..a..', '.bbb.', 'bbbbb', '.....'] },
  book: { kind: 'purple', rows: ['a...a', 'aaaaa', 'abbba', 'abbba', 'aaaaa'] },
  rose: { kind: 'pink', rows: ['..a..', '.aaa.', '..a..', '.aba.', 'a...a'] },
  photo: { kind: 'neutral', rows: ['aaaaa', 'ab..a', 'a..ba', 'a...a', 'aaaaa'] },
  medkit: { kind: 'alert', rows: ['.aaa.', 'a...a', 'aa.aa', 'a...a', '.aaa.'] },
  armor: { kind: 'gold', rows: ['.aaa.', 'aaaaa', 'aa.aa', 'aaaaa', '.a.a.'] },
  smoke: { kind: 'neutral', rows: ['..a..', '.aaa.', 'aa.aa', '.aaa.', '..a..'] },
  arrow: { kind: 'warm', rows: ['..a..', '.aa..', 'aaaaa', '.aa..', '..a..'] },
  weather: { kind: 'blue', rows: ['.aaa.', 'aaaaa', '.....', '.a.a.', 'a.a..'] },
  stars: { kind: 'gold', rows: ['a...a', '..a..', '.a.a.', '..a..', 'a...a'] },
  drink: { kind: 'blue', rows: ['.aaa.', 'a...a', 'a...a', 'aaaaa', '..a..'] },
  rocket: { kind: 'alert', rows: ['..a..', '.aaa.', 'aaaaa', '..a..', '.a.a.'] },
  dodge: { kind: 'neutral', rows: ['a....', '.aa..', '..aa.', '...aa', '....a'] },
  candy: { kind: 'pink', rows: ['a...a', '.aaa.', 'aaaaa', '.aaa.', 'a...a'] },
  scratch: { kind: 'alert', rows: ['a.a.a', '.a.a.', 'a.a.a', '.a.a.', 'a.a.a'] },
  knot: { kind: 'purple', rows: ['a...a', '.a.a.', '..a..', '.a.a.', 'a...a'] },
  firework: { kind: 'gold', rows: ['a.a.a', '.aaa.', 'a.a.a', '..a..', '..a..'] },
  crack: { kind: 'neutral', rows: ['a....', '.a...', '..a..', '...a.', '....a'] },
  smilemask: { kind: 'warm', rows: ['.aaa.', 'a...a', 'aa.aa', 'a...a', '.aaa.'] },
  thought: { kind: 'neutral', rows: ['.aaa.', 'aaaaa', '.aaa.', '..a..', '.a...'] },
  weight: { kind: 'neutral', rows: ['.aaa.', 'aaaaa', 'a...a', 'a...a', 'aaaaa'] },
  megaphone: { kind: 'warm', rows: ['..aa.', '..aaa', 'aaaa.', '..aaa', '..aa.'] },
  gift: { kind: 'pink', rows: ['a.a.a', 'aaaaa', '.aaa.', 'aaaaa', 'a...a'] },
  dice: { kind: 'gold', rows: ['aaaaa', 'a.a.a', 'a...a', 'a.a.a', 'aaaaa'] },
  scale: { kind: 'gold', rows: ['..a..', '.aaa.', 'aaaaa', 'a.a.a', 'a.a.a'] },
  mute: { kind: 'blue', rows: ['a...a', '.a.a.', '..a..', '.a.a.', 'a...a'] },
  magnet: { kind: 'alert', rows: ['a...a', 'a...a', 'aaaaa', '.a.a.', '.....'] },
  laugh: { kind: 'warm', rows: ['a...a', '.....', 'aaaaa', '.....', 'a...a'] },
  extinguisher: { kind: 'alert', rows: ['.aa..', '.aaa.', '..aa.', '..aa.', '.aaa.'] },
  fog: { kind: 'neutral', rows: ['aaaaa', '.....', '.aaa.', '.....', 'aaaaa'] },
  revive: { kind: 'green', rows: ['..a..', '.aaa.', 'a.a.a', '..a..', '..a..'] },
}

const accessoryPatterns = {
  glasses: { x: 13, y: 8, kind: 'neutral', rows: ['aa.aa', 'a...a', 'aa.aa'] },
  crown: { x: 13, y: 1, kind: 'gold', rows: ['a.a.a', 'aaaaa', '.aaa.'] },
  clip: { x: 18, y: 4, kind: 'pink', rows: ['aa', '.a'] },
  bandage: { x: 17, y: 4, kind: 'gold', rows: ['aaa', '.b.'] },
  blush: { x: 13, y: 10, kind: 'pink', rows: ['a...a'] },
  brow: { x: 13, y: 7, kind: 'neutral', rows: ['aa.aa'] },
  star: { x: 19, y: 3, kind: 'gold', rows: ['.a.', 'aaa', '.a.'] },
  sweat: { x: 20, y: 8, kind: 'blue', rows: ['a', 'a'] },
  headband: { x: 12, y: 6, kind: 'alert', rows: ['aaaaaaaa'] },
  headphones: { x: 11, y: 6, kind: 'blue', rows: ['a......a', 'aa....aa'] },
  visor: { x: 12, y: 8, kind: 'blue', rows: ['aaaaaaaa', '.bbbbbb.'] },
  helmet: { x: 11, y: 2, kind: 'neutral', rows: ['..aaaa..', '.aaaaaa.', 'aaaaaaaa', 'aa....aa'] },
  earpiece: { x: 19, y: 10, kind: 'neutral', rows: ['a', 'a', 'a'] },
  none: null,
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

function rect(x, y, width, height, fill, opacity = 1) {
  return `<rect x="${x * CELL}" y="${y * CELL}" width="${width * CELL}" height="${height * CELL}" fill="${fill}" opacity="${opacity}" shape-rendering="crispEdges" />`
}

function drawPattern(x, y, rows, palette) {
  const parts = []

  rows.forEach((row, rowIndex) => {
    row.split('').forEach((char, columnIndex) => {
      if (char === '.') {
        return
      }

      const fill = palette[char] ?? palette.a
      parts.push(rect(x + columnIndex, y + rowIndex, 1, 1, fill))
    })
  })

  return parts.join('')
}

function shadedRect(x, y, width, height, palette, bottomColor = palette.shadow) {
  const parts = [rect(x, y, width, height, palette.base)]

  if (width > 1) {
    parts.push(rect(x, y, 1, height, palette.shadow))
    parts.push(rect(x + width - 1, y, 1, height, palette.light ?? palette.base))
  }

  if (height > 1) {
    parts.push(rect(x + 1, y + height - 1, Math.max(width - 2, 0), 1, bottomColor))
  }

  return parts.join('')
}

function buildSpec(code) {
  const seed = hashCode(code)
  const family = codeFamilyMap[code] ?? 'lowkey'
  const defaults = familyStyles[family] ?? familyStyles.lowkey
  const profile = codeProfiles[code] ?? {}

  return {
    code,
    family,
    theme: pick(themePalettes, seed, 2),
    skin: pick(skinPalettes, seed, 3),
    hair: pick(hairPalettes, seed, 4),
    outfit: pick(outfitPalettes, seed, 5),
    propSide: seed % 2 === 0 ? 'right' : 'left',
    ...defaults,
    ...profile,
  }
}

function getPropPalette(kind, spec) {
  const base = propPaletteByKind[kind] ?? propPaletteByKind.neutral

  return {
    a: base.a,
    b: base.b,
    c: base.c,
    d: spec.theme.sparkle,
  }
}

function getHairPattern(style) {
  const patterns = {
    messy: ['..ccccc..', '.bbbbbbb.', 'aaaaaaaaa', 'aa.....aa', '.a.....a.'],
    side: ['..ccccc..', '.bbbbbbb.', 'aaaaaaaaa', 'a......aa', '.a.....a.'],
    crop: ['..ccccc..', '.bbbbbbb.', '.aaaaaaa.', '.a.....a.'],
    bob: ['..ccccc..', '.bbbbbbb.', 'aaaaaaaaa', 'aa.....aa', 'aa.....aa'],
    wave: ['..ccccc..', '.bbbbbbb.', 'aaaaaaaaa', 'aa.....aa', 'a.a...a.a'],
    spike: ['..c.c.c..', '.bbbbbbb.', 'aaaaaaaaa', '.a.....a.'],
    slick: ['...ccccc.', '.bbbbbbb.', 'aaaaaaaaa', '.a.....a.'],
    bun: ['....a.....', '...ccc....', '..bbbb....', '.aaaaaaaa.', 'aa.....aa.'],
    hood: ['..bbbbbb..', '.baaaaaab.', 'ba......ab', 'ba......ab', '.baaaaaab.'],
    lift: ['...cc.....', '..bbbbc...', '.aaaaaaaa.', 'aa.....aa.', '.a.....a..'],
  }

  return patterns[style] ?? patterns.crop
}

function getFacePattern(expression) {
  const patterns = {
    flat: { eyes: ['a...a'], mouth: ['.aaa.'] },
    soft: { eyes: ['a...a'], mouth: ['aa.aa'] },
    tired: { eyes: ['aa.aa'], mouth: ['.aaa.'] },
    tense: { brows: ['aa.aa'], eyes: ['a...a'], mouth: ['aaaaa'] },
    open: { eyes: ['a...a'], mouth: ['.aba.'] },
    sharp: { brows: ['aa.aa'], eyes: ['a...a'], mouth: ['aaaa.'] },
    smirk: { eyes: ['a...a'], mouth: ['..aaa'] },
    calm: { eyes: ['aa.aa'], mouth: ['a...a'] },
    smile: { eyes: ['a...a'], mouth: ['aa.aa'] },
  }

  return patterns[expression] ?? patterns.soft
}

function getPoseLayout(pose) {
  const layouts = {
    idle: {
      headX: 12,
      headY: 4,
      bodyX: 12,
      bodyY: 12,
      leftArm: [[10, 12, 2, 8]],
      rightArm: [[20, 12, 2, 8]],
      leftLeg: [[13, 20, 3, 8]],
      rightLeg: [[16, 20, 3, 8]],
      hands: { left: [10, 18], right: [20, 18] },
    },
    slouch: {
      headX: 12,
      headY: 5,
      bodyX: 12,
      bodyY: 13,
      leftArm: [[10, 13, 2, 7]],
      rightArm: [[20, 14, 2, 6]],
      leftLeg: [[13, 21, 3, 7]],
      rightLeg: [[16, 21, 3, 7]],
      hands: { left: [10, 19], right: [20, 19] },
    },
    open: {
      headX: 12,
      headY: 4,
      bodyX: 12,
      bodyY: 12,
      leftArm: [[8, 13, 2, 6], [10, 12, 2, 1]],
      rightArm: [[22, 13, 2, 6], [20, 12, 2, 1]],
      leftLeg: [[13, 20, 3, 8]],
      rightLeg: [[16, 20, 3, 8]],
      hands: { left: [8, 18], right: [22, 18] },
    },
    guard: {
      headX: 12,
      headY: 4,
      bodyX: 12,
      bodyY: 12,
      leftArm: [[10, 14, 2, 4], [12, 15, 4, 2]],
      rightArm: [[20, 14, 2, 4], [16, 16, 4, 2]],
      leftLeg: [[13, 20, 3, 8]],
      rightLeg: [[16, 20, 3, 8]],
      hands: { left: [15, 15], right: [15, 17] },
    },
    wave: {
      headX: 12,
      headY: 4,
      bodyX: 12,
      bodyY: 12,
      leftArm: [[10, 12, 2, 8]],
      rightArm: [[21, 8, 2, 8], [20, 8, 1, 2]],
      leftLeg: [[13, 20, 3, 8]],
      rightLeg: [[16, 20, 3, 8]],
      hands: { left: [10, 18], right: [21, 8] },
    },
    command: {
      headX: 12,
      headY: 4,
      bodyX: 12,
      bodyY: 12,
      leftArm: [[10, 12, 2, 8]],
      rightArm: [[20, 12, 2, 4], [18, 15, 2, 2]],
      leftLeg: [[13, 20, 3, 8]],
      rightLeg: [[16, 20, 3, 8]],
      hands: { left: [10, 18], right: [18, 15] },
    },
    stride: {
      headX: 12,
      headY: 4,
      bodyX: 12,
      bodyY: 12,
      leftArm: [[10, 13, 2, 7]],
      rightArm: [[20, 12, 2, 8]],
      leftLeg: [[12, 20, 3, 8]],
      rightLeg: [[17, 19, 3, 9]],
      hands: { left: [10, 18], right: [20, 18] },
    },
    lean: {
      headX: 13,
      headY: 4,
      bodyX: 13,
      bodyY: 12,
      leftArm: [[11, 13, 2, 7]],
      rightArm: [[21, 12, 2, 8]],
      leftLeg: [[14, 20, 3, 8]],
      rightLeg: [[17, 20, 3, 8]],
      hands: { left: [11, 18], right: [21, 18] },
    },
    calm: {
      headX: 12,
      headY: 4,
      bodyX: 12,
      bodyY: 12,
      leftArm: [[11, 13, 1, 6]],
      rightArm: [[20, 13, 1, 6]],
      leftLeg: [[13, 20, 3, 8]],
      rightLeg: [[16, 20, 3, 8]],
      hands: { left: [11, 18], right: [20, 18] },
    },
  }

  return layouts[pose] ?? layouts.idle
}

function renderBackdrop(spec) {
  const { soft, ground, shadow, sparkle } = spec.theme

  return [
    drawPattern(7, 4, ['....a....', '..aaaaa..', '.aaaaaaa.', '..aaaaa..'], { a: soft }),
    drawPattern(20, 6, ['..a..', '.aaa.', '..a..'], { a: sparkle }),
    drawPattern(4, 10, ['.a.a.', '..a..', '.a.a.'], { a: sparkle }),
    rect(6, 27, 20, 1, shadow, 0.8),
    rect(8, 28, 16, 2, ground, 0.95),
  ].join('')
}

function renderHead(spec, layout) {
  return [
    shadedRect(layout.headX, layout.headY + 2, 8, 6, spec.skin, spec.skin.deep),
    rect(layout.headX - 1, layout.headY + 3, 1, 3, spec.skin.shadow),
    rect(layout.headX + 8, layout.headY + 3, 1, 3, spec.skin.light),
  ].join('')
}

function renderHair(spec, layout) {
  const pattern = getHairPattern(spec.hairStyle)
  const palette = spec.hairStyle === 'hood'
    ? { a: spec.outfit.base, b: spec.outfit.shadow, c: spec.outfit.light }
    : { a: spec.hair.base, b: spec.hair.shadow, c: spec.hair.light }

  return drawPattern(layout.headX - 1, layout.headY, pattern, palette)
}

function renderFace(spec, layout) {
  const ink = '#2a2521'
  const features = getFacePattern(spec.expression)
  const parts = []

  if (features.brows) {
    parts.push(drawPattern(layout.headX + 1, layout.headY + 3, features.brows, { a: ink }))
  }

  parts.push(drawPattern(layout.headX + 2, layout.headY + 4, features.eyes, { a: ink }))
  parts.push(drawPattern(layout.headX + 2, layout.headY + 6, features.mouth, { a: ink, b: '#51352d' }))

  return parts.join('')
}

function renderAccessory(spec, layout) {
  const accessory = accessoryPatterns[spec.accessory]

  if (!accessory) {
    return ''
  }

  return drawPattern(accessory.x, accessory.y, accessory.rows, getPropPalette(accessory.kind, spec))
}

function renderTorso(spec, layout) {
  const { bodyX, bodyY } = layout
  const outfit = spec.outfit
  const parts = [shadedRect(bodyX, bodyY, 8, 8, outfit, outfit.shadow)]

  if (spec.outfitStyle === 'hoodie') {
    parts.push(rect(bodyX + 3, bodyY + 1, 1, 4, outfit.accent))
    parts.push(rect(bodyX + 4, bodyY + 1, 1, 4, outfit.accent))
    parts.push(rect(bodyX + 2, bodyY + 5, 4, 2, outfit.light))
  }

  if (spec.outfitStyle === 'cardigan') {
    parts.push(rect(bodyX + 3, bodyY, 1, 8, outfit.accent))
    parts.push(rect(bodyX + 4, bodyY, 1, 8, outfit.accent))
    parts.push(rect(bodyX + 3, bodyY + 2, 2, 1, outfit.shadow))
  }

  if (spec.outfitStyle === 'coat') {
    parts.push(rect(bodyX + 1, bodyY, 1, 8, outfit.light))
    parts.push(rect(bodyX + 6, bodyY, 1, 8, outfit.light))
    parts.push(rect(bodyX + 3, bodyY + 2, 2, 6, outfit.accent))
  }

  if (spec.outfitStyle === 'robe') {
    parts.push(rect(bodyX + 3, bodyY, 2, 8, outfit.accent))
    parts.push(rect(bodyX + 1, bodyY + 4, 6, 1, outfit.light))
  }

  if (spec.outfitStyle === 'blazer') {
    parts.push(rect(bodyX + 1, bodyY + 1, 2, 3, outfit.accent))
    parts.push(rect(bodyX + 5, bodyY + 1, 2, 3, outfit.accent))
    parts.push(rect(bodyX + 3, bodyY + 2, 2, 3, '#e8d9cc'))
  }

  if (spec.outfitStyle === 'jacket') {
    parts.push(rect(bodyX + 1, bodyY + 1, 1, 6, outfit.accent))
    parts.push(rect(bodyX + 6, bodyY + 1, 1, 6, outfit.accent))
  }

  if (spec.outfitStyle === 'vest') {
    parts.push(rect(bodyX + 2, bodyY + 1, 4, 3, outfit.accent))
    parts.push(rect(bodyX + 2, bodyY + 5, 4, 1, outfit.light))
  }

  if (spec.outfitStyle === 'tee') {
    parts.push(rect(bodyX, bodyY + 1, 8, 1, outfit.accent))
  }

  if (spec.outfitStyle === 'sweater') {
    parts.push(rect(bodyX + 1, bodyY + 3, 6, 1, outfit.accent))
  }

  if (spec.outfitStyle === 'armor') {
    parts.push(rect(bodyX - 1, bodyY + 1, 2, 3, outfit.light))
    parts.push(rect(bodyX + 7, bodyY + 1, 2, 3, outfit.light))
    parts.push(rect(bodyX + 2, bodyY + 2, 4, 3, outfit.accent))
    parts.push(rect(bodyX + 3, bodyY + 5, 2, 2, outfit.light))
  }

  return parts.join('')
}

function renderLimbSegments(segments, palette) {
  return segments
    .map(([x, y, width, height]) => shadedRect(x, y, width, height, palette, palette.shadow))
    .join('')
}

function renderHands(layout, skin) {
  return [
    rect(layout.hands.left[0], layout.hands.left[1], 2, 2, skin.base),
    rect(layout.hands.right[0], layout.hands.right[1], 2, 2, skin.base),
  ].join('')
}

function renderLegs(layout, outfit) {
  return [
    renderLimbSegments(layout.leftLeg, outfit),
    renderLimbSegments(layout.rightLeg, outfit),
    rect(layout.leftLeg[0][0], layout.leftLeg[0][1] + layout.leftLeg[0][3], 3, 1, '#2a2521'),
    rect(layout.rightLeg[0][0], layout.rightLeg[0][1] + layout.rightLeg[0][3], 3, 1, '#2a2521'),
  ].join('')
}

function renderArms(layout, outfit) {
  return renderLimbSegments(layout.leftArm, outfit) + renderLimbSegments(layout.rightArm, outfit)
}

function renderProp(spec, layout) {
  const prop = propPatterns[spec.prop]

  if (!prop) {
    return ''
  }

  const x = spec.propSide === 'left' ? 3 : 24
  const y = spec.propSide === 'left' ? 12 : 11

  return [
    drawPattern(x + 1, y + 1, prop.rows, { a: 'rgba(44, 35, 29, 0.12)', b: 'rgba(44, 35, 29, 0.12)', c: 'rgba(44, 35, 29, 0.12)' }),
    drawPattern(x, y, prop.rows, getPropPalette(prop.kind, spec)),
  ].join('')
}

function buildSvg(spec) {
  const layout = getPoseLayout(spec.pose)

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${VIEWBOX} ${VIEWBOX}" role="img" aria-hidden="true">
      ${renderBackdrop(spec)}
      <g transform="translate(-18 -14) scale(1.18)">
        ${renderProp(spec, layout)}
        ${renderHead(spec, layout)}
        ${renderHair(spec, layout)}
        ${renderFace(spec, layout)}
        ${renderAccessory(spec, layout)}
        ${renderTorso(spec, layout)}
        ${renderArms(layout, spec.outfit)}
        ${renderHands(layout, spec.skin)}
        ${renderLegs(layout, spec.outfit)}
      </g>
    </svg>
  `
}

function toDataUri(svg) {
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg.replace(/\s+/g, ' ').trim())}`
}

const cache = new Map()

export function getCharacterArt(code, name = '') {
  if (!cache.has(code)) {
    const spec = buildSpec(code)
    cache.set(code, {
      src: toDataUri(buildSvg(spec)),
      alt: `${name || code} 的像素方块角色造型`,
      theme: {
        accent: spec.theme.accent,
        soft: spec.theme.soft,
        deep: spec.theme.deep,
      },
    })
  }

  return cache.get(code)
}
