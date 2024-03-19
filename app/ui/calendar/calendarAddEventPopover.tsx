'use client'

import * as Popover from '@radix-ui/react-popover';
import { useEffect, useState } from 'react';
import { uploadCalendarEvent } from '@/lib/actions';
import FormButtonAbstraction from '../miscelaneous/formButtonAbstraction';

export default function CalendarAddEventPopover(){
    
    let [eventLabel, setEventLabel] = useState('');
    let [eventStartTime, setEventStartTime] = useState('');
    let [eventStartTimeMin, setEventStartTimeMin] = useState('');
    let [eventStartTimeMax, setEventStartTimeMax] = useState('');
    let [eventEndTime, setEventEndTime] = useState('');
    let [eventEndTimeMax, setEventEndTimeMax] = useState('');

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

    return (
        <Popover.Root
        onOpenChange={(open) => {
            if(!open){
                setEventLabel('')
                setEventStartTime('');
                setEventEndTime('');
                setEventStartTimeMin('');
                setEventStartTimeMax('');
                setEventEndTimeMax('');
            }
        }}
        >
            <Popover.Trigger asChild>
                <button
                className='w-fit h-8 px-2 flex flex-row gap-2 items-center border border-neutral-800 rounded-md shadow-sm text-sm font-bold text-neutral-800 hover:bg-neutral-800 hover:text-neutral-100 hover:fill-neutral-100 focus-visible:outline-0 focus-visible:ring-1 focus-visible:ring-black'
                aria-label='Add event'
                >
                    Add event
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 256 256"><path d="M216.49,104.49l-80,80a12,12,0,0,1-17,0l-80-80a12,12,0,0,1,17-17L128,159l71.51-71.52a12,12,0,0,1,17,17Z"></path></svg>
                </button>
            </Popover.Trigger>
            <Popover.Portal>
                <Popover.Content 
                className='w-64 h-fit p-4 bg-neutral-100 border border-neutral-800 rounded-md shadow-sm'
                side="bottom"
                align="center"
                sideOffset={5}
                >
                    <div className='flex flex-col gap-2'>
                        <p className='text-sm font-bold text-neutral-800'>Add event</p>
                        <form action={uploadCalendarEvent} className='flex flex-col gap-3'>
                            <Popover.Root>
                                <Popover.Trigger asChild>
                                    <button
                                    className='relative w-full h-10 px-2 flex items-center justify-center border border-neutral-800 rounded-md shadow-sm text-sm font-normal text-neutral-800 hover:bg-neutral-800 hover:text-neutral-100 hover:fill-neutral-100 focus-visible:border-0 focus:outline-0 focus-visible:ring-2 focus-visible:ring-black'
                                    aria-label='Add event'
                                    >
                                        {
                                            eventLabel === '' ? 'Select label' : eventLabel.charAt(0).toUpperCase() + eventLabel.slice(1)
                                        }
                                        <svg className='absolute left-2' xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 256 256"><path d="M168.49,199.51a12,12,0,0,1-17,17l-80-80a12,12,0,0,1,0-17l80-80a12,12,0,0,1,17,17L97,128Z"></path></svg>
                                    </button>
                                </Popover.Trigger>
                                <Popover.Portal>
                                    <Popover.Content 
                                    className='flex flex-col gap-2 w-fit h-fit p-4 bg-neutral-100 border border-neutral-800 rounded-l-md shadow-sm'
                                    side="left"
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
                            <input type='hidden' name='calendar-event-label' value={
                                eventLabel === '' ? 'personal' : eventLabel
                            } />
                            <div className='flex flex-col gap-1'>
                                <label htmlFor='calendar-event-name' className='text-sm font-normal text-neutral-800'>Event name</label>
                                <input required type='text' autoComplete='off' id='calendar-event-name' name='calendar-event-name' className='w-full h-8 px-2 border border-neutral-800 rounded-md shadow-sm text-sm font-normal text-neutral-800 focus-visible:border-0 focus-visible:ring-2 focus-visible:ring-black' />
                            </div>
                            <div className='flex flex-col gap-1'>
                                <label htmlFor='calendar-event-description' className='text-sm font-normal text-neutral-800'>Event description</label>
                                <input required type='text' autoComplete='off' id='calendar-event-description' name='calendar-event-description' className='w-full h-8 px-2 border border-neutral-800 rounded-md shadow-sm text-sm font-normal text-neutral-800 focus-visible:border-0 focus-visible:ring-2 focus-visible:ring-black' />
                            </div>
                            <div className='flex flex-col gap-3'>
                                <div className='flex flex-col gap-1'>
                                    <label htmlFor='calendar-event-start-date' className='text-sm font-normal text-neutral-800'>Event start time</label>
                                    <input 
                                    required 
                                    type='datetime-local' 
                                    id='calendar-event-start-date'
                                    name='calendar-event-start-date'
                                    min={eventStartTimeMin}
                                    max={eventStartTimeMax}
                                    className='w-full h-8 px-2 border border-neutral-800 rounded-md shadow-sm text-sm font-normal text-neutral-800 focus-visible:border-0 focus-visible:ring-2 focus-visible:ring-black'
                                    onChange={(e) => {
                                        setEventStartTime(e.target.value);
                                    }}
                                    />
                                </div>
                                <div className='flex flex-col gap-1'>
                                    <label htmlFor='calendar-event-end-date' className='text-sm font-normal text-neutral-800'>Event end time</label>
                                    <input 
                                    required 
                                    type='datetime-local' 
                                    id='calendar-event-end-date'
                                    name='calendar-event-end-date'
                                    min={eventStartTime}
                                    max={eventEndTimeMax}
                                    onChange={(e) => {
                                       if(!eventStartTime || eventStartTime === ''){
                                           setEventEndTime(e.target.value);
                                       }
                                    }}
                                    className='w-full h-8 px-2 border border-neutral-800 rounded-md shadow-sm text-sm font-normal text-neutral-800 focus-visible:border-0 focus-visible:ring-1 focus-visible:ring-black'
                                    />
                                </div>
                            </div>
                            <FormButtonAbstraction loadingText="Uploading..." buttonText="Add event" />
                        </form>
                    </div>
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    )
};