import CalendarAddEventPopover from "@/app/ui/calendar/calendarAddEventPopover";
import CalendarCycleBtns from "@/app/ui/calendar/calendarCycleBtns";
import CalendarMonthAndYear from "@/app/ui/calendar/calendarMonthAndYear";
import CalendarTable from "@/app/ui/calendar/calendarTable";
import { Suspense } from "react";


export default async function Calendar({searchParams}){

    //query the url for the month and year
    //if nothing is found, use current month and year
    //query example: ?month=06&year=2024&day=12

    return (
        <div className="w-full h-full flex flex-col gap-4 p-5 rounded-sm bg-white border border-neutral-800 shadow-sm">
            <h2 className="text-2xl font-bold text-neutral-800">
            Calendar
            </h2>
            <div className="w-full h-fit flex flex-row justify-between items-center">
                <Suspense fallback={<div>Loading...</div>}>
                    <CalendarMonthAndYear/>
                </Suspense>
                <div className="w-fit flex flex-row gap-2">
                    <CalendarAddEventPopover searchParams={searchParams}/>
                    <Suspense fallback={<div>Loading...</div>}>
                        <CalendarCycleBtns/>
                    </Suspense>
                </div>
            </div>
            <Suspense fallback={<div>Loading...</div>}>
                <CalendarTable searchParams={searchParams}/>
            </Suspense>
        </div>
    )
};