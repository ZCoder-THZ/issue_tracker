"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";

export default function DeadlineFilter() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [date, setDate] = useState<Date | null>(
        searchParams.get("deadline") ? new Date(searchParams.get("deadline")!) : null
    );

    const updateSearchParams = (newDate: Date | null) => {
        const params = new URLSearchParams(searchParams);
        if (newDate) {
            params.set("deadline", newDate.toISOString().split("T")[0]); // Format YYYY-MM-DD
        } else {
            params.delete("deadline");
        }
        router.push(`?${params.toString()}`);
    };

    const handleDateChange = (newDate: Date | undefined) => {
        setDate(newDate || null);
        updateSearchParams(newDate || null);
    };

    const resetFilter = () => {
        setDate(null);
        updateSearchParams(null);
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline">
                    {date ? format(date, "PPP") : "Select Deadline"}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="flex flex-col items-center gap-2">
                <Calendar mode="single" selected={date || undefined} onSelect={handleDateChange} />
                {date && (
                    <Button variant="destructive" onClick={resetFilter} className="w-full flex items-center justify-center gap-2">
                        <XIcon size={16} /> Reset
                    </Button>
                )}
            </PopoverContent>
        </Popover>
    );
}
