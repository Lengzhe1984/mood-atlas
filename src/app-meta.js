export const appMeta = {
  stage: 'Beta',
  version: '0.1.0-beta.7',
  repoUrl: 'https://github.com/Lengzhe1984/mood-atlas',
  siteUrl: 'https://lengzhe1984.github.io/mood-atlas/',
  latestUpdateTitle: '首页更新区改成简版日志',
  latestUpdatePoints: [
    '首页不再展示大面积更新卡片，改成更像软件版本说明的文字形式。',
    '首页只保留最近 3 次更新内容，阅读路径更短，也更接近 README 的感觉。',
    '更新区继续保留版本号，后续每次迭代都可以顺着往下追加。',
  ],
  recentUpdates: [
    {
      version: '0.1.0-beta.7',
      notes: [
        '首页更新区改成更紧凑的版本日志，不再使用大卡片。',
        '只保留最近 3 次更新内容，改成 README 风格的文字说明。',
      ],
    },
    {
      version: '0.1.0-beta.6',
      notes: [
        '手机端答题页顶部不再显示 Beta Quiz Flow。',
        '答题提示提前到最上方，更新说明改到答题页底部小字展示。',
      ],
    },
    {
      version: '0.1.0-beta.5',
      notes: [
        '首页移除整段 64 结果预览，减少无效滚动。',
        'How It Works 改成更新摘要，不再使用三连卡片。',
      ],
    },
  ],
}
