export const answerOptions = [
  { value: 1, label: '你别乱说' },
  { value: 2, label: '不太像' },
  { value: 3, label: '一半一半' },
  { value: 4, label: '挺像我的' },
  { value: 5, label: '像到离谱' },
]

export const axisMeta = {
  A: {
    title: '表达方式',
    lowLabel: '嘴硬压着',
    highLabel: '外露写脸上',
    tieBreakerQuestionId: 8,
  },
  B: {
    title: '关系距离',
    lowLabel: '抽离自扛',
    highLabel: '黏连挂心',
    tieBreakerQuestionId: 16,
  },
  C: {
    title: '应对方式',
    lowLabel: '硬撑顶住',
    highLabel: '摆烂缓冲',
    tieBreakerQuestionId: 24,
  },
  D: {
    title: '行动姿态',
    lowLabel: '控场接管',
    highLabel: '随流看情况',
    tieBreakerQuestionId: 32,
  },
  E: {
    title: '认知路径',
    lowLabel: '脑补复盘',
    highLabel: '直给按字面',
    tieBreakerQuestionId: 40,
  },
  F: {
    title: '情绪出口',
    lowLabel: '冷处理静音',
    highLabel: '发疯热反应',
    tieBreakerQuestionId: 48,
  },
}

export const quizQuestions = [
  { id: 1, text: '我经常嘴上说“没事”，哪怕心里其实有事。', axis: 'A', reverse: true },
  { id: 2, text: '我情绪一来，很难完全装得像没事。', axis: 'A', reverse: false },
  { id: 3, text: '我越在意，表面越容易装得轻描淡写。', axis: 'A', reverse: true },
  { id: 4, text: '别人通常能很快看出我今天状态不对。', axis: 'A', reverse: false },
  { id: 5, text: '我习惯把真实反应藏到安全的时候再说。', axis: 'A', reverse: true },
  { id: 6, text: '我不太擅长假装平静，脸上容易写字。', axis: 'A', reverse: false },
  { id: 7, text: '就算受委屈，我第一反应也不是当场说开。', axis: 'A', reverse: true },
  { id: 8, text: '真碰到点上，我会明显让人感觉“我现在有情绪”。', axis: 'A', reverse: false },

  { id: 9, text: '难受时我更想自己待着，不太想立刻找人说。', axis: 'B', reverse: true },
  { id: 10, text: '我一旦确认关系，就会很在意对方有没有回应。', axis: 'B', reverse: false },
  { id: 11, text: '很多时候不是别人不重要，是我更习惯先把门关上。', axis: 'B', reverse: true },
  { id: 12, text: '我会忍不住去确认别人是不是还在意我。', axis: 'B', reverse: false },
  { id: 13, text: '被人靠太近时，我会本能想退一点。', axis: 'B', reverse: true },
  { id: 14, text: '我喜欢关系里有明确存在感，而不是若有若无。', axis: 'B', reverse: false },
  { id: 15, text: '需要帮助时，我通常还是先靠自己。', axis: 'B', reverse: true },
  { id: 16, text: '我很难对重要的人彻底“随便”，总会多挂心一点。', axis: 'B', reverse: false },

  { id: 17, text: '再累我也会先顶着，把事做完再说。', axis: 'C', reverse: true },
  { id: 18, text: '压力一大，我会很想先躺平一下。', axis: 'C', reverse: false },
  { id: 19, text: '我经常把“先撑过去”排在“先照顾自己”前面。', axis: 'C', reverse: true },
  { id: 20, text: '一旦消息和任务一起涌过来，我会本能想静音。', axis: 'C', reverse: false },
  { id: 21, text: '即使状态差，我也会逼自己保持在线。', axis: 'C', reverse: true },
  { id: 22, text: '有些事不是不会做，是得拖到最后才有力气动。', axis: 'C', reverse: false },
  { id: 23, text: '我不太允许自己当场垮掉。', axis: 'C', reverse: true },
  { id: 24, text: '如果能缓一天，我通常会想先缓一天。', axis: 'C', reverse: false },

  { id: 25, text: '场面一乱，我会下意识想接手安排。', axis: 'D', reverse: true },
  { id: 26, text: '与其定一堆计划，我更习惯看情况再说。', axis: 'D', reverse: false },
  { id: 27, text: '我对“事情悬着不动”这件事耐受度很低。', axis: 'D', reverse: true },
  { id: 28, text: '很多时候我会顺着局面走，而不是非要自己主导。', axis: 'D', reverse: false },
  { id: 29, text: '比起等别人决定，我更愿意自己定方向。', axis: 'D', reverse: true },
  { id: 30, text: '我不太想管全局，只想先把自己活明白。', axis: 'D', reverse: false },
  { id: 31, text: '失控感会让我很烦。', axis: 'D', reverse: true },
  { id: 32, text: '只要不太离谱，我通常可以接受事情自然发展。', axis: 'D', reverse: false },

  { id: 33, text: '别人一句语气不对，我能在脑子里回放很久。', axis: 'E', reverse: true },
  { id: 34, text: '比起猜来猜去，我更愿意直接按字面理解。', axis: 'E', reverse: false },
  { id: 35, text: '我常常不是被事累，是被自己反复分析累。', axis: 'E', reverse: true },
  { id: 36, text: '我不太喜欢反复琢磨潜台词，能直说最好。', axis: 'E', reverse: false },
  { id: 37, text: '很多已经过去的小细节，我还是会复盘。', axis: 'E', reverse: true },
  { id: 38, text: '我做判断时更依赖当下感觉，不太反刍。', axis: 'E', reverse: false },
  { id: 39, text: '我经常会想“他这句话是不是还有别的意思”。', axis: 'E', reverse: true },
  { id: 40, text: '能一次说清的事，我不喜欢在心里绕来绕去。', axis: 'E', reverse: false },

  { id: 41, text: '我不爽时更容易安静下来，而不是当场炸。', axis: 'F', reverse: true },
  { id: 42, text: '开心、生气、委屈这些情绪，我通常都比较明显。', axis: 'F', reverse: false },
  { id: 43, text: '我处理情绪的方式常常是先降温、先少说话。', axis: 'F', reverse: true },
  { id: 44, text: '我一上头，周围人一般都能感觉到。', axis: 'F', reverse: false },
  { id: 45, text: '不想处理一段关系时，我更可能拉开距离。', axis: 'F', reverse: true },
  { id: 46, text: '难受的时候，我很难装得像什么都没发生。', axis: 'F', reverse: false },
  { id: 47, text: '我的情绪很多时候是“先静音，再决定”。', axis: 'F', reverse: true },
  { id: 48, text: '真被点着了，我反应通常会比较大。', axis: 'F', reverse: false },
]

export const totalQuestions = quizQuestions.length

export const axisSections = Object.entries(axisMeta).map(([axis, meta]) => ({
  axis,
  ...meta,
  questions: quizQuestions.filter((question) => question.axis === axis),
}))
