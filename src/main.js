import './style.css'
import { appMeta } from './app-meta.js'
import { getCharacterArt } from './character-art.js'
import { buildHeatSubmissionUrl, fetchHeatBoard, readHeatCache, sortHeatEntries, writeHeatCache } from './heat.js'
import { answerOptions, axisSections, quizQuestions, totalQuestions } from './quiz-data.js'
import { indexedResults } from './results.js'
import { getAnsweredCount, getFinalResult, isQuizComplete } from './scoring.js'

const app = document.querySelector('#app')

const answerLabelByValue = Object.fromEntries(answerOptions.map((option) => [option.value, option.label]))
const quizHelperTips = [
  '选最像你的直觉，不需要想标准答案。',
  '每题都用 1 到 5 分量表，系统会自动完成计分。',
  '如果你中途停下，再回来时这一页还能继续补答。',
]

const navItems = [
  { view: 'types', label: '人格类型' },
  { view: 'rankings', label: '人格排行榜' },
  { view: 'about', label: '关于测试' },
  { view: 'quiz', label: '开始测试' },
]

const aboutSteps = [
  {
    step: 'Step 1',
    title: '48 道题先按直觉作答',
    body: '每题都只做 1 到 5 分判断，不用背人格理论，也不用把自己硬往一个标签里塞。',
  },
  {
    step: 'Step 2',
    title: '系统会先整理 6 个核心维度',
    body: '它会综合你在表达、关系、行动和情绪上的回答方式，再判断你更靠近哪一类反应组合。',
  },
  {
    step: 'Step 3',
    title: '最后映射成 64 个独立结果',
    body: '结果不是四个字母硬拼出来的，而是先看整体回答，再落到 64 型里最接近的一型，所以每种都能写得更具体。',
  },
]

const state = {
  view: 'home',
  answers: Array(totalQuestions).fill(null),
  previewCode: 'LOOP',
  copyState: 'idle',
  preservedQuizScrollY: null,
  rankingStatus: 'idle',
  rankingEntries: [],
  rankingUpdatedAt: null,
  rankingTotal: 0,
}

let copyResetTimer = null

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function compactText(value, maxLength = 28) {
  const normalized = String(value).replace(/\s+/g, ' ').trim()
  const sentence = normalized.split(/[。！？]/)[0]?.trim() ?? ''
  const candidate = sentence || normalized

  return candidate.length > maxLength ? `${candidate.slice(0, maxLength).trim()}…` : candidate
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

function formatTimeAgo(timestamp) {
  if (!Number.isFinite(timestamp)) {
    return '刚刚更新'
  }

  const diff = Date.now() - timestamp
  const minutes = Math.max(0, Math.round(diff / 60000))

  if (minutes < 1) {
    return '刚刚更新'
  }

  if (minutes < 60) {
    return `${minutes} 分钟前更新`
  }

  const hours = Math.round(minutes / 60)

  if (hours < 24) {
    return `${hours} 小时前更新`
  }

  const days = Math.round(hours / 24)
  return `${days} 天前更新`
}

function getResultByCode(code) {
  return indexedResults.find((result) => result.code === code) ?? indexedResults[0]
}

function getPreviewResult() {
  return getResultByCode(state.previewCode)
}

function getCurrentResultPayload() {
  return isQuizComplete(state.answers) ? getFinalResult(state.answers) : null
}

function getRelatedResults(index) {
  const offsets = [-2, -1, 1, 2]

  return offsets.map((offset) => {
    const nextIndex = (index + offset + indexedResults.length) % indexedResults.length
    return indexedResults[nextIndex]
  })
}

function getShareText(result) {
  return `我测出来是 ${result.code}｜${result.englishName}｜${result.name}\n一句话：${result.verdict}\n朋友式吐槽：${result.friendRoast}\n给我的提醒：${result.reminder}\n#MoodAtlas`
}

function getAxisAnsweredCount(axis) {
  return quizQuestions.reduce((count, question, index) => {
    if (question.axis !== axis) {
      return count
    }

    return Number.isInteger(state.answers[index]) ? count + 1 : count
  }, 0)
}

function getQuestionIndexById(questionId) {
  return quizQuestions.findIndex((question) => question.id === questionId)
}

function scrollToSelector(selector) {
  document.querySelector(selector)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function getHeatCountForCode(code) {
  return state.rankingEntries.find((entry) => entry.code === code)?.count ?? null
}

function seedRankingEntries() {
  return indexedResults.map((result) => ({
    ...result,
    count: getHeatCountForCode(result.code) ?? 0,
  }))
}

function applyRankingPayload(payload) {
  state.rankingEntries = sortHeatEntries(payload.entries)
  state.rankingTotal = payload.totalCount
  state.rankingUpdatedAt = payload.updatedAt
  state.rankingStatus = 'loaded'
  writeHeatCache(payload)
}

async function ensureRankingData(force = false) {
  if (state.rankingStatus === 'loading') {
    return
  }

  if (!force) {
    if (state.rankingStatus === 'loaded' && state.rankingEntries.length) {
      return
    }

    const cached = readHeatCache()

    if (cached) {
      applyRankingPayload(cached)
      render()
      return
    }
  }

  state.rankingStatus = 'loading'
  render()

  try {
    const payload = await fetchHeatBoard(indexedResults)
    applyRankingPayload(payload)
  } catch {
    state.rankingStatus = 'error'
  }

  render()
}

function openHeatSubmission() {
  const payload = getCurrentResultPayload()

  if (!payload) {
    return
  }

  const submissionUrl = buildHeatSubmissionUrl(payload.result, {
    binaryIndex: payload.binaryIndex,
    index: payload.index,
  })

  window.open(submissionUrl, '_blank', 'noopener,noreferrer')
}

function goToView(view, options = {}) {
  const { scroll = true, code = null } = options

  if (view === 'result' && !isQuizComplete(state.answers)) {
    view = 'quiz'
  }

  if (code) {
    state.previewCode = code
  }

  state.view = view
  render()

  if (view === 'rankings') {
    void ensureRankingData()
  }

  if (scroll) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

function openType(code) {
  state.previewCode = code
  state.view = 'types'
  render()
  requestAnimationFrame(() => {
    scrollToSelector('#type-hero')
  })
}

function resetCopyStateSoon() {
  window.clearTimeout(copyResetTimer)
  copyResetTimer = window.setTimeout(() => {
    state.copyState = 'idle'
    render()
  }, 1800)
}

async function copyResultText() {
  if (!isQuizComplete(state.answers)) {
    return
  }

  const { result } = getFinalResult(state.answers)

  try {
    await navigator.clipboard.writeText(getShareText(result))
    state.copyState = 'done'
  } catch {
    state.copyState = 'error'
  }

  resetCopyStateSoon()
  render()
}

function startQuiz() {
  goToView('quiz')
}

function restartQuiz() {
  state.answers = Array(totalQuestions).fill(null)
  state.copyState = 'idle'
  goToView('quiz')
}

function goHome() {
  goToView('home')
}

function showResult() {
  if (!isQuizComplete(state.answers)) {
    jumpToFirstUnanswered()
    return
  }

  goToView('result')
}

function jumpToFirstUnanswered() {
  const firstUnansweredIndex = state.answers.findIndex((answer) => !Number.isInteger(answer))

  if (firstUnansweredIndex === -1) {
    return
  }

  state.view = 'quiz'
  render()
  requestAnimationFrame(() => {
    scrollToSelector(`#question-${quizQuestions[firstUnansweredIndex].id}`)
  })
}

function selectAnswer(questionIndex, value) {
  state.preservedQuizScrollY = window.scrollY
  state.answers[questionIndex] = value
  render()
}

function pickRandomPreview() {
  const pool = indexedResults.filter((result) => result.code !== state.previewCode)
  const next = pool[Math.floor(Math.random() * pool.length)] ?? indexedResults[0]
  state.previewCode = next.code
  render()
}

function renderScaleLegend() {
  return `
    <div class="scale-legend">
      ${answerOptions
        .map(
          (option) => `
            <div class="scale-legend-item">
              <span class="scale-legend-value">${option.value}</span>
              <span>${escapeHtml(option.label)}</span>
            </div>
          `,
        )
        .join('')}
    </div>
  `
}

function getResultConfidence(axisBreakdown) {
  const averageDistance =
    axisBreakdown.reduce((total, item) => total + clamp(Math.abs(item.score - 24) / 16, 0, 1), 0) / axisBreakdown.length

  return Math.round(68 + averageDistance * 28)
}

function getStrongAxisCount(axisBreakdown) {
  return axisBreakdown.filter((item) => Math.abs(item.score - 24) >= 5).length
}

function renderPortraitPosterCard(result, options = {}) {
  const { variant = 'result', lead = '你的人格类型是：', footerText = result.friendRoast } = options
  const art = getCharacterArt(result.code, result.name)
  const imageClass = variant === 'home' ? 'portrait-illustration-home' : 'portrait-illustration-result'

  return `
    <article
      class="reference-card portrait-card portrait-card-${variant}"
      style="--portrait-accent:${escapeHtml(art.theme.accent)}; --portrait-soft:${escapeHtml(art.theme.soft)}; --portrait-deep:${escapeHtml(art.theme.deep)};"
    >
      <p class="portrait-lead">${escapeHtml(lead)}</p>
      <h2 class="portrait-code">${escapeHtml(result.code)}</h2>
      <p class="portrait-tagline">${escapeHtml(result.verdict)}</p>
      <div class="portrait-frame">
        <img class="portrait-illustration ${imageClass}" src="${art.src}" alt="${escapeHtml(art.alt)}" />
      </div>
      <p class="portrait-footer">${escapeHtml(compactText(footerText, variant === 'home' ? 20 : 28))}</p>
    </article>
  `
}

function renderTypeSummaryCard(result, options = {}) {
  const { kicker = '你的主类型', pill = '', body = '', note = '', variant = 'result' } = options

  return `
    <article class="reference-card summary-card summary-card-${variant}">
      <p class="mini-label">${escapeHtml(kicker)}</p>
      <h3>${escapeHtml(result.name)}（${escapeHtml(result.code)}）</h3>
      <p class="summary-english">${escapeHtml(result.englishName)}</p>
      ${pill ? `<div class="summary-pill-row"><span class="summary-pill">${escapeHtml(pill)}</span></div>` : ''}
      ${body ? `<p class="summary-body">${escapeHtml(body)}</p>` : ''}
      ${note ? `<p class="summary-note">${escapeHtml(note)}</p>` : ''}
    </article>
  `
}

function renderHomeScreen() {
  const preview = getPreviewResult()

  return `
    <main class="layout">
      <section class="hero-panel" id="hero">
        <div class="hero-copy">
          <p class="eyebrow">Atlas Personality Test</p>
          <h1>别测 MBTI 了，<br />你这点毛病四个字母装不下。</h1>
          <div class="hero-story">
            <p class="lede story-line">有的人一委屈就先说没事。</p>
            <p class="lede story-line">有的人明明很在意，还要装得像也就那样。还有的人一到晚上，脑子里那些白天没来得及处理的破事，就自动开始排队上播。</p>
            <p class="lede story-line">如果这些你多少沾点，那这套测试大概率不会把你夸成什么高冷神秘天选人格。它更擅长的，是把你那些小别扭、小反应、小毛病，说得很像你。</p>
          </div>

          <div class="stat-row">
            <article class="stat-card">
              <strong>48</strong>
              <span>不用做阅读理解，凭直觉选就行</span>
            </article>
            <article class="stat-card">
              <strong>6</strong>
              <span>从 6 个维度慢慢看你像哪一型</span>
            </article>
            <article class="stat-card">
              <strong>64</strong>
              <span>每一种都比“INFP”具体一点</span>
            </article>
          </div>

          <div class="action-row">
            <button class="primary-btn" data-nav-view="quiz" type="button">开始测试</button>
            <button class="secondary-btn" data-random-preview type="button">随机看一型</button>
          </div>

          <div class="chip-row">
            ${['像素人物卡', '单页答题', '移动端优化', '中英双名']
              .map((item) => `<span class="result-chip">${escapeHtml(item)}</span>`)
              .join('')}
          </div>
        </div>

        <aside class="preview-panel preview-panel-reference">
          ${renderPortraitPosterCard(preview, { variant: 'home', lead: '随机预览这一型：', footerText: preview.friendRoast })}
          ${renderTypeSummaryCard(preview, {
            variant: 'home',
            kicker: '这型预览',
            pill: '随机预览 · 64 型之一',
            body: preview.charm,
            note: `给你的提醒：${preview.reminder}`,
          })}
        </aside>
      </section>

      <section class="mechanics-panel update-panel" id="latest-update">
        <div class="section-heading">
          <p class="eyebrow">Recently Added</p>
          <h2>最近新增</h2>
          <p class="section-copy">最近把人物卡、导航页和热度榜都补得更完整了，直接看重点就行。</p>
        </div>

        <div class="release-log">
          ${appMeta.recentUpdates
            .map(
              (item) => `
                <article class="release-entry">
                  <div class="release-entry-head">
                    <span class="release-version">v${escapeHtml(item.version)}</span>
                    ${item.version === appMeta.version ? '<span class="release-current">最新</span>' : ''}
                  </div>
                  <ul class="release-entry-list">
                    ${item.notes.map((note) => `<li>${escapeHtml(note)}</li>`).join('')}
                  </ul>
                </article>
              `,
            )
            .join('')}
        </div>
      </section>
    </main>
  `
}

function renderTypeCard(result) {
  const isActive = result.code === state.previewCode
  const heatCount = getHeatCountForCode(result.code)

  return `
    <button class="result-card type-browser-card${isActive ? ' is-active' : ''}" type="button" data-open-type="${escapeHtml(result.code)}">
      <div class="result-top">
        <span class="result-code">${escapeHtml(result.code)}</span>
        <span class="result-index">${heatCount !== null ? `${heatCount} 次加入榜单` : escapeHtml(result.englishName)}</span>
      </div>
      <h3 class="result-name">${escapeHtml(result.name)}</h3>
      <p class="result-verdict">${escapeHtml(result.verdict)}</p>
      <p class="result-description result-card-note">${escapeHtml(compactText(result.friendRoast, 42))}</p>
    </button>
  `
}

function renderTypesScreen() {
  const selected = getPreviewResult()
  const selectedHeatCount = getHeatCountForCode(selected.code)

  return `
    <main class="layout">
      <section class="page-hero" id="type-hero">
        <div class="page-hero-copy">
          <p class="eyebrow">Personality Types</p>
          <h1>64 种人格类型</h1>
          <p class="lede">不是只给你一个代号，而是把每一型都做成带人物卡、双语名和五段式吐槽文案的完整结果页。</p>

          <div class="action-row">
            <button class="primary-btn" data-nav-view="quiz" type="button">开始测试</button>
            <button class="secondary-btn" data-random-preview type="button">随机切一型</button>
          </div>

          <div class="chip-row">
            <span class="result-chip">当前选中：${escapeHtml(selected.code)}</span>
            <span class="result-chip">${escapeHtml(selected.englishName)}</span>
            <span class="result-chip">${escapeHtml(selected.name)}</span>
            ${selectedHeatCount !== null ? `<span class="result-chip">已加入热度榜 ${selectedHeatCount} 次</span>` : ''}
          </div>
        </div>

        <aside class="preview-panel preview-panel-reference">
          ${renderPortraitPosterCard(selected, { variant: 'home', lead: '当前展开这一型：', footerText: selected.friendRoast })}
          ${renderTypeSummaryCard(selected, {
            variant: 'home',
            kicker: '类型档案',
            pill: `${selected.code} · ${selected.englishName}`,
            body: selected.charm,
            note: `给你的提醒：${selected.reminder}`,
          })}
        </aside>
      </section>

      <section class="library-panel type-grid-panel">
        <div class="library-toolbar">
          <div class="section-heading">
            <p class="eyebrow">Type Library</p>
            <h2>把 64 型一次摊开看</h2>
            <p class="section-copy">点任意一型，就会把上面的主卡切到对应人物和文案。</p>
          </div>
          <p class="library-count">共 ${indexedResults.length} 型，当前浏览 ${escapeHtml(selected.name)}。</p>
        </div>

        <div class="results-grid type-results-grid">
          ${indexedResults.map((result) => renderTypeCard(result)).join('')}
        </div>
      </section>
    </main>
  `
}

function renderRankingCard(result, rank) {
  return `
    <button class="result-card ranking-card" type="button" data-open-type="${escapeHtml(result.code)}">
      <div class="result-top">
        <span class="ranking-rank">#${rank}</span>
        <span class="result-code">${escapeHtml(result.count)} 次</span>
      </div>
      <h3 class="result-name">${escapeHtml(result.name)}</h3>
      <p class="result-verdict">${escapeHtml(result.code)} · ${escapeHtml(result.englishName)}</p>
      <p class="result-description result-card-note">${escapeHtml(compactText(result.verdict, 38))}</p>
    </button>
  `
}

function renderRankingsScreen() {
  const rankingEntries = state.rankingEntries.length ? state.rankingEntries : seedRankingEntries()
  const topEntries = rankingEntries.slice(0, 12)

  return `
    <main class="layout">
      <section class="page-hero">
        <div class="page-hero-copy">
          <p class="eyebrow">Atlas Rankings</p>
          <h1>Atlas 人格热度榜</h1>
          <p class="lede">这里展示的是用户主动把结果加入 Atlas 热度榜后的累计公开提交数。每次生成结果后，都可以在结果页把自己的类型加入榜单。</p>

          <div class="action-row">
            <button class="primary-btn" data-nav-view="quiz" type="button">测完加入热度榜</button>
            <button class="secondary-btn" data-refresh-ranking type="button">刷新热度数据</button>
          </div>
        </div>

        <aside class="palette-card about-callout">
          <p class="mini-label">公开热度概览</p>
          <h3>${state.rankingStatus === 'loading' ? '正在刷新最新榜单' : `${state.rankingTotal} 次公开提交`}</h3>
          <p class="summary-note">
            ${
              state.rankingStatus === 'error'
                ? '热度数据暂时没有加载成功，稍后刷新一下就好。'
                : `当前已统计 ${rankingEntries.length} 种人格类型，${formatTimeAgo(state.rankingUpdatedAt)}。`
            }
          </p>
        </aside>
      </section>

      <section class="mechanics-panel">
        <div class="section-heading">
          <p class="eyebrow">Live Heat</p>
          <h2>当前热度最高的 12 型</h2>
          <p class="section-copy">点任意一型，就能跳去人格类型页继续看人物卡和完整文案。</p>
        </div>

        <div class="ranking-board-grid">
          ${topEntries.map((result, index) => renderRankingCard(result, index + 1)).join('')}
        </div>
      </section>

      <section class="library-panel">
        <div class="library-toolbar">
          <div class="section-heading">
            <p class="eyebrow">Full Ranking</p>
            <h2>完整热度榜</h2>
            <p class="section-copy">按累计公开提交数从高到低排序，提交数相同就按类型索引顺序排列。</p>
          </div>
        </div>

        <div class="ranking-row-list">
          ${rankingEntries
            .map(
              (result, index) => `
                <button class="ranking-row" type="button" data-open-type="${escapeHtml(result.code)}">
                  <span class="ranking-row-rank">#${index + 1}</span>
                  <span class="ranking-row-main">
                    <strong>${escapeHtml(result.name)}（${escapeHtml(result.code)}）</strong>
                    <small>${escapeHtml(result.englishName)}</small>
                  </span>
                  <span class="ranking-row-count">${escapeHtml(result.count)} 次</span>
                </button>
              `,
            )
            .join('')}
        </div>
      </section>
    </main>
  `
}

function renderAboutScreen() {
  return `
    <main class="layout">
      <section class="page-hero">
        <div class="page-hero-copy">
          <p class="eyebrow">About The Test</p>
          <h1>这套测试到底怎么跑</h1>
          <p class="lede">它会先看你在表达、关系、行动和情绪上的回答方式，再综合映射成 64 种结果里的其中一型，所以每种结果都能写得更像真人。</p>

          <div class="stat-row">
            <article class="stat-card">
              <strong>48</strong>
              <span>每题都只回答 1 到 5 分</span>
            </article>
            <article class="stat-card">
              <strong>6</strong>
              <span>隐藏轴先算出来</span>
            </article>
            <article class="stat-card">
              <strong>64</strong>
              <span>最后落到独立人格结果</span>
            </article>
          </div>
        </div>

        <aside class="palette-card about-callout">
          <p class="mini-label">一句话版</p>
          <h3>先看整体反应，再落到最像的一型。</h3>
          <p class="summary-note">这套测试不是用四个字母硬概括你，而是先看回答里的反应模式，再给出更具体的一张人格截图。</p>
        </aside>
      </section>

      <section class="mechanics-panel">
        <div class="section-heading">
          <p class="eyebrow">How It Works</p>
          <h2>不是先想好结果，再把题目贴上去</h2>
          <p class="section-copy">它会先整理回答里的共性，再去判断你最接近哪一型，所以题目、维度和结果是分开工作的。</p>
        </div>

        <div class="about-step-grid">
          ${aboutSteps
            .map(
              (item) => `
                <article class="copy-card">
                  <p class="mini-label">${escapeHtml(item.step)}</p>
                  <h3>${escapeHtml(item.title)}</h3>
                  <p class="copy-body">${escapeHtml(item.body)}</p>
                </article>
              `,
            )
            .join('')}
        </div>
      </section>

      <section class="mechanics-panel">
        <div class="section-heading">
          <p class="eyebrow">Answer Scale</p>
          <h2>量表怎么答</h2>
          <p class="section-copy">不做阅读理解，不猜命题人意图，直接选最像你的那一格就行。</p>
        </div>
        ${renderScaleLegend()}
      </section>

      <section class="mechanics-panel">
        <div class="section-heading">
          <p class="eyebrow">Hidden Axes</p>
          <h2>这套测试主要会看 6 个方向</h2>
          <p class="section-copy">每条轴都是 8 题，按正反向计分后，再决定这一轴到底偏哪边。</p>
        </div>

        <div class="details-grid">
          ${axisSections
            .map(
              (section) => `
                <article class="axis-card about-axis-card">
                  <div class="axis-top">
                    <span class="result-code">${escapeHtml(section.axis)}</span>
                    <span class="result-index">${section.questions.length} 题</span>
                  </div>
                  <h3>${escapeHtml(section.title)}</h3>
                  <p class="result-description">${escapeHtml(section.lowLabel)} → ${escapeHtml(section.highLabel)}</p>
                </article>
              `,
            )
            .join('')}
        </div>
      </section>

      <section class="result-content-panel about-formula-panel">
        <div class="section-heading">
          <p class="eyebrow">Scoring Logic</p>
          <h2>最后怎么从 6 轴走到 64 型</h2>
          <p class="section-copy">每条轴先判成 0 或 1，六位拼起来得到一个二进制索引，再用那一位去查 64 结果映射表。</p>
        </div>

        <div class="result-copy-grid">
          <article class="copy-card">
            <p class="mini-label">Axis Rule</p>
            <h3>8 到 23 判 0，25 到 40 判 1</h3>
            <p class="copy-body">如果某条轴刚好 24 分，就看这一轴最后一题的原始作答；4 分以上判后者，3 分以下判前者。</p>
          </article>

          <article class="copy-card">
            <p class="mini-label">Binary Index</p>
            <h3>按 A / B / C / D / E / F 拼成六位</h3>
            <p class="copy-body">得到的不是人格名本身，而是一串隐藏索引。前台不展示这六位，但它会稳定地决定最终结果。</p>
          </article>

          <article class="copy-card copy-card-wide">
            <p class="mini-label">Formula</p>
            <pre class="formula-block">index = A × 32 + B × 16 + C × 8 + D × 4 + E × 2 + F</pre>
            <p class="copy-body">索引范围刚好是 0 到 63，对应 64 种结果。你最后看到的那一型，就是从这 64 个结果里综合选出来的落点。</p>
          </article>
        </div>
      </section>
    </main>
  `
}

function renderQuestionCard(question) {
  const questionIndex = getQuestionIndexById(question.id)
  const currentAnswer = state.answers[questionIndex]

  return `
    <article class="question-card${Number.isInteger(currentAnswer) ? ' is-answered' : ''}" id="question-${question.id}">
      <div class="question-card-top">
        <span class="question-number">Q${String(question.id).padStart(2, '0')}</span>
        <span class="question-state">${Number.isInteger(currentAnswer) ? escapeHtml(answerLabelByValue[currentAnswer]) : '未作答'}</span>
      </div>
      <p class="question-text">${escapeHtml(question.text)}</p>
      <div class="answer-button-row" role="radiogroup" aria-label="第 ${question.id} 题">
        ${answerOptions
          .map(
            (option) => `
              <button
                class="answer-button${currentAnswer === option.value ? ' is-active' : ''}"
                type="button"
                data-answer-question="${questionIndex}"
                data-answer-value="${option.value}"
                aria-pressed="${currentAnswer === option.value ? 'true' : 'false'}"
                title="${escapeHtml(option.label)}"
                aria-label="第 ${question.id} 题，${escapeHtml(option.label)}"
              >
                ${option.value}
              </button>
            `,
          )
          .join('')}
      </div>
    </article>
  `
}

function renderAxisSection(section) {
  const answered = getAxisAnsweredCount(section.axis)

  return `
    <section class="axis-section" id="axis-${section.axis}">
      <div class="axis-section-head">
        <div>
          <p class="eyebrow">${section.axis} Axis</p>
          <h2>${escapeHtml(section.title)}</h2>
          <p class="section-copy">从 ${escapeHtml(section.lowLabel)} 到 ${escapeHtml(section.highLabel)}，共 ${section.questions.length} 题。</p>
        </div>
        <div class="axis-tags">
          <span class="axis-tag">${escapeHtml(section.lowLabel)}</span>
          <span class="axis-tag">${escapeHtml(section.highLabel)}</span>
          <span class="axis-tag axis-tag-count">${answered}/${section.questions.length} 已答</span>
        </div>
      </div>

      ${renderScaleLegend()}

      <div class="question-card-grid">
        ${section.questions.map((question) => renderQuestionCard(question)).join('')}
      </div>
    </section>
  `
}

function renderQuizScreen() {
  const answeredCount = getAnsweredCount(state.answers)
  const progress = Math.round((answeredCount / totalQuestions) * 100)

  return `
    <main class="layout quiz-layout">
      <section class="quiz-main">
        <article class="quiz-intro-card">
          <div class="progress-header">
            <div class="quiz-intro-copy">
              <p class="eyebrow">Atlas Quiz</p>
              <h1 class="question-title">按直觉作答，整页一次填完。</h1>
              <p class="section-copy">不用先想标准答案，做完就能直接算结果。</p>
            </div>
            <div class="progress-stack">
              <div class="progress-track" aria-hidden="true">
                <span class="progress-fill" style="width:${progress}%"></span>
              </div>
              <p class="progress-copy">已作答 ${answeredCount} / ${totalQuestions} 题。做完就能直接算结果。</p>
            </div>
          </div>

          <ul class="helper-list helper-list-inline">
            ${quizHelperTips.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}
          </ul>
        </article>

        <div class="axis-section-stack">
          ${axisSections.map((section) => renderAxisSection(section)).join('')}
        </div>

        <article class="quiz-update-note">
          <p class="mini-label">小提示</p>
          <p class="quiz-update-copy">测完以后你可以把结果加入 Atlas 热度榜，也可以直接继续逛 64 型的人格结果。</p>
        </article>
      </section>

      <aside class="quiz-sidebar">
        <article class="palette-card quiz-summary-card">
          <p class="mini-label">Atlas Quiz</p>
          <h2 class="sidebar-title">进度一眼看完</h2>
          <p class="section-copy">边答边看进度，补题时也能直接跳到还没做完的那一段。</p>

          <div class="sidebar-progress">
            <strong>${progress}%</strong>
            <span>${answeredCount}/${totalQuestions} 已答</span>
          </div>

          <div class="axis-summary-list">
            ${axisSections
              .map(
                (section) => `
                  <button class="axis-summary-button" type="button" data-jump-axis="${section.axis}">
                    <span>${section.axis} · ${escapeHtml(section.title)}</span>
                    <strong>${getAxisAnsweredCount(section.axis)}/${section.questions.length}</strong>
                  </button>
                `,
              )
              .join('')}
          </div>

          <div class="sidebar-actions">
            <button class="primary-btn" id="submit-quiz" type="button" ${!isQuizComplete(state.answers) ? 'disabled' : ''}>
              查看结果
            </button>
            <button class="secondary-btn" id="jump-unanswered" type="button">
              跳到漏答题
            </button>
            <button class="secondary-btn" data-nav-view="home" type="button">
              回到首页
            </button>
          </div>
        </article>
      </aside>
    </main>
  `
}

function renderResultScreen() {
  const { axisBreakdown, binaryIndex, index, result } = getFinalResult(state.answers)
  const relatedResults = getRelatedResults(index)
  const confidence = getResultConfidence(axisBreakdown)
  const strongAxes = getStrongAxisCount(axisBreakdown)
  const heatCount = getHeatCountForCode(result.code)

  return `
    <main class="layout result-layout">
      <section class="result-hero">
        <div class="result-copy">
          <p class="eyebrow">Atlas Result</p>
          <div class="result-badge-row">
            <span class="code-badge">${escapeHtml(result.code)}</span>
            <span class="status-pill">#${String(index).padStart(2, '0')} / 63</span>
          </div>
          <h1>${escapeHtml(result.name)}</h1>
          <p class="result-english hero-english">${escapeHtml(result.englishName)}</p>
          <p class="result-verdict hero-verdict">${escapeHtml(result.verdict)}</p>
          <p class="lede">${escapeHtml(result.friendRoast)}</p>

          <div class="stat-row">
            <article class="stat-card">
              <strong>48</strong>
              <span>题目已完成</span>
            </article>
            <article class="stat-card">
              <strong>${binaryIndex}</strong>
              <span>隐藏索引</span>
            </article>
            <article class="stat-card">
              <strong>${heatCount ?? '—'}</strong>
              <span>已加入热度榜</span>
            </article>
          </div>

          <div class="action-row">
            <button class="secondary-btn" id="submit-heat" type="button">提交到 Atlas 热度榜</button>
            <button class="primary-btn" id="copy-result" type="button">
              ${
                state.copyState === 'done'
                  ? '已复制结果文案'
                  : state.copyState === 'error'
                    ? '复制失败，再试一次'
                    : '复制结果文案'
              }
            </button>
            <button class="secondary-btn" id="restart-quiz" type="button">重新测一次</button>
            <button class="secondary-btn" data-nav-view="home" type="button">回到首页</button>
          </div>

          <p class="result-heat-note">
            会打开一个公开提交页，确认提交后，这一型就会计入 Atlas 热度榜。${heatCount !== null ? `这一型目前累计 ${heatCount} 次公开提交。` : ''}
          </p>
        </div>

        <aside class="preview-panel preview-panel-reference">
          ${renderPortraitPosterCard(result, { variant: 'result', lead: '你的人格类型是：', footerText: result.friendRoast })}
          ${renderTypeSummaryCard(result, {
            variant: 'result',
            kicker: '你的主类型',
            pill: `匹配感 ${confidence}% · ${strongAxes}/6 轴更明确`,
            body: result.why,
            note: `维度命中度比较稳定，这一型可以先看作你当前最像的一张人格截图。隐藏索引是 ${binaryIndex}（#${index}）。`,
          })}
        </aside>
      </section>

      <section class="result-content-panel">
        <div class="section-heading">
          <p class="eyebrow">Your Type</p>
          <h2>这一型的人格描述</h2>
          <p class="section-copy">上面先看人物海报和主类型摘要，下面继续看完整的朋友式点评。</p>
        </div>

        <div class="result-copy-grid">
          <article class="copy-card copy-card-wide">
            <p class="mini-label">一句话结论</p>
            <h3>${escapeHtml(result.verdict)}</h3>
            <p class="copy-subline">${escapeHtml(result.code)} / ${escapeHtml(result.englishName)} / ${escapeHtml(result.name)}</p>
          </article>

          <article class="copy-card">
            <p class="mini-label">朋友式吐槽</p>
            <p class="copy-body">${escapeHtml(result.friendRoast)}</p>
          </article>

          <article class="copy-card">
            <p class="mini-label">其实你为什么会这样</p>
            <p class="copy-body">${escapeHtml(result.why)}</p>
          </article>

          <article class="copy-card copy-card-wide">
            <p class="mini-label">你这个类型可爱的地方</p>
            <p class="copy-body">${escapeHtml(result.charm)}</p>
          </article>

          <article class="copy-card copy-card-wide">
            <p class="mini-label">给你的提醒</p>
            <p class="copy-body">${escapeHtml(result.reminder)}</p>
          </article>

          <article class="copy-card copy-card-wide share-preview-card">
            <p class="mini-label">分享文案预览</p>
            <pre class="share-copy">${escapeHtml(getShareText(result))}</pre>
          </article>
        </div>
      </section>

      <details class="details-panel">
        <summary>查看幕后算分</summary>
        <div class="details-content">
          <p class="section-copy">
            你的最终结果来自 6 个隐藏维度组成的二进制索引 <strong>${binaryIndex}</strong>，十进制是 <strong>${index}</strong>。
          </p>

          <div class="details-grid">
            ${axisBreakdown
              .map(
                (item) => `
                  <article class="axis-card">
                    <div class="axis-top">
                      <span class="result-code">${escapeHtml(item.axis)}</span>
                      <span class="result-index">${item.score}/40</span>
                    </div>
                    <h3>${escapeHtml(item.title)}</h3>
                    <p class="result-description">${escapeHtml(item.label)}</p>
                    <p class="axis-note">
                      ${
                        item.tied
                          ? `24 分平局，使用 Q${item.tieBreakerQuestionId} 的原始作答 ${item.tieRawAnswer} 分裁决。`
                          : `该轴最终判定为 ${item.bit}。`
                      }
                    </p>
                  </article>
                `,
              )
              .join('')}
          </div>
        </div>
      </details>

      <section class="mechanics-panel">
        <div class="section-heading">
          <p class="eyebrow">Neighbor Types</p>
          <h2>和你同片宇宙的另外几型</h2>
          <p class="section-copy">这些是索引上离你最近的几型，点进去会跳到人格类型页继续看整套结果的气质。</p>
        </div>

        <div class="mechanics-grid">
          ${relatedResults
            .map(
              (neighbor) => `
                <button
                  class="mechanic-card related-card"
                  type="button"
                  data-open-type="${escapeHtml(neighbor.code)}"
                >
                  <span class="mechanic-step">${escapeHtml(neighbor.code)}</span>
                  <h3>${escapeHtml(neighbor.name)}</h3>
                  <p>${escapeHtml(neighbor.verdict)}</p>
                </button>
              `,
            )
            .join('')}
        </div>
      </section>
    </main>
  `
}

function getActiveNavView() {
  return state.view === 'result' ? 'quiz' : state.view
}

function renderTopbar() {
  const activeView = getActiveNavView()

  return `
    <header class="topbar">
      <button class="brand-lockup brand-button" type="button" id="back-home-top" aria-label="返回首页">
        <span class="brand-mark" aria-hidden="true">
          <span class="brand-orbit brand-orbit-a"></span>
          <span class="brand-orbit brand-orbit-b"></span>
          <span class="brand-dot brand-dot-a"></span>
          <span class="brand-dot brand-dot-b"></span>
          <span class="brand-dot brand-dot-c"></span>
        </span>
        <span class="brand-stack">
          <span class="brand-wordmark">Atlas</span>
          <span class="brand-subtitle">人格测试</span>
        </span>
      </button>

      <nav class="topnav" aria-label="主导航">
        ${navItems
          .map(
            (item) => `
              <button
                class="topnav-button${activeView === item.view ? ' is-active' : ''}"
                type="button"
                data-nav-view="${item.view}"
              >
                ${escapeHtml(item.label)}
              </button>
            `,
          )
          .join('')}
      </nav>

      <div class="topbar-side">
        <span class="status-pill">64 型结果 · 实时热度榜</span>
      </div>
    </header>
  `
}

function renderFooter() {
  return `
    <footer class="site-footer">
      <span>Atlas · v${escapeHtml(appMeta.version)}</span>
      <span>Atlas · 64 型人格测试</span>
      <a href="${escapeHtml(appMeta.repoUrl)}" target="_blank" rel="noreferrer">GitHub</a>
    </footer>
  `
}

function getDocumentTitle() {
  if (state.view === 'result' && isQuizComplete(state.answers)) {
    const { result } = getFinalResult(state.answers)
    return `${result.name} | Atlas 人格测试`
  }

  if (state.view === 'types') {
    return `人格类型 | Atlas 人格测试`
  }

  if (state.view === 'rankings') {
    return `人格排行榜 | Atlas 人格测试`
  }

  if (state.view === 'about') {
    return `关于测试 | Atlas 人格测试`
  }

  if (state.view === 'quiz') {
    return `开始测试 | Atlas 人格测试`
  }

  return `Atlas 人格测试 | 64 型结果测试`
}

function renderView() {
  if (state.view === 'types') {
    return renderTypesScreen()
  }

  if (state.view === 'rankings') {
    return renderRankingsScreen()
  }

  if (state.view === 'about') {
    return renderAboutScreen()
  }

  if (state.view === 'quiz') {
    return renderQuizScreen()
  }

  if (state.view === 'result') {
    return renderResultScreen()
  }

  return renderHomeScreen()
}

function render() {
  if (state.view === 'result' && !isQuizComplete(state.answers)) {
    state.view = 'quiz'
  }

  document.title = getDocumentTitle()

  app.innerHTML = `
    <div class="page-shell">
      <div class="ambient ambient-a"></div>
      <div class="ambient ambient-b"></div>
      ${renderTopbar()}
      ${renderView()}
      ${renderFooter()}
    </div>
  `

  document.querySelector('#back-home-top')?.addEventListener('click', goHome)
  document.querySelectorAll('[data-nav-view]').forEach((button) => {
    button.addEventListener('click', () => {
      goToView(button.dataset.navView)
    })
  })

  document.querySelectorAll('[data-random-preview]').forEach((button) => {
    button.addEventListener('click', pickRandomPreview)
  })

  document.querySelector('#submit-heat')?.addEventListener('click', openHeatSubmission)
  document.querySelectorAll('[data-refresh-ranking]').forEach((button) => {
    button.addEventListener('click', () => {
      void ensureRankingData(true)
    })
  })

  document.querySelector('#restart-quiz')?.addEventListener('click', restartQuiz)
  document.querySelector('#copy-result')?.addEventListener('click', copyResultText)
  document.querySelector('#submit-quiz')?.addEventListener('click', showResult)
  document.querySelector('#jump-unanswered')?.addEventListener('click', jumpToFirstUnanswered)

  document.querySelectorAll('[data-open-type]').forEach((button) => {
    button.addEventListener('click', () => {
      openType(button.dataset.openType ?? indexedResults[0].code)
    })
  })

  document.querySelectorAll('[data-answer-question]').forEach((button) => {
    button.addEventListener('click', () => {
      const questionIndex = Number(button.dataset.answerQuestion)
      const value = Number(button.dataset.answerValue)
      selectAnswer(questionIndex, value)
    })
  })

  document.querySelectorAll('[data-jump-axis]').forEach((button) => {
    button.addEventListener('click', () => {
      scrollToSelector(`#axis-${button.dataset.jumpAxis}`)
    })
  })

  if (state.view === 'quiz' && state.preservedQuizScrollY !== null) {
    const preservedScrollY = state.preservedQuizScrollY
    state.preservedQuizScrollY = null
    requestAnimationFrame(() => {
      window.scrollTo({ top: preservedScrollY })
    })
  }
}

render()
