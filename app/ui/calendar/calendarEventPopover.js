'use client'

import * as Popover from '@radix-ui/react-popover';
import { useEffect, useState } from 'react';
import { deleteCalendarEvent, updateCalendarEvent } from '@/lib/actions';
import FormButtonAbstraction from '../miscelaneous/formButtonAbstraction';

export default function CalendarEventPopover( { event, dayName, dayNumber }){

    let [readOnlyState, setReadOnlyState] = useState(true);
    let [eventId, setEventId] = useState('');
    let [eventLabel, setEventLabel] = useState('');
    let [eventName, setEventName] = useState('');
    let [eventDescription, setEventDescription] = useState('');
    let [eventStartTime, setEventStartTime] = useState('');
    let [eventStartTimeMin, setEventStartTimeMin] = useState('');
    let [eventStartTimeMax, setEventStartTimeMax] = useState('');
    let [eventEndTime, setEventEndTime] = useState('');
    let [eventEndTimeMax, setEventEndTimeMax] = useState('');

    let startDate = new Date(event.cal_event_start_date);
    let endDate = new Date(event.cal_event_end_date);

    let eventStartDateFormatted = startDate.toISOString().split('.')[0];
    let eventEndDateFormatted = endDate.toISOString().split('.')[0];

    useEffect(() => {
        if(event){
            setEventId(event.cal_event_id);
            setEventLabel(event.cal_event_label);
            setEventName(event.cal_event_name);
            setEventDescription(event.cal_event_description);
        }
    }, [event]);

    useEffect(() => {
        if(eventStartTime && eventStartTime !== ''){
            //the event end time max should be 23:59 of the same day as the event start time
            let theEventEndtimeMax = eventStartTime.split('T')[0] + 'T23:59';
            setEventEndTimeMax(theEventEndtimeMax);
        }
        if(eventEndTime && eventEndTime !== '' && (!eventStartTime && eventStartTime === '') ){
            //the event start time min should be 00:00 of the same day as the event end time
            let theEventStartTimeMin = eventEndTime.split('T')[0] + 'T00:00';
            setEventStartTimeMin(theEventStartTimeMin);
            setEventStartTimeMax(eventEndTime);
        }
    }, [eventStartTime, eventEndTime]);

    const calendarEventLabelIcons = [
        {
            name: 'organization',
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="fill-neutral-50" width="16" height="16" viewBox="0 0 256 256"><path d="M221.56,100.85,141.61,25.38l-.16-.15a19.93,19.93,0,0,0-26.91,0l-.17.15L34.44,100.85A20.07,20.07,0,0,0,28,115.55V208a20,20,0,0,0,20,20H208a20,20,0,0,0,20-20V115.55A20.07,20.07,0,0,0,221.56,100.85ZM204,204H52V117.28l76-71.75,76,71.75Z"></path></svg>,
        },
        {
            name: 'personal',
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="fill-neutral-50" width="16" height="16" viewBox="0 0 256 256"><path d="M128,20A108,108,0,1,0,236,128,108.12,108.12,0,0,0,128,20ZM79.57,196.57a60,60,0,0,1,96.86,0,83.72,83.72,0,0,1-96.86,0ZM100,120a28,28,0,1,1,28,28A28,28,0,0,1,100,120ZM194,179.94a83.48,83.48,0,0,0-29-23.42,52,52,0,1,0-74,0,83.48,83.48,0,0,0-29,23.42,84,84,0,1,1,131.9,0Z"></path></svg>,
        },
    ];

    const changereadOnlyState = () => {
        //clean the event start time and end time
        setEventStartTime('');
        setEventEndTime('');
        setEventStartTimeMin('');
        setEventStartTimeMax('');
        setEventEndTimeMax('');
        
        //change the state of the edit state
        setReadOnlyState(!readOnlyState);
    };
    
    
    return(
        <Popover.Root>
            <Popover.Trigger className="flex items-center justify-center w-6 h-6 bg-neutral-800 border border-neutral-800 rounded-md">
                {
                    event.cal_event_label === 'organization' ? calendarEventLabelIcons[0].icon :
                    event.cal_event_label === 'personal' ? calendarEventLabelIcons[1].icon :
                    null
                }
            </Popover.Trigger>
            <Popover.Portal>
                <Popover.Content 
                className='relative w-96 h-fit p-4 bg-neutral-100 border border-neutral-800 rounded-md shadow-sm'
                side={
                    dayNumber <= 14 && (dayName !== 'Sunday' && dayName !== 'Monday') ? 'bottom' : dayName === 'Sunday' ? 'left' : dayName === 'Monday' ? 'right' : 'top'
                }
                align="center"
                sideOffset={5}
                >
                    <div className='flex flex-col gap-2'>
                        <form action={updateCalendarEvent} className='flex flex-col gap-2'>
                            <div className='w-full flex flex-row items-center justify-between gap-2'>
                                <p className='text-sm font-semibold text-neutral-800'>Event details</p>
                                <div className='flex flex-col gap-3'>
                                    {
                                        readOnlyState === true ? (
                                            <div className='relative w-full h-10 px-2 flex items-center justify-center border border-neutral-800 rounded-md shadow-sm text-sm font-normal text-neutral-800 hover:bg-neutral-800 hover:text-neutral-100 hover:fill-neutral-100 focus-visible:border-0 focus:outline-0 focus-visible:ring-2 focus-visible:ring-black cursor-default'>
                                            {event.cal_event_label.charAt(0).toUpperCase() + event.cal_event_label.slice(1)}
                                            </div>
                                        ) : (
                                            <Popover.Root>
                                                <Popover.Trigger asChild>
                                                    <button
                                                    className='w-full h-10 px-2 flex flex-row gap-2 items-center justify-center border border-neutral-800 rounded-md shadow-sm text-sm font-normal text-neutral-800 hover:bg-neutral-800 hover:text-neutral-100 hover:fill-neutral-100 focus-visible:border-0 focus:outline-0 focus-visible:ring-2 focus-visible:ring-black'
                                                    aria-label='Add event'
                                                    >
                                                        {
                                                            eventLabel === '' ? 'Select label' : eventLabel.charAt(0).toUpperCase() + eventLabel.slice(1)
                                                        }
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 256 256"><path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"></path></svg>
                                                    </button>
                                                </Popover.Trigger>
                                                <Popover.Portal>
                                                    <Popover.Content 
                                                    className='flex flex-col gap-2 w-fit h-fit p-4 bg-neutral-100 border border-neutral-800 rounded-r-md shadow-sm'
                                                    side="right"
                                                    align="start"
                                                    sideOffset={17}
                                                    >
                                                        <div 
                                                        aria-label='select-label-btn-1'
                                                        className="relative flex flex-row gap-2 items-center justify-between text-xs font-semibold text-black select-none outline-none rounded-lg cursor-pointer"
                                                        >
                                                            Organization
                                                            <button onClick={() => {
                                                                setEventLabel('organization');
                                                            }} className={`flex items-center justify-center w-6 h-6 fill-neutral-700 border border-neutral-500 rounded-md focus:bg-neutral-800 focus:fill-white focus:outline-0 ${eventLabel === 'organization' ? 'bg-neutral-600 fill-white' : ''}`}>
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 256 256"><path d="M221.56,100.85,141.61,25.38l-.16-.15a19.93,19.93,0,0,0-26.91,0l-.17.15L34.44,100.85A20.07,20.07,0,0,0,28,115.55V208a20,20,0,0,0,20,20H208a20,20,0,0,0,20-20V115.55A20.07,20.07,0,0,0,221.56,100.85ZM204,204H52V117.28l76-71.75,76,71.75Z"></path></svg>
                                                            </button>
                                                        </div>
                                                        <div 
                                                        aria-label='select-label-btn-2'
                                                        className="relative flex flex-row gap-2 items-center justify-between text-xs font-semibold text-black select-none outline-none rounded-lg cursor-pointer"
                                                        >
                                                            Personal
                                                            <button onClick={() => {
                                                                setEventLabel('personal');
                                                            }} className={`flex items-center justify-center w-6 h-6 fill-neutral-700 border border-neutral-500 rounded-md focus:bg-neutral-800 focus:fill-white focus:outline-0 ${eventLabel === 'personal' ? 'bg-neutral-600 fill-white' : ''}`}>
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 256 256"><path d="M128,20A108,108,0,1,0,236,128,108.12,108.12,0,0,0,128,20ZM79.57,196.57a60,60,0,0,1,96.86,0,83.72,83.72,0,0,1-96.86,0ZM100,120a28,28,0,1,1,28,28A28,28,0,0,1,100,120ZM194,179.94a83.48,83.48,0,0,0-29-23.42,52,52,0,1,0-74,0,83.48,83.48,0,0,0-29,23.42,84,84,0,1,1,131.9,0Z"></path></svg>
                                                            </button>
                                                        </div>
                                                    </Popover.Content>
                                                </Popover.Portal>
                                            </Popover.Root>
                                        )
                                    }
                                    <input autoComplete="off" required type='hidden' id='calendar-event-id' name='calendar-event-id' value={eventId} />
                                    <input autoComplete="off" required type='hidden' id='calendar-event-label'  name='calendar-event-label' value={eventLabel} />
                                </div>
                            </div>
                            <div className='flex flex-row gap-3 mb-3'>
                                <div className='flex flex-col gap-3'>
                                    <div className='flex flex-col gap-1'>
                                        <label htmlFor='calendar-event-name' className='text-sm font-normal text-neutral-800'>Event name</label>
                                        <input 
                                        autoComplete="off" 
                                        required 
                                        readOnly={readOnlyState}
                                        type='text' 
                                        value={readOnlyState === true ? event.cal_event_name : eventName} 
                                        autoComplete='off' 
                                        id='calendar-event-name' 
                                        name='calendar-event-name' 
                                        onChange={(e) => {
                                            setEventName(e.target.value);
                                        }}
                                        className='w-full h-8 px-2 border border-neutral-800 rounded-md shadow-sm text-sm font-normal text-neutral-800 focus-visible:border-0 focus-visible:ring-2 focus-visible:ring-black' />
                                    </div>
                                    <div className='flex flex-col gap-1'>
                                        <label htmlFor='calendar-event-description' className='text-sm font-normal text-neutral-800'>Event description</label>
                                        <input 
                                        autoComplete="off" 
                                        required 
                                        readOnly={readOnlyState}
                                        type='text' 
                                        value={readOnlyState === true ? event.cal_event_description : eventDescription} 
                                        autoComplete='off' 
                                        id='calendar-event-description' 
                                        name='calendar-event-description' 
                                        onChange={(e) => {
                                            setEventDescription(e.target.value);
                                        }}
                                        className='w-full h-8 px-2 border border-neutral-800 rounded-md shadow-sm text-sm font-normal text-neutral-800 focus-visible:border-0 focus-visible:ring-2 focus-visible:ring-black' />
                                    </div> 
                                </div>
                                <div className='w-0.5 border-l-[1px] border-neutral-400' />
                                <div className='flex flex-col gap-3'>
                                    <div className='flex flex-col gap-1'>
                                        <label htmlFor='calendar-event-start-date' className='text-sm font-normal text-neutral-800'>Event start time</label>
                                        <input 
                                        autoComplete="off" 
                                        required 
                                        readOnly={readOnlyState}
                                        type='datetime-local'
                                        value={readOnlyState === true ? eventStartDateFormatted : eventStartTime}
                                        id='calendar-event-start-date'
                                        name='calendar-event-start-date'
                                        min={eventStartTimeMin}
                                        max={eventStartTimeMax}
                                        onChange={(e) => {
                                            setEventStartTime(e.target.value);
                                        }}
                                        className='w-full h-8 px-2 border border-neutral-800 rounded-md shadow-sm text-sm font-normal text-neutral-800 focus-visible:border-0 focus-visible:ring-1 focus-visible:ring-black'
                                        />
                                    </div>
                                    <div className='flex flex-col gap-1'>
                                        <label htmlFor='calendar-event-end-date' className='text-sm font-normal text-neutral-800'>Event end time</label>
                                        <input 
                                        autoComplete="off" 
                                        required 
                                        readOnly={readOnlyState}
                                        type='datetime-local'
                                        value={readOnlyState === true ? eventEndDateFormatted : eventEndTime}
                                        id='calendar-event-end-date'
                                        name='calendar-event-end-date'
                                        min={eventStartTime}
                                        max={eventEndTimeMax}
                                        onChange={(e) => {
                                            setEventEndTime(e.target.value);
                                        }}
                                        className='w-full h-8 px-2 border border-neutral-800 rounded-md shadow-sm text-sm font-normal text-neutral-800 focus-visible:border-0 focus-visible:ring-1 focus-visible:ring-black'
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className='flex flex-row justify-between gap-2'>
                                <div onClick={changereadOnlyState} className='w-fit px-4 py-2 border border-neutral-800 rounded-md shadow-sm text-sm font-bold text-neutral-800 hover:bg-neutral-800 hover:text-neutral-100 focus-visible:outline-0 focus-visible:ring-1 focus-visible:ring-black cursor-pointer'>
                                    {
                                        readOnlyState === true ? 'Edit' : 'Cancel'
                                    }
                                </div>
                                {
                                    readOnlyState === false ? (
                                        <div className='flex flex-row gap-3'>
                                            <FormButtonAbstraction loadingText="Updating..." buttonText="Update"/>
                                        </div>
                                    ) : null
                                }
                            </div>
                        </form>
                        {
                            readOnlyState === false ? (
                                <form action={deleteCalendarEvent} className='absolute bottom-4 right-28'>
                                    <input autoComplete="off" required type='hidden' id='calendar-event-id' name='calendar-event-id' value={eventId} />
                                    <FormButtonAbstraction loadingText="Deleting..." buttonText="Delete"/>
                                </form>
                            ) : null
                        }
                    </div>
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    )
};
