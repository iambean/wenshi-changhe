import { eras } from "./eras";
import { events as eventsBase } from "./events";
import { eventsExtra } from "./events-extra";
import { figures } from "./figures";
import { figuresExtra } from "./figures-extra";
import { works as worksBase, COLLECTIVE_FIGURE } from "./works";
import { worksExtra } from "./works-extra";
import { phases } from "./phases";
import type { Era, HistEvent, Figure, Work } from "./types";

export { eras, phases };
export const events: HistEvent[] = [...eventsBase, ...eventsExtra];
export const works: Work[] = [...worksBase, ...worksExtra];
export const allFigures: Figure[] = [...figures, ...figuresExtra, COLLECTIVE_FIGURE as unknown as Figure];

const eraMap = new Map(eras.map((e) => [e.id, e]));
const figureMap = new Map(allFigures.map((f) => [f.id, f]));
const workMap = new Map(works.map((w) => [w.id, w]));
const eventMap = new Map(events.map((e) => [e.id, e]));

export const eraById = (id: string): Era | undefined => eraMap.get(id);
export const figureById = (id: string): Figure | undefined => figureMap.get(id);
export const workById = (id: string): Work | undefined => workMap.get(id);
export const eventById = (id: string): HistEvent | undefined => eventMap.get(id);

/** 公元前用负数表示：-1046 → 公元前1046年 */
export function fmtYear(y: number): string {
  return y < 0 ? `公元前${-y}年` : `${y}年`;
}

export function fmtRange(start: number, end: number): string {
  return `${fmtYear(start)} — ${fmtYear(end)}`;
}

export function eraName(id: string): string {
  return eraById(id)?.name ?? id;
}

/** 某朝代的全部时间轴条目（事件 + 该朝代人物生卒 + 作品），按年份排序 */
export interface TimelineItem {
  kind: "event" | "figure" | "work";
  year: number;
  event?: HistEvent;
  figure?: Figure;
  work?: Work;
}

export function eraTimeline(eraId: string): TimelineItem[] {
  const items: TimelineItem[] = [];
  for (const e of events)
    if (e.eraId === eraId) items.push({ kind: "event", year: e.year, event: e });
  for (const f of allFigures)
    if (f.eraId === eraId) items.push({ kind: "figure", year: f.born, figure: f });
  for (const w of works)
    if (w.eraId === eraId) items.push({ kind: "work", year: w.year, work: w });
  return items.sort((a, b) => a.year - b.year);
}

// ===== 学习进度（localStorage）=====
const KEY = "wenshi.learned.v1";

export function getLearned(): Set<string> {
  try {
    return new Set(JSON.parse(localStorage.getItem(KEY) ?? "[]") as string[]);
  } catch {
    return new Set();
  }
}

export function toggleLearned(id: string): Set<string> {
  const s = getLearned();
  if (s.has(id)) s.delete(id);
  else s.add(id);
  localStorage.setItem(KEY, JSON.stringify([...s]));
  return s;
}

// ===== 复习卡组 =====
export interface Card {
  id: string;
  kind: "work-bg" | "work-who" | "figure-when" | "event-link";
  question: string;
  answer: string;
  extra?: string;
}

export function buildDeck(): Card[] {
  const cards: Card[] = [];
  for (const w of works) {
    const author = figureById(w.authorId);
    const evs = w.events.map(eventById).filter(Boolean) as HistEvent[];
    cards.push({
      id: `${w.id}:bg`,
      kind: "work-bg",
      question: `《${w.title}》写作时，历史上正在发生什么？`,
      answer: evs.length
        ? evs.map((e) => `${e.title}：${e.description.slice(0, 60)}……`).join("\n")
        : w.background.slice(0, 120) + "……",
      extra: w.background,
    });
    if (author && author.id !== "f-collective") {
      cards.push({
        id: `${w.id}:who`,
        kind: "work-who",
        question: `“${w.excerpt.split("/")[0].trim().slice(0, 24)}……”出自谁手？`,
        answer: `${author.name}${author.courtesy ? `（${author.courtesy}）` : ""}《${w.title}》`,
        extra: w.analysis.slice(0, 100) + "……",
      });
    }
  }
  for (const f of allFigures) {
    if (f.id === "f-collective") continue;
    cards.push({
      id: `${f.id}:when`,
      kind: "figure-when",
      question: `${f.name}生于哪一年、历经哪个朝代的关键节点？`,
      answer: `${fmtYear(f.born)}—${fmtYear(f.died)}，${eraName(f.eraId)}时期。${
        f.events.length
          ? "亲历：" +
            f.events
              .map((id) => eventById(id)?.title)
              .filter(Boolean)
              .join("；")
          : ""
      }`,
      extra: f.bio.slice(0, 100) + "……",
    });
  }
  return cards;
}

// ===== 短视频脚本生成 =====
export interface Shot {
  sec: string;
  visual: string;
  text: string;
}

export function buildScript(w: Work): { title: string; shots: Shot[] } {
  const author = figureById(w.authorId);
  const evs = w.events.map(eventById).filter(Boolean) as HistEvent[];
  const firstExcerpt = w.excerpt.split("/")[0].trim();
  return {
    title: `60秒读懂《${w.title}》`,
    shots: [
      {
        sec: "0-3s",
        visual: "黑屏渐入，毛笔字逐字写出作品名，配一声悠远古琴",
        text: `${w.hook}`,
      },
      {
        sec: "3-15s",
        visual: "地图动画 + 水墨晕染，标注时间与地点",
        text: `${fmtYear(w.year)}年。${
          evs.length
            ? `此时正在发生：${evs[0].title}。${evs[0].description.slice(0, 50)}……`
            : w.background.slice(0, 60) + "……"
        }`,
      },
      {
        sec: "15-30s",
        visual: `${author ? author.name : ""}形象剪影登场，诗朗诵同期声`,
        text: `「${firstExcerpt.slice(0, 40)}${firstExcerpt.length > 40 ? "……" : ""}」——${author ? author.name : "无名氏"}${w.genre ? `，${w.genre}` : ""}。`,
      },
      {
        sec: "30-48s",
        visual: "金句放大特写，弹幕式关键词弹出",
        text: w.background,
      },
      {
        sec: "48-60s",
        visual: "画面收束为一枚印章落下，定格片尾",
        text: `${w.analysis.slice(0, 60)}…… 关注，继续下一段文史长河。`,
      },
    ],
  };
}
