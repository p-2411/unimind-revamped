'use client'
import { useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "~/app/components/ui/card";
import { cn } from "~/lib/utils";

const stubQuestion = {
  prompt: "Question of the day",
  options: [
    { id: "option-a", label: "A", value: "Photosynthesis" },
    { id: "option-b", label: "B", value: "Cellular respiration" },
    { id: "option-c", label: "C", value: "Fermentation" },
    { id: "option-d", label: "D", value: "Carbon fixation" },
  ],
  correctId: "option-b",
} as const;

export function QuestionCard() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const hasSelection = selectedId !== null;

  return (
    <Card className="rounded-3xl border border-[var(--border)] bg-[var(--surface)]/95 text-[var(--text)] shadow-xl">
      <CardHeader className="rounded-t-3xl border-b border-[var(--border)] bg-[var(--surface-muted)]/70 px-7 py-6">
        <CardTitle className="text-xl font-semibold">
          {stubQuestion.prompt}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 px-4 pb-6 pt-5 sm:px-7">
        {stubQuestion.options.map((option) => {
          const isSelected = option.id === selectedId;
          const isCorrect = option.id === stubQuestion.correctId;
          const isRevealedCorrect = hasSelection && isCorrect;
          const isWrongSelection = hasSelection && isSelected && !isCorrect;

          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={isSelected}
              onClick={() => setSelectedId(option.id)}
              className={cn(
                "group flex w-full items-center gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-[var(--primary)]/40 hover:bg-[var(--surface-muted)]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]/60",
                isSelected && "border-[var(--primary)]/45 bg-[var(--primary)]/10",
                isRevealedCorrect &&
                  "border-emerald-500/60 bg-emerald-500/10 text-emerald-700",
                isWrongSelection &&
                  "border-[var(--destructive)]/70 bg-[var(--destructive)]/10 text-[var(--destructive)]",
              )}
            >
              <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-[var(--primary)]/15 text-sm font-semibold text-[var(--primary)] transition group-hover:bg-[var(--primary)]/25">
                {option.label}
              </span>
              <span className="text-sm font-medium sm:text-base">
                {option.value}
              </span>
            </button>
          );
        })}
      </CardContent>
    </Card>
  );
}
