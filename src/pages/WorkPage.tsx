import { useMemo, useState } from "react";
import { Link, useParams } from "react-router";
import { workById, figureById, eventById, eraById, buildScript, fmtYear } from "@/data";
import LearnedToggle from "@/components/LearnedToggle";

export default function WorkPage() {
  const { id } = useParams();
  const work = workById(id ?? "");
  const [copied, setCopied] = useState(false);

  const script = useMemo(() => (work ? buildScript(work) : null), [work]);

  if (!work || !script)
    return <div className="max-w-3xl mx-auto px-4 py-20 text-center">未找到该作品。</div>;

  const author = figureById(work.authorId);
  const era = eraById(work.eraId);
  const relEvents = work.events.map(eventById).filter(Boolean);

  const copyScript = () => {
    const text =
      `【${script.title}】\n\n` +
      script.shots.map((s) => `【${s.sec}】\n画面：${s.visual}\n文案：${s.text}`).join("\n\n");
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* 头部 */}
      <div className="paper-card rounded-xl overflow-hidden">
        <div className="p-8" style={{ background: `linear-gradient(135deg, ${era?.color ?? "#666"}16, transparent 55%)` }}>
          <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
            <div>
              <p className="text-xs font-hei mb-2" style={{ color: "var(--ink-soft)" }}>
                <Link to={`/era/${work.eraId}`} className="hover:underline">{era?.name}</Link>
                {" · "}{work.genre}
                {" · 约"}{fmtYear(work.year)}
              </p>
              <h1 className="font-kai text-4xl font-bold">《{work.title}》</h1>
              {author && (
                <Link to={`/figure/${author.id}`} className="inline-block mt-2 text-sm font-kai hover:underline" style={{ color: "var(--cinnabar)" }}>
                  {author.name}{author.courtesy ? `（${author.courtesy}）` : ""}
                </Link>
              )}
            </div>
            <LearnedToggle id={work.id} label="读完了" />
          </div>

          {/* 名句 */}
          <blockquote className="relative mt-6 pl-10 py-4 pr-4 rounded-lg" style={{ background: "rgba(80,66,48,0.05)" }}>
            <span className="quote-mark absolute left-2 top-0">“</span>
            <p className="font-kai text-lg leading-loose" style={{ color: "var(--ink)" }}>
              {work.excerpt.split("/").map((seg, i) => (
                <span key={i} className="block">{seg.trim()}</span>
              ))}
            </p>
          </blockquote>
        </div>
      </div>

      {/* 背景 + 赏析 */}
      <div className="grid md:grid-cols-2 gap-6 mt-8">
        <div className="paper-card rounded-xl p-7">
          <h2 className="font-kai text-xl font-bold mb-4">写作背景 · 那时正在发生什么</h2>
          <p className="text-sm leading-loose" style={{ color: "var(--ink)" }}>{work.background}</p>
          {relEvents.length > 0 && (
            <div className="mt-5 space-y-2">
              {relEvents.map((e) => (
                <Link key={e!.id} to={`/era/${e!.eraId}?e=${e!.id}`}
                  className="flex items-center gap-3 px-3 py-2 rounded-md hover:underline text-xs font-hei"
                  style={{ background: "rgba(138,79,61,0.08)", color: "#8a4f3d" }}>
                  <span className="font-bold tabular-nums shrink-0">{fmtYear(e!.year)}</span>
                  <span className="truncate">{e!.title}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
        <div className="paper-card rounded-xl p-7">
          <h2 className="font-kai text-xl font-bold mb-4">为什么它重要</h2>
          <p className="text-sm leading-loose" style={{ color: "var(--ink)" }}>{work.analysis}</p>
          {author && (
            <Link to={`/figure/${author.id}`} className="mt-4 inline-block text-xs font-hei font-bold" style={{ color: "var(--cinnabar)" }}>
              了解作者 {author.name} 的完整生平 →
            </Link>
          )}
        </div>
      </div>

      {/* 短视频脚本 */}
      <section className="mt-10">
        <div className="paper-card rounded-xl p-7">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div>
              <h2 className="font-kai text-2xl font-bold">60 秒短视频脚本</h2>
              <p className="text-xs font-hei mt-1" style={{ color: "var(--ink-soft)" }}>
                基于本条目的钩子、背景与名句自动生成，可复制后用于二次创作
              </p>
            </div>
            <button
              onClick={copyScript}
              className="px-4 py-2 rounded-md text-xs font-hei font-bold transition-transform hover:scale-105"
              style={{ background: copied ? "#5d7261" : "var(--cinnabar)", color: "#f6efdf" }}
            >
              {copied ? "已复制 ✓" : "复制脚本"}
            </button>
          </div>
          <div className="space-y-4">
            {script.shots.map((s, i) => (
              <div key={i} className="flex gap-4">
                <div className="shrink-0 w-14 text-center">
                  <span className="inline-block px-2 py-1 rounded text-[11px] font-hei font-bold tabular-nums"
                    style={{ background: "rgba(154,59,46,0.12)", color: "var(--cinnabar)" }}>
                    {s.sec}
                  </span>
                </div>
                <div className="flex-1 grid sm:grid-cols-2 gap-3">
                  <div className="rounded-md px-3 py-2 text-xs leading-relaxed" style={{ background: "rgba(80,66,48,0.06)", color: "var(--ink-soft)" }}>
                    <span className="font-hei font-bold block mb-1" style={{ color: "var(--ink)" }}>画面</span>
                    {s.visual}
                  </div>
                  <div className="rounded-md px-3 py-2 text-xs leading-relaxed font-kai" style={{ background: "rgba(80,66,48,0.06)", color: "var(--ink)" }}>
                    <span className="font-hei font-bold block mb-1">文案</span>
                    {s.text}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
