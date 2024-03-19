'use client'

import * as Tooltip from '@radix-ui/react-tooltip';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function LeftSideBarItem( props ){

    const pathname = usePathname();

    const arrayOfIcons = [
        {
            name: "Main Page",
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 256 256"><path d="M216,36H40A20,20,0,0,0,20,56V200a20,20,0,0,0,20,20H216a20,20,0,0,0,20-20V56A20,20,0,0,0,216,36Zm-4,24V92H44V60ZM44,116H92v80H44Zm72,80V116h96v80Z"></path></svg>,
            link: `/dash`
        },
        {
            name: "Image Gallery",
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 256 256"><path d="M216,36H80A20,20,0,0,0,60,56V68H40A20,20,0,0,0,20,88V200a20,20,0,0,0,20,20H184a20,20,0,0,0,20-20V180h12a20,20,0,0,0,20-20V56A20,20,0,0,0,216,36ZM84,60H212v45.09l-3.23-3.23a20,20,0,0,0-28.28,0L165.31,117,130.14,81.86a20,20,0,0,0-28.28,0L84,99.72Zm96,136H44V92H60v68a20,20,0,0,0,20,20H180ZM84,156V133.66l32-32,40.83,40.83a12,12,0,0,0,17,0l20.83-20.83L212,139v17Z"></path></svg>,
            link: `/dash/image-gallery`
        },
        {
            name: "Calendar",
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 256 256"><path d="M208,28H188V24a12,12,0,0,0-24,0v4H92V24a12,12,0,0,0-24,0v4H48A20,20,0,0,0,28,48V208a20,20,0,0,0,20,20H208a20,20,0,0,0,20-20V48A20,20,0,0,0,208,28ZM68,52a12,12,0,0,0,24,0h72a12,12,0,0,0,24,0h16V76H52V52ZM52,204V100H204V204Z"></path></svg>,
            link: `/dash/calendar?year=${new Date().getFullYear()}&month=${new Date().getMonth() + 1}&day=${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`
        }
    ];

    //select the icon to display
    let indexOfIcon = arrayOfIcons.findIndex(icon => icon.name === props.text);

    return(
        <Tooltip.Provider>
            <Tooltip.Root>
                <Tooltip.Trigger asChild>
                    <Link href={arrayOfIcons[indexOfIcon].link} className={`flex items-center justify-center w-8 h-8 border border-neutral-500 rounded-md ${
                       pathname === arrayOfIcons[indexOfIcon].link.slice(0, arrayOfIcons[indexOfIcon].link.indexOf("?")) || pathname === arrayOfIcons[indexOfIcon].link ? "bg-neutral-800 fill-neutral-100" : "bg-white fill-neutral-700"
                    }`}>
                        {arrayOfIcons[indexOfIcon].icon}
                    </Link>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                    <Tooltip.Content
                    className="p-2 bg-neutral-700 text-sm text-white rounded-md shadow-lg"
                    side='right'
                    sideOffset={5}
                    >
                        {arrayOfIcons[indexOfIcon].name}
                        <Tooltip.Arrow className='fill-neutral-800'/>
                    </Tooltip.Content>
                </Tooltip.Portal>
            </Tooltip.Root>
        </Tooltip.Provider>
    )
};