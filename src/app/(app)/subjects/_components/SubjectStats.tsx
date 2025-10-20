import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "../../../components/ui/card";

interface SubjectStatsProps {
  stats: {
    accuracy: number;
    timeMins: number;
    questions: number;
  };
}

interface StatProps {
  label: string;
  value: string;
  description?: string;
}

function Stat({ label, value, description }: StatProps) {
  return (
    <Card className="gap-0 border-[var(--border)] bg-transparent shadow-none">
      <CardContent className="px-5 py-4">
        <CardDescription className="text-[var(--text-muted)] text-xs uppercase tracking-wide">
          {label}
        </CardDescription>
        <CardTitle className="text-2xl font-semibold text-foreground">
          {value}
        </CardTitle>
        {description ? (
          <p className="text-[var(--text-muted)] text-xs">{description}</p>
        ) : null}
      </CardContent>
    </Card>
  );
}

export function SubjectStats({ stats }: SubjectStatsProps) {
  const { accuracy, timeMins, questions } = stats;

  const safeAccuracy =
    Number.isFinite(accuracy) && accuracy >= 0 ? accuracy : 0;
  const safeTimeMins =
    Number.isFinite(timeMins) && timeMins >= 0 ? timeMins : 0;
  const safeQuestions =
    Number.isFinite(questions) && questions >= 0 ? questions : 0;

  return (
    <section className="grid gap-4 sm:grid-cols-3">
      <Stat label="Accuracy" value={`${Math.round(safeAccuracy)}%`} />
      <Stat label="Time" value={`${Math.round(safeTimeMins)} m`} />
      <Stat label="Questions" value={`${Math.round(safeQuestions)}`} />
    </section>
  );
}
