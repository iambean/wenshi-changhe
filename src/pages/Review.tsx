import { useMemo, useState } from "react";
import { Link } from "react-router";
import { buildDeck, type Card } from "@/data";

type Grade = "know" | "vague" | "unknown";

export default function Review() {
  const deck = useMemo(() => {
    const cards = buildDeck();
    // Fisher–Yates 洗牌
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    return cards;
  }, []);

  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [stats, setStats] = useState<Record<Grade, number>>({ know: 0, vague: 0, unknown: 0 });
  const [finished, setFinished] = useState(false);
  const [graded, setGraded] = useState(false);

  const card: Card | undefined = deck[idx];

  const next = () => {
    if (idx + 1 >= deck.length) setFinished(true);
    else {
      setIdx(idx + 1);
      setFlipped(false);
      setGraded(false);
    }
  };

  const grade = (g: Grade) => {
    if (graded) return;
    setStats((s) => ({ ...s, [g]: s[g] + 1 }));
    setGraded(true);
    setTimeout(next, 350);
  };

  if (finished)
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <div className="paper-card rounded-xl p-10">
          <p className="font-kai text-5xl mb-4">完</p>
          <h2 className="font-kai text-2xl font-bold mb-6">本轮复习完成</h2>
          <div className="grid grid-cols-3 gap-3 mb-8">
            {[
              { n: stats.know, l: "熟记", c: "#5d7261" },
              { n: stats.vague, l: "模糊", c: "#8c6d2f" },
              { n: stats.unknown, l: "陌生", c: "#9a3b2e" },
            ].map((s) => (
              <div key={s.l} className="rounded-lg py-4" style={{ background: `${s.c}14` }}>
                <div className="font-kai text-3xl font-bold" style={{ color: s.c }}>{s.n}</div>
                <div className="text-xs font-hei mt-1" style={{ color: "var(--ink-soft)" }}>{s.l}</div>
              </div>
            ))}
          </div>
          <p className="text-sm leading-relaxed mb-6" style={{ color: "var(--ink-soft)" }}>
            模糊与陌生的条目，建议回到时间轴找到对应的作品与事件重新学习——文史互证的卡片，回读原文最有效。
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => { setIdx(0); setFlipped(false); setGraded(false); setStats({ know: 0, vague: 0, unknown: 0 }); setFinished(false); }}
              className="px-5 py-2 rounded-md text-sm font-hei font-bold"
              style={{ background: "var(--cinnabar)", color: "#f6efdf" }}
            >
              再来一轮
            </button>
            <Link to="/timeline" className="px-5 py-2 rounded-md text-sm font-hei" style={{ border: "1px solid rgba(80,66,48,0.3)", color: "var(--ink)" }}>
              回时间轴
            </Link>
          </div>
        </div>
      </div>
    );

  if (!card) return null;

  const KIND_LABEL: Record<Card["kind"], string> = {
    "work-bg": "文史互证",
    "work-who": "名句归属",
    "figure-when": "人物定位",
    "event-link": "事件关联",
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-kai text-2xl font-bold">复习卡片</h1>
        <span className="text-xs font-hei tabular-nums" style={{ color: "var(--ink-soft)" }}>
          第 {idx + 1} / {deck.length} 张 · {KIND_LABEL[card.kind]}
        </span>
      </div>

      {/* 进度条 */}
      <div className="h-1 rounded-full mb-8 overflow-hidden" style={{ background: "rgba(80,66,48,0.12)" }}>
        <div className="h-full rounded-full transition-all" style={{ width: `${((idx + 1) / deck.length) * 100}%`, background: "var(--cinnabar)" }} />
      </div>

      {/* 卡面 */}
      <button
        onClick={() => setFlipped(!flipped)}
        className="paper-card rounded-xl w-full p-10 text-center min-h-64 flex flex-col justify-center transition-shadow hover:shadow-lg"
      >
        {!flipped ? (
          <>
            <p className="text-xs font-hei mb-4" style={{ color: "var(--cinnabar)" }}>问题 · 点击翻面</p>
            <p className="font-kai text-xl leading-relaxed" style={{ color: "var(--ink)" }}>{card.question}</p>
          </>
        ) : (
          <>
            <p className="text-xs font-hei mb-4" style={{ color: "#5d7261" }}>答案</p>
            <p className="text-base leading-loose whitespace-pre-line" style={{ color: "var(--ink)" }}>{card.answer}</p>
            {card.extra && (
              <p className="mt-4 text-xs leading-relaxed text-left rounded-md px-3 py-2" style={{ background: "rgba(80,66,48,0.06)", color: "var(--ink-soft)" }}>
                {card.extra}
              </p>
            )}
          </>
        )}
      </button>

      {/* 评分 */}
      <div className="mt-6 flex justify-center gap-3">
        {(
          [
            ["unknown", "陌生", "#9a3b2e"],
            ["vague", "模糊", "#8c6d2f"],
            ["know", "熟记", "#5d7261"],
          ] as [Grade, string, string][]
        ).map(([g, l, c]) => (
          <button
            key={g}
            onClick={() => grade(g)}
            className="px-6 py-2.5 rounded-full text-sm font-hei font-bold transition-transform hover:scale-105"
            style={{ background: `${c}18`, color: c, border: `1px solid ${c}55` }}
          >
            {l}
          </button>
        ))}
      </div>
      <p className="text-center text-xs mt-4 font-hei" style={{ color: "var(--ink-soft)" }}>
        评分后自动进入下一张 · 不熟的内容回时间轴重学
      </p>
    </div>
  );
}
