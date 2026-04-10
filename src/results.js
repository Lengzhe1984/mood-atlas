const resultProfilesByCode = {
  OJBK: {
    code: 'OJBK',
    name: '无所谓人',
    description:
      '表面上“都行都可以随便”，实际上只是懒得争。你这朋友不是没意见，是把意见全省着用了。',
  },
  ATMR: {
    code: 'ATMR',
    name: '垫付侠',
    description:
      '总爱多给一点、多做一点、多扛一点，最后把自己活成关系里的自动补款机。心软是真的，吃亏也是真的。',
  },
  SOLO: {
    code: 'SOLO',
    name: '孤岛人',
    description:
      '能自己消化就自己消化，能不麻烦别人就不麻烦别人。你不是高冷，你只是太熟悉“说了也未必有用”那种感觉。',
  },
  FAKE: {
    code: 'FAKE',
    name: '伪装人',
    description:
      '很会营业，很会体面，很会把真正的情绪折叠起来。别人眼里你挺稳，只有你知道自己天天在演正常。',
  },
  LOOP: {
    code: 'LOOP',
    name: '复盘怪',
    description:
      '一句话能想三天，一个眼神能拆八层。你这朋友不是心思细，是脑子根本没打算放过自己。',
  },
  EMOO: {
    code: 'EMOO',
    name: '夜游魂',
    description:
      '白天看着没啥毛病，晚上突然开始思考人生、关系和自己到底哪里烂了。属于典型的深夜限定版脆弱生物。',
  },
  ZZZZ: {
    code: 'ZZZZ',
    name: '装死人',
    description:
      '一有压力先躺，一有任务先缓，一有消息先假装没看见。不是故意摆烂，是系统每次都先进入省电模式。',
  },
  DEAD: {
    code: 'DEAD',
    name: '低电量人',
    description:
      '对很多事都提不起劲，不是不懂重要，只是能量条常年偏红。你不是没想法，是整个人像没充满过。',
  },
  HOLD: {
    code: 'HOLD',
    name: '硬撑王',
    description:
      '再烦也先顶着，再累也先不倒。你这朋友嘴上说没事，实际上像拿自己的骨头给全世界打地基。',
  },
  COLD: {
    code: 'COLD',
    name: '冷处理人',
    description:
      '不吵，不闹，不解释，直接安静下来。你不是不生气，你只是生气时会切到“我先把自己撤走”的模式。',
  },
  CRYZ: {
    code: 'CRYZ',
    name: '哭包体',
    description:
      '情绪是真的藏不住，委屈来了眼睛先知道。好处是真诚，坏处是你想装酷的时候根本装不了半小时。',
  },
  JOKR: {
    code: 'JOKR',
    name: '段子精',
    description:
      '越难受越想开玩笑，越尴尬越会整活。你不是幽默感太强，你只是老拿梗给自己止血。',
  },
  WILD: {
    code: 'WILD',
    name: '疯感人',
    description:
      '高兴是真高兴，崩溃也是真崩溃。你活得像一条情绪波形图，旁人看着刺激，你自己坐在上面晕车。',
  },
  BOSS: {
    code: 'BOSS',
    name: '控场怪',
    description:
      '场面一乱你就想接手，别人一散你就想收拾。你不是天生爱管事，是失控会让你浑身难受。',
  },
  HEAL: {
    code: 'HEAL',
    name: '自愈体',
    description:
      '虽然也会烂、也会丧、也会掉线，但最后总能慢慢把自己捞回来。你这朋友恢复速度不一定快，但生命力确实顽强。',
  },
  GONE: {
    code: 'GONE',
    name: '蒸发侠',
    description:
      '一烦就消失，一累就静音，一委屈就不想说话。熟你的人都知道，你不是失踪，是去后台抢修自己了。',
  },
  SHIT: {
    code: 'SHIT',
    name: '嘴臭侠',
    description:
      '嘴上老在骂世界，心里其实还挺认真。你这人最有意思的地方就是：一边嫌弃一切，一边又偷偷把责任捡起来。',
  },
  FINE: {
    code: 'FINE',
    name: '淡写怪',
    description:
      '什么都能说成“还行吧”“也就那样”。不是你真这么淡定，是你习惯把大风大浪先压成一句轻飘飘的话。',
  },
  NOPE: {
    code: 'NOPE',
    name: '拒绝体',
    description:
      '第一反应永远是“不想”“算了”“别来”。你不是叛逆，你只是很难对无意义的消耗假装热情。',
  },
  WHYU: {
    code: 'WHYU',
    name: '追问怪',
    description:
      '凡事都想问一句为什么，尤其是别人的态度和自己的倒霉。你不是求知欲旺盛，你是非得把自己问累了才算完。',
  },
  SORRY: {
    code: 'SORRY',
    name: '道歉人',
    description:
      '哪怕不是你的锅，你也会条件反射先说一句不好意思。你这朋友礼貌得过头，活像从小把自己练成了人形缓冲垫。',
  },
  TIRED: {
    code: 'TIRED',
    name: '疲惫精',
    description:
      '没干多少惊天动地的大事，但就是一直累。你像那种生活每次只揍一拳，结果攒起来把人打麻了的样本。',
  },
  PANIC: {
    code: 'PANIC',
    name: '惊慌体',
    description:
      '事还没发生，你已经先把最坏结果想了一遍。你不是悲观，是大脑装了个自动报警器，而且灵敏度还调太高。',
  },
  DRAMA: {
    code: 'DRAMA',
    name: '戏剧人',
    description:
      '很多事情到你这里，情绪张力都会自动拉满。不是你爱演，是你的感受器从来不开省电模式。',
  },
  NPCX: {
    code: 'NPCX',
    name: '背景板',
    description:
      '在人群里经常自动透明，不争不抢不抢镜。别人容易忘记你在场，但你其实把全场都看得挺清楚。',
  },
  GLOW: {
    code: 'GLOW',
    name: '氛围人',
    description:
      '不一定话最多，但很容易被注意到。你这朋友身上总有点“我不一定要赢，但我得有存在感”的气场。',
  },
  CARE: {
    code: 'CARE',
    name: '操心怪',
    description:
      '别人一句“没事”，你能听出三层不对劲。你不是爱管闲事，你是天然把自己活成了关系里的预警系统。',
  },
  KIDDO: {
    code: 'KIDDO',
    name: '小孩人',
    description:
      '开心难过都挺直接，喜欢讨厌也很明显。你不是幼稚，是心里那套“我想要被认真对待”的系统一直没卸载。',
  },
  MONK: {
    code: 'MONK',
    name: '出家体',
    description:
      '不争不抢不解释，很多事你都懒得投入情绪。你不是看破红尘，你只是发现大多数拉扯都不值得耗命。',
  },
  FWORD: {
    code: 'FWORD',
    name: '爆粗怪',
    description:
      '嘴比脑子快，情绪比礼貌先上线。你这个人厉害的地方是，骂完通常也还是会把事做了。',
  },
  GLASS: {
    code: 'GLASS',
    name: '玻璃心',
    description:
      '别人一句不重的话，到你心里都能叮一下。不是你矫情，是你的自尊和在意都摆在离地面太近的位置。',
  },
  STUCK: {
    code: 'STUCK',
    name: '卡住人',
    description:
      '你不是不想动，是总在“想动”和“动不了”之间反复横跳。别人看你像拖延，其实你更像系统卡顿。',
  },
  CTRL: {
    code: 'CTRL',
    name: '控制怪',
    description:
      '凡事都想安排明白，不是因为你多爱主导，而是你太烦那种不确定感。你这朋友不是强势，是见不得散。',
  },
  AAAB: {
    code: 'AAAB',
    name: '算账人',
    description:
      '边界感主要靠算清楚，关系感主要靠别糊涂。你不是抠，是讨厌那种谁都不说、最后全靠你吃哑巴亏的局。',
  },
  LOVER: {
    code: 'LOVER',
    name: '多情种',
    description:
      '很容易动心，也很容易把别人放进心里。你不是恋爱脑，你只是感情系统更新得比别人积极一点。',
  },
  EXXX: {
    code: 'EXXX',
    name: '前任脑',
    description:
      '表面上早翻篇了，实际上很多旧情绪还在缓存。你这朋友不是放不下，是脑子有点自动备份功能。',
  },
  MUMM: {
    code: 'MUMM',
    name: '妈妈人',
    description:
      '总想提醒、总想照顾、总想确认别人别出事。你不是爱控制，你只是把“操心”练成了表达爱的母语。',
  },
  TANK: {
    code: 'TANK',
    name: '扛把子',
    description:
      '能扛的先扛，能忍的先忍，能自己消化的绝不外包。你这人可靠得像个工具箱，但工具箱也是会磨损的。',
  },
  SNEAK: {
    code: 'SNEAK',
    name: '偷退人',
    description:
      '不喜欢正面冲突，很多不舒服都靠悄悄后退解决。你不是怂，你只是觉得很多对抗根本不值票价。',
  },
  BLUNT: {
    code: 'BLUNT',
    name: '直球怪',
    description:
      '想到什么就说什么，受不了拐弯抹角。你这朋友有时像真诚，有时像工伤，但至少很少让人猜。',
  },
  MOODY: {
    code: 'MOODY',
    name: '阴晴怪',
    description:
      '情绪切换全看天意，前一秒还挺好，后一秒就不太想活人社交。你不是难伺候，你只是内在天气系统太活跃。',
  },
  DIZZY: {
    code: 'DIZZY',
    name: '迷糊体',
    description:
      '经常走神，经常断片，经常灵魂不知道飘哪去了。你不是傻，你只是现实世界对你来说有点太吵。',
  },
  CHILL: {
    code: 'CHILL',
    name: '散漫王',
    description:
      '不爱绷太紧，不爱把一切搞得太重。你这朋友像那种能把别人急死、又让别人羡慕他松弛感的人。',
  },
  HURRY: {
    code: 'HURRY',
    name: '急急国王',
    description:
      '想到就要做，卡一下就烦。你不是执行力强，你是耐心值低到几乎不支持加载动画。',
  },
  DODGE: {
    code: 'DODGE',
    name: '闪避怪',
    description:
      '不想回答的就绕开，不想面对的就延后。你不是不知道问题在那儿，你只是习惯先活下来再说。',
  },
  SWEET: {
    code: 'SWEET',
    name: '软糖人',
    description:
      '嘴不一定甜，心倒是真的软。你这朋友看着能讲道理，实则别人稍微可怜一点你就开始心软。',
  },
  RUDEY: {
    code: 'RUDEY',
    name: '欠揍人',
    description:
      '说话爱损，吐槽带刺，偏偏又没什么真坏心。你属于那种很欠打，但关键时刻又挺让人放心的朋友。',
  },
  NERDY: {
    code: 'NERDY',
    name: '拧巴精',
    description:
      '想得多，表达绕，明明在意却非要装得没那么在意。你这人像一团耳机线，拆开得花时间，但不是没有顺的时候。',
  },
  YAYAY: {
    code: 'YAYAY',
    name: '上头怪',
    description:
      '喜欢的时候特别明显，冲动的时候也特别明显。你不是热情，是脑子里的“算了冲吧”按钮太大了。',
  },
  BROKE: {
    code: 'BROKE',
    name: '碎掉人',
    description:
      '没发生什么毁天灭地的大事，但你整个人就是有点碎。你不是矫情，是被生活反复磕碰后留下了很多小裂纹。',
  },
  SMILE: {
    code: 'SMILE',
    name: '假笑怪',
    description:
      '再累也先笑一下，再烦也先把场面圆过去。你不是好脾气，是从小就知道“不让别人难受”比“让自己舒服”更容易被夸。',
  },
  BUBU: {
    code: 'BUBU',
    name: '脑补王',
    description:
      '别人一句“哦”，你能自动补完十种潜台词。你不是阅读理解强，你是总担心自己是不是哪里又不对劲了。',
  },
  GUILT: {
    code: 'GUILT',
    name: '内疚体',
    description:
      '哪怕不是你的责任，你也会忍不住有点自责。你这朋友良心太在线，在线得有点影响正常使用。',
  },
  PUSHY: {
    code: 'PUSHY',
    name: '推进器',
    description:
      '只要认定一件事，就想赶紧往前推。你不是催命，是实在受不了事情悬在半空晃来晃去。',
  },
  SPOIL: {
    code: 'SPOIL',
    name: '纵容怪',
    description:
      '对自己挺狠，对喜欢的人却很容易双标。你不是没原则，你只是每次原则遇到感情都会自动打折。',
  },
  RISKY: {
    code: 'RISKY',
    name: '冒险派',
    description:
      '有些人活得谨慎，你活得像“先做再说”。你不是莽，是对“万一成了呢”这句话有种神秘信仰。',
  },
  WORTH: {
    code: 'WORTH',
    name: '值吗人',
    description:
      '做事前总会先在心里算一遍值不值。你不是功利，你只是很怕再把真心和精力浪费在烂地方。',
  },
  DONTA: {
    code: 'DONTA',
    name: '别烦我',
    description:
      '一旦烦起来，世界上最想说的话就是“先别跟我讲话”。你不是针对谁，你只是情绪缓冲区太小了。',
  },
  ICYBB: {
    code: 'ICYBB',
    name: '冰壳心',
    description:
      '外面硬，里面软，只是软的那部分你不给人随便看。你不是没感情，你只是防摔包装比较厚。',
  },
  CLING: {
    code: 'CLING',
    name: '黏人怪',
    description:
      '确认了关系就会想靠近、想联系、想有回应。你不是缺爱，你只是很怕热起来的关系突然降温。',
  },
  HAHAA: {
    code: 'HAHAA',
    name: '哈哈人',
    description:
      '很多难受都先拿“哈哈哈”垫一下。你像那种聊天记录里看着很轻松，实际情绪全靠语气词在挡的人。',
  },
  SAVER: {
    code: 'SAVER',
    name: '救火队',
    description:
      '哪里乱了你就往哪补，哪里缺人你就先上。你不是圣母，你只是太习惯把“还是我来吧”当默认设置。',
  },
  GREYY: {
    code: 'GREYY',
    name: '灰度人',
    description:
      '不太极端，不太高调，也不太容易被看透。你像雾天，没那么炸眼，但靠近了会发现里面东西不少。',
  },
  ALIVE: {
    code: 'ALIVE',
    name: '回春体',
    description:
      '哪怕低谷时真挺烂，过一阵你又能慢慢活回来。你这朋友最大的本事不是从不崩，是每次崩完都还能续上。',
  },
}

export const resultMap = [
  { index: 0, code: 'CTRL', name: '控制怪' },
  { index: 1, code: 'SHIT', name: '嘴臭侠' },
  { index: 2, code: 'AAAB', name: '算账人' },
  { index: 3, code: 'BLUNT', name: '直球怪' },
  { index: 4, code: 'GREYY', name: '灰度人' },
  { index: 5, code: 'RUDEY', name: '欠揍人' },
  { index: 6, code: 'NOPE', name: '拒绝体' },
  { index: 7, code: 'DONTA', name: '别烦我' },

  { index: 8, code: 'ZZZZ', name: '装死人' },
  { index: 9, code: 'BROKE', name: '碎掉人' },
  { index: 10, code: 'DODGE', name: '闪避怪' },
  { index: 11, code: 'DIZZY', name: '迷糊体' },
  { index: 12, code: 'SOLO', name: '孤岛人' },
  { index: 13, code: 'GONE', name: '蒸发侠' },
  { index: 14, code: 'CHILL', name: '散漫王' },
  { index: 15, code: 'FINE', name: '淡写怪' },

  { index: 16, code: 'ATMR', name: '垫付侠' },
  { index: 17, code: 'CARE', name: '操心怪' },
  { index: 18, code: 'MUMM', name: '妈妈人' },
  { index: 19, code: 'SAVER', name: '救火队' },
  { index: 20, code: 'HOLD', name: '硬撑王' },
  { index: 21, code: 'SORRY', name: '道歉人' },
  { index: 22, code: 'SWEET', name: '软糖人' },
  { index: 23, code: 'SMILE', name: '假笑怪' },

  { index: 24, code: 'TIRED', name: '疲惫精' },
  { index: 25, code: 'GUILT', name: '内疚体' },
  { index: 26, code: 'HEAL', name: '自愈体' },
  { index: 27, code: 'HAHAA', name: '哈哈人' },
  { index: 28, code: 'CLING', name: '黏人怪' },
  { index: 29, code: 'EXXX', name: '前任脑' },
  { index: 30, code: 'LOVER', name: '多情种' },
  { index: 31, code: 'ALIVE', name: '回春体' },

  { index: 32, code: 'BOSS', name: '控场怪' },
  { index: 33, code: 'FWORD', name: '爆粗怪' },
  { index: 34, code: 'HURRY', name: '急急国王' },
  { index: 35, code: 'PUSHY', name: '推进器' },
  { index: 36, code: 'GLOW', name: '氛围人' },
  { index: 37, code: 'YAYAY', name: '上头怪' },
  { index: 38, code: 'RISKY', name: '冒险派' },
  { index: 39, code: 'WILD', name: '疯感人' },

  { index: 40, code: 'STUCK', name: '卡住人' },
  { index: 41, code: 'PANIC', name: '惊慌体' },
  { index: 42, code: 'OJBK', name: '无所谓人' },
  { index: 43, code: 'JOKR', name: '段子精' },
  { index: 44, code: 'NPCX', name: '背景板' },
  { index: 45, code: 'EMOO', name: '夜游魂' },
  { index: 46, code: 'WHYU', name: '追问怪' },
  { index: 47, code: 'MOODY', name: '阴晴怪' },

  { index: 48, code: 'FAKE', name: '伪装人' },
  { index: 49, code: 'DRAMA', name: '戏剧人' },
  { index: 50, code: 'SPOIL', name: '纵容怪' },
  { index: 51, code: 'CRYZ', name: '哭包体' },
  { index: 52, code: 'TANK', name: '扛把子' },
  { index: 53, code: 'KIDDO', name: '小孩人' },
  { index: 54, code: 'BUBU', name: '脑补王' },
  { index: 55, code: 'NERDY', name: '拧巴精' },

  { index: 56, code: 'LOOP', name: '复盘怪' },
  { index: 57, code: 'GLASS', name: '玻璃心' },
  { index: 58, code: 'COLD', name: '冷处理人' },
  { index: 59, code: 'ICYBB', name: '冰壳心' },
  { index: 60, code: 'MONK', name: '出家体' },
  { index: 61, code: 'SNEAK', name: '偷退人' },
  { index: 62, code: 'WORTH', name: '值吗人' },
  { index: 63, code: 'DEAD', name: '低电量人' },
]

export const indexedResults = resultMap.map((entry) => {
  const profile = resultProfilesByCode[entry.code]

  if (!profile) {
    throw new Error(`Missing profile for result code: ${entry.code}`)
  }

  if (profile.name !== entry.name) {
    throw new Error(`Result name mismatch for ${entry.code}: ${profile.name} !== ${entry.name}`)
  }

  return {
    ...profile,
    index: entry.index,
  }
})

export const resultByCode = Object.fromEntries(indexedResults.map((result) => [result.code, result]))
