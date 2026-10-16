import { Link, useParams, useSearchParams } from "react-router";
import { eraById, events, allFigures, works, fmtRange } from "@/data";
import LearnedToggle from "@/components/LearnedToggle";

export default function EraPage() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const era = eraById(id ?? "");

  if (!era) return <div className="max-w-3xl mx-auto px-4 py-20 text-center">未找到该阶段。</div>;

  const eraEvents = events.filter((e) => e.eraId === era.id).sort((a, b) => a.year - b.year);
  const eraFigures = allFigures.filter((f) => f.eraId === era.id && f.id !== "f-collective");
  const eraWorks = works.filter((w) => w.eraId === era.id).sort((a, b) => a.year - b.year);
  const highlight = params.get("e");

  return (
    <div>
      {/* 阶段头图 */}
      <section className="relative h-64 overflow-hidden">
        <img src={era.image} alt={era.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(30,22,14,0.3), rgba(30,22,14,0.7))" }} />
        <div className="absolute bottom-6 left-0 right-0">
          <div className="max-w-6xl mx-auto px-4">
            <p className="text-xs font-hei mb-2" style={{ color: "rgba(240,230,210,0.85)" }}>{fmtRange(era.start, era.end)}</p>
            <h1 className="font-kai text-5xl font-bold" style={{ color: "#f3ecdc" }}>{era.name}</h1>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-10 space-y-12">
        {/* 历史主线 + 文学脉络 */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="paper-card rounded-xl p-7">
            <h2 className="font-kai text-xl font-bold mb-4 flex items-center gap-2">
              <span className="w-1 h-5 rounded" style={{ background: era.color }} />
              历史主线
            </h2>
            <p className="text-sm leading-loose" style={{ color: "var(--ink)" }}>{era.summary}</p>
          </div>
          <div className="paper-card rounded-xl p-7">
            <h2 className="font-kai text-xl font-bold mb-4 flex items-center gap-2">
              <span className="w-1 h-5 rounded" style={{ background: "var(--cinnabar)" }} />
              文学脉络
            </h2>
            <p className="text-sm leading-loose" style={{ color: "var(--ink)" }}>{era.literature}</p>
          </div>
        </div>

        {/* 历史事件 */}
        <section>
          <h2 className="font-kai text-2xl font-bold mb-5">关键历史事件</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {eraEvents.map((e) => (
              <div
                key={e.id}
                className="paper-card rounded-lg p-5"
                style={highlight === e.id ? { outline: "2px solid var(--cinnabar)" } : undefined}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-bold font-hei tabular-nums" style={{ color: "var(--cinnabar)" }}>
                    {e.endYear && e.endYear !== e.year ? `${e.year < 0 ? `公元前${-e.year}` : e.year}—${e.endYear}年` : e.year < 0 ? `公元前${-e.year}年` : `${e.year}年`}
                  </span>
                  <span className="text-[10px] font-hei px-1.5 py-0.5 rounded" style={{ background: "rgba(80,66,48,0.08)", color: "var(--ink-soft)" }}>
                    {e.type}
                  </span>
                </div>
                <h3 className="font-kai text-lg font-bold mb-2">{e.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--ink-soft)" }}>{e.description}</p>
                {(e.figures.length > 0 || e.works.length > 0) && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {e.figures.map((fid) => {
                      const f = allFigures.find((x) => x.id === fid);
                      return f ? (
                        <Link key={fid} to={`/figure/${fid}`} className="text-xs font-hei px-2 py-0.5 rounded-full hover:underline"
                          style={{ background: "rgba(93,114,97,0.12)", color: "#5d7261" }}>
                          {f.name}
                        </Link>
                      ) : null;
                    })}
                    {e.works.map((wid) => {
                      const w = works.find((x) => x.id === wid);
                      return w ? (
                        <Link key={wid} to={`/work/${wid}`} className="text-xs font-hei px-2 py-0.5 rounded-full hover:underline"
                          style={{ background: "rgba(63,107,122,0.12)", color: "#3f6b7a" }}>
                          《{w.title}》
                        </Link>
                      ) : null;
                    })}
                  </div>
                )}
                <div className="mt-3"><LearnedToggle id={e.id} /></div>
              </div>
            ))}
          </div>
        </section>

        {/* 代表人物 */}
        <section>
          <h2 className="font-kai text-2xl font-bold mb-5">代表人物</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {eraFigures.map((f) => (
              <Link key={f.id} to={`/figure/${f.id}`} className="paper-card paper-card-hover rounded-lg p-5 block">
                <div className="flex items-baseline justify-between mb-1">
                  <h3 className="font-kai text-xl font-bold">{f.name}</h3>
                  <span className="text-xs font-hei tabular-nums" style={{ color: "var(--ink-soft)" }}>
                    {f.born < 0 ? `前${-f.born}` : f.born}—{f.died < 0 ? `前${-f.died}` : f.died}
                  </span>
                </div>
                <p className="text-xs font-hei mb-2" style={{ color: "var(--cinnabar)" }}>{f.roles.join(" · ")}</p>
                <p className="text-xs leading-relaxed line-clamp-3" style={{ color: "var(--ink-soft)" }}>{f.bio}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* 经典作品 */}
        <section>
          <h2 className="font-kai text-2xl font-bold mb-5">经典作品</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {eraWorks.map((w) => (
              <Link key={w.id} to={`/work/${w.id}`} className="paper-card paper-card-hover rounded-lg p-5 block">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-kai text-xl font-bold">《{w.title}》</h3>
                  <span className="text-[10px] font-hei px-1.5 py-0.5 rounded" style={{ background: "rgba(63,107,122,0.12)", color: "#3f6b7a" }}>
                    {w.genre}
                  </span>
                </div>
                <p className="font-kai text-sm leading-relaxed mb-2 line-clamp-2" style={{ color: "var(--ink-soft)" }}>
                  {w.excerpt.split("/")[0]}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-hei" style={{ color: "var(--ink-soft)" }}>
                    {w.year < 0 ? `约公元前${-w.year}年` : `约${w.year}年`}
                  </span>
                  <LearnedToggle id={w.id} />
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
