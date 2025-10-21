'use client'
import Image from "next/image";
import { Card, CardContent } from "~/app/components/ui/card";
import { Button } from "~/app/components/ui/button";

export function TopicCard({ title, category, icon, mastery }: TopicCardProps) {
  const masteryPercent = Math.round(mastery * 100);

  return (
    <Card className="h-full rounded-3xl border border-[var(--border)] bg-[var(--surface)]/90 text-left text-[var(--text)] shadow-lg transition hover:-translate-y-1 hover:shadow-xl">
      <CardContent className="flex h-full flex-col gap-5 p-6">
        <div className="flex items-center gap-4">
          <div className="grid size-16 place-items-center rounded-2xl bg-[var(--primary)]/15 text-3xl">
            <span>{icon}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--text-muted)]">
              {category}
            </span>
            <h3 className="text-lg font-semibold leading-tight text-[var(--text)]">
              {title}
            </h3>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs uppercase tracking-[0.25em] text-[var(--text-muted)]">
            <span>Mastery</span>
            <span>{masteryPercent}%</span>
          </div>
          <Progress
            value={masteryPercent}
            className="h-2 bg-[var(--track)] [&_[data-slot=progress-indicator]]:bg-[var(--primary)]"
          />
        </div>

        <Button
          variant="outline"
          className="mt-auto w-fit rounded-full border-[var(--border)] bg-[var(--surface)] px-5 py-2 text-sm font-medium text-[var(--text)] shadow-sm transition hover:border-[var(--primary)]/50 hover:bg-[var(--primary)]/10"
        >
          Review topic
        </Button>
      </CardContent>
    </Card>
  );
}
