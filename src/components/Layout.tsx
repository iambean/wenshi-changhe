import { Link, NavLink, Outlet } from "react-router";
import { useMemo } from "react";
import { works, allFigures, events, getLearned } from "@/data";

const NAV = [
  { to: "/", label: "首页" },
  { to: "/timeline", label: "时间轴" },
  { to: "/review", label: "复习" },
  { to: "/recs", label: "书单 · 片单" },
];

export default function Layout() {
  const stats = useMemo(() => {
    const learned = getLearned();
    const total = works.length + allFigures.length + events.length;
    const done = [...works, ...allFigures, ...events].filter((x) => learned.has(x.id)).length;
    return { total, done, pct: total ? Math.round((done / total) * 100) : 0 };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 backdrop-blur-md" style={{ background: "rgba(244,239,228,0.88)", borderBottom: "1px solid rgba(80,66,48,0.18)" }}>
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <span className="seal">文史</span>
            <span className="font-kai text-xl font-bold tracking-widest" style={{ color: "var(--ink)" }}>
              文史长河
            </span>
          </Link>
          <nav className="flex items-center gap-1 sm:gap-2 text-sm font-hei">
            {NAV.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.to === "/"}
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-md transition-colors ${
                    isActive ? "font-bold" : "opacity-70 hover:opacity-100"
                  }`
                }
                style={({ isActive }) => (isActive ? { background: "rgba(154,59,46,0.12)", color: "var(--cinnabar)" } : {})}
              >
                {n.label}
              </NavLink>
            ))}
          </nav>
          <div className="ml-auto hidden sm:flex items-center gap-2 text-xs font-hei" style={{ color: "var(--ink-soft)" }}>
            <span>学习进度</span>
            <div className="w-24 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(80,66,48,0.15)" }}>
              <div className="h-full rounded-full" style={{ width: `${stats.pct}%`, background: "var(--cinnabar)" }} />
            </div>
            <span className="tabular-nums">{stats.pct}%</span>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="mt-16 py-8 text-center text-xs font-hei" style={{ color: "var(--ink-soft)", borderTop: "1px solid rgba(80,66,48,0.12)" }}>
        <p className="font-kai text-sm mb-1" style={{ color: "var(--ink)" }}>以史为纲，以文为目 —— 知人论世，以意逆志</p>
        <p>文史长河 · 个人中国历史文学学习系统 · 数据与进度保存在本机浏览器</p>
      </footer>
    </div>
  );
}
