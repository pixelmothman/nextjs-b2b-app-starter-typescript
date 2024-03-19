import { fetchCalendarEvents } from "@/lib/data";
import CalendarEventPopover from "./calendarEventPopover";

interface SearchParams {
    searchParams: {
        day: string;
        month: string;
        year: string
    };
};

type CalendarEvent = {
    cal_event_start_date: string;
}[];

interface ArrayOfDays {
    day: string;
    month: string;
    year: string;
    name: string;
    events: any[];
};

export default async function CalendarTable({searchParams}: SearchParams){

    //this calendar will be inside a Suspense component
    //as a server side rendered component, it will be rendered with all the relevant data of selected time period
    //the default month will be the current month if nothing is read from the url
    let date: Date;
    let day: number;
    
    if(searchParams === undefined || searchParams === null || !searchParams.year || !searchParams.month || !searchParams.day){
        date = new Date();
    };

    //if the url has a day, change the day format from YYYY-MM-DD to DD
    let year = Number(searchParams.year);
    let month = Number(searchParams.month);
    day = Number(searchParams.day.split("-")[2]);
    date = new Date(year, month - 1, day);

    const calendarEvents: CalendarEvent  = await fetchCalendarEvents(date);
  
    //names of days
    const days = ['Sunday','Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    //names of months
    const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

    let firstDayOfTheMonthNumber = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    let lasttDayOfTheMonthNumber = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDay();

    // Adjust the day numbers to start from Monday
    firstDayOfTheMonthNumber = firstDayOfTheMonthNumber === 0 ? 7 : firstDayOfTheMonthNumber;
    lasttDayOfTheMonthNumber = lasttDayOfTheMonthNumber === 0 ? 7 : lasttDayOfTheMonthNumber;

    const numberOfDaysInTheMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

    const arrayOfDays: ArrayOfDays[] = [];
    const totalSlots: number = 7 * 6;
    const daysBeforeMonthStarts: number = firstDayOfTheMonthNumber - 1;
    const daysAfterMonthEnds: number = totalSlots - (daysBeforeMonthStarts + numberOfDaysInTheMonth) % totalSlots;

    // Days before the first day of the month
    for (let i = 0; i < daysBeforeMonthStarts; i++) {
        arrayOfDays.push({
            day: "",
            month: "",
            year: "",
            name: '',
            events: []
        });
    };
    
    // Days in the current month
    for (let i = 1; i <= numberOfDaysInTheMonth; i++) {
        let day: ArrayOfDays = {
            day: `${i}`,
            month: `${date.getMonth() + 1}`,
            year: `${date.getFullYear()}`,
            name: days[new Date(date.getFullYear(), date.getMonth(), i).getDay()],
            events: []
        };
    
        // Check for events on this day
        for(let j=0; j < calendarEvents.length; j++){
            if(Number(day.day) === Number(calendarEvents[j].cal_event_start_date.slice(8,10))){
                day.events.push(calendarEvents[j]);
            }
        }
    
        arrayOfDays.push(day);
    };
    
    // Days after the last day of the month
    for (let i = 0; i < daysAfterMonthEnds; i++) {
        arrayOfDays.push({
            day: "",
            month: "",
            year: "",
            name: '',
            events: []
        });
    };


    return (
        <div className="w-full h-full grid grid-cols-7 grid-rows-6 gap-4">
            {
                arrayOfDays.map((day, index) => {
                    return (
                        <div key={index} className={`w-full h-full flex flex-col gap-1 p-2 rounded-md overflow-y-auto ${
                            day.name === '' ? "outline outline-1 outline-neutral-300 shadow-sm" : 
                            day.year === searchParams.day.split("-")[0] && 
                            day.month === searchParams.day.split("-")[1] && 
                            day.day === searchParams.day.split("-")[2] ? 
                            "outline outline-2 outline-neutral-800 shadow-md shadow-neutral-400" : 
                            "outline outline-1 outline-neutral-800 shadow-sm"
                        }`}>
                            <span className="text-sm font-bold text-neutral-800">
                                {day.name.slice(0,3)} {day.day}
                            </span>
                            <div className="flex flex-row flex-wrap gap-2">
                                {
                                    day?.events.map((event, index) => {
                                        return (
                                            <CalendarEventPopover key={index} event={event} dayName={day.name} dayNumber={day.day}/>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
};