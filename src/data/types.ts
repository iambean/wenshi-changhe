// ===== 数据模型：时间为主轴，人物生平 / 作品为次轴 =====
// 年份统一使用整数：公元前用负数表示（如 -221 = 公元前221年）

export interface Era {
  id: string;
  name: string;
  short: string;
  start: number; // 起
  end: number; // 止
  image: string;
  color: string; // 主题色（tailwind  Tailwind 类片段，如 #9a6a3a）
  summary: string; // 历史主线概述
  literature: string; // 文学概述
}

export type EventType = "政治" | "战争" | "制度" | "文化" | "社会" | "经济";

export interface HistEvent {
  id: string;
  year: number;
  endYear?: number;
  title: string;
  eraId: string;
  type: EventType;
  description: string;
  figures: string[]; // figure ids
  works: string[]; // work ids
}

export interface Figure {
  id: string;
  name: string;
  courtesy?: string; // 字 / 号
  born: number;
  died: number;
  eraId: string;
  roles: string[];
  bio: string; // 生平 + 时代背景
  facts: string[]; // 记忆要点
  works: string[]; // work ids
  events: string[]; // event ids
}

export interface Work {
  id: string;
  title: string;
  authorId: string;
  year: number; // 约成书 / 创作年份
  eraId: string;
  genre: string; // 诗 / 词 / 散文 / 史传 / 赋 / 戏曲 / 小说 / 文论
  excerpt: string; // 名句节选
  background: string; // 写作背景（历史语境）
  analysis: string; // 文学史地位与赏析要点
  events: string[]; // 关联历史事件
  hook: string; // 短视频切入点（一句话钩子）
}

export interface RecItem {
  title: string;
  meta: string; // 作者 / 年份 / 集数等
  note: string; // 推荐理由 / 适合哪个阶段
  stage: string; // 对应阶段
}
