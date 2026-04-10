import { axisMeta } from './quiz-data.js'

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

function defineNarrative(verdict, hiddenPain) {
  return { verdict, hiddenPain }
}

const resultNarrativesByCode = {
  OJBK: defineNarrative(
    '你不是佛，你只是懒得把有限精力花在无效争论上。',
    '别人总把你的“都行”当真，久了你连认真表达都嫌麻烦。',
  ),
  ATMR: defineNarrative(
    '你老是先替关系兜底，最后把自己兜得最累。',
    '最伤的不是付出，而是别人慢慢把你的补位当成理所当然。',
  ),
  SOLO: defineNarrative(
    '你习惯独自消化一切，连脆弱都要先自助处理。',
    '你太熟悉“说了也未必有用”，所以很多情绪只能在心里风干。',
  ),
  FAKE: defineNarrative(
    '你很会维持体面，但真实感受通常被你收在后台。',
    '越会演稳定，越容易没人发现你其实早就快掉线了。',
  ),
  LOOP: defineNarrative(
    '你的大脑像个复盘机，不把细节榨干就不肯下班。',
    '真正累你的往往不是事本身，而是停不下来的二次加工。',
  ),
  EMOO: defineNarrative(
    '白天还能正常营业，深夜就自动切到灵魂审判模式。',
    '你很多崩溃都发生在别人看不见的时段，所以也更难被接住。',
  ),
  ZZZZ: defineNarrative(
    '你不是不想处理，是系统一有压力就先省电。',
    '最怕别人把你的缓冲误读成摆烂，却没人看见你其实已经超载。',
  ),
  DEAD: defineNarrative(
    '你的问题不是没想法，是常年像没充满电。',
    '你知道很多事重要，但能量总在关键时刻先掉到红线。',
  ),
  HOLD: defineNarrative(
    '你会先顶住世界，再慢慢考虑自己会不会裂开。',
    '别人夸你能扛的同时，也默认你可以一直扛。',
  ),
  COLD: defineNarrative(
    '你一生气就先撤离现场，用安静代替争执。',
    '你以为自己在止损，别人却常常只读到疏远和关闭。',
  ),
  CRYZ: defineNarrative(
    '你的情绪是真直播，不太擅长把委屈延迟播放。',
    '你越真，越容易在还没解释前就先被人误解成太敏感。',
  ),
  JOKR: defineNarrative(
    '你总能把难受打包成段子，边流血边负责活跃气氛。',
    '梗抛得太熟练以后，别人会忘记你也是真的在疼。',
  ),
  WILD: defineNarrative(
    '你活得像高振幅情绪曲线，开心和崩溃都来真的。',
    '别人只看到你有戏剧张力，只有你知道自己其实很耗命。',
  ),
  BOSS: defineNarrative(
    '你不一定爱管，但你真的受不了场面失控。',
    '一旦你总是出来收拾，最后很多烂摊子都会自动落到你头上。',
  ),
  HEAL: defineNarrative(
    '你会烂会丧会掉线，但最后大概率还能把自己捞上来。',
    '外人容易因为你能恢复，就低估你每次沉下去时有多难受。',
  ),
  GONE: defineNarrative(
    '你一烦就蒸发，不是拉黑世界，是在后台自救。',
    '你消失得越熟练，越容易让人忽略你其实是在硬修自己。',
  ),
  SHIT: defineNarrative(
    '你骂骂咧咧归骂骂咧咧，关键时刻还是会把事捡起来。',
    '你总把认真藏在脏话后面，久了别人也不太会认真接你的累。',
  ),
  FINE: defineNarrative(
    '你最会把大风大浪压成一句“也就那样”。',
    '轻描淡写说多了，连真正想被看见的时刻都不知道怎么认真开口。',
  ),
  NOPE: defineNarrative(
    '你对消耗型关系和任务的第一反应就是拒绝加载。',
    '你不是没热情，只是太怕又把自己浪费在烂局里。',
  ),
  WHYU: defineNarrative(
    '你遇事会先追问为什么，直到把自己问得更累。',
    '你越想弄明白一切，越容易把自己困在没有标准答案的地方。',
  ),
  SORRY: defineNarrative(
    '你反射弧里自带一句“不好意思”，哪怕根本不是你的锅。',
    '你总想先缓冲别人的不舒服，结果把自己的边界压得太薄。',
  ),
  TIRED: defineNarrative(
    '你不是经历了什么惊天动地，是一直被细碎生活慢性消耗。',
    '累得太日常以后，连你自己都很难理直气壮地说“我撑不住了”。',
  ),
  PANIC: defineNarrative(
    '事情还没发生，你的大脑已经先跑完最坏预案。',
    '警报器开太久以后，你会把本来能过的日子也过成持续应激。',
  ),
  DRAMA: defineNarrative(
    '你的感受器从不开省电模式，什么都容易拉出情绪张力。',
    '你并不是故意放大，是很多人根本没体验过你那种真实强度。',
  ),
  NPCX: defineNarrative(
    '你在人群里像背景板，但其实一直在安静收集全场信号。',
    '越习惯隐身，越容易连重要时刻都没人记得来问问你的感受。',
  ),
  GLOW: defineNarrative(
    '你不一定最吵，但你很难真的毫无存在感。',
    '越容易被注意，越容易在状态差的时候还得维持体面在线。',
  ),
  CARE: defineNarrative(
    '你自带关系雷达，别人一句“没事”你都能听出异常。',
    '你对别人的波动太敏感，常常先把自己累成全天候预警系统。',
  ),
  KIDDO: defineNarrative(
    '你心里那套想被认真对待的系统，一直都没下线。',
    '你越真诚越直接，越容易在不够认真的关系里先受伤。',
  ),
  MONK: defineNarrative(
    '你不是看破红尘，你只是懒得再给烂事投入情绪。',
    '冷掉久了以后，连真正值得的人和事也可能被你一起挡在外面。',
  ),
  FWORD: defineNarrative(
    '你脾气先到，礼貌后到，但事通常还是会做完。',
    '嘴硬和情绪太快上线时，别人很容易只记住你的冲，不记得你的扛。',
  ),
  GLASS: defineNarrative(
    '你的在意和自尊都摆得很低，所以稍微一碰就会响。',
    '你最怕的不是一句重话，而是被轻轻带过却没人知道你其实很在意。',
  ),
  STUCK: defineNarrative(
    '你长期卡在想动和动不了之间，像系统一直转圈。',
    '别人只看见你没动，只有你知道自己早就在心里跑过很多次。',
  ),
  CTRL: defineNarrative(
    '你靠安排明白来获得安全感，越不确定越想接管。',
    '一旦局面不受控，你的焦虑就会立刻从后台冲到前台。',
  ),
  AAAB: defineNarrative(
    '你对关系的安心感，很大一部分来自算得清楚。',
    '你不是想斤斤计较，你只是太怕最后又轮到自己吃闷亏。',
  ),
  LOVER: defineNarrative(
    '你心动得快也真，感情系统总是比别人更早上线。',
    '你最大的危险不是投入，而是把稀缺的真心放错了地方。',
  ),
  EXXX: defineNarrative(
    '你表面翻篇很快，但旧情绪会在脑子里长期缓存。',
    '你难的不是承认过去，而是那些回收不掉的余温总会突然返场。',
  ),
  MUMM: defineNarrative(
    '你照顾人几乎是本能，提醒和操心就是你的爱语。',
    '你太容易把关心做成默认值，结果常常忘了自己也需要被照顾。',
  ),
  TANK: defineNarrative(
    '你可靠得像工具箱，先扛先忍先消化几乎成了本能。',
    '真正磨损你的不是一次大事，而是长期都没人问你需不需要停一下。',
  ),
  SNEAK: defineNarrative(
    '你解决不舒服的方式往往不是对抗，而是悄悄后退。',
    '你避开冲突的同时，也常把自己真正想说的话一起撤掉了。',
  ),
  BLUNT: defineNarrative(
    '你讲真话的速度通常快过你包装真话的耐心。',
    '你明明是想减少误会，却常常因为太直先制造一点工伤。',
  ),
  MOODY: defineNarrative(
    '你的内在天气系统很活跃，情绪切换不一定提前打招呼。',
    '你自己都还没来得及理解变化，别人就先给你贴上难搞标签了。',
  ),
  DIZZY: defineNarrative(
    '你不是笨，是现实世界经常把你吵到灵魂出走。',
    '越容易走神断片，越容易在需要高度在线的生活里对自己生气。',
  ),
  CHILL: defineNarrative(
    '你有种让人又急又羡慕的松弛感，很多事不愿意绷太紧。',
    '别人夸你松弛的时候，也可能顺手把你的认真和边界一起看轻了。',
  ),
  HURRY: defineNarrative(
    '你最大的特点不是快，而是对卡顿的忍耐值极低。',
    '你不是爱催，是事情一旦悬着，你整个人都会被拖得很烦。',
  ),
  DODGE: defineNarrative(
    '你擅长先绕开难题，等自己活下来再处理。',
    '逃得过一时的压迫感，却很难完全逃过事情迟早要回来的时刻。',
  ),
  SWEET: defineNarrative(
    '你不是嘴甜，你是心太软，见不得别人可怜巴巴。',
    '你明知道该收一点，还是会在别人一示弱时忍不住双手奉上。',
  ),
  RUDEY: defineNarrative(
    '你说话带刺但心不坏，欠揍感和靠谱感经常一起出现。',
    '你太会用损话挡真心，结果很多温柔都只能靠熟人才看得懂。',
  ),
  NERDY: defineNarrative(
    '你在意得很深，但表达总爱拐几道弯。',
    '你越想把真实藏得体面，越容易把自己先拧成一团。',
  ),
  YAYAY: defineNarrative(
    '你的喜欢和冲劲都很明显，脑内“冲吧”按钮特别大。',
    '上头时你很会点燃生活，回头时也更容易被自己吓一跳。',
  ),
  BROKE: defineNarrative(
    '你不是突然坏掉，是被生活一点点磕出了很多细裂纹。',
    '最难受的不是大崩一次，而是一直半碎不碎地继续过日子。',
  ),
  SMILE: defineNarrative(
    '你最擅长的不是笑，而是先把场面圆过去。',
    '你太熟悉顾全别人，于是经常连自己什么时候真的不舒服都要往后排。',
  ),
  BUBU: defineNarrative(
    '你脑补能力太强，一句“哦”都能生成完整连续剧。',
    '你最累的时候不是发生了什么，而是你已经在脑内演完十版坏结果。',
  ),
  GUILT: defineNarrative(
    '你的良心总在线，甚至在线得有点影响日常使用。',
    '你会把很多本不该你背的情绪也顺手扛到自己肩上。',
  ),
  PUSHY: defineNarrative(
    '你认定的事就想尽快推进，悬着会让你很不舒服。',
    '你不是没耐心，是长期半空吊着的状态真的会把你磨疯。',
  ),
  SPOIL: defineNarrative(
    '你对自己可以很狠，对喜欢的人却总会额外心软。',
    '你最大的破绽不是没原则，是原则一碰到感情就开始打折。',
  ),
  RISKY: defineNarrative(
    '你对“万一成了呢”这句话有种近乎本能的信仰。',
    '冲得太快的时候，你也会把后果和恢复成本一起赌进去。',
  ),
  WORTH: defineNarrative(
    '你做事前总会先算值不值，不愿再白白浪费自己。',
    '怕亏太久以后，你有时也会连值得的冒险一起犹豫掉。',
  ),
  DONTA: defineNarrative(
    '你一烦起来最需要的不是沟通，是世界先安静一下。',
    '情绪缓冲区太小的时候，连你在意的人都可能先被你挡在门外。',
  ),
  ICYBB: defineNarrative(
    '你外面那层冰壳很厚，但里面那块心其实很软。',
    '你为了不摔坏自己加厚包装，结果也让别人更难及时接近你。',
  ),
  CLING: defineNarrative(
    '你一旦确认关系，就会想靠近、想确认、想得到回应。',
    '你不是要很多，只是很怕关系一热起来又突然冷回去。',
  ),
  HAHAA: defineNarrative(
    '你习惯先用“哈哈哈”给情绪打个缓冲包。',
    '你把难受挡得太轻巧，别人就更容易误判你其实没那么难受。',
  ),
  SAVER: defineNarrative(
    '哪里缺人你就先补上，救火几乎是你的默认设置。',
    '你太常说“还是我来吧”，久了连你自己都会忘记求助这回事。',
  ),
  GREYY: defineNarrative(
    '你不炸眼也不极端，很多东西都藏在灰度里慢慢显形。',
    '越不高调的人，越容易在需要被认真看见时继续被当成没事。',
  ),
  ALIVE: defineNarrative(
    '你不是不会崩，你是崩完之后大概率还能续上。',
    '外人常常只看到你又活回来了，却看不到你每次回来的代价。',
  ),
}

const resultDisplayByLegacyCode = {
  OJBK: { code: 'OJBK', englishName: 'Whatever Type', name: '无所谓人' },
  ATMR: { code: 'ATMR', englishName: 'Overgiver', name: '垫付侠' },
  SOLO: { code: 'SOLO', englishName: 'Island Soul', name: '孤岛人' },
  FAKE: { code: 'FAKE', englishName: 'Masked One', name: '伪装人' },
  LOOP: { code: 'LOOP', englishName: 'Overthink Looper', name: '复盘怪' },
  EMOO: { code: 'EMOO', englishName: 'Midnight Emo', name: '夜游魂' },
  ZZZZ: { code: 'ZZZZ', englishName: 'Sleep Mode', name: '装死人' },
  DEAD: { code: 'DEAD', englishName: 'Low Battery', name: '低电量人' },

  HOLD: { code: 'HOLD', englishName: 'Hard Holder', name: '硬撑王' },
  COLD: { code: 'COLD', englishName: 'Silent Freezer', name: '冷处理人' },
  CRYZ: { code: 'CRYZ', englishName: 'Crybaby Core', name: '哭包体' },
  JOKR: { code: 'JOKR', englishName: 'Coping Joker', name: '段子精' },
  WILD: { code: 'WILD', englishName: 'Chaos Engine', name: '疯感人' },
  BOSS: { code: 'BOSS', englishName: 'Control Freak', name: '控场怪' },
  HEAL: { code: 'HEAL', englishName: 'Bounce-Back Type', name: '回弹人' },
  GONE: { code: 'GONE', englishName: 'Vanishing Act', name: '蒸发侠' },

  SHIT: { code: 'SHIT', englishName: 'Trash Talker', name: '嘴臭侠' },
  FINE: { code: 'FINE', englishName: 'Lowkey Pretender', name: '淡写怪' },
  NOPE: { code: 'NOPE', englishName: 'Hard Pass', name: '拒绝体' },
  WHYU: { code: 'WHYY', englishName: 'Why Machine', name: '追问怪' },
  SORRY: { code: 'SORRY', englishName: 'Apology Machine', name: '道歉人' },
  TIRED: { code: 'TIRED', englishName: 'Tired Soul', name: '疲惫精' },
  PANIC: { code: 'PANIC', englishName: 'Alarm System', name: '惊慌体' },
  DRAMA: { code: 'DRAMA', englishName: 'Drama Magnet', name: '戏剧人' },

  NPCX: { code: 'NPC', englishName: 'Background Unit', name: '背景板' },
  GLOW: { code: 'GLOW', englishName: 'Vibe Generator', name: '氛围精' },
  CARE: { code: 'CARE', englishName: 'Worry Loader', name: '操心怪' },
  KIDDO: { code: 'KIDDO', englishName: 'Inner Kid', name: '小孩人' },
  MONK: { code: 'MONK', englishName: 'Detached One', name: '看破人' },
  FWORD: { code: 'FWORD', englishName: 'Swear Reactor', name: '爆粗怪' },
  GLASS: { code: 'GLASS', englishName: 'Fragile Heart', name: '玻璃心' },
  STUCK: { code: 'STUCK', englishName: 'Frozen Engine', name: '卡住人' },

  CTRL: { code: 'CTRL', englishName: 'Control Panel', name: '控制怪' },
  AAAB: { code: 'LEDGR', englishName: 'Score Keeper', name: '记账人' },
  LOVER: { code: 'LOVER', englishName: 'Love Loader', name: '多情种' },
  EXXX: { code: 'XREC', englishName: 'Ex Cache', name: '前任脑' },
  MUMM: { code: 'MUMM', englishName: 'Mom Friend', name: '妈妈人' },
  TANK: { code: 'TANK', englishName: 'Damage Tank', name: '扛把子' },
  SNEAK: { code: 'FADE', englishName: 'Quiet Exit', name: '偷退人' },
  BLUNT: { code: 'BLUNT', englishName: 'Straight Shooter', name: '直球怪' },

  MOODY: { code: 'MOODY', englishName: 'Mood Swinger', name: '阴晴怪' },
  DIZZY: { code: 'DIZZY', englishName: 'Floaty Brain', name: '迷糊体' },
  CHILL: { code: 'CHILL', englishName: 'Loose Vibes', name: '散漫王' },
  HURRY: { code: 'HURRY', englishName: 'Rush Mode', name: '急急国王' },
  DODGE: { code: 'DODGE', englishName: 'Escape Artist', name: '闪避怪' },
  SWEET: { code: 'SWEET', englishName: 'Soft Candy', name: '软糖人' },
  RUDEY: { code: 'RUDEY', englishName: 'Mean Cutie', name: '欠揍人' },
  NERDY: { code: 'NERDY', englishName: 'Twisted Thinker', name: '拧巴精' },

  YAYAY: { code: 'YAYAY', englishName: 'Hype Rocket', name: '上头怪' },
  BROKE: { code: 'BROKE', englishName: 'Cracked Soul', name: '碎掉人' },
  SMILE: { code: 'SMILE', englishName: 'Smile Mask', name: '假笑怪' },
  BUBU: { code: 'BUBU', englishName: 'Scenario Builder', name: '脑补王' },
  GUILT: { code: 'GUILT', englishName: 'Guilt Carrier', name: '内疚体' },
  PUSHY: { code: 'PUSHY', englishName: 'Momentum Pusher', name: '推进器' },
  SPOIL: { code: 'SPOIL', englishName: 'Soft Spotter', name: '纵容怪' },
  RISKY: { code: 'RISKY', englishName: 'Gamble Brain', name: '冒险派' },

  WORTH: { code: 'WORTH', englishName: 'Cost Checker', name: '值吗人' },
  DONTA: { code: 'MUTE', englishName: 'Do Not Disturb', name: '别烦我' },
  ICYBB: { code: 'SHELL', englishName: 'Icy Shell', name: '冰壳心' },
  CLING: { code: 'CLING', englishName: 'Velcro Heart', name: '黏人怪' },
  HAHAA: { code: 'HAHA', englishName: 'Laugh Buffer', name: '哈哈人' },
  SAVER: { code: 'SAVER', englishName: 'Firefighter Friend', name: '救火队' },
  GREYY: { code: 'GREYY', englishName: 'Soft Blur', name: '灰度人' },
  ALIVE: { code: 'ALIVE', englishName: 'Comes-Back Type', name: '回春人' },
}

const axisOrder = ['A', 'B', 'C', 'D', 'E', 'F']

const axisPairStrengths = {
  AB: {
    '00': '能把情绪和边界都收稳，不容易被关系轻易拖着跑。',
    '01': '嘴上可以收着，心里却会认真挂着人，关系里很有耐力。',
    '10': '感受来得真也表达得真，别人很容易知道你不是在敷衍。',
    '11': '表达和在乎都很直接，跟你相处通常能感到明确温度。',
  },
  CD: {
    '00': '关键时刻有顶住和接管的能力，烂摊子面前不容易完全失速。',
    '01': '知道什么时候该先稳住，什么时候该顺势调整，不会硬把自己逼死。',
    '10': '就算想躺一下，真到需要扛的时候也有把事兜住的本能。',
    '11': '你会给自己留缓冲，也能根据局面改打法，韧性其实不低。',
  },
  EF: {
    '00': '洞察细节和潜台词很敏锐，同时还能先把情绪降温处理。',
    '01': '想得细也反应真，既能抓住细节，又能让感受有出口。',
    '10': '判断直接，不容易被脑内小剧场困太久，处理事情效率高。',
    '11': '直觉和情绪都在线，气氛感、感染力和当下反应都很强。',
  },
}

function getBitsFromIndex(index) {
  return Object.fromEntries(
    axisOrder.map((axis, axisIndex) => [axis, (index >> (5 - axisIndex)) & 1]),
  )
}

function getFirstSentence(text) {
  const [firstSentence] = text.split(/[。！？]/)
  return firstSentence ? `${firstSentence.trim()}。` : text
}

function buildStrengths(index) {
  const bits = getBitsFromIndex(index)

  return [
    axisPairStrengths.AB[`${bits.A}${bits.B}`],
    axisPairStrengths.CD[`${bits.C}${bits.D}`],
    axisPairStrengths.EF[`${bits.E}${bits.F}`],
    `你的六维落点更偏向 ${axisOrder
      .map((axis) =>
        bits[axis] === 0 ? axisMeta[axis].lowLabel : axisMeta[axis].highLabel,
      )
      .join(' / ')}。`,
  ]
}

function buildBarrage(profile) {
  return [
    { label: '朋友锐评', text: profile.verdict },
    { label: '本人嘴上', text: getFirstSentence(profile.description) },
    { label: '内心实况', text: profile.hiddenPain },
  ]
}

const legacyResultMap = [
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

export const resultMap = legacyResultMap.map((entry) => ({
  index: entry.index,
  ...resultDisplayByLegacyCode[entry.code],
}))

export const indexedResults = legacyResultMap.map((entry) => {
  const legacyCode = entry.code
  const profile = resultProfilesByCode[legacyCode]
  const narrative = resultNarrativesByCode[legacyCode]
  const display = resultDisplayByLegacyCode[legacyCode]

  if (!profile) {
    throw new Error(`Missing profile for result code: ${legacyCode}`)
  }

  if (!narrative) {
    throw new Error(`Missing narrative for result code: ${legacyCode}`)
  }

  if (!display) {
    throw new Error(`Missing display metadata for result code: ${legacyCode}`)
  }

  return {
    code: display.code,
    englishName: display.englishName,
    name: display.name,
    description: profile.description,
    index: entry.index,
    verdict: narrative.verdict,
    hiddenPain: narrative.hiddenPain,
    strengths: buildStrengths(entry.index),
    barrage: buildBarrage({
      code: display.code,
      englishName: display.englishName,
      name: display.name,
      description: profile.description,
      verdict: narrative.verdict,
      hiddenPain: narrative.hiddenPain,
    }),
  }
})

export const resultByCode = Object.fromEntries(indexedResults.map((result) => [result.code, result]))
