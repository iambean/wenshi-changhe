import { Link } from "react-router";
import { eras, works, allFigures, events, fmtRange } from "@/data";

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <img
          src="images/hero.jpg"
          alt="文史长河长卷"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to bottom, rgba(30,22,14,0.25), rgba(30,22,14,0.55) 60%, rgba(30,22,14,0.75))" }}
        />
        <div className="relative max-w-6xl mx-auto px-4 py-24 sm:py-32 flex flex-col items-center text-center">
          <p className="font-kai text-sm tracking-[0.6em] mb-6" style={{ color: "rgba(240,230,210,0.85)" }}>
            中国通史 × 中国文学史
          </p>
          <h1 className="font-kai text-5xl sm:text-7xl font-bold tracking-wider mb-6" style={{ color: "#f3ecdc", textShadow: "0 2px 20px rgba(0,0,0,0.5)" }}>
            文史长河
          </h1>
          <p className="max-w-2xl text-base sm:text-lg leading-relaxed mb-8" style={{ color: "rgba(240,230,210,0.92)" }}>
            以时间为轴，以人物生平与经典作品为目。读到范仲淹时，你会看到庆历新政的失败；
            读到杜甫时，你会看到安史之乱的长安——文学在这里回到它生长的土壤。
          </p>
          <div className="flex gap-3">
            <Link
              to="/timeline"
              className="px-6 py-2.5 rounded-md font-hei text-sm font-bold transition-transform hover:scale-105"
              style={{ background: "var(--cinnabar)", color: "#f6efdf" }}
            >
              进入时间轴
            </Link>
            <Link
              to="/review"
              className="px-6 py-2.5 rounded-md font-hei text-sm transition-transform hover:scale-105"
              style={{ background: "rgba(246,239,223,0.15)", color: "#f6efdf", border: "1px solid rgba(246,239,223,0.5)" }}
            >
              开始复习
            </Link>
          </div>
        </div>
      </section>

      {/* 统计 */}
      <section className="max-w-6xl mx-auto px-4 -mt-10 relative z-10">
        <div className="paper-card rounded-xl px-6 py-5 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          {[
            { n: `${eras.length}`, l: "历史阶段" },
            { n: `${events.length}`, l: "关键历史事件" },
            { n: `${allFigures.length - 1}+`, l: "历史人物" },
            { n: `${works.length}`, l: "经典作品" },
          ].map((s) => (
            <div key={s.l}>
              <div className="font-kai text-3xl font-bold" style={{ color: "var(--cinnabar)" }}>{s.n}</div>
              <div className="text-xs font-hei mt-1" style={{ color: "var(--ink-soft)" }}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 方法论 */}
      <section className="max-w-6xl mx-auto px-4 mt-16">
        <h2 className="font-kai text-2xl font-bold text-center mb-2">怎么用这个系统学习</h2>
        <p className="text-center text-sm font-hei mb-10" style={{ color: "var(--ink-soft)" }}>三步走：先史后文，文史互证，卡片巩固</p>
        <div className="grid md:grid-cols-3 gap-5">
          {[
            {
              t: "① 按时间轴推进",
              d: "每个朝代先看历史主线（事件卡片），再看同时代的文人与作品。作品卡片永远带着它的历史语境：写作那年正在发生什么、作者当时身处何地、因何而作。",
            },
            {
              t: "② 人物是活的历史",
              d: "每个人物页都回答三个问题：他生于何时、亲历了哪些事件、他的作品如何被时代塑造。范仲淹被贬邓州才有『先忧后乐』，李煜被俘汴京才有『一江春水』。",
            },
            {
              t: "③ 复习 + 二次创作",
              d: "用复习卡片检验『文史互证』是否真正建立。每个作品页可一键生成 60 秒短视频脚本——未来可以照脚本配图配音，把你学过的内容讲给别人听。",
            },
          ].map((c) => (
            <div key={c.t} className="paper-card paper-card-hover rounded-xl p-6">
              <h3 className="font-kai text-lg font-bold mb-3" style={{ color: "var(--ink)" }}>{c.t}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--ink-soft)" }}>{c.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 朝代入口 */}
      <section className="max-w-6xl mx-auto px-4 mt-16">
        <h2 className="font-kai text-2xl font-bold text-center mb-10">七个历史阶段</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {eras.map((era) => (
            <Link
              key={era.id}
              to={`/era/${era.id}`}
              className="paper-card paper-card-hover rounded-xl overflow-hidden group"
            >
              <div className="relative h-40 overflow-hidden">
                <img
                  src={era.image}
                  alt={era.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(30,22,14,0.65), transparent 60%)" }} />
                <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                  <span className="font-kai text-3xl font-bold" style={{ color: "#f3ecdc" }}>{era.name}</span>
                  <span className="text-xs font-hei" style={{ color: "rgba(240,230,210,0.85)" }}>{fmtRange(era.start, era.end)}</span>
                </div>
              </div>
              <div className="p-5">
                <p className="text-sm leading-relaxed line-clamp-3" style={{ color: "var(--ink-soft)" }}>{era.summary}</p>
                <div className="mt-3 text-xs font-hei font-bold" style={{ color: "var(--cinnabar)" }}>
                  进入这一阶段 →
                </div>
              </div>
            </Link>
          ))}
          {/* 占位卡：保持网格完整 */}
          <Link to="/recs" className="paper-card paper-card-hover rounded-xl p-6 flex flex-col justify-center items-center text-center">
            <span className="font-kai text-xl font-bold mb-2" style={{ color: "var(--ink)" }}>书单 · 片单</span>
            <p className="text-xs leading-relaxed" style={{ color: "var(--ink-soft)" }}>
              每个阶段配套的严肃纪录片与书籍推荐：从《中国通史》《国史大纲》到《唐之韵》《宋之韵》
            </p>
            <span className="mt-3 text-xs font-hei font-bold" style={{ color: "var(--cinnabar)" }}>查看学习材料 →</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
