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

  const label = enrolled ? "Remove" : "Enroll";
  const variant = enrolled ? "destructive" : "default";
  const tooltipText = enrolled
    ? "Click to remove this subject from your list"
    : "Click to enroll in this subject";

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          size="sm"
          variant={variant}
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
