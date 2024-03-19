'use client'

import * as Avatar from '@radix-ui/react-avatar';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useRedirectFunctions, useUser } from "@propelauth/nextjs/client";
import { useLogoutFunction } from "@propelauth/nextjs/client"
import { useRouter } from 'next/navigation'

export default function MainMenuDropDown(){
    const user = useUser();

    //get the org_id 
    let org = user?.user?.orgIdToOrgMemberInfo;
    let orgID = null;
    let userRole = null;

    if(org){
        orgID = Object.keys(org)[0];
        userRole = user.user.orgIdToOrgMemberInfo[orgID].userAssignedRole;
    }

    const logoutFn = useLogoutFunction();
    const {redirectToAccountPage, redirectToOrgPage} = useRedirectFunctions();
    const router = useRouter()

    //use Radix UI to create a dropdown menu
    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger className="outline-8 rounded-full">
                <Avatar.Root>
                    <Avatar.Fallback className="flex w-8 h-8 items-center justify-center bg-black text-white fill-white rounded-full cursor-default">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 256 256"><path d="M128,76a52,52,0,1,0,52,52A52.06,52.06,0,0,0,128,76Zm0,80a28,28,0,1,1,28-28A28,28,0,0,1,128,156Zm92-27.21v-1.58l14-17.51a12,12,0,0,0,2.23-10.59A111.75,111.75,0,0,0,225,71.89,12,12,0,0,0,215.89,66L193.61,63.5l-1.11-1.11L190,40.1A12,12,0,0,0,184.11,31a111.67,111.67,0,0,0-27.23-11.27A12,12,0,0,0,146.3,22L128.79,36h-1.58L109.7,22a12,12,0,0,0-10.59-2.23A111.75,111.75,0,0,0,71.89,31.05,12,12,0,0,0,66,40.11L63.5,62.39,62.39,63.5,40.1,66A12,12,0,0,0,31,71.89,111.67,111.67,0,0,0,19.77,99.12,12,12,0,0,0,22,109.7l14,17.51v1.58L22,146.3a12,12,0,0,0-2.23,10.59,111.75,111.75,0,0,0,11.29,27.22A12,12,0,0,0,40.11,190l22.28,2.48,1.11,1.11L66,215.9A12,12,0,0,0,71.89,225a111.67,111.67,0,0,0,27.23,11.27A12,12,0,0,0,109.7,234l17.51-14h1.58l17.51,14a12,12,0,0,0,10.59,2.23A111.75,111.75,0,0,0,184.11,225a12,12,0,0,0,5.91-9.06l2.48-22.28,1.11-1.11L215.9,190a12,12,0,0,0,9.06-5.91,111.67,111.67,0,0,0,11.27-27.23A12,12,0,0,0,234,146.3Zm-24.12-4.89a70.1,70.1,0,0,1,0,8.2,12,12,0,0,0,2.61,8.22l12.84,16.05A86.47,86.47,0,0,1,207,166.86l-20.43,2.27a12,12,0,0,0-7.65,4,69,69,0,0,1-5.8,5.8,12,12,0,0,0-4,7.65L166.86,207a86.47,86.47,0,0,1-10.49,4.35l-16.05-12.85a12,12,0,0,0-7.5-2.62c-.24,0-.48,0-.72,0a70.1,70.1,0,0,1-8.2,0,12.06,12.06,0,0,0-8.22,2.6L99.63,211.33A86.47,86.47,0,0,1,89.14,207l-2.27-20.43a12,12,0,0,0-4-7.65,69,69,0,0,1-5.8-5.8,12,12,0,0,0-7.65-4L49,166.86a86.47,86.47,0,0,1-4.35-10.49l12.84-16.05a12,12,0,0,0,2.61-8.22,70.1,70.1,0,0,1,0-8.2,12,12,0,0,0-2.61-8.22L44.67,99.63A86.47,86.47,0,0,1,49,89.14l20.43-2.27a12,12,0,0,0,7.65-4,69,69,0,0,1,5.8-5.8,12,12,0,0,0,4-7.65L89.14,49a86.47,86.47,0,0,1,10.49-4.35l16.05,12.85a12.06,12.06,0,0,0,8.22,2.6,70.1,70.1,0,0,1,8.2,0,12,12,0,0,0,8.22-2.6l16.05-12.85A86.47,86.47,0,0,1,166.86,49l2.27,20.43a12,12,0,0,0,4,7.65,69,69,0,0,1,5.8,5.8,12,12,0,0,0,7.65,4L207,89.14a86.47,86.47,0,0,1,4.35,10.49l-12.84,16.05A12,12,0,0,0,195.88,123.9Z"></path></svg>
                    </Avatar.Fallback>
                </Avatar.Root>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
                <DropdownMenu.Content
                className="w-56 bg-white py-4 px-4 rounded-md shadow-lg ring-2 ring-neutral-200 will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade"
                sideOffset={5}
                align="end"
                >
                    <DropdownMenu.Label className='flex justify-end text-xs font-semibold text-neutral-700 mb-2'>
                        Settings
                    </DropdownMenu.Label>
                    <DropdownMenu.Item onSelect={() => redirectToAccountPage()} className="group relative flex flex-row gap-2 items-center justify-between h-6 py-4 my-2 text-xs font-semibold text-black select-none outline-none rounded-lg cursor-pointer data-[disabled]:text-white data-[disabled]:pointer-events-none">
                        Account Settings
                        <div className='flex items-center justify-center w-6 h-6 fill-neutral-700 border border-neutral-500 rounded-md group-data-[highlighted]:bg-neutral-800 group-data-[highlighted]:fill-white group-data-[highlighted]:border-black'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 256 256"><path d="M230.93,220a8,8,0,0,1-6.93,4H32a8,8,0,0,1-6.92-12c15.23-26.33,38.7-45.21,66.09-54.16a72,72,0,1,1,73.66,0c27.39,8.95,50.86,27.83,66.09,54.16A8,8,0,0,1,230.93,220Z"></path></svg>
                        </div>
                    </DropdownMenu.Item>
                    <DropdownMenu.Item onSelect={() => redirectToOrgPage()} className="group relative flex flex-row gap-2 items-center justify-between h-6 py-4 my-2 text-xs font-semibold text-black select-none outline-none rounded-lg cursor-pointer data-[disabled]:text-white data-[disabled]:pointer-events-none">
                        Organization Settings
                        <div className='flex items-center justify-center w-6 h-6 fill-neutral-700 border border-neutral-500 rounded-md group-data-[highlighted]:bg-neutral-800 group-data-[highlighted]:fill-white group-data-[highlighted]:border-black'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 256 256"><path d="M224,115.55V208a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V115.55a16,16,0,0,1,5.17-11.78l80-75.48.11-.11a16,16,0,0,1,21.53,0,1.14,1.14,0,0,0,.11.11l80,75.48A16,16,0,0,1,224,115.55Z"></path></svg>
                        </div>
                    </DropdownMenu.Item>
                    {
                        userRole === "Owner" && (
                            <DropdownMenu.Sub>
                                <DropdownMenu.SubTrigger className="group relative flex flex-row gap-2 items-center justify-between h-6 py-4 my-2 text-xs font-semibold text-black select-none outline-none rounded-lg cursor-pointer data-[disabled]:text-white data-[disabled]:pointer-events-none">
                                    <div className='flex items-center justify-center w-6 h-6 fill-neutral-700 border border-neutral-500 rounded-md group-data-[highlighted]:bg-neutral-800 group-data-[highlighted]:fill-white group-data-[highlighted]:border-black'>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 256 256"><path d="M168.49,199.51a12,12,0,0,1-17,17l-80-80a12,12,0,0,1,0-17l80-80a12,12,0,0,1,17,17L97,128Z"></path></svg>
                                    </div>
                                    More Settings
                                </DropdownMenu.SubTrigger>
                                <DropdownMenu.Portal>
                                    <DropdownMenu.SubContent
                                    className="w-56 bg-white py-2 px-4 rounded-md shadow-lg ring-2 ring-neutral-200 will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade"
                                    sideOffset={18}
                                    alignOffset={-16}
                                    >
                                        <DropdownMenu.Item onSelect={() => router.push("/dash/delete-organization")} className="group relative flex flex-row gap-2 items-center justify-between h-6 py-4 my-2 text-xs font-semibold text-black select-none outline-none rounded-lg cursor-pointer data-[disabled]:text-white data-[disabled]:pointer-events-none">
                                            Delete Organization
                                            <div className='flex items-center justify-center w-6 h-6 fill-neutral-700 border border-neutral-500 rounded-md group-data-[highlighted]:bg-red-800 group-data-[highlighted]:fill-white group-data-[highlighted]:border-black'>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 256 256"><path d="M216,48H180V36A28,28,0,0,0,152,8H104A28,28,0,0,0,76,36V48H40a12,12,0,0,0,0,24h4V208a20,20,0,0,0,20,20H192a20,20,0,0,0,20-20V72h4a12,12,0,0,0,0-24ZM100,36a4,4,0,0,1,4-4h48a4,4,0,0,1,4,4V48H100Zm88,168H68V72H188ZM116,104v64a12,12,0,0,1-24,0V104a12,12,0,0,1,24,0Zm48,0v64a12,12,0,0,1-24,0V104a12,12,0,0,1,24,0Z"></path></svg>
                                            </div>
                                        </DropdownMenu.Item>
                                    </DropdownMenu.SubContent>
                                </DropdownMenu.Portal>
                            </DropdownMenu.Sub>
                        )
                    }
                    <DropdownMenu.Separator className='h-[1px] my-4 bg-neutral-700 opacity-10' />
                    <DropdownMenu.Item onSelect={() => logoutFn()} className="group relative flex flex-row gap-2 items-center justify-center h-6 bg-white text-xs font-semibold text-black border border-neutral-800 select-none outline-none rounded-md cursor-pointer data-[disabled]:text-white data-[disabled]:pointer-events-none data-[highlighted]:bg-neutral-800 data-[highlighted]:text-white">
                        Log Out
                    </DropdownMenu.Item>
                </DropdownMenu.Content>
            </DropdownMenu.Portal>
        </DropdownMenu.Root>
    )
}