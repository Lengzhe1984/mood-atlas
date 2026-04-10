import './style.css'
import { appMeta } from './app-meta.js'
import { answerOptions, axisSections, quizQuestions, totalQuestions } from './quiz-data.js'
import { indexedResults } from './results.js'
import { getAnsweredCount, getFinalResult, isQuizComplete } from './scoring.js'

const app = document.querySelector('#app')

const answerLabelByValue = Object.fromEntries(answerOptions.map((option) => [option.value, option.label]))

const state = {
  view: 'home',
  answers: Array(totalQuestions).fill(null),
  search: '',
  previewCode: 'LOOP',
  copyState: 'idle',
  focusSearchAfterRender: false,
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

function getPreviewResult() {
  return indexedResults.find((result) => result.code === state.previewCode) ?? indexedResults[0]
}

function getFilteredResults() {
  const keyword = state.search.trim().toLowerCase()

  if (!keyword) {
    return indexedResults
  }

  return indexedResults.filter((result) =>
    [
      result.code,
      result.englishName,
      result.name,
      result.verdict,
      result.description,
      result.hiddenPain,
      ...result.strengths,
      ...result.barrage.map((item) => item.text),
    ]
      .join(' ')
      .toLowerCase()
      .includes(keyword),
  )
}

function getRelatedResults(index) {
  const offsets = [-2, -1, 1, 2]

  return offsets.map((offset) => {
    const nextIndex = (index + offset + indexedResults.length) % indexedResults.length
    return indexedResults[nextIndex]
  })
}

function getShareText(result) {
  return `我测出来是 ${result.code}｜${result.englishName}｜${result.name}\n一句话：${result.verdict}\n吐槽：${result.description}\n#MoodAtlas`
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
  state.view = 'quiz'
  render()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function restartQuiz() {
  state.answers = Array(totalQuestions).fill(null)
  state.copyState = 'idle'
  state.view = 'quiz'
  render()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function goHome() {
  state.view = 'home'
  render()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function showResult() {
  if (!isQuizComplete(state.answers)) {
    jumpToFirstUnanswered()
    return
  }

  state.view = 'result'
  render()
  window.scrollTo({ top: 0, behavior: 'smooth' })
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

function renderResultCard(result, activeCode = '') {
  const isActive = result.code === activeCode

  return `
    <button
      class="result-card${isActive ? ' is-active' : ''}"
      type="button"
      data-preview-code="${escapeHtml(result.code)}"
    >
      <div class="result-top">
        <span class="result-code">${escapeHtml(result.code)}</span>
        <span class="result-index">#${String(result.index).padStart(2, '0')}</span>
      </div>
      <h3 class="result-name">${escapeHtml(result.name)}</h3>
      <p class="result-english">${escapeHtml(result.englishName)}</p>
      <p class="result-verdict">${escapeHtml(result.verdict)}</p>
      <p class="result-description">${escapeHtml(result.description)}</p>
    </button>
  `
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

function renderHomeScreen() {
  const preview = getPreviewResult()
  const filteredResults = getFilteredResults()

  return `
    <main class="layout">
      <section class="hero-panel" id="hero">
        <div class="hero-copy">
          <p class="eyebrow">Beta v${escapeHtml(appMeta.version)}</p>
          <h1>前台像梗图人格宇宙，后台其实是六维模型。</h1>
          <p class="lede">
            这版已经把 48 道题、6 个隐藏维度和 64 个结果映射全部接进来了。现在答题页也改成了更适合手机和桌面的单页式结构，尽量少翻页、少遮挡、少打断。
          </p>

          <div class="stat-row">
            <article class="stat-card">
              <strong>48</strong>
              <span>题目已接入</span>
            </article>
            <article class="stat-card">
              <strong>6</strong>
              <span>隐藏维度在后台计分</span>
            </article>
            <article class="stat-card">
              <strong>64</strong>
              <span>独立结果映射完成</span>
            </article>
          </div>

          <div class="action-row">
            <button class="primary-btn" id="start-quiz" type="button">开始测试</button>
            <button class="secondary-btn" id="random-preview" type="button">随机看一型</button>
          </div>

          <div class="chip-row">
            ${['单页答题', '移动端优化', '中英双名', 'GitHub Pages']
              .map((item) => `<span class="result-chip">${escapeHtml(item)}</span>`)
              .join('')}
          </div>
        </div>

        <aside class="preview-panel">
          <div class="preview-card">
            <p class="mini-label">结果预览</p>
            <span class="code-badge">${escapeHtml(preview.code)}</span>
            <h2>${escapeHtml(preview.name)}</h2>
            <p class="preview-english">${escapeHtml(preview.englishName)}</p>
            <p class="preview-verdict">${escapeHtml(preview.verdict)}</p>
            <p class="preview-body">${escapeHtml(preview.description)}</p>
            <div class="preview-points">
              ${preview.strengths
                .slice(0, 2)
                .map((item) => `<span class="preview-chip">${escapeHtml(item)}</span>`)
                .join('')}
            </div>
            <p class="preview-tip">隐藏痛点：${escapeHtml(preview.hiddenPain)}</p>
          </div>
        </aside>
      </section>

      <section class="mechanics-panel">
        <div class="section-heading">
          <p class="eyebrow">How It Works</p>
          <h2>这版重点把答题体验做顺了</h2>
          <p class="section-copy">
            现在答题页改成分区长卷，手机端不用一题一翻，桌面端也能更快扫完整体进度。后台计分逻辑保持不变，仍然是 6 维隐藏轴映射到 64 个结果。
          </p>
        </div>

        <div class="mechanics-grid">
          <article class="mechanic-card">
            <span class="mechanic-step">01</span>
            <h3>单页答题</h3>
            <p>按 6 个维度分组展示，一次看完一整段，尽量少翻页。</p>
          </article>
          <article class="mechanic-card">
            <span class="mechanic-step">02</span>
            <h3>更稳的移动端布局</h3>
            <p>缩小遮挡风险，去掉容易挡内容的结构，按钮区也更紧凑。</p>
          </article>
          <article class="mechanic-card">
            <span class="mechanic-step">03</span>
            <h3>版本化 beta</h3>
            <p>这版开始按 beta 版本维护，每次更新同步改版本号和 README。</p>
          </article>
        </div>
      </section>

      <section class="library-panel" id="library">
        <div class="section-heading">
          <p class="eyebrow">Result Library</p>
          <h2>64 种人格结果可以直接预览</h2>
          <p class="section-copy">
            点击任意卡片会切换上方预览。搜索现在也支持新代号、英文名、中文名和结果文案关键词。
          </p>
        </div>

        <div class="library-toolbar">
          <label class="search-box" for="result-search">
            <span>搜索代号、英文、中文或关键词</span>
            <input
              id="result-search"
              type="search"
              value="${escapeHtml(state.search)}"
              placeholder="比如：LEDGR、Why Machine、回春人、复盘"
              autocomplete="off"
            />
          </label>
          <p class="library-count">当前显示 ${filteredResults.length} / ${indexedResults.length}</p>
        </div>

        <div class="results-grid">
          ${filteredResults.length
            ? filteredResults.map((result) => renderResultCard(result, state.previewCode)).join('')
            : `
              <div class="empty-state">
                <h3>没搜到对应类型</h3>
                <p>换个关键词试试，或者直接翻卡片库看看。</p>
              </div>
            `}
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
            <div>
              <p class="eyebrow">Beta Quiz Flow</p>
              <h1 class="question-title">这版改成整页答题，尽量少翻页。</h1>
            </div>
            <div class="progress-stack">
              <div class="progress-track" aria-hidden="true">
                <span class="progress-fill" style="width:${progress}%"></span>
              </div>
              <p class="progress-copy">已作答 ${answeredCount} / ${totalQuestions} 题。做完就能直接算结果。</p>
            </div>
          </div>
        </article>

        <div class="axis-section-stack">
          ${axisSections.map((section) => renderAxisSection(section)).join('')}
        </div>
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
            <button class="secondary-btn" id="back-home" type="button">
              回到首页
            </button>
          </div>
        </article>

        <article class="palette-card">
          <p class="mini-label">答题提示</p>
          <ul class="helper-list">
            <li>选最像你的直觉，不需要想标准答案。</li>
            <li>每题都用 1 到 5 分量表，后台会自动处理正反向记分。</li>
            <li>如果你中途停下，再回来时这一页还能继续补答。</li>
          </ul>
        </article>
      </aside>
    </main>
  `
}

function renderResultScreen() {
  const { axisBreakdown, binaryIndex, index, result } = getFinalResult(state.answers)
  const relatedResults = getRelatedResults(index)

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
          <p class="lede">${escapeHtml(result.description)}</p>

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
            <button class="secondary-btn" id="back-home" type="button">回到首页</button>
          </div>
        </div>

        <aside class="preview-panel">
          <div class="share-card">
            <p class="mini-label">分享文案预览</p>
            <pre class="share-copy">${escapeHtml(getShareText(result))}</pre>
          </div>
        </aside>
      </section>

      <section class="result-content-panel">
        <div class="section-heading">
          <p class="eyebrow">Result Copy</p>
          <h2>这次结果不只给你一个名字</h2>
          <p class="section-copy">这部分是用户真正会截图、会转发、会反复看的内容。</p>
        </div>

        <div class="result-copy-grid">
          <article class="copy-card copy-card-wide">
            <p class="mini-label">一句话结论</p>
            <h3>${escapeHtml(result.verdict)}</h3>
            <p class="copy-subline">${escapeHtml(result.code)} / ${escapeHtml(result.englishName)} / ${escapeHtml(result.name)}</p>
          </article>

          <article class="copy-card">
            <p class="mini-label">吐槽描述</p>
            <p class="copy-body">${escapeHtml(result.description)}</p>
          </article>

          <article class="copy-card">
            <p class="mini-label">隐藏痛点</p>
            <p class="copy-body">${escapeHtml(result.hiddenPain)}</p>
          </article>

          <article class="copy-card copy-card-wide">
            <p class="mini-label">优点</p>
            <ul class="copy-list">
              ${result.strengths.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}
            </ul>
          </article>
        </div>
      </section>

      <section class="mechanics-panel">
        <div class="section-heading">
          <p class="eyebrow">Hot Comments</p>
          <h2>属于你的高频弹幕</h2>
          <p class="section-copy">很多人最后记住的就是这几句，所以它们会跟着每个结果一起切换。</p>
        </div>

        <div class="barrage-grid">
          ${result.barrage
            .map(
              (item) => `
                <article class="barrage-card">
                  <p class="mini-label">${escapeHtml(item.label)}</p>
                  <p class="copy-body">${escapeHtml(item.text)}</p>
                </article>
              `,
            )
            .join('')}
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
          <p class="section-copy">这些是索引上离你最近的几型，很适合继续翻看整套结果的气质。</p>
        </div>

        <div class="mechanics-grid">
          ${relatedResults
            .map(
              (neighbor) => `
                <button
                  class="mechanic-card related-card"
                  type="button"
                  data-open-library="${escapeHtml(neighbor.code)}"
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

function renderTopbar() {
  const answeredCount = getAnsweredCount(state.answers)

  return `
    <header class="topbar">
      <button class="brand brand-button" type="button" id="back-home-top">Mood Atlas</button>
      <div class="topbar-meta">
        <span class="status-pill">${escapeHtml(appMeta.stage)} · v${escapeHtml(appMeta.version)}</span>
        ${
          state.view === 'quiz'
            ? `<span class="ghost-link is-static">已答 ${answeredCount}/${totalQuestions}</span>`
            : state.view === 'result'
              ? '<span class="ghost-link is-static">结果已生成</span>'
              : '<a class="ghost-link" href="#library">浏览结果库</a>'
        }
      </div>
    </header>
  `
}

function renderFooter() {
  return `
    <footer class="site-footer">
      <span>${escapeHtml(appMeta.stage)} · v${escapeHtml(appMeta.version)}</span>
      <span>静态网页版 64 型人格测试</span>
      <a href="${escapeHtml(appMeta.repoUrl)}" target="_blank" rel="noreferrer">GitHub</a>
    </footer>
  `
}

function render() {
  if (state.view === 'result' && !isQuizComplete(state.answers)) {
    state.view = 'quiz'
  }

  document.title = `Mood Atlas | ${appMeta.stage} v${appMeta.version}`

  app.innerHTML = `
    <div class="page-shell">
      <div class="ambient ambient-a"></div>
      <div class="ambient ambient-b"></div>
      ${renderTopbar()}
      ${state.view === 'home' ? renderHomeScreen() : ''}
      ${state.view === 'quiz' ? renderQuizScreen() : ''}
      ${state.view === 'result' ? renderResultScreen() : ''}
      ${renderFooter()}
    </div>
  `

  document.querySelector('#back-home')?.addEventListener('click', goHome)
  document.querySelector('#back-home-top')?.addEventListener('click', goHome)
  document.querySelector('#start-quiz')?.addEventListener('click', startQuiz)
  document.querySelector('#random-preview')?.addEventListener('click', pickRandomPreview)
  document.querySelector('#restart-quiz')?.addEventListener('click', restartQuiz)
  document.querySelector('#copy-result')?.addEventListener('click', copyResultText)
  document.querySelector('#submit-quiz')?.addEventListener('click', showResult)
  document.querySelector('#jump-unanswered')?.addEventListener('click', jumpToFirstUnanswered)

  document.querySelector('#result-search')?.addEventListener('input', (event) => {
    state.search = event.target.value
    state.focusSearchAfterRender = true
    render()
  })

  document.querySelectorAll('[data-preview-code]').forEach((button) => {
    button.addEventListener('click', () => {
      state.previewCode = button.dataset.previewCode ?? indexedResults[0].code
      render()
    })
  })

  document.querySelectorAll('[data-open-library]').forEach((button) => {
    button.addEventListener('click', () => {
      state.previewCode = button.dataset.openLibrary ?? indexedResults[0].code
      state.view = 'home'
      render()
      requestAnimationFrame(() => {
        scrollToSelector('#library')
      })
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

  if (state.focusSearchAfterRender) {
    const searchInput = document.querySelector('#result-search')
    searchInput?.focus()
    searchInput?.setSelectionRange(searchInput.value.length, searchInput.value.length)
    state.focusSearchAfterRender = false
  }

  if (state.view === 'quiz' && state.preservedQuizScrollY !== null) {
    const preservedScrollY = state.preservedQuizScrollY
    state.preservedQuizScrollY = null
    requestAnimationFrame(() => {
      window.scrollTo({ top: preservedScrollY })
    })
  }
}

render()
