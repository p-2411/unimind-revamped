 "use client";

import { useState } from "react";

import { Button } from "../../../components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../../../components/ui/tooltip";

interface EnrollmentPanelProps {
  subjectId: string;
  initiallyEnrolled?: boolean;
}

export function EnrollmentPanel({
  subjectId,
  initiallyEnrolled = false,
}: EnrollmentPanelProps) {
  const [isEnrolled, setIsEnrolled] = useState(initiallyEnrolled);

  const label = isEnrolled ? "Enrolled" : "Enroll";
  const variant = isEnrolled ? "secondary" : "default";

  const toggleEnrollment = () => {
    setIsEnrolled((prev) => !prev);
  };

  const button = (
    <Button
      type="button"
      variant={variant}
      aria-pressed={isEnrolled}
      onClick={toggleEnrollment}
      data-subject-id={subjectId}
    >
      {label}
    </Button>
  );

  return typeof Tooltip !== "undefined" ? (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent>
        {isEnrolled ? "Click to remove from your enrolled subjects" : "Click to enroll in this subject"}
      </TooltipContent>
    </Tooltip>
  ) : (
    button
  );
}
