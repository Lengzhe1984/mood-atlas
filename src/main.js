import './style.css'
import { answerOptions, quizQuestions, totalQuestions } from './quiz-data.js'
import { indexedResults } from './results.js'
import {
  getAnsweredCount,
  getFinalResult,
  getFirstUnansweredIndex,
  isQuizComplete,
} from './scoring.js'

const app = document.querySelector('#app')

const state = {
  view: 'home',
  currentQuestionIndex: 0,
  answers: Array(totalQuestions).fill(null),
  search: '',
  previewCode: 'LOOP',
  copyState: 'idle',
  focusSearchAfterRender: false,
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
    [result.code, result.name, result.description].join(' ').toLowerCase().includes(keyword),
  )
}

function getCurrentQuestion() {
  return quizQuestions[state.currentQuestionIndex]
}

function getRelatedResults(index) {
  const offsets = [-2, -1, 1, 2]

  return offsets.map((offset) => {
    const nextIndex = (index + offset + indexedResults.length) % indexedResults.length
    return indexedResults[nextIndex]
  })
}

function getShareText(result) {
  return `我测出来是 ${result.code}｜${result.name}\n${result.description}\n#MoodAtlas`
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
  state.currentQuestionIndex = Math.max(0, getFirstUnansweredIndex(state.answers))
  render()
}

function restartQuiz() {
  state.answers = Array(totalQuestions).fill(null)
  state.currentQuestionIndex = 0
  state.view = 'quiz'
  state.copyState = 'idle'
  render()
}

function goHome() {
  state.view = 'home'
  render()
}

function goToQuestion(index) {
  state.currentQuestionIndex = Math.max(0, Math.min(index, totalQuestions - 1))
  state.view = 'quiz'
  render()
}

function showResult() {
  if (!isQuizComplete(state.answers)) {
    const firstUnansweredIndex = getFirstUnansweredIndex(state.answers)
    state.view = 'quiz'
    state.currentQuestionIndex = firstUnansweredIndex === -1 ? 0 : firstUnansweredIndex
    render()
    return
  }

  state.view = 'result'
  render()
}

function nextQuestion() {
  if (state.currentQuestionIndex === totalQuestions - 1) {
    showResult()
    return
  }

  state.currentQuestionIndex += 1
  render()
}

function previousQuestion() {
  if (state.currentQuestionIndex === 0) {
    return
  }

  state.currentQuestionIndex -= 1
  render()
}

function selectAnswer(value) {
  state.answers[state.currentQuestionIndex] = value

  if (state.currentQuestionIndex === totalQuestions - 1) {
    if (isQuizComplete(state.answers)) {
      state.view = 'result'
    } else {
      const firstUnansweredIndex = getFirstUnansweredIndex(state.answers)
      state.currentQuestionIndex = firstUnansweredIndex === -1 ? state.currentQuestionIndex : firstUnansweredIndex
    }

    render()
    return
  }

  state.currentQuestionIndex += 1
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
      <p class="result-description">${escapeHtml(result.description)}</p>
    </button>
  `
}

function renderHomeScreen() {
  const preview = getPreviewResult()
  const filteredResults = getFilteredResults()

  return `
    <main class="layout">
      <section class="hero-panel" id="hero">
        <div class="hero-copy">
          <p class="eyebrow">不是拼前缀，是 64 个独立人格结果</p>
          <h1>前台像梗图人格宇宙，后台其实是六维模型。</h1>
          <p class="lede">
            这版已经把 48 道题、6 个隐藏维度和 64 个结果映射全部接进来了。用户做的是一个完整的
            静态网页测试，页面不会暴露维度拼接感，但后台仍然是可维护、可调参的稳定结构。
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
            ${['嘴硬压着', '黏连挂心', '摆烂缓冲', '控场接管', '脑补复盘', '发疯热反应']
              .map((item) => `<span class="result-chip">${escapeHtml(item)}</span>`)
              .join('')}
          </div>
        </div>

        <aside class="preview-panel">
          <div class="preview-card">
            <p class="mini-label">结果预览</p>
            <span class="code-badge">${escapeHtml(preview.code)}</span>
            <h2>${escapeHtml(preview.name)}</h2>
            <p class="preview-body">${escapeHtml(preview.description)}</p>
            <p class="preview-tip">
              现在这里是预览卡。正式测试完成后，会进入完整结果页并给出该人格的最终结论。
            </p>
          </div>
        </aside>
      </section>

      <section class="mechanics-panel">
        <div class="section-heading">
          <p class="eyebrow">How It Works</p>
          <h2>最适合静态网页的一种实现</h2>
          <p class="section-copy">
            每题都走 1 到 5 分的量表，后台按正反向累计到隐藏维度，再把 6 位二进制索引映射成 64 个最终结果。
            用户看到的是顺滑的测试体验，开发端拿到的是一套很稳定的结构。
          </p>
        </div>

        <div class="mechanics-grid">
          <article class="mechanic-card">
            <span class="mechanic-step">01</span>
            <h3>48 题量表作答</h3>
            <p>每题统一 1 到 5 分，从“你别乱说”到“像到离谱”。</p>
          </article>
          <article class="mechanic-card">
            <span class="mechanic-step">02</span>
            <h3>6 维隐藏计分</h3>
            <p>每个维度 8 题，正反向题自动换算，24 分时用该轴最后一题裁决。</p>
          </article>
          <article class="mechanic-card">
            <span class="mechanic-step">03</span>
            <h3>映射到独立结果</h3>
            <p>最终只展示独立人格结果，不把后台的拼接结构直接暴露给用户。</p>
          </article>
        </div>
      </section>

      <section class="library-panel" id="library">
        <div class="section-heading">
          <p class="eyebrow">Result Library</p>
          <h2>64 种人格结果可以直接预览</h2>
          <p class="section-copy">
            点击任意卡片会切换上方预览。等你后面还想继续补“优点 / 痛点 / 高频弹幕”，这里的数据层也已经够用了。
          </p>
        </div>

        <div class="library-toolbar">
          <label class="search-box" for="result-search">
            <span>搜索代号、名称或关键词</span>
            <input
              id="result-search"
              type="search"
              value="${escapeHtml(state.search)}"
              placeholder="比如：复盘、哈哈、冰壳、上头"
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

function renderQuestionPalette() {
  return quizQuestions
    .map((question, index) => {
      const answer = state.answers[index]
      const answered = Number.isInteger(answer)
      const current = index === state.currentQuestionIndex

      return `
        <button
          class="question-dot${answered ? ' is-answered' : ''}${current ? ' is-current' : ''}"
          type="button"
          data-go-question="${index}"
          aria-label="第 ${question.id} 题"
        >
          ${String(question.id).padStart(2, '0')}
        </button>
      `
    })
    .join('')
}

function renderQuizScreen() {
  const currentQuestion = getCurrentQuestion()
  const answeredCount = getAnsweredCount(state.answers)
  const progress = Math.round((answeredCount / totalQuestions) * 100)
  const currentAnswer = state.answers[state.currentQuestionIndex]

  return `
    <main class="layout quiz-layout">
      <section class="quiz-main">
        <article class="quiz-card">
          <div class="progress-header">
            <div>
              <p class="eyebrow">Question ${String(currentQuestion.id).padStart(2, '0')} / ${totalQuestions}</p>
              <h1 class="question-title">${escapeHtml(currentQuestion.text)}</h1>
            </div>
            <div class="progress-stack">
              <div class="progress-track" aria-hidden="true">
                <span class="progress-fill" style="width:${progress}%"></span>
              </div>
              <p class="progress-copy">已作答 ${answeredCount} 题，还剩 ${totalQuestions - answeredCount} 题。</p>
            </div>
          </div>

          <div class="choice-scale">
            <span>1 = 你别乱说</span>
            <span>5 = 像到离谱</span>
          </div>

          <div class="option-grid">
            ${answerOptions
              .map(
                (option) => `
                  <button
                    class="option-card${currentAnswer === option.value ? ' is-active' : ''}"
                    type="button"
                    data-answer-value="${option.value}"
                  >
                    <span class="option-value">${option.value}</span>
                    <span class="option-copy">${escapeHtml(option.label)}</span>
                  </button>
                `,
              )
              .join('')}
          </div>

          <div class="quiz-controls">
            <button
              class="secondary-btn"
              type="button"
              id="previous-question"
              ${state.currentQuestionIndex === 0 ? 'disabled' : ''}
            >
              上一题
            </button>
            <button class="secondary-btn" type="button" id="next-question">
              ${
                state.currentQuestionIndex === totalQuestions - 1
                  ? isQuizComplete(state.answers)
                    ? '查看结果'
                    : '检查漏答'
                  : currentAnswer
                    ? '下一题'
                    : '先跳过'
              }
            </button>
          </div>
        </article>
      </section>

      <aside class="quiz-sidebar">
        <article class="palette-card">
          <p class="mini-label">题号导航</p>
          <p class="section-copy">
            点选项后会自动进入下一题。也可以直接点题号回看或补答。
          </p>
          <div class="question-palette">
            ${renderQuestionPalette()}
          </div>
        </article>

        <article class="palette-card">
          <p class="mini-label">答题提示</p>
          <ul class="helper-list">
            <li>不需要想“标准答案”，按直觉选更准。</li>
            <li>这套题背后有 6 个隐藏维度，但结果页只会展示最终人格。</li>
            <li>如果最后提示有漏答，会自动带你跳去第一道没做的题。</li>
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
          <p class="eyebrow">Your Result</p>
          <div class="result-badge-row">
            <span class="code-badge">${escapeHtml(result.code)}</span>
            <span class="status-pill">#${String(index).padStart(2, '0')} / 63</span>
          </div>
          <h1>${escapeHtml(result.name)}</h1>
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
              <strong>64</strong>
              <span>结果库映射成功</span>
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

      <details class="details-panel">
        <summary>查看幕后算分</summary>
        <div class="details-content">
          <p class="section-copy">
            这部分是开发逻辑，不会干扰前台结果展示。你的最终结果来自 6 个隐藏维度组成的二进制索引
            <strong>${binaryIndex}</strong>，十进制是 <strong>${index}</strong>。
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
          <p class="section-copy">
            这些是索引上离你最近的几型，不代表你次高概率会落在这里，但很适合用来继续看整套结果的气质。
          </p>
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
                  <p>${escapeHtml(neighbor.description)}</p>
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

  if (state.view === 'quiz') {
    return `
      <header class="topbar">
        <button class="brand brand-button" type="button" id="back-home-top">Mood Atlas</button>
        <div class="topbar-meta">
          <span class="status-pill">第 ${state.currentQuestionIndex + 1} 题 / ${totalQuestions}</span>
          <span class="ghost-link is-static">已答 ${answeredCount} 题</span>
        </div>
      </header>
    `
  }

  if (state.view === 'result') {
    return `
      <header class="topbar">
        <button class="brand brand-button" type="button" id="back-home-top">Mood Atlas</button>
        <div class="topbar-meta">
          <span class="status-pill">结果已生成</span>
          <span class="ghost-link is-static">48 题已完成</span>
        </div>
      </header>
    `
  }

  return `
    <header class="topbar">
      <a class="brand" href="#hero">Mood Atlas</a>
      <div class="topbar-meta">
        <span class="status-pill">48 题 / 6 维 / 64 结果</span>
        <a class="ghost-link" href="#library">浏览结果库</a>
      </div>
    </header>
  `
}

function render() {
  if (state.view === 'result' && !isQuizComplete(state.answers)) {
    state.view = 'quiz'
  }

  document.title = 'Mood Atlas | 64 型人格测试'

  app.innerHTML = `
    <div class="page-shell">
      <div class="ambient ambient-a"></div>
      <div class="ambient ambient-b"></div>
      ${renderTopbar()}
      ${state.view === 'home' ? renderHomeScreen() : ''}
      ${state.view === 'quiz' ? renderQuizScreen() : ''}
      ${state.view === 'result' ? renderResultScreen() : ''}
    </div>
  `

  document.querySelector('#start-quiz')?.addEventListener('click', startQuiz)
  document.querySelector('#random-preview')?.addEventListener('click', pickRandomPreview)
  document.querySelector('#back-home')?.addEventListener('click', goHome)
  document.querySelector('#back-home-top')?.addEventListener('click', goHome)
  document.querySelector('#restart-quiz')?.addEventListener('click', restartQuiz)
  document.querySelector('#copy-result')?.addEventListener('click', copyResultText)
  document.querySelector('#previous-question')?.addEventListener('click', previousQuestion)
  document.querySelector('#next-question')?.addEventListener('click', nextQuestion)

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
      document.querySelector('#library')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  })

  document.querySelectorAll('[data-go-question]').forEach((button) => {
    button.addEventListener('click', () => {
      const nextIndex = Number(button.dataset.goQuestion)
      goToQuestion(nextIndex)
    })
  })

  document.querySelectorAll('[data-answer-value]').forEach((button) => {
    button.addEventListener('click', () => {
      const value = Number(button.dataset.answerValue)
      selectAnswer(value)
    })
  })

  if (state.focusSearchAfterRender) {
    const searchInput = document.querySelector('#result-search')
    searchInput?.focus()
    searchInput?.setSelectionRange(searchInput.value.length, searchInput.value.length)
    state.focusSearchAfterRender = false
  }
}

render()
