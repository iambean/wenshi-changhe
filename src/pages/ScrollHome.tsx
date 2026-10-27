import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { eras, eraTimeline, fmtYear, getLearned, type TimelineItem } from "@/data";

const KIND: Record<TimelineItem["kind"], { label: string; color: string }> = {
  event: { label: "史", color: "#8a4f3d" },
  figure: { label: "人", color: "#5d7261" },
  work: { label: "文", color: "#3f6b7a" },
};

/** 卡片宽度（px），用于间距计算 */
const CARD_W = 136;
const ROW_GAP = 14; // 行内卡片最小间距 px

/** 每行可放卡片数 → 段落宽度：保证卡片不重叠、不越界 */
function segWidth(eraStart: number, eraEnd: number, itemCount: number): number {
  const perRow = Math.ceil(itemCount / 2);
  const byItems = perRow * (CARD_W + ROW_GAP) + 120;
  const bySpan = 380 + Math.round(Math.log(Math.max(10, eraEnd - eraStart)) * 88);
  return Math.max(bySpan, byItems);
}

interface PlacedItem {
  item: TimelineItem;
  pct: number; // 距段落右边缘的百分比（越早越靠右）
  below: boolean;
}

/** 上下两行交替分配，行内强制最小间距 */
function placeItems(
  items: TimelineItem[],
  eraStart: number,
  eraEnd: number,
  width: number
): PlacedItem[] {
  const margin = (CARD_W / 2 + 10) / width; // 半卡宽 + 边距，占百分比
  const minGap = (CARD_W + ROW_GAP) / width;
  let prevAbove = -Infinity;
  let prevBelow = -Infinity;
  return items.map((item, i) => {
    const year = item.kind === "figure" ? item.figure!.born : item.year;
    let raw = (year - eraStart) / (eraEnd - eraStart);
    raw = Math.min(1 - margin, Math.max(margin, raw));
    const below = i % 2 === 1;
    let pct = raw;
    if (below) {
      pct = Math.max(pct, prevBelow + minGap);
      pct = Math.min(pct, 1 - margin);
      prevBelow = pct;
    } else {
      pct = Math.max(pct, prevAbove + minGap);
      pct = Math.min(pct, 1 - margin);
      prevAbove = pct;
    }
    return { item, pct: pct * 100, below };
  });
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
      className="paper-card block w-[136px] px-2.5 py-2 rounded-md hover:scale-[1.05] transition-transform relative z-10"
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
  const [pos, setPos] = useState(0);

  // 朝代按时间倒序：卷尾（最早）在右，卷首（最近）在左
  const reversed = [...eras].reverse();
  const widths = new Map(
    eras.map((e) => [e.id, segWidth(e.start, e.end, eraTimeline(e.id).length)])
  );
  const total = [...widths.values()].reduce((a, b) => a + b, 0) + 220;

  // 默认停在卷尾（时间最早处 = 最右端）
  useLayoutEffect(() => {
    const el = containerRef.current;
    if (el) el.scrollLeft = el.scrollWidth;
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onScroll = () => setPos(el.scrollLeft);
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
    return max > 0 ? Math.round((1 - pos / max) * 100) : 0;
  })();

  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col overflow-hidden">
      {/* 顶部：题记 + 朝代跳转 */}
      <div className="shrink-0 px-4 pt-4 pb-2 max-w-6xl mx-auto w-full">
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <h1 className="font-kai text-2xl font-bold leading-none">文史长河 · 画卷</h1>
            <p className="text-[11px] font-hei mt-1" style={{ color: "var(--ink-soft)" }}>
              从右往左展卷 · 向右为往古，向左为来世 · 已行 {progress}%
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
          {/* 卷面中缝：时间轴纸带 */}
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-9"
            style={{
              background: "linear-gradient(to bottom, rgba(80,66,48,0.03), rgba(80,66,48,0.09) 45%, rgba(80,66,48,0.03))",
              borderTop: "1px solid rgba(80,66,48,0.28)",
              borderBottom: "1px solid rgba(80,66,48,0.28)",
            }} />

          {/* 从左往右：明清 → … → 先秦 → 卷尾题记 */}
          <div className="absolute top-0 bottom-0 right-0 flex h-full">
            {reversed.map((era) => {
              const w = widths.get(era.id)!;
              const items = eraTimeline(era.id);
              const placed = placeItems(items, era.start, era.end, w);
              return (
                <section key={era.id} id={`seg-${era.id}`} className="relative h-full shrink-0" style={{ width: w }}>
                  <img src={era.image} alt="" className="absolute inset-0 w-full h-full object-cover opacity-[0.13] pointer-events-none" />

                  {/* 段界（左缘，即时间较晚一侧） */}
                  <div className="absolute inset-y-0 left-0 w-px" style={{ background: "rgba(80,66,48,0.3)" }} />

                  {/* 段首题签 */}
                  <div className="absolute top-3 left-4 flex items-baseline gap-2">
                    <span className="font-kai text-xl font-bold" style={{ color: era.color }}>{era.name}</span>
                    <span className="text-[10px] font-hei tabular-nums" style={{ color: "var(--ink-soft)" }}>
                      {fmtYear(era.start)} — {fmtYear(era.end)}
                    </span>
                  </div>
                  <p className="absolute top-9 left-4 right-24 text-[10px] leading-relaxed font-hei line-clamp-2" style={{ color: "var(--ink-soft)" }}>
                    {era.summary}
                  </p>

                  {/* 轴带上的朝代起止年刻度 */}
                  <span className="absolute top-1/2 -translate-y-1/2 right-1 text-[9px] font-hei tabular-nums px-1 rounded-sm"
                    style={{ background: "rgba(244,239,228,0.9)", color: era.color, border: `1px solid ${era.color}44` }}>
                    {era.start < 0 ? `前${-era.start}` : era.start}
                  </span>
                  <span className="absolute top-1/2 -translate-y-1/2 left-1 text-[9px] font-hei tabular-nums px-1 rounded-sm"
                    style={{ background: "rgba(244,239,228,0.9)", color: era.color, border: `1px solid ${era.color}44` }}>
                    {era.end < 0 ? `前${-era.end}` : era.end}
                  </span>
                  {/* 10% 刻度线 */}
                  {Array.from({ length: 9 }, (_, i) => (
                    <span key={i} className="absolute top-1/2 -translate-y-1/2 h-3.5 w-px"
                      style={{ right: `${(i + 1) * 10}%`, background: "rgba(80,66,48,0.22)" }} />
                  ))}

                  {/* 条目：垂挂于轴带 */}
                  {placed.map(({ item, pct, below }, i) => {
                    const k = KIND[item.kind];
                    return (
                      <div key={`${item.kind}-${i}`} className="absolute w-[136px]"
                        style={{
                          right: `calc(${pct}% - ${CARD_W / 2}px)`,
                          ...(below
                            ? { top: "calc(50% + 19px)" }
                            : { bottom: "calc(50% + 19px)" }),
                        }}>
                        {/* 轴点 + 垂线 */}
                        <span className="absolute left-1/2 -translate-x-1/2 w-[11px] h-[11px] rounded-full border-2 bg-[var(--paper)] z-10"
                          style={{
                            borderColor: k.color,
                            boxShadow: "0 1px 3px rgba(60,48,30,0.3)",
                            ...(below ? { top: "-16px" } : { bottom: "-16px" }),
                          }} />
                        <span className="absolute left-1/2 -translate-x-1/2 w-px h-[10px]"
                          style={{ background: "rgba(80,66,48,0.4)", ...(below ? { top: "-6px" } : { bottom: "-6px" }) }} />
                        <MiniCard item={item} />
                      </div>
                    );
                  })}

                  {/* 段尾说明 */}
                  <div className="absolute bottom-2 left-3 text-[9px] font-hei" style={{ color: "var(--ink-soft)" }}>
                    {items.length} 个条目 · <Link to={`/era/${era.id}`} className="font-bold" style={{ color: era.color }}>完整学习页 →</Link>
                  </div>
                </section>
              );
            })}

            {/* 卷尾题记（最右端 = 时间最早处） */}
            <div className="relative h-full w-[220px] shrink-0 flex items-center justify-center">
              <div className="absolute inset-y-0 left-0 w-px" style={{ background: "rgba(154,59,46,0.5)" }} />
              <div className="text-center px-4">
                <p className="font-kai text-lg font-bold" style={{ color: "var(--cinnabar)" }}>卷尾</p>
                <p className="text-[10px] font-hei mt-1" style={{ color: "var(--ink-soft)" }}>公元前1046年<br />武王伐纣</p>
                <p className="font-kai text-2xl font-bold mt-4 vertical-text mx-auto" style={{ color: "var(--ink)" }}>时间从这里开始</p>
              </div>
            </div>
          </div>

          {/* 展卷动画：卷轴杆 + 卷起纸边，从右向左徐徐展开 */}
          {!unrolled && (
            <div
              className="absolute top-0 bottom-0 left-0 z-30 pointer-events-none"
              style={{ width: "100%", animation: "unroll 2.8s cubic-bezier(0.25,1,0.4,1) 0.5s forwards" }}
              onAnimationEnd={() => setUnrolled(true)}
            >
              {/* 尚未展开的卷面 */}
              <div className="absolute inset-0" style={{ background: "linear-gradient(to right, #ece4d0 0%, #f2ecdc 55%, #f6f1e3 100%)" }} />
              {/* 卷起纸边：三层纸的厚度感 */}
              <div className="absolute top-0 bottom-0 right-0 w-[54px]">
                <div className="absolute inset-y-0 right-0 w-[54px]"
                  style={{ background: "linear-gradient(to left, #e6ddc8 0%, #efe8d6 30%, #f6f1e3 100%)", boxShadow: "-10px 0 24px rgba(60,45,28,0.18)" }} />
                <div className="absolute inset-y-0 right-[7px] w-px" style={{ background: "rgba(120,100,70,0.35)" }} />
                <div className="absolute inset-y-0 right-[15px] w-px" style={{ background: "rgba(120,100,70,0.22)" }} />
                <div className="absolute inset-y-0 right-[24px] w-px" style={{ background: "rgba(120,100,70,0.12)" }} />
              </div>
              {/* 卷轴杆：深色漆木 + 玉轴头 */}
              <div className="absolute top-[-8px] bottom-[-8px] right-0 w-[18px] rounded-[9px]"
                style={{
                  background: "linear-gradient(to right, #2e2019 0%, #5b4131 38%, #7a5a42 50%, #4a3527 70%, #241a14 100%)",
                  boxShadow: "-6px 2px 18px rgba(40,26,16,0.5), inset 0 0 3px rgba(255,240,210,0.25)",
                }}>
                {/* 木纹高光 */}
                <div className="absolute inset-y-3 left-1/2 -translate-x-1/2 w-[3px] rounded-full"
                  style={{ background: "linear-gradient(to bottom, transparent, rgba(230,205,160,0.35), transparent)" }} />
                {/* 束箍 */}
                <div className="absolute top-[12%] left-0 right-0 h-[5px]" style={{ background: "linear-gradient(to bottom, rgba(20,12,8,0.55), rgba(120,90,60,0.4), rgba(20,12,8,0.55))" }} />
                <div className="absolute top-[84%] left-0 right-0 h-[5px]" style={{ background: "linear-gradient(to bottom, rgba(20,12,8,0.55), rgba(120,90,60,0.4), rgba(20,12,8,0.55))" }} />
              </div>
              {/* 玉轴头（上下） */}
              {["-top-[13px]", "-bottom-[13px]"].map((posCls) => (
                <div key={posCls} className={`absolute ${posCls} right-[-7px] w-[32px] h-[20px] rounded-full`}
                  style={{
                    background: "radial-gradient(ellipse at 40% 35%, #cfe0d8 0%, #9db8a8 45%, #6e8a7a 80%, #4c6357 100%)",
                    boxShadow: "0 2px 6px rgba(40,26,16,0.45), inset 0 1px 2px rgba(255,255,255,0.5)",
                  }} />
              ))}
              {/* 展卷题记 */}
              <div className="absolute top-1/2 -translate-y-1/2 right-[86px]" style={{ animation: "fadeSeal 2.8s ease 0.5s forwards" }}>
                <p className="font-kai text-3xl font-bold vertical-text" style={{ color: "rgba(60,48,32,0.75)", textShadow: "0 1px 0 rgba(255,250,240,0.6)" }}>展卷</p>
                <p className="text-[10px] font-hei mt-3 vertical-text ml-1" style={{ color: "rgba(80,66,48,0.55)" }}>三千年文史一轴收</p>
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
          0% { width: 100%; }
          100% { width: 0%; }
        }
        @keyframes fadeSeal {
          0%, 60% { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
