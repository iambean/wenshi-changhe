import { useState } from "react";
import { toggleLearned, getLearned } from "@/data";

export default function LearnedToggle({ id, label = "标记已学" }: { id: string; label?: string }) {
  const [on, setOn] = useState(() => getLearned().has(id));
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setOn(toggleLearned(id).has(id));
      }}
      className="inline-flex items-center gap-1.5 text-xs font-hei px-2.5 py-1 rounded-full transition-colors"
      style={
        on
          ? { background: "rgba(154,59,46,0.14)", color: "var(--cinnabar)", border: "1px solid rgba(154,59,46,0.4)" }
          : { background: "rgba(80,66,48,0.06)", color: "var(--ink-soft)", border: "1px solid rgba(80,66,48,0.2)" }
      }
      title={label}
    >
      <span className="inline-block w-3.5 h-3.5 rounded-sm text-center leading-3 text-[10px]"
        style={on ? { background: "var(--cinnabar)", color: "#fff" } : { border: "1px solid rgba(80,66,48,0.4)" }}>
        {on ? "✓" : ""}
      </span>
      {on ? "已学" : label}
    </button>
  );
}
