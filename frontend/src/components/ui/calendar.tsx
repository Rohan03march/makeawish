"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
    className,
    classNames,
    showOutsideDays = true,
    ...props
}: CalendarProps) {
    return (
        <DayPicker
            showOutsideDays={showOutsideDays}
            className={cn("p-3", className)}
            classNames={{
                months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                month: "space-y-4",
                caption: "flex justify-center pt-1 relative items-center",
                caption_label: "text-sm font-medium text-gold-400",
                nav: "space-x-1 flex items-center",
                nav_button: cn(
                    "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 text-gold-400 hover:bg-white/10 rounded-md transition-colors"
                ),
                nav_button_previous: "absolute left-1",
                nav_button_next: "absolute right-1",
                table: "w-full border-collapse space-y-1",
                head_row: "flex",
                head_cell:
                    "text-chocolate-400 rounded-md w-9 font-normal text-[0.8rem]",
                row: "flex w-full mt-2",
                cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-white/5 [&:has([aria-selected])]:bg-white/5 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                day: cn(
                    "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-white/10 rounded-md transition-colors text-white"
                ),
                day_range_end: "day-range-end",
                day_selected:
                    "bg-gold-500 text-chocolate-950 hover:bg-gold-500 hover:text-chocolate-950 focus:bg-gold-500 focus:text-chocolate-950 font-bold",
                day_today: "bg-white/10 text-white",
                day_outside:
                    "day-outside text-white/30 aria-selected:bg-white/5 aria-selected:text-white/30",
                day_disabled: "text-white/20 opacity-50",
                day_range_middle:
                    "aria-selected:bg-white/10 aria-selected:text-white",
                day_hidden: "invisible",
                ...classNames,
            }}

            {...props}
        />
    )
}
Calendar.displayName = "Calendar"

export { Calendar }
