import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { eras, eraTimeline, fmtYear, getLearned, type TimelineItem } from "@/data";

const KIND: Record<TimelineItem["kind"], { label: string; color: string }> = {
  event: { label: "史", color: "#8a4f3d" },
  figure: { label: "人", color: "#5d7261" },
  work: { label: "文", color: "#3f6b7a" },
};

/** 按朝代跨度分配宽度（对数缩放，避免先秦独霸全卷） */
function segWidth(start: number, end: number): number {
  return 380 + Math.round(Math.log(Math.max(10, end - start)) * 88);
}

function pctIn(eraStart: number, eraEnd: number, year: number): number {
  const p = ((year - eraStart) / (eraEnd - eraStart)) * 100;
  return Math.min(97, Math.max(3, p));
}

function MiniCard({ item }: { item: TimelineItem }) {
  const k = KIND[item.kind];
  const to =
    item.kind === "event"
      ? `/era/${item.event!.eraId}?e=${item.event!.id}`
      : item.kind === "figure"
        ? `/figure/${item.figure!.id}`
        : `/work/${item.work!.id}`;
  const title =
    item.kind === "event"
      ? item.event!.title
      : item.kind === "figure"
        ? item.figure!.name
        : item.work!.title;
  const learned = getLearned().has(
    item.kind === "event" ? item.event!.id : item.kind === "figure" ? item.figure!.id : item.work!.id
  );
  return (
    <Link
      to={to}
      className="paper-card block w-32 sm:w-36 px-2.5 py-2 rounded-md hover:scale-[1.04] transition-transform"
      title={title}
    >
      <div className="flex items-center gap-1.5 mb-0.5">
        <span
          className="w-4 h-4 rounded-full text-[10px] leading-4 text-center font-hei text-white shrink-0"
          style={{ background: k.color }}
        >
          {k.label}
        </span>
        <span className="text-[10px] font-hei tabular-nums" style={{ color: "var(--ink-soft)" }}>
          {item.kind === "figure" ? `${fmtYear(item.figure!.born)}生` : fmtYear(item.year)}
        </span>
        {learned && <span className="text-[9px]" style={{ color: "#5d7261" }}>✓</span>}
      </div>
      <p className="font-kai text-xs font-bold leading-snug line-clamp-2" style={{ color: "var(--ink)" }}>
        {item.kind === "work" ? `《${title}》` : title}
      </p>
    </Link>
  );
}

export default function ScrollHome() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [unrolled, setUnrolled] = useState(false);
  const [trackWidth, setTrackWidth] = useState(0);

  // 朝代按时间倒序排布：卷尾（最早）在右，卷首（最晚）在左
  const reversed = [...eras].reverse();
  const widths = new Map(eras.map((e) => [e.id, segWidth(e.start, e.end)]));
  const total = [...widths.values()].reduce((a, b) => a + b, 0) + 200; // 200 = 卷首题记

  // 默认停在卷尾（时间最早处 = 最右端）
  useLayoutEffect(() => {
    const el = containerRef.current;
    if (el) el.scrollLeft = el.scrollWidth;
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onScroll = () => setTrackWidth(el.scrollLeft);
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const jumpToEnd = () => containerRef.current?.scrollTo({ left: containerRef.current.scrollWidth, behavior: "smooth" });
  const jumpToStart = () => containerRef.current?.scrollTo({ left: 0, behavior: "smooth" });
  const step = (dir: 1 | -1) => {
    const el = containerRef.current;
    el?.scrollTo({ left: el.scrollLeft + dir * el.clientWidth * 0.85, behavior: "smooth" });
  };
  const jumpToEra = (id: string) => {
    const el = document.getElementById(`seg-${id}`);
    const c = containerRef.current;
    if (el && c) c.scrollTo({ left: el.offsetLeft, behavior: "smooth" });
  };

  const progress = (() => {
    const el = containerRef.current;
    if (!el) return 0;
    const max = el.scrollWidth - el.clientWidth;
    return max > 0 ? Math.round((1 - trackWidth / max) * 100) : 0;
  })();

  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col overflow-hidden">
      {/* 顶部：题记 + 朝代跳转 */}
      <div className="shrink-0 px-4 pt-4 pb-2 max-w-6xl mx-auto w-full">
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <h1 className="font-kai text-2xl font-bold leading-none">文史长河 · 画卷</h1>
            <p className="text-[11px] font-hei mt-1" style={{ color: "var(--ink-soft)" }}>
              从右往左展卷 · 向右为往古，向左为来世 · 当前位置：{progress}% 处
            </p>
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <button onClick={() => step(1)} className="px-3 py-1 rounded-full text-xs font-hei" style={{ border: "1px solid rgba(80,66,48,0.3)", color: "var(--ink)" }}>向过去 →</button>
            <button onClick={() => step(-1)} className="px-3 py-1 rounded-full text-xs font-hei" style={{ border: "1px solid rgba(80,66,48,0.3)", color: "var(--ink)" }}>← 向后世</button>
          </div>
        </div>
        <div className="flex gap-1.5 mt-3 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          <button onClick={jumpToEnd} className="shrink-0 px-2.5 py-1 rounded text-[11px] font-hei" style={{ background: "var(--cinnabar)", color: "#f6efdf" }}>卷尾·最早</button>
          {[...eras].map((e) => (
            <button key={e.id} onClick={() => jumpToEra(e.id)} className="shrink-0 px-2.5 py-1 rounded text-[11px] font-hei font-kai"
              style={{ background: `${e.color}16`, color: e.color, border: `1px solid ${e.color}33` }}>
              {e.name}
            </button>
          ))}
          <button onClick={jumpToStart} className="shrink-0 px-2.5 py-1 rounded text-[11px] font-hei" style={{ background: "rgba(80,66,48,0.1)", color: "var(--ink-soft)" }}>卷首·最近</button>
        </div>
      </div>

      {/* 画卷主体 */}
      <div ref={containerRef} className="flex-1 overflow-x-auto overflow-y-hidden relative" style={{ scrollbarWidth: "thin" }}>
        <div className="relative h-full" style={{ width: total }}>
          {/* 全局中轴 */}
          <div className="absolute left-0 right-0 top-1/2 h-px" style={{ background: "linear-gradient(to left, rgba(154,59,46,0.5), rgba(80,66,48,0.35) 30%, rgba(80,66,48,0.35))" }} />

          {/* 从左往右为从晚到早：明清 → … → 先秦 → 卷尾题记 */}
          <div className="absolute top-0 bottom-0 right-0 flex h-full">
            {reversed.map((era) => {
              const w = widths.get(era.id)!;
              const items = eraTimeline(era.id);
              return (
                <section key={era.id} id={`seg-${era.id}`} className="relative h-full shrink-0" style={{ width: w }}>
                  {/* 画芯底色 */}
                  <img src={era.image} alt="" className="absolute inset-0 w-full h-full object-cover opacity-[0.14] pointer-events-none" />
                  <div className="absolute inset-y-0 left-0 w-px" style={{ background: "rgba(80,66,48,0.25)" }} />
                  <div className="absolute top-3 left-4 right-4 flex items-baseline justify-between">
                    <span className="font-kai text-xl font-bold" style={{ color: era.color }}>{era.name}</span>
                    <span className="text-[10px] font-hei tabular-nums" style={{ color: "var(--ink-soft)" }}>
                      {fmtYear(era.start)} — {fmtYear(era.end)}
                    </span>
                  </div>
                  <p className="absolute top-9 left-4 right-4 text-[10px] leading-relaxed font-hei line-clamp-2" style={{ color: "var(--ink-soft)" }}>
                    {era.summary}
                  </p>

                  {/* 条目沿轴落位：越早越靠右；同年份条目自动错开 */}
                  {(() => {
                    const MIN_GAP = 7;
                    let prev = -Infinity;
                    return items.map((item, i) => {
                      const year = item.kind === "figure" ? item.figure!.born : item.year;
                      let pct = pctIn(era.start, era.end, year);
                      pct = Math.max(pct, prev + MIN_GAP);
                      pct = Math.min(96, pct);
                      prev = pct;
                      const above = i % 2 === 0;
                      return (
                        <div
                          key={`${item.kind}-${i}`}
                          className="absolute w-32 sm:w-36"
                          style={{
                            right: `calc(${pct}% - 4.5rem)`,
                            [above ? "bottom" : "top"]: `calc(50% ${above ? "+" : "-"} 14px)`,
                            transform: above ? "translateY(4px)" : "translateY(-4px)",
                          }}
                        >
                          {/* 轴点 */}
                          <span className="absolute left-1/2 -translate-x-1/2 w-[9px] h-[9px] rounded-full border-2 bg-[var(--paper)]"
                            style={{ borderColor: KIND[item.kind].color, [above ? "top" : "bottom"]: "-16px" }} />
                          <MiniCard item={item} />
                        </div>
                      );
                    });
                  })()}

                  {/* 段落结束刻度 */}
                  <div className="absolute bottom-2 left-3 text-[9px] font-hei" style={{ color: "var(--ink-soft)" }}>
                    {items.length} 个条目 · 点此进入 → <Link to={`/era/${era.id}`} className="font-bold" style={{ color: era.color }}>完整学习页</Link>
                  </div>
                </section>
              );
            })}

            {/* 卷尾题记（最右端 = 时间最早处） */}
            <div className="relative h-full w-[200px] shrink-0 flex items-center justify-center" style={{ borderLeft: "none" }}>
              <div className="absolute inset-y-0 left-0 w-px" style={{ background: "rgba(154,59,46,0.5)" }} />
              <div className="text-center px-4">
                <p className="font-kai text-lg font-bold" style={{ color: "var(--cinnabar)" }}>卷尾</p>
                <p className="text-[10px] font-hei mt-1" style={{ color: "var(--ink-soft)" }}>公元前1046年<br />武王伐纣</p>
                <p className="font-kai text-2xl font-bold mt-3 vertical-text mx-auto" style={{ color: "var(--ink)" }}>时间从这里开始</p>
              </div>
            </div>
          </div>

          {/* 展开动画：卷面从右向左徐徐展开 */}
          {!unrolled && (
            <div
              className="absolute top-0 bottom-0 left-0 z-20 pointer-events-none"
              style={{ width: "100%", animation: "unroll 2.2s ease-in-out 0.3s forwards" }}
              onAnimationEnd={() => setUnrolled(true)}
            >
              <div className="absolute inset-0" style={{ background: "linear-gradient(to right, #efe8d8 60%, #f4efe4)" }} />
              {/* 卷轴杆 */}
              <div className="absolute top-[-2%] bottom-[-2%] right-0 w-5 rounded-full"
                style={{ background: "linear-gradient(to right, #4a3226, #7a5540 40%, #3d2a20)", boxShadow: "6px 0 18px rgba(40,26,16,0.45)" }}>
                <div className="absolute inset-y-6 left-1/2 -translate-x-1/2 w-1 rounded-full" style={{ background: "rgba(240,225,200,0.35)" }} />
              </div>
              <div className="absolute top-1/2 -translate-y-1/2 right-10 text-right">
                <p className="font-kai text-2xl font-bold vertical-text ml-auto" style={{ color: "var(--ink)" }}>展卷</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 底部图例 */}
      <div className="shrink-0 px-4 py-2 flex items-center gap-4 text-[10px] font-hei max-w-6xl mx-auto w-full" style={{ color: "var(--ink-soft)" }}>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full" style={{ background: KIND.event.color }} /> 历史事件</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full" style={{ background: KIND.figure.color }} /> 人物生卒</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full" style={{ background: KIND.work.color }} /> 作品成书</span>
        <span className="ml-auto">点击卡片进入详情 · ✓ 为已学标记</span>
      </div>

      <style>{`
        @keyframes unroll {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
}
