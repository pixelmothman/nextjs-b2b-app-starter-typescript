'use client'

import { usePathname, useSearchParams } from "next/navigation"
import { useRouter } from "next/navigation"
import { useCallback } from "react";

export default function CalendarCycleBtns({}){
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Get a new searchParams string by merging the current
    // searchParams with a provided key/value pair
    const createQueryString = useCallback((paramsObj) => {
        const params = new URLSearchParams(searchParams.toString());
        for (const [name, value] of Object.entries(paramsObj)) {
            params.set(name, value);
        }
        return params.toString();
    }, [searchParams]);

    const currentYear = searchParams.get("year");
    const currentMonth = searchParams.get("month");
    const currentDay = searchParams.get("day");


    return (
        <div className="w-fit flex flex-row gap-2 self-end">
        <button 
        onClick={() => {
            if (Number(currentMonth) === 1) {
                router.push(`
                ${pathname}?${createQueryString({
                    year: Number(currentYear) - 1,
                    month: 12
                })}
                `)
            } else {
                router.push(`
                ${pathname}?${createQueryString({
                    month: Number(currentMonth) - 1
                })}
                `)
            }
        }
        }
        className="w-fit h-8 px-2 flex items-center justify-center border border-neutral-800 rounded-md shadow-sm text-neutral-800 font-bold hover:bg-neutral-800 hover:fill-neutral-100 focus-visible:outline-0 focus-visible:ring-1 focus-visible:ring-black"
        >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 256 256"><path d="M228,128a12,12,0,0,1-12,12H69l51.52,51.51a12,12,0,0,1-17,17l-72-72a12,12,0,0,1,0-17l72-72a12,12,0,0,1,17,17L69,116H216A12,12,0,0,1,228,128Z"></path></svg>
        </button>
        <button 
        onClick={() => {
            if (Number(currentMonth) === 12) {
                router.push(`
                ${pathname}?${createQueryString({
                    year: Number(currentYear) + 1,
                    month: 1
                })}
                `)
            } else {
                router.push(`
                ${pathname}?${createQueryString({
                    month: Number(currentMonth) + 1
                })}
                `)
            }
        }}
        className="w-fit h-8 px-2 flex items-center justify-center border border-neutral-800 rounded-md shadow-sm text-neutral-800 font-bold hover:bg-neutral-800 hover:fill-neutral-100 focus-visible:outline-0 focus-visible:ring-1 focus-visible:ring-black"
        >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 256 256"><path d="M224.49,136.49l-72,72a12,12,0,0,1-17-17L187,140H40a12,12,0,0,1,0-24H187L135.51,64.48a12,12,0,0,1,17-17l72,72A12,12,0,0,1,224.49,136.49Z"></path></svg>
        </button>
        </div>
    )
};