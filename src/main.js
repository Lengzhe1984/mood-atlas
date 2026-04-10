import './style.css'
import { appMeta } from './app-meta.js'
import { getCharacterArt } from './character-art.js'
import { answerOptions, axisSections, quizQuestions, totalQuestions } from './quiz-data.js'
import { indexedResults } from './results.js'
import { getAnsweredCount, getFinalResult, isQuizComplete } from './scoring.js'

const app = document.querySelector('#app')

const answerLabelByValue = Object.fromEntries(answerOptions.map((option) => [option.value, option.label]))
const quizHelperTips = [
  '选最像你的直觉，不需要想标准答案。',
  '每题都用 1 到 5 分量表，后台会自动处理正反向记分。',
  '如果你中途停下，再回来时这一页还能继续补答。',
]

const navItems = [
  { view: 'types', label: '人格类型' },
  { view: 'rankings', label: '人格排行榜' },
  { view: 'about', label: '关于测试' },
  { view: 'quiz', label: '开始测试' },
]

const rankingBoards = [
  {
    title: '上来先看榜',
    description: '第一次逛这套测试时，最容易迅速找到感觉的几型。',
    codes: ['LOOP', 'OJBK', 'FAKE', 'JOKR', 'PANIC', 'CLING', 'BOSS', 'DEAD'],
  },
  {
    title: '朋友最容易认出来榜',
    description: '那种朋友看一眼就会说“你就是这个”的类型。',
    codes: ['HOLD', 'COLD', 'NOPE', 'CARE', 'MUMM', 'MOODY', 'SWEET', 'BOSS'],
  },
  {
    title: '越看越像你榜',
    description: '不一定第一眼最炸，但很容易在细节里越读越像本人。',
    codes: ['WHYY', 'BUBU', 'GLASS', 'EMOO', 'GREYY', 'WORTH', 'NERDY', 'ALIVE'],
  },
]

const aboutSteps = [
  {
    step: 'Step 1',
    title: '48 道题先按直觉作答',
    body: '每题都只做 1 到 5 分判断，不用背人格理论，也不用把自己硬往一个标签里塞。',
  },
  {
    step: 'Step 2',
    title: '后台先算 6 条隐藏轴',
    body: '前台看起来像梗图人格，后台其实是 6 维二选一模型，先把你的反应方式拆开再计分。',
  },
  {
    step: 'Step 3',
    title: '最后映射成 64 个独立结果',
    body: '结果不是四个字母拼出来的，而是 6 位隐藏索引落到 64 型结果表，所以每型都能单独写人话。',
  },
]

const state = {
  view: 'home',
  answers: Array(totalQuestions).fill(null),
  previewCode: 'LOOP',
  copyState: 'idle',
  preservedQuizScrollY: null,
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

function getResultByCode(code) {
  return indexedResults.find((result) => result.code === code) ?? indexedResults[0]
}

function getPreviewResult() {
  return getResultByCode(state.previewCode)
}

function getResultsByCodes(codes) {
  return codes.map((code) => getResultByCode(code)).filter(Boolean)
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
          <p class="eyebrow">Beta v${escapeHtml(appMeta.version)}</p>
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
              <span>嘴上是梗，后台是六维模型</span>
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
          <p class="eyebrow">Release Notes</p>
          <h2>最近更新</h2>
          <p class="section-copy">用更轻的文字方式记录最近几次版本变化，像 README 一样直接看重点。</p>
        </div>

        <div class="release-log">
          ${appMeta.recentUpdates
            .map(
              (item) => `
                <article class="release-entry">
                  <div class="release-entry-head">
                    <span class="release-version">v${escapeHtml(item.version)}</span>
                    ${item.version === appMeta.version ? '<span class="release-current">current</span>' : ''}
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

  return `
    <button class="result-card type-browser-card${isActive ? ' is-active' : ''}" type="button" data-open-type="${escapeHtml(result.code)}">
      <div class="result-top">
        <span class="result-code">${escapeHtml(result.code)}</span>
        <span class="result-index">${escapeHtml(result.englishName)}</span>
      </div>
      <h3 class="result-name">${escapeHtml(result.name)}</h3>
      <p class="result-verdict">${escapeHtml(result.verdict)}</p>
      <p class="result-description result-card-note">${escapeHtml(compactText(result.friendRoast, 42))}</p>
    </button>
  `
}

function renderTypesScreen() {
  const selected = getPreviewResult()

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
        <span class="result-code">${escapeHtml(result.code)}</span>
      </div>
      <h3 class="result-name">${escapeHtml(result.name)}</h3>
      <p class="result-verdict">${escapeHtml(result.verdict)}</p>
      <p class="result-description result-card-note">${escapeHtml(compactText(result.charm, 38))}</p>
    </button>
  `
}

function renderRankingsScreen() {
  return `
    <main class="layout">
      <section class="page-hero">
        <div class="page-hero-copy">
          <p class="eyebrow">SBTI Rankings</p>
          <h1>SBTI 人格排行榜</h1>
          <p class="lede">这页先放当前版本的站内编辑榜，帮你从 64 型里快速找到切入口。它不是全站用户投票榜，但很适合先逛、先代入、先挑几型看。</p>

          <div class="action-row">
            <button class="primary-btn" data-nav-view="types" type="button">先逛人格类型</button>
            <button class="secondary-btn" data-nav-view="quiz" type="button">直接开始测试</button>
          </div>
        </div>

        <aside class="palette-card about-callout">
          <p class="mini-label">当前榜单说明</p>
          <h3>先做成站内编辑榜，后面再接真实热度</h3>
          <p class="summary-note">静态站点这一版先不给你假装用户总榜，先把“先看哪几型更容易有手感”这件事做好。以后如果接入结果提交，再换成实时榜单也顺手。</p>
        </aside>
      </section>

      <section class="mechanics-panel">
        <div class="section-heading">
          <p class="eyebrow">Ranking Boards</p>
          <h2>先从这几张榜单入手</h2>
          <p class="section-copy">每张榜单都能点进去跳到对应人格类型页，继续看人物卡和整段文案。</p>
        </div>

        <div class="ranking-board-grid">
          ${rankingBoards
            .map(
              (board) => `
                <article class="ranking-board">
                  <div class="ranking-board-head">
                    <h3>${escapeHtml(board.title)}</h3>
                    <p class="ranking-note">${escapeHtml(board.description)}</p>
                  </div>
                  <div class="ranking-list">
                    ${getResultsByCodes(board.codes)
                      .map((result, index) => renderRankingCard(result, index + 1))
                      .join('')}
                  </div>
                </article>
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
          <p class="lede">前台看起来像是在测你那些小毛病，后台其实是一套结构很稳的六维模型。不是 64 个结果直接瞎配题，而是先测维度，再映射结果。</p>

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
          <h3>梗图是前台，模型在后台。</h3>
          <p class="summary-note">用户看到的是 64 个单独人格结果，后台维护的是 6 条隐藏轴和一张稳定映射表，所以这套东西既好玩，也能长期迭代。</p>
        </aside>
      </section>

      <section class="mechanics-panel">
        <div class="section-heading">
          <p class="eyebrow">How It Works</p>
          <h2>不是直接把结果硬贴到题目上</h2>
          <p class="section-copy">流程上分三步走，题库、六维计分和 64 型映射是拆开的，所以后面调文案和调体验不会互相打架。</p>
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
          <h2>后台实际在看的 6 条隐藏轴</h2>
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
            <p class="copy-body">索引范围刚好是 0 到 63，对应 64 种结果。也就是说，用户看到的是梗图人格宇宙，后台其实是一个可维护的六维模型。</p>
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
  const updateSummary = appMeta.latestUpdatePoints.join(' ')

  return `
    <main class="layout quiz-layout">
      <section class="quiz-main">
        <article class="quiz-intro-card">
          <div class="progress-header">
            <div class="quiz-intro-copy">
              <p class="eyebrow">答题提示</p>
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
          <p class="mini-label">Latest Update · v${escapeHtml(appMeta.version)}</p>
          <p class="quiz-update-copy">${escapeHtml(appMeta.latestUpdateTitle)}。${escapeHtml(updateSummary)}</p>
        </article>
      </section>

      <aside class="quiz-sidebar">
        <article class="palette-card quiz-summary-card">
          <p class="mini-label">${escapeHtml(appMeta.stage)} / v${escapeHtml(appMeta.version)}</p>
          <h2 class="sidebar-title">进度一眼看完</h2>
          <p class="section-copy">桌面端右侧固定，手机端会折回顶部，不再挡住内容。</p>

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

  return `
    <main class="layout result-layout">
      <section class="result-hero">
        <div class="result-copy">
          <p class="eyebrow">${escapeHtml(appMeta.stage)} Result</p>
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
              <strong>v${escapeHtml(appMeta.version)}</strong>
              <span>当前 beta 版本</span>
            </article>
          </div>

          <div class="action-row">
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
          <p class="eyebrow">Result Copy</p>
          <h2>结果文案还是五段式，但现在也能顺着站点继续逛其他页面</h2>
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
          <span class="brand-wordmark">SBTI</span>
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
        <span class="status-pill">${escapeHtml(appMeta.stage)} · v${escapeHtml(appMeta.version)}</span>
      </div>
    </header>
  `
}

function renderFooter() {
  return `
    <footer class="site-footer">
      <span>${escapeHtml(appMeta.stage)} · v${escapeHtml(appMeta.version)}</span>
      <span>SBTI · 静态网页版 64 型人格测试</span>
      <a href="${escapeHtml(appMeta.repoUrl)}" target="_blank" rel="noreferrer">GitHub</a>
    </footer>
  `
}

function getDocumentTitle() {
  if (state.view === 'result' && isQuizComplete(state.answers)) {
    const { result } = getFinalResult(state.answers)
    return `${result.name} | SBTI 人格测试`
  }

  if (state.view === 'types') {
    return `人格类型 | SBTI 人格测试`
  }

  if (state.view === 'rankings') {
    return `人格排行榜 | SBTI 人格测试`
  }

  if (state.view === 'about') {
    return `关于测试 | SBTI 人格测试`
  }

  if (state.view === 'quiz') {
    return `开始测试 | SBTI 人格测试`
  }

  return `SBTI 人格测试 | ${appMeta.stage} v${appMeta.version}`
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
