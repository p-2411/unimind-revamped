'use client'
import Image from "next/image";
import { Card, CardContent } from "~/app/components/ui/card";
import { Button } from "~/app/components/ui/button";

export function TopicCard() {
    return (
        <Card className = "w-64 bg-muted/5 text-center shadow-sm">
            <CardContent className = "flex flex-row items-centre gap-4 p-6">
                <div className = "flex size-24 items-center justify-center">
                    <Image src = "/badges/bronze-star.png" alt="Bronze bage" width = {80} height = {80} />
                </div>
                <div>
                    <p className = "text-xl font-semibold">Topic - Class</p>
                    <p className = "text-x3 font-black">0</p>
                </div>
                <Button variant = "secondary" className = "rounded-full px-8">View More</Button>
            </CardContent>
        </Card>
    );
}