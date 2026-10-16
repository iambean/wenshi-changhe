import { Link, useParams } from "react-router";
import { figureById, workById, eventById, eraById, works, fmtYear } from "@/data";
import type { HistEvent } from "@/data/types";
import LearnedToggle from "@/components/LearnedToggle";

export default function FigurePage() {
  const { id } = useParams();
  const fig = figureById(id ?? "");

  if (!fig) return <div className="max-w-3xl mx-auto px-4 py-20 text-center">未找到该人物。</div>;

  const era = eraById(fig.eraId);
  const figWorks = fig.works.map(workById).filter((w) => w !== undefined);
  const figEvents = fig.events.map(eventById).filter((e): e is HistEvent => e !== undefined);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* 头卡 */}
      <div className="paper-card rounded-xl overflow-hidden">
        <div className="p-8" style={{ background: `linear-gradient(135deg, ${era?.color ?? "#666"}18, transparent 60%)` }}>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-hei mb-2" style={{ color: "var(--ink-soft)" }}>
                <Link to={`/era/${fig.eraId}`} className="hover:underline">{era?.name}</Link> 时期 · {fig.roles.join(" · ")}
              </p>
              <h1 className="font-kai text-5xl font-bold mb-1">{fig.name}</h1>
              {fig.courtesy && <p className="text-sm font-kai" style={{ color: "var(--ink-soft)" }}>{fig.courtesy}</p>}
            </div>
            <div className="text-right">
              <div className="font-kai text-2xl font-bold tabular-nums" style={{ color: "var(--cinnabar)" }}>
                {fig.born < 0 ? `前${-fig.born}` : fig.born} — {fig.died < 0 ? `前${-fig.died}` : fig.died}
              </div>
              <div className="text-xs font-hei mt-1" style={{ color: "var(--ink-soft)" }}>生卒年</div>
              <div className="mt-3"><LearnedToggle id={fig.id} /></div>
            </div>
          </div>
          <p className="mt-6 text-sm leading-loose" style={{ color: "var(--ink)" }}>{fig.bio}</p>
        </div>
      </div>

      {/* 生平时间线 */}
      {figEvents.length > 0 && (
        <section className="mt-10">
          <h2 className="font-kai text-2xl font-bold mb-5">他亲历的历史</h2>
          <div className="space-y-3">
            {figEvents.map((e) => (
              <Link key={e.id} to={`/era/${e.eraId}?e=${e.id}`}
                className="paper-card paper-card-hover rounded-lg p-4 flex items-center gap-4">
                <span className="text-xs font-hei font-bold tabular-nums shrink-0 w-24" style={{ color: "var(--cinnabar)" }}>
                  {fmtYear(e.year)}
                </span>
                <div className="flex-1">
                  <h3 className="font-kai font-bold">{e.title}</h3>
                  <p className="text-xs leading-relaxed mt-0.5 line-clamp-1" style={{ color: "var(--ink-soft)" }}>{e.description}</p>
                </div>
                <span className="text-xs shrink-0" style={{ color: "var(--ink-soft)" }}>→</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 记忆要点 */}
      {fig.facts.length > 0 && (
        <section className="mt-10">
          <h2 className="font-kai text-2xl font-bold mb-5">记忆要点</h2>
          <ul className="space-y-2.5">
            {fig.facts.map((f, i) => (
              <li key={i} className="paper-card rounded-lg px-4 py-3 text-sm leading-relaxed flex gap-3" style={{ color: "var(--ink)" }}>
                <span className="font-kai font-bold shrink-0" style={{ color: "var(--cinnabar)" }}>{["其一", "其二", "其三", "其四", "其五", "其六"][i] ?? i + 1}</span>
                {f}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* 代表作品 */}
      {figWorks.length > 0 && (
        <section className="mt-10">
          <h2 className="font-kai text-2xl font-bold mb-5">代表作品</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {figWorks.map((w) => (
              <Link key={w!.id} to={`/work/${w!.id}`} className="paper-card paper-card-hover rounded-lg p-5 block">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-kai text-lg font-bold">《{w!.title}》</h3>
                  <span className="text-[10px] font-hei px-1.5 py-0.5 rounded" style={{ background: "rgba(63,107,122,0.12)", color: "#3f6b7a" }}>{w!.genre}</span>
                </div>
                <p className="font-kai text-sm line-clamp-2" style={{ color: "var(--ink-soft)" }}>{w!.excerpt.split("/")[0]}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 同代人物 */}
      <section className="mt-10">
        <h2 className="font-kai text-2xl font-bold mb-5">同代人物</h2>
        <div className="flex flex-wrap gap-2">
          {works
            .filter((w) => w.eraId === fig.eraId)
            .map((w) => w.authorId)
            .filter((aid, i, arr) => arr.indexOf(aid) === i && aid !== fig.id)
            .map((aid) => {
              const f = figureById(aid);
              return f ? (
                <Link key={aid} to={`/figure/${aid}`}
                  className="px-3 py-1.5 rounded-full text-sm font-kai hover:underline"
                  style={{ background: "rgba(80,66,48,0.08)", color: "var(--ink)" }}>
                  {f.name}
                </Link>
              ) : null;
            })}
        </div>
      </section>
    </div>
  );
}
