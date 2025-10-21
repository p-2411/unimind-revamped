'use client'
import { useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "~/app/components/ui/card";
import { cn } from "~/lib/utils";

const stubQuestion = {
  prompt: "Question here:",
  options: [
    { id: "option-a", label: "A", value: "Answer" },
    { id: "option-b", label: "B", value: "Answer" },
    { id: "option-c", label: "C", value: "Answer" },
    { id: "option-d", label: "D", value: "Answer" },
  ],
  correctId: "option-c",
} as const;

export function QuestionCard() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const hasSelection = selectedId !== null;

  return (
    <Card className="w-full max-w-3xl rounded-3xl border border-border/60 bg-card shadow-lg">
      <CardHeader className="rounded-t-3xl border-b border-border/50 bg-muted/40 px-8 py-6">
        <CardTitle className="text-2xl font-semibold text-foreground">
          {stubQuestion.prompt}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 px-4 pb-6 pt-4 sm:px-6">
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
                "group flex w-full items-center gap-3 rounded-2xl border border-transparent bg-muted/40 px-3 py-3 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/80",
                "hover:-translate-y-0.5 hover:bg-muted/60 hover:shadow-md",
                isSelected && "border-primary/70 bg-primary/10 shadow-sm",
                isRevealedCorrect &&
                  "border-emerald-400/80 bg-emerald-500/10 text-emerald-900 dark:text-emerald-100",
                isWrongSelection &&
                  "border-destructive/70 bg-destructive/10 text-destructive dark:text-destructive-foreground",
              )}
            >
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-secondary font-semibold text-secondary-foreground shadow-[inset_0_0_12px_rgb(0_0_0/0.08)] group-hover:bg-secondary/90 group-hover:shadow-[inset_0_0_16px_rgb(0_0_0/0.12)]">
                {option.label}
              </span>
              <span className="text-base font-medium text-foreground sm:text-lg">
                {option.value}
              </span>
            </button>
          );
        })}
      </CardContent>
    </Card>
  );
}
