'use client'

import * as Popover from '@radix-ui/react-popover';
import Link from 'next/link';

export default function DeleteOrgAlert({userWhoTriggeredOrgDeleteEmail}){
    return (
        <Popover.Root>
            <Popover.Trigger>
                <div className='flex w-8 h-8 items-center justify-center bg-red-500 fill-neutral-100 rounded-full'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm-8,56a8,8,0,0,1,16,0v56a8,8,0,0,1-16,0Zm8,104a12,12,0,1,1,12-12A12,12,0,0,1,128,184Z"></path></svg>
                </div>
            </Popover.Trigger>
            <Popover.Portal>
                <Popover.Content
                className="w-56 bg-white py-4 px-4 rounded-md shadow-lg ring-2 ring-neutral-200 will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade"
                sideOffset={5}
                align="end"
                >
                    <div className='flex flex-col gap-2'>
                        <div className='flex flex-col gap-1'>
                            <span className='text-xs font-semibold text-black cursor-default'>
                            Important info:
                            </span>
                            <div className='p-2 bg-red-100 rounded-md'>
                                <span className='text-xs font-semibold text-neutral-600 cursor-default'>
                                The org will be deleted tonight at midnight
                                </span>
                            </div>
                        </div>
                        <div className='flex flex-col gap-1'>
                            <span className='text-xs font-semibold text-black cursor-default'>
                            User who triggered delete:
                            </span>
                            <div className='p-2 bg-neutral-100 rounded-md'>
                                <span className='text-xs font-semibold text-neutral-600 cursor-default'>
                                {userWhoTriggeredOrgDeleteEmail}
                                </span>
                            </div>
                        </div>
                        <Link href='/dash/delete-organization' className='w-full h-8 flex items-center justify-center bg-blue-500 rounded-md text-xs text-neutral-100 font-semibold cursor-pointer hover:bg-blue-600'>
                        Prevent delete
                        </Link>
                    </div>
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    )
}