import { Card, CardTitle, CardHeader, CardContent } from "~/app/components/ui/card";

export default function UpcomingTasksCard() {
    return (
        <Card className="w-full max-w-sm bg-muted/5 shadow-sm">
            <CardHeader className="pb-2 text-center">
                <CardTitle className="text-xl font-semibold" role="heading" aria-level={2}>Upcoming Tasks</CardTitle>
            </CardHeader>


            <CardContent className="pt-2">
            <div className="rounded-xl border px-6 py-4">
            <p className="text-sm">Assessment 1 Due Now</p>
            </div>
            </CardContent>
        </Card>
    );
}