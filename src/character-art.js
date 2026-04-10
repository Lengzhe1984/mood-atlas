const VIEWBOX = 320

const skinPalettes = [
  { base: '#f1d7c7', light: '#f8e7db', shadow: '#dcb9a9', deep: '#c69784' },
  { base: '#e6c2a5', light: '#f0d3bb', shadow: '#c89b7e', deep: '#a57356' },
  { base: '#c89571', light: '#ddb08f', shadow: '#a77150', deep: '#83543a' },
  { base: '#8d6348', light: '#ac7d60', shadow: '#6f4a34', deep: '#593926' },
]

const hairPalettes = [
  { base: '#5d5b43', shadow: '#403f2f', highlight: '#8a8867' },
  { base: '#38312c', shadow: '#231d1a', highlight: '#5a4e47' },
  { base: '#7a6a58', shadow: '#55473c', highlight: '#9b8f80' },
  { base: '#5a465f', shadow: '#382d3b', highlight: '#7d6582' },
  { base: '#496273', shadow: '#2f4350', highlight: '#69879a' },
  { base: '#7a7d52', shadow: '#585a3a', highlight: '#a0a46f' },
]

const outfitPalettes = [
  { base: '#1d2027', light: '#424754', shadow: '#0f1116' },
  { base: '#40566d', light: '#667f98', shadow: '#22313f' },
  { base: '#6d7a86', light: '#98a7b2', shadow: '#4d5964' },
  { base: '#6d5a4b', light: '#9a816c', shadow: '#473a30' },
  { base: '#4d674f', light: '#7a947b', shadow: '#304131' },
  { base: '#6d4e59', light: '#9b7280', shadow: '#4a343c' },
]

const backgroundPalettes = [
  { accent: '#dfe8d7', soft: '#f3f7ef', deep: '#73906c', halo: '#e9f0e3', mist: '#d0dcc7' },
  { accent: '#d8e1ea', soft: '#eff4f9', deep: '#6c8397', halo: '#e5edf5', mist: '#ced9e4' },
  { accent: '#eadfd6', soft: '#faf4ee', deep: '#9a7a68', halo: '#f1e6dc', mist: '#decdbf' },
  { accent: '#e5dde9', soft: '#f6f1f9', deep: '#8b7494', halo: '#ede5f2', mist: '#d9cce1' },
  { accent: '#e4e8d8', soft: '#f7f9ef', deep: '#7f8c60', halo: '#eef2df', mist: '#d8debf' },
]

const familyStyles = {
  lowkey: { faceShape: 'long', hairStyle: 'parted', accessory: 'none', expression: 'flat', bust: 'sweater' },
  giver: { faceShape: 'soft', hairStyle: 'bob', accessory: 'earring', expression: 'soft', bust: 'cardigan' },
  guarded: { faceShape: 'square', hairStyle: 'hooded', accessory: 'none', expression: 'flat', bust: 'coat' },
  overthink: { faceShape: 'narrow', hairStyle: 'parted', accessory: 'glasses', expression: 'tense', bust: 'sweater' },
  night: { faceShape: 'soft', hairStyle: 'wave', accessory: 'none', expression: 'tired', bust: 'hoodie' },
  lowBattery: { faceShape: 'square', hairStyle: 'crop', accessory: 'patch', expression: 'tired', bust: 'hoodie' },
  resilient: { faceShape: 'diamond', hairStyle: 'lift', accessory: 'patch', expression: 'smile', bust: 'jacket' },
  heavy: { faceShape: 'square', hairStyle: 'crop', accessory: 'none', expression: 'flat', bust: 'coat' },
  loud: { faceShape: 'diamond', hairStyle: 'spike', accessory: 'none', expression: 'open', bust: 'tee' },
  driver: { faceShape: 'square', hairStyle: 'slick', accessory: 'earpiece', expression: 'sharp', bust: 'blazer' },
  boundary: { faceShape: 'square', hairStyle: 'bun', accessory: 'glasses', expression: 'flat', bust: 'jacket' },
  direct: { faceShape: 'long', hairStyle: 'crop', accessory: 'brow', expression: 'smirk', bust: 'jacket' },
  heart: { faceShape: 'soft', hairStyle: 'wave', accessory: 'clip', expression: 'soft', bust: 'cardigan' },
  spirit: { faceShape: 'long', hairStyle: 'bun', accessory: 'none', expression: 'calm', bust: 'robe' },
  glow: { faceShape: 'soft', hairStyle: 'wave', accessory: 'clip', expression: 'smile', bust: 'vest' },
  alarm: { faceShape: 'diamond', hairStyle: 'messy', accessory: 'brow', expression: 'open', bust: 'hoodie' },
  soft: { faceShape: 'soft', hairStyle: 'bob', accessory: 'earring', expression: 'soft', bust: 'cardigan' },
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

function polygon(points, fill, opacity = 1) {
  return `<polygon points="${points}" fill="${fill}" opacity="${opacity}" />`
}

function filledPath(d, fill, opacity = 1) {
  return `<path d="${d}" fill="${fill}" opacity="${opacity}" />`
}

function line(x1, y1, x2, y2, stroke, width = 4) {
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="${width}" stroke-linecap="round" />`
}

function ellipse(cx, cy, rx, ry, fill, opacity = 1) {
  return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${fill}" opacity="${opacity}" />`
}

function circle(cx, cy, r, fill, opacity = 1) {
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" opacity="${opacity}" />`
}

function outlinedRect(x, y, width, height, stroke, fill = 'none', radius = 4) {
  return `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${radius}" ry="${radius}" fill="${fill}" stroke="${stroke}" stroke-width="4" />`
}

function buildSpec(code) {
  const seed = hashCode(code)
  const family = codeFamilyMap[code] ?? 'lowkey'
  const familyStyle = familyStyles[family]
  const background = pick(backgroundPalettes, seed, 1)

  return {
    code,
    family,
    background,
    skin: pick(skinPalettes, seed, 2),
    hair: pick(hairPalettes, seed, 4),
    outfit: pick(outfitPalettes, seed, 6),
    ...familyStyle,
  }
}

function renderBackdrop(spec) {
  const { accent, soft, deep, halo, mist } = spec.background

  return [
    ellipse(160, 182, 108, 102, halo, 0.95),
    polygon('56,230 100,102 174,88 134,260', mist, 0.58),
    polygon('196,88 256,102 272,248 204,260', accent, 0.58),
    ellipse(160, 292, 86, 14, 'rgba(54, 48, 44, 0.12)', 1),
    line(72, 86, 248, 86, deep, 2),
  ].join('')
}

function renderBody(spec) {
  const { base, light, shadow } = spec.outfit
  const parts = [
    polygon('58,320 86,260 136,230 188,230 236,260 262,320', shadow),
    polygon('86,258 136,230 188,230 236,258 218,320 104,320', base),
    polygon('138,230 160,250 184,230 198,320 124,320', light, 0.96),
    polygon('104,320 132,238 160,250 138,320', shadow, 0.48),
    polygon('182,236 216,320 198,320 160,250', shadow, 0.56),
  ]

  if (spec.bust === 'hoodie') {
    parts.push(polygon('116,238 140,226 160,254 142,320 122,320', light, 0.92))
    parts.push(polygon('182,226 206,238 196,320 178,320 160,254', light, 0.92))
    parts.push(line(150, 248, 146, 280, light, 4), line(170, 248, 174, 280, light, 4))
  }

  if (spec.bust === 'cardigan' || spec.bust === 'blazer') {
    parts.push(polygon('136,230 152,252 142,320 126,320', light, 0.96))
    parts.push(polygon('184,230 176,252 194,320 178,320', light, 0.96))
  }

  if (spec.bust === 'coat') {
    parts.push(polygon('126,224 146,252 138,320 112,320 98,270', light, 0.96))
    parts.push(polygon('194,224 176,252 186,320 212,320 224,270', light, 0.96))
  }

  if (spec.bust === 'robe') {
    parts.push(polygon('142,230 160,258 178,230 176,320 144,320', '#ebe8e0', 0.92))
  }

  if (spec.bust === 'vest') {
    parts.push(polygon('128,242 160,232 192,242 184,320 136,320', light, 0.9))
  }

  if (spec.bust === 'tee') {
    parts.push(polygon('92,266 122,240 122,282 110,320 82,320', light, 0.5))
    parts.push(polygon('228,266 198,240 198,282 210,320 238,320', light, 0.5))
  }

  return parts.join('')
}

function renderFace(spec) {
  const { base, light, shadow, deep } = spec.skin
  const templates = {
    square: {
      outline: 'M126 88 L198 90 L220 122 L214 188 L160 232 L110 206 L102 128 Z',
      left: '126,88 104,130 110,206 156,170 166,98',
      center: '126,88 198,90 194,160 156,170 166,98',
      right: '198,90 220,122 214,188 194,160',
      chin: '110,206 156,170 194,160 214,188 160,232',
      leftEar: '96,134 104,128 108,166 96,160',
      rightEar: '218,132 228,140 222,172 212,164',
      neckLeft: '146,220 160,212 158,248 138,248',
      neckRight: '160,212 178,214 184,248 158,248',
    },
    soft: {
      outline: 'M130 90 L194 90 L214 120 L210 184 L160 228 L114 202 L108 126 Z',
      left: '130,90 108,126 114,202 156,168 166,100',
      center: '130,90 194,90 190,158 156,168 166,100',
      right: '194,90 214,120 210,184 190,158',
      chin: '114,202 156,168 190,158 210,184 160,228',
      leftEar: '102,134 110,130 112,164 102,158',
      rightEar: '210,132 220,140 216,168 206,160',
      neckLeft: '146,216 160,210 158,248 140,248',
      neckRight: '160,210 176,214 182,248 158,248',
    },
    diamond: {
      outline: 'M138 86 L190 90 L218 124 L210 180 L160 236 L112 204 L106 128 Z',
      left: '138,86 106,128 112,204 156,166 164,98',
      center: '138,86 190,90 190,156 156,166 164,98',
      right: '190,90 218,124 210,180 190,156',
      chin: '112,204 156,166 190,156 210,180 160,236',
      leftEar: '100,136 108,130 110,164 100,158',
      rightEar: '214,132 224,142 218,170 208,160',
      neckLeft: '146,222 160,214 158,248 138,248',
      neckRight: '160,214 176,216 184,248 158,248',
    },
    narrow: {
      outline: 'M134 86 L192 88 L212 120 L206 194 L160 236 L118 208 L110 126 Z',
      left: '134,86 110,126 118,208 156,176 166,96',
      center: '134,86 192,88 190,164 156,176 166,96',
      right: '192,88 212,120 206,194 190,164',
      chin: '118,208 156,176 190,164 206,194 160,236',
      leftEar: '104,136 110,130 114,168 104,162',
      rightEar: '208,134 218,142 214,174 204,166',
      neckLeft: '148,224 160,216 158,248 140,248',
      neckRight: '160,216 174,218 180,248 158,248',
    },
  }

  const t = templates[spec.faceShape] ?? templates.soft

  return [
    polygon(t.leftEar, shadow, 0.95),
    polygon(t.rightEar, shadow, 0.95),
    polygon(t.left, light),
    polygon(t.center, base),
    polygon(t.right, shadow),
    polygon(t.chin, deep, 0.42),
    polygon(t.neckLeft, shadow),
    polygon(t.neckRight, base),
  ].join('')
}

function renderHair(spec) {
  const { base, shadow, highlight } = spec.hair
  const styles = {
    crop: [
      polygon('120,82 188,84 206,112 118,114 108,96', base),
      polygon('120,82 160,74 162,104 126,112 112,98', shadow),
      polygon('160,76 194,82 198,104 170,100', highlight),
    ],
    parted: [
      polygon('128,80 198,84 208,110 178,112 150,102 118,112 112,96', base),
      polygon('130,80 158,74 154,104 124,112 112,98', shadow),
      polygon('162,74 198,82 206,104 170,100', highlight),
    ],
    bob: [
      polygon('126,82 194,86 210,118 204,170 194,166 186,110 136,110 126,170 114,166 110,116', base),
      polygon('126,82 164,76 160,108 138,110 118,102', shadow),
      polygon('164,76 196,84 202,104 176,102', highlight),
    ],
    wave: [
      polygon('124,82 196,84 210,118 198,124 188,112 158,104 126,112 112,122 108,110', base),
      polygon('124,82 156,76 152,104 132,110 116,100', shadow),
      polygon('164,78 194,84 204,102 178,100', highlight),
      polygon('112,122 126,112 128,162 116,170', base, 0.96),
      polygon('188,112 204,124 198,166 186,162', base, 0.96),
    ],
    spike: [
      polygon('118,88 136,66 154,84 174,62 194,88 206,116 118,114', base),
      polygon('118,88 136,66 144,92 126,112', shadow),
      polygon('174,62 194,88 198,104 176,98', highlight),
    ],
    slick: [
      polygon('122,84 204,90 210,112 160,106 126,116 114,100', base),
      polygon('122,84 172,74 170,102 128,110 116,98', shadow),
      polygon('174,78 206,88 208,104 182,100', highlight),
    ],
    bun: [
      circle(174, 70, 14, base),
      polygon('124,84 194,88 204,114 134,116 114,104', base),
      polygon('126,84 154,76 150,106 132,114 118,102', shadow),
      polygon('160,78 192,88 198,104 172,100', highlight),
    ],
    lift: [
      polygon('122,88 136,68 166,70 196,82 206,112 122,114', base),
      polygon('122,88 140,68 154,92 130,112', shadow),
      polygon('164,72 194,82 200,104 174,100', highlight),
    ],
    messy: [
      polygon('120,86 138,72 162,80 178,68 198,86 208,118 122,114', base),
      polygon('120,86 140,72 150,94 128,112', shadow),
      polygon('170,70 198,86 202,104 178,98', highlight),
    ],
    hooded: [
      polygon('112,102 126,80 196,82 210,104 206,158 196,144 186,108 134,110 124,148 114,158', base),
      polygon('124,82 160,76 156,106 132,110 116,102', shadow),
      polygon('162,76 194,82 202,100 176,98', highlight),
    ],
  }

  return (styles[spec.hairStyle] ?? styles.crop).join('')
}

function renderFeatures(spec) {
  const ink = '#2a2521'
  const parts = []
  const eyeY = spec.faceShape === 'narrow' ? 150 : 146
  const mouthY = spec.faceShape === 'narrow' ? 194 : 188

  const expressions = {
    flat: () => {
      parts.push(line(136, eyeY, 148, eyeY, ink, 4), line(174, eyeY, 186, eyeY, ink, 4), line(146, mouthY, 176, mouthY, ink, 4))
    },
    soft: () => {
      parts.push(line(136, eyeY, 148, eyeY + 1, ink, 4), line(174, eyeY + 1, 186, eyeY, ink, 4), line(146, mouthY, 160, mouthY + 4, ink, 4), line(160, mouthY + 4, 176, mouthY, ink, 4))
    },
    tired: () => {
      parts.push(line(134, eyeY + 2, 148, eyeY, ink, 4), line(174, eyeY, 188, eyeY + 2, ink, 4), line(148, mouthY + 2, 176, mouthY + 2, ink, 4))
    },
    tense: () => {
      parts.push(line(132, eyeY - 8, 146, eyeY - 4, ink, 4), line(176, eyeY - 4, 190, eyeY - 8, ink, 4), line(136, eyeY, 148, eyeY + 1, ink, 4), line(174, eyeY + 1, 186, eyeY, ink, 4), line(146, mouthY + 2, 176, mouthY, ink, 4))
    },
    open: () => {
      parts.push(circle(142, eyeY + 2, 4, ink), circle(180, eyeY + 2, 4, ink), outlinedRect(148, mouthY - 2, 26, 18, ink, '#3f2d26', 6))
    },
    sharp: () => {
      parts.push(line(132, eyeY - 8, 148, eyeY - 4, ink, 4), line(172, eyeY - 4, 188, eyeY - 8, ink, 4), line(136, eyeY, 148, eyeY + 1, ink, 4), line(174, eyeY + 1, 186, eyeY, ink, 4), line(146, mouthY, 176, mouthY + 1, ink, 4))
    },
    smirk: () => {
      parts.push(line(136, eyeY, 148, eyeY + 1, ink, 4), line(174, eyeY + 1, 186, eyeY, ink, 4), line(146, mouthY + 2, 162, mouthY + 2, ink, 4), line(162, mouthY + 2, 178, mouthY - 2, ink, 4))
    },
    calm: () => {
      parts.push(line(134, eyeY + 1, 148, eyeY + 3, ink, 4), line(174, eyeY + 3, 188, eyeY + 1, ink, 4), line(148, mouthY, 174, mouthY, ink, 4))
    },
    smile: () => {
      parts.push(line(136, eyeY, 148, eyeY + 1, ink, 4), line(174, eyeY + 1, 186, eyeY, ink, 4), line(146, mouthY, 160, mouthY + 6, ink, 4), line(160, mouthY + 6, 176, mouthY, ink, 4))
    },
  }

  ;(expressions[spec.expression] ?? expressions.soft)()

  parts.push(polygon('156,154 164,154 168,176 160,184 152,176', spec.skin.shadow, 0.66))

  return parts.join('')
}

function renderAccessory(spec) {
  const ink = '#2a2521'
  const soft = '#d7dbe0'
  const accessories = {
    glasses: [
      outlinedRect(126, 136, 28, 18, ink, 'none', 5),
      outlinedRect(166, 136, 28, 18, ink, 'none', 5),
      line(154, 145, 166, 145, ink, 4),
    ],
    earring: [circle(106, 170, 4, '#d0b06b')],
    patch: [filledPath('M188 176 L204 176 L200 188 L184 188 Z', '#efe2a6'), line(188, 180, 200, 184, '#c5aa5f', 2)],
    earpiece: [circle(206, 158, 4, soft), line(206, 162, 200, 184, soft, 3)],
    brow: [line(134, 136, 150, 134, ink, 4), line(170, 134, 186, 136, ink, 4)],
    clip: [filledPath('M194 108 L210 108 L204 126 L188 126 Z', '#e1b899')],
    none: [],
  }

  return (accessories[spec.accessory] ?? []).join('')
}

function buildSvg(spec) {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${VIEWBOX} ${VIEWBOX}" role="img" aria-hidden="true">
      ${renderBackdrop(spec)}
      ${renderBody(spec)}
      ${renderFace(spec)}
      ${renderHair(spec)}
      ${renderFeatures(spec)}
      ${renderAccessory(spec)}
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
      alt: `${name || code} 的几何插画人物造型`,
      theme: {
        accent: spec.background.accent,
        soft: spec.background.soft,
        deep: spec.background.deep,
      },
    })
  }

  return cache.get(code)
}
