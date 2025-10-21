"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface EnrollmentPanelProps {
  subjectId: string;
  initiallyEnrolled?: boolean;
}

export function EnrollmentPanel({
  subjectId,
  initiallyEnrolled = false,
}: EnrollmentPanelProps) {
  const [enrolled, setEnrolled] = useState(Boolean(initiallyEnrolled));

  const label = enrolled ? "Enrolled" : "Enroll";
  const tooltipText = enrolled
    ? "Remove this subject from your enrolled list"
    : "Add this subject to your enrolled list";

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          size="sm"
          variant={enrolled ? "outline" : "default"}
          className={[
            "rounded-full px-5",
            enrolled
              ? "border-[var(--primary)]/50 bg-[var(--primary)]/10 text-[var(--primary)] hover:bg-[var(--primary)]/15"
              : "bg-[var(--primary)] text-[var(--text-on-primary)] hover:bg-[var(--primary)]/90",
          ].join(" ")}
          aria-pressed={enrolled}
          onClick={() => setEnrolled((state) => !state)}
          data-subject-id={subjectId}
        >
          {label}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{tooltipText}</TooltipContent>
    </Tooltip>
  );
}
