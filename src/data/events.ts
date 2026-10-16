import type { HistEvent } from "./types";

// 历史事件：时间轴上的『主轴』节点
export const events: HistEvent[] = [
  // ===== 先秦 =====
  {
    id: "e-wuwang", year: -1046, title: "武王伐纣，西周建立", eraId: "xianqin",
    type: "政治",
    description: "周武王在牧野之战击败商纣王，建立西周，大行分封，以宗法礼乐维系统治。孔子日后所怀念的『周礼』即源于此。",
    figures: [], works: ["w-shijing"],
  },
  {
    id: "e-pingwang", year: -770, title: "平王东迁，春秋开始", eraId: "xianqin",
    type: "政治",
    description: "犬戎攻破镐京，周平王迁都洛邑。王室衰微，诸侯争霸，礼崩乐坏的时代到来。《春秋》即以这一年为纪年之始。",
    figures: [], works: ["w-shijing"],
  },
  {
    id: "e-baijia", year: -500, title: "百家争鸣", eraId: "xianqin",
    type: "文化",
    description: "春秋战国之际，士阶层崛起，私学兴盛。儒、道、墨、法、名、阴阳诸家在列国竞争的思想市场中竞相立说，中国思想的基本格局就此奠定。",
    figures: ["f-zhuangzi"], works: ["w-zhuangzi"],
  },
  {
    id: "e-qinmie", year: -221, title: "秦统一六国", eraId: "xianqin",
    type: "政治",
    description: "秦王嬴政十年间扫灭六国，废分封行郡县、书同文车同轨，建立中国历史上第一个中央集权帝国。秦的速亡与教训成为此后两千年政治思考的原点。",
    figures: [], works: ["w-guoqin"],
  },
  // ===== 秦汉 =====
  {
    id: "e-chuhan", year: -206, endYear: -202, title: "楚汉战争", eraId: "qinhan",
    type: "战争",
    description: "秦亡后项羽、刘邦四年争雄。垓下之围，项羽自刎乌江。刘邦的胜利是布衣对贵族的胜利，司马迁为项羽作本纪，寄寓了复杂的兴亡之叹。",
    figures: ["f-simaqian"], works: ["w-shiji"],
  },
  {
    id: "e-wenzhi", year: -179, endYear: -141, title: "文景之治", eraId: "qinhan",
    type: "政治",
    description: "文帝、景帝轻徭薄赋、休养生息，为武帝时代的扩张积下雄厚国力。贾谊在文帝朝上《治安策》，三十三岁抑郁而终。",
    figures: ["f-jiayi"], works: ["w-guoqin"],
  },
  {
    id: "e-wudi", year: -119, title: "武帝北击匈奴，帝国鼎盛", eraId: "qinhan",
    type: "战争",
    description: "卫青、霍去病远征漠北，封狼居胥；张骞凿空西域。空前的武功需要空前的文辞，铺陈巨丽的汉赋应运而生。",
    figures: ["f-simaqian"], works: ["w-shiji"],
  },
  {
    id: "e-wugu", year: -91, title: "巫蛊之祸，司马迁发愤著书", eraId: "qinhan",
    type: "社会",
    description: "武帝晚年巫蛊之祸，太子被杀，株连数万。司马迁因李陵之祸早已受宫刑，隐忍苟活只为完成《史记》——『人固有一死，或重于泰山，或轻于鸿毛』。",
    figures: ["f-simaqian"], works: ["w-shiji"],
  },
  {
    id: "e-wangmang", year: 9, title: "王莽篡汉", eraId: "qinhan",
    type: "政治",
    description: "王莽以复古改制代汉建新，改革失败引发绿林赤眉起义，帝国第一次完整的治乱循环告终。班固《汉书》以正统史笔重写这段历史。",
    figures: ["f-bangu"], works: ["w-liangdu"],
  },
  {
    id: "e-huangjin", year: 184, title: "黄巾起义，东汉名存实亡", eraId: "qinhan",
    type: "战争",
    description: "张角以太平道起事，『苍天已死，黄天当立』。为镇压起义，豪强武装合法化，军阀割据的种子就此埋下，建安文学的乱世底色由此铺开。",
    figures: ["f-caocao", "f-caozhi"], works: ["w-duange"],
  },
  // ===== 魏晋南北朝 =====
  {
    id: "e-cao", year: 220, title: "曹丕代汉，三国鼎立", eraId: "weijin",
    type: "政治",
    description: "曹丕受汉禅建立魏，以九品中正制保障士族特权；刘备、孙权相继称帝。三国时代正式开启，也是建安文学向正始之音过渡的节点。",
    figures: ["f-caocao", "f-caozhi"], works: ["w-duange", "w-luoshen"],
  },
  {
    id: "e-bawang", year: 291, endYear: 306, title: "八王之乱", eraId: "weijin",
    type: "战争",
    description: "西晋宗室内战十六年，国力耗尽。战乱中的人生无常，直接塑造了这一时期文学中强烈的个体意识与生命焦虑。",
    figures: [], works: ["w-taoyuan"],
  },
  {
    id: "e-yongjia", year: 311, title: "永嘉之乱，衣冠南渡", eraId: "weijin",
    type: "战争",
    description: "匈奴攻破洛阳，掳走怀帝；次年长安陷落，西晋亡。中原士族大规模南迁，建康成为文化中心，东晋南朝的文化脉络由此展开。",
    figures: ["f-taoyuanming"], works: ["w-taoyuan"],
  },
  {
    id: "e-feishui", year: 383, title: "淝水之战", eraId: "weijin",
    type: "战争",
    description: "谢安、谢玄以八万北府兵大破前秦苻坚百万大军，保住东晋半壁江山。战后『东山再起』『草木皆兵』的典故流传至今，谢氏一门也成为山水诗的源头。",
    figures: [], works: [],
  },
  {
    id: "e-xiaowen", year: 494, title: "北魏孝文帝迁都洛阳", eraId: "weijin",
    type: "制度",
    description: "孝文帝拓跋宏迁都洛阳、全面汉化，为后来的南北统一和隋唐盛世奠定民族与文化基础。北方文学的刚健质朴与南方的绮靡在此后汇流。",
    figures: [], works: [],
  },
  // ===== 隋唐五代 =====
  {
    id: "e-suitong", year: 605, title: "隋炀帝开凿大运河", eraId: "suitang",
    type: "经济",
    description: "贯通南北的大运河耗尽民力，隋二世而亡——与秦惊人相似的兴亡节奏，成为杜牧《阿房宫赋》借古讽今的靶子。",
    figures: [], works: ["w-epang"],
  },
  {
    id: "e-zhenguan", year: 627, endYear: 649, title: "贞观之治", eraId: "suitang",
    type: "政治",
    description: "唐太宗虚怀纳谏、轻刑省赋，政治清明、四夷来朝。初唐诗风也在这一时代完成革新，为盛唐气象开路。",
    figures: [], works: ["w-tengwang"],
  },
  {
    id: "e-kaiyuan", year: 713, endYear: 741, title: "开元盛世", eraId: "suitang",
    type: "经济",
    description: "唐玄宗前期励精图治，仓廪丰实、物价低廉，长安成为世界第一都市。李白、杜甫都亲历并书写了这个时代——以及它的崩塌。",
    figures: ["f-libai", "f-dufu"], works: ["w-shudao", "w-jiangjin"],
  },
  {
    id: "e-anshi", year: 755, endYear: 763, title: "安史之乱", eraId: "suitang",
    type: "战争",
    description: "安禄山、史思明起兵叛唐，历时八年。长安陷落，玄宗入蜀，盛世终结。杜甫以诗为史写下『三吏三别』，个人命运与帝国命运从此同悲。",
    figures: ["f-libai", "f-dufu"], works: ["w-chunwang", "w-gaoshi"],
  },
  {
    id: "e-yongzhen", year: 805, title: "永贞革新失败，二王八司马事件", eraId: "suitang",
    type: "政治",
    description: "王叔文集团百日革新触怒宦官藩镇而败，刘禹锡、柳宗元等八人贬为远州司马。贬谪文化由此成为中唐文学的重要主题。",
    figures: [], works: ["w-shishuo"],
  },
  {
    id: "e-huangchao", year: 875, title: "黄巢起义", eraId: "suitang",
    type: "战争",
    description: "『冲天香阵透长安，满城尽带黄金甲』——黄巢军两度攻破长安，门阀士族在战乱中遭到毁灭性打击。唐王朝名存实亡。",
    figures: [], works: [],
  },
  {
    id: "e-mietang", year: 907, title: "朱温灭唐，五代十国开始", eraId: "suitang",
    type: "政治",
    description: "朱温废唐哀帝自立为梁，长安毁弃。此后五十余年武人弑君如儿戏。词在乱世中转入『变伶工之词为士大夫之词』的前夜——李煜就在这个时代末年出生。",
    figures: ["f-liyu"], works: ["w-yumeiren"],
  },
  // ===== 宋 =====
  {
    id: "e-chenqiao", year: 960, title: "陈桥兵变，北宋建立", eraId: "song",
    type: "政治",
    description: "赵匡胤黄袍加身代周建宋，杯酒释兵权，立『崇文抑武』『不杀大臣言官』之家法。文人士大夫的黄金时代由此开启，文学的主人也随之更换。",
    figures: ["f-fanzhongyan"], works: ["w-yueyang"],
  },
  {
    id: "e-chanyuan", year: 1005, title: "澶渊之盟", eraId: "song",
    type: "政治",
    description: "宋辽以岁币三十万换百年和平。外患阴影从此笼罩有宋三百年，也渗入了宋人『先天下之忧而忧』的集体焦虑。",
    figures: [], works: ["w-yueyang"],
  },
  {
    id: "e-qingli", year: 1043, endYear: 1045, title: "庆历新政", eraId: "song",
    type: "政治",
    description: "范仲淹以『明黜陟、抑侥幸』十事发起改革，一年四个月即败，范、欧、富、韩先后外放。《岳阳楼记》写于新政失败后的1046年——『先忧后乐』正是改革者的自况。",
    figures: ["f-fanzhongyan", "f-ouyangxiu"], works: ["w-yueyang"],
  },
  {
    id: "e-wanganshi", year: 1069, title: "王安石变法", eraId: "song",
    type: "政治",
    description: "神宗起用王安石推行青苗、免役、市易诸法，富国强兵。以司马光为首的旧党激烈反对，党争自此撕裂北宋五十年。苏轼因反对激进变法而先遭贬谪，又因不附旧党而再贬——新法之争没有中间地带。",
    figures: ["f-wanganshi", "f-simaguang", "f-suoshi", "f-ouyangxiu"], works: ["w-chibi", "w-chibifu", "w-zizhi"],
  },
  {
    id: "e-yuanyou", year: 1085, title: "元祐更化，旧党复起", eraId: "song",
    type: "政治",
    description: "神宗去世，高太后临朝，司马光尽废新法，新党被逐。苏轼反对尽废免役法，再次被新旧两党夹击。十二年后章惇还朝，贬苏轼于惠州、儋州。党争从此只有报复，没有政见。",
    figures: ["f-wanganshi", "f-simaguang", "f-suoshi"], works: ["w-chibifu", "w-zizhi"],
  },
  {
    id: "e-jingkang", year: 1127, title: "靖康之变，北宋亡", eraId: "song",
    type: "战争",
    description: "金兵破汴京，掳徽、钦二帝及宗室数千人北去，北宋亡。南渡的撕裂感贯穿此后整个南宋文学——李清照词风的巨变就是最痛切的个人证词。",
    figures: ["f-liqingzhao", "f-xinqiji", "f-luyou"], works: ["w-shengshengman", "w-yongyu"],
  },
  {
    id: "e-shaoxing", year: 1141, title: "绍兴和议，岳飞之死", eraId: "song",
    type: "政治",
    description: "秦桧以『莫须有』害岳飞，宋金议和，宋称臣纳贡。恢复中原从此成为南宋士人心中永远不能触碰的痛，辛弃疾、陆游的一生都被这道和议钉住。",
    figures: ["f-xinqiji", "f-luyou", "f-liqingzhao"], works: ["w-yongyu", "w-shier"],
  },
  {
    id: "e-yashan", year: 1279, title: "崖山海战，南宋亡", eraId: "song",
    type: "战争",
    description: "元军追至崖山，陆秀夫负幼帝蹈海，十万军民相随。文天祥此前已被俘，写下『人生自古谁无死，留取丹心照汗青』。王朝终结处，正是文学殉道处。",
    figures: [], works: [],
  },
  // ===== 元 =====
  {
    id: "e-yuantong", year: 1271, title: "忽必烈定国号大元", eraId: "yuan",
    type: "政治",
    description: "忽必烈取《易经》『大哉乾元』之意建国号。等级制度（蒙古、色目、汉人、南人）下，科举长期停废，士人沦为『九儒十丐』，大批文人走向市井书会。",
    figures: ["f-guanhanqing", "f-wangshifu"], works: ["w-doueyuan"],
  },
  {
    id: "e-hongjin", year: 1351, title: "红巾军起义", eraId: "yuan",
    type: "战争",
    description: "黄河工地掘出石人一只眼，『挑动黄河天下反』。元末农民战争席卷全国，朱元璋、张士诚、陈友谅崛起于乱世。1368年明军北伐，元朝退回草原。",
    figures: [], works: ["w-tianjingsha"],
  },
  // ===== 明清 =====
  {
    id: "e-tumu", year: 1449, title: "土木堡之变", eraId: "mingqing",
    type: "战争",
    description: "明英宗率二十万大军亲征瓦剌，于土木堡全军覆没被俘。明朝由盛转衰，边防压力与财政危机持续加重。",
    figures: [], works: [],
  },
  {
    id: "e-zhangjuzheng", year: 1572, endYear: 1582, title: "张居正改革", eraId: "mingqing",
    type: "制度",
    description: "考成法、一条鞭法使明朝财政一度中兴。张居正死后被抄家，万历皇帝从此怠政数十年不上朝——明朝的衰败不是亡于流寇，而是亡于制度生命力的枯竭。",
    figures: [], works: [],
  },
  {
    id: "e-salhu", year: 1619, title: "萨尔浒之战", eraId: "mingqing",
    type: "战争",
    description: "后金努尔哈赤以少胜多大破明军四路大军。此后明军由攻转守，《明史》所谓『辽事』拖垮了明朝最后的财政与军心。",
    figures: [], works: ["w-taohuashan"],
  },
  {
    id: "e-mingwang", year: 1644, title: "李自成入京，明亡", eraId: "mingqing",
    type: "政治",
    description: "甲申之变，崇祯帝自缢煤山；吴三桂引清军入关。十年扬州十日、嘉定三屠，江南士人的亡国之痛渗入清初文学的血脉，《桃花扇》『眼看他起朱楼，眼看他宴宾客，眼看他楼塌了』即为此作。",
    figures: ["f-kongshangren"], works: ["w-taohuashan"],
  },
  {
    id: "e-kangqian", year: 1681, endYear: 1796, title: "康乾盛世", eraId: "mingqing",
    type: "经济",
    description: "平三藩、收台湾、定准噶尔，人口破三亿，《四库全书》开馆。然而文字狱贯穿始终，考据学取代义理之学——盛世的繁华与思想的萧索同时存在。",
    figures: ["f-pusongling", "f-wujingzi"], works: ["w-liaozhai", "w-rulin"],
  },
  {
    id: "e-yp", year: 1840, title: "鸦片战争，国门被撞开", eraId: "mingqing",
    type: "战争",
    description: "中国沦为半殖民地半封建社会。龚自珍、魏源之后，古典文学的时代落幕，梁启超倡导的『诗界革命』『小说界革命』开启近代文学。传统文史学习在此收束。",
    figures: [], works: ["w-hongloumeng"],
  },
];
