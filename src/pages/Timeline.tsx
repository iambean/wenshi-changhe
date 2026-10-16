import { useMemo, useState } from "react";
import { Link } from "react-router";
import { eras, eraTimeline, fmtYear, type TimelineItem } from "@/data";
import LearnedToggle from "@/components/LearnedToggle";

type Filter = "all" | "event" | "figure" | "work";

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "全部" },
  { key: "event", label: "历史事件" },
  { key: "figure", label: "人物" },
  { key: "work", label: "作品" },
];

const KIND_STYLE: Record<TimelineItem["kind"], { label: string; color: string }> = {
  event: { label: "历史事件", color: "#8a4f3d" },
  figure: { label: "人物", color: "#5d7261" },
  work: { label: "作品", color: "#3f6b7a" },
};

function ItemCard({ item }: { item: TimelineItem }) {
  const k = KIND_STYLE[item.kind];
  const to =
    item.kind === "event"
      ? `/era/${item.event!.eraId}?e=${item.event!.id}`
      : item.kind === "figure"
        ? `/figure/${item.figure!.id}`
        : `/work/${item.work!.id}`;
  const title = item.kind === "event" ? item.event!.title : item.kind === "figure" ? item.figure!.name : `《${item.work!.title}》`;
  const sub =
    item.kind === "event"
      ? item.event!.description
      : item.kind === "figure"
        ? item.figure!.bio
        : item.work!.excerpt.split("/")[0];
  const id = item.kind === "event" ? item.event!.id : item.kind === "figure" ? item.figure!.id : item.work!.id;
  const yearText =
    item.kind === "figure"
      ? `${fmtYear(item.figure!.born)} 生`
      : fmtYear(item.year);

  return (
    <Link to={to} className="paper-card paper-card-hover rounded-lg p-4 block relative">
      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
        <span className="text-xs font-hei tabular-nums font-bold" style={{ color: "var(--cinnabar)" }}>
          {yearText}
        </span>
        <span
          className="text-[10px] font-hei px-1.5 py-0.5 rounded"
          style={{ background: `${k.color}22`, color: k.color }}
        >
          {k.label}
        </span>
        {item.kind === "event" && item.event!.type && (
          <span className="text-[10px] font-hei px-1.5 py-0.5 rounded" style={{ background: "rgba(80,66,48,0.08)", color: "var(--ink-soft)" }}>
            {item.event!.type}
          </span>
        )}
      </div>
      <h4 className="font-kai text-lg font-bold leading-snug mb-1" style={{ color: "var(--ink)" }}>{title}</h4>
      <p className="text-xs leading-relaxed line-clamp-2" style={{ color: "var(--ink-soft)" }}>{sub}</p>
      <div className="mt-2.5 flex items-center justify-between">
        <LearnedToggle id={id} />
        <span className="text-xs font-hei" style={{ color: "var(--ink-soft)" }}>详情 →</span>
      </div>
    </Link>
  );
}

export default function Timeline() {
  const [filter, setFilter] = useState<Filter>("all");
  const [openEra, setOpenEra] = useState<string | null>("xianqin");

  const data = useMemo(
    () =>
      eras.map((era) => ({
        era,
        items: eraTimeline(era.id).filter((it) => filter === "all" || it.kind === filter),
      })),
    [filter]
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="font-kai text-3xl font-bold mb-2">完整时间轴</h1>
          <p className="text-sm font-hei" style={{ color: "var(--ink-soft)" }}>
            公元前1046年 — 1912年 · 历史事件 / 人物 / 作品同轴呈现，按年代先后推进学习
          </p>
        </div>
        <div className="flex gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className="px-3 py-1.5 rounded-full text-xs font-hei transition-colors"
              style={
                filter === f.key
                  ? { background: "var(--cinnabar)", color: "#f6efdf" }
                  : { background: "rgba(80,66,48,0.08)", color: "var(--ink-soft)" }
              }
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {data.map(({ era, items }) => {
        const isOpen = openEra === era.id;
        return (
          <section key={era.id} className="mb-8">
            <button
              onClick={() => setOpenEra(isOpen ? null : era.id)}
              className="w-full relative rounded-xl overflow-hidden text-left group"
            >
              <div className="h-24 sm:h-28">
                <img src={era.image} alt={era.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(30,22,14,0.72), rgba(30,22,14,0.25))" }} />
              </div>
              <div className="absolute inset-0 flex items-center px-6 gap-4">
                <span className="font-kai text-3xl font-bold" style={{ color: "#f3ecdc" }}>{era.name}</span>
                <span className="text-xs font-hei" style={{ color: "rgba(240,230,210,0.85)" }}>
                  {fmtYear(era.start)} — {fmtYear(era.end)}
                </span>
                <span className="ml-auto text-xs font-hei" style={{ color: "rgba(240,230,210,0.85)" }}>
                  {items.length} 个条目 {isOpen ? "▲" : "▼"}
                </span>
              </div>
            </button>

            {isOpen && (
              <div className="mt-4 relative pl-6">
                <div className="timeline-line absolute left-[5px] top-2 bottom-2 w-px" />
                {items.length === 0 && (
                  <p className="text-sm py-6" style={{ color: "var(--ink-soft)" }}>该筛选条件下暂无条目。</p>
                )}
                <div className="space-y-4">
                  {items.map((item, i) => (
                    <div key={`${item.kind}-${i}`} className="relative">
                      <span
                        className="absolute -left-6 top-5 w-[11px] h-[11px] rounded-full border-2"
                        style={{ borderColor: KIND_STYLE[item.kind].color, background: "var(--paper)" }}
                      />
                      <ItemCard item={item} />
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-right">
                  <Link to={`/era/${era.id}`} className="text-xs font-hei font-bold" style={{ color: "var(--cinnabar)" }}>
                    查看 {era.name} 阶段完整学习页 →
                  </Link>
                </div>
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
