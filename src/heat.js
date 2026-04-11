const GITHUB_ISSUES_API = 'https://api.github.com/repos/Lengzhe1984/mood-atlas/issues'
const HEAT_TITLE_PREFIX = 'Atlas Heat:'
const CACHE_KEY = 'atlas-heat-cache-v2'
const CACHE_TTL = 1000 * 60 * 5

function safeReadJson(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function safeWriteJson(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Ignore storage write failures in the browser.
  }
}

async function requestJson(url) {
  const response = await fetch(url, {
    headers: {
      Accept: 'application/vnd.github+json',
    },
  })

  if (!response.ok) {
    throw new Error(`GitHub request failed: ${response.status}`)
  }

  return response.json()
}

function buildIssuesUrl(page) {
  const url = new URL(GITHUB_ISSUES_API)
  url.searchParams.set('state', 'all')
  url.searchParams.set('per_page', '100')
  url.searchParams.set('page', String(page))
  return url.toString()
}

function extractHeatCode(issue) {
  const title = String(issue?.title ?? '')
  const match = title.match(/Atlas Heat:\s*([A-Z0-9]+)/i)
  return match ? match[1].toUpperCase() : null
}

export function buildHeatSubmissionUrl(result, payload = {}) {
  const params = new URLSearchParams({
    title: `${HEAT_TITLE_PREFIX} ${result.code}`,
    body: [
      `code: ${result.code}`,
      `name: ${result.name}`,
      `english_name: ${result.englishName}`,
      `index: ${payload.index ?? ''}`,
      `binary_index: ${payload.binaryIndex ?? ''}`,
      'source: atlas-web',
    ].join('\n'),
  })

  return `https://github.com/Lengzhe1984/mood-atlas/issues/new?${params.toString()}`
}

export function readHeatCache() {
  const cache = safeReadJson(CACHE_KEY, null)

  if (!cache || !Array.isArray(cache.entries) || !Number.isFinite(cache.updatedAt)) {
    return null
  }

  if (Date.now() - cache.updatedAt > CACHE_TTL) {
    return null
  }

  return cache
}

export function writeHeatCache(payload) {
  safeWriteJson(CACHE_KEY, payload)
}

export function sortHeatEntries(entries) {
  return [...entries].sort((left, right) => right.count - left.count || left.index - right.index)
}

export async function fetchHeatBoard(results) {
  const issues = []
  let page = 1

  while (true) {
    const batch = await requestJson(buildIssuesUrl(page))

    if (!Array.isArray(batch) || batch.length === 0) {
      break
    }

    issues.push(...batch)

    if (batch.length < 100) {
      break
    }

    page += 1
  }

  const heatCodes = issues.map((issue) => extractHeatCode(issue)).filter(Boolean)
  const countsByCode = heatCodes.reduce((map, code) => {
    map.set(code, (map.get(code) ?? 0) + 1)

    return map
  }, new Map())

  const entries = results.map((result) => ({
    ...result,
    count: countsByCode.get(result.code) ?? 0,
  }))

  return {
    entries: sortHeatEntries(entries),
    totalCount: heatCodes.length,
    updatedAt: Date.now(),
  }
}
