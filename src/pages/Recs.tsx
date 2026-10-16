import { documentaries, books } from "@/data/recommendations";

function RecSection({ title, sub, items, color }: { title: string; sub: string; items: typeof documentaries; color: string }) {
  return (
    <section>
      <h2 className="font-kai text-2xl font-bold mb-2">{title}</h2>
      <p className="text-sm font-hei mb-6" style={{ color: "var(--ink-soft)" }}>{sub}</p>
      <div className="grid md:grid-cols-2 gap-4">
        {items.map((it) => (
          <div key={it.title} className="paper-card paper-card-hover rounded-lg p-5">
            <div className="flex items-start justify-between gap-3 mb-1.5">
              <h3 className="font-kai text-lg font-bold">{it.title}</h3>
              <span className="text-[10px] font-hei px-1.5 py-0.5 rounded shrink-0" style={{ background: `${color}16`, color }}>
                {it.stage}
              </span>
            </div>
            <p className="text-xs font-hei mb-2" style={{ color: "var(--ink-soft)" }}>{it.meta}</p>
            <p className="text-sm leading-relaxed" style={{ color: "var(--ink)" }}>{it.note}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function Recs() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-14">
      <div>
        <h1 className="font-kai text-3xl font-bold mb-3">书单 · 片单</h1>
        <p className="text-sm font-hei leading-relaxed max-w-3xl" style={{ color: "var(--ink-soft)" }}>
          严肃取向的辅助材料，按学习阶段配套。使用建议：每进入一个朝代，先读通史对应章节 →
          看对应纪录片建立画面 → 读文学史 → 读原典 → 回本站打卡与复习。
        </p>
      </div>

      <RecSection
        title="纪录片"
        sub="以央视纪录频道与中国社会科学院监制的作品为主，兼顾文学专题片"
        items={documentaries}
        color="#8a4f3d"
      />

      <RecSection
        title="书籍"
        sub="通史两读（钱穆、吕思勉）＋ 文学史两读（袁行霈、章培恒/骆玉明）＋ 原典选本"
        items={books}
        color="#3f6b7a"
      />

      <div className="paper-card rounded-xl p-6 text-sm leading-relaxed" style={{ color: "var(--ink-soft)" }}>
        <h3 className="font-kai text-lg font-bold mb-2" style={{ color: "var(--ink)" }}>使用顺序建议</h3>
        <ol className="list-decimal list-inside space-y-1.5">
          <li>通史（钱穆 / 吕思勉）对应朝代章节 → 搭历史骨架</li>
          <li>纪录片（《中国通史》对应集数 / 专题片）→ 建立时空画面感</li>
          <li>文学史（袁行霈对应卷）→ 知道这个阶段有哪些人与流派</li>
          <li>原典（本站作品页的节选与背景）→ 精读，回本站标记已学</li>
          <li>复习卡片 → 检验文史互证是否建立；模糊条目回读</li>
        </ol>
      </div>
    </div>
  );
}
