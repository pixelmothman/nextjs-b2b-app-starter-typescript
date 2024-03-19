'use client'

import { useSearchParams } from "next/navigation"

export default function CalendarMonthAndYear({}){

    const searchParams = useSearchParams();

    let currentYear: string = "";
    let currentMonth: string;
    let monthsOfYear: string[] = [
        "January", "February", "March", "April", "May", "June", "July", "August", "September", 
        "October", "November", "December"
    ];
    let currentMonthName: string = "";

    if(searchParams){
        //get the current month and year from the url
        currentYear = searchParams.get("year") || "";
        currentMonth = searchParams.get("month") || "";
        //get the current month name from the array
        currentMonthName = monthsOfYear[Number(currentMonth) - 1];
    }




    return (
        <span className="text-lg font-bold text-neutral-800">
            {currentMonthName} / {currentYear}
        </span>
    )
};