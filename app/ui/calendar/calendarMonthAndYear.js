'use client'

import { useSearchParams } from "next/navigation"

export default function CalendarMonthAndYear({}){

    const searchParams = useSearchParams();

    //get the current month and year from the url
    const currentYear = searchParams.get("year");
    const currentMonth = searchParams.get("month");

    //array of months to display
    const monthsOfYear = [
        "January", "February", "March", "April", "May", "June", "July", "August", "September", 
        "October", "November", "December"
    ];

    //get the current month name from the array
    const currentMonthName = monthsOfYear[currentMonth - 1];


    return (
        <span className="text-lg font-bold text-neutral-800">
            {currentMonthName} / {currentYear}
        </span>
    )
};