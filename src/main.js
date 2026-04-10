import './style.css'
import { appMeta } from './app-meta.js'
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

function getPreviewResult() {
  return indexedResults.find((result) => result.code === state.previewCode) ?? indexedResults[0]
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
            <p class="preview-body">${escapeHtml(preview.friendRoast)}</p>
            <div class="preview-points">
              <span class="preview-chip">可爱的地方</span>
            </div>
            <p class="preview-note">${escapeHtml(preview.charm)}</p>
            <p class="preview-tip">给你的提醒：${escapeHtml(preview.reminder)}</p>
          </div>
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
            <button class="secondary-btn" id="back-home" type="button">
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
          <h2>这次结果页换成新版五段式文案</h2>
          <p class="section-copy">从一句话结论到提醒，整页内容都换成了更像朋友在认真点评你的版本。</p>
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
              : '<a class="ghost-link" href="#latest-update">查看本次更新</a>'
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

  document.querySelectorAll('[data-open-library]').forEach((button) => {
    button.addEventListener('click', () => {
      state.previewCode = button.dataset.openLibrary ?? indexedResults[0].code
      state.view = 'home'
      render()
      requestAnimationFrame(() => {
        scrollToSelector('#hero')
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

  if (state.view === 'quiz' && state.preservedQuizScrollY !== null) {
    const preservedScrollY = state.preservedQuizScrollY
    state.preservedQuizScrollY = null
    requestAnimationFrame(() => {
      window.scrollTo({ top: preservedScrollY })
    })
  }
}

render()
