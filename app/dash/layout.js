import { getUserOrRedirect } from "@propelauth/nextjs/server/app-router";
import Link from "next/link";
import MainMenuDropDown from "../ui/menus/mainMenuDropDown";
import LeftSideBar from "../ui/menus/leftSideBar";
import DeleteOrgAlert from "../ui/delete-org/deleteOrgAlert";
import { getIsOrgInDeleteQueue } from "@/lib/data";

export default async function DashLayout( { children }) {
    const user = await getUserOrRedirect();
    const isOrgInDeleteQueue = await getIsOrgInDeleteQueue();

    return (
        <div className="w-full h-full bg-neutral-100 overflow-hidden">
            <div className="w-full h-full flex flex-col">
                <div className="w-full h-fit flex flex-row justify-between items-center ring-1 ring-neutral-800">
                    <div className="w-fit flex items-center justify-center py-[18px] px-4 ring-1 ring-neutral-800">
                        <Link href="/dash" className="font-black text-xl text-neutral-900">
                        pixelmothman/nextjs-b2b-app-starter
                        </Link>
                    </div>
                    <div className="w-fit h-fit flex flex-row gap-2 pr-4">
                        {
                            isOrgInDeleteQueue.isOrgInDeleteQueue === true ? (<DeleteOrgAlert userWhoTriggeredOrgDeleteEmail={isOrgInDeleteQueue.userWhoTriggeredOrgDeleteEmail}/>) : null
                        }
                        <MainMenuDropDown/>
                    </div>
                </div>
                <div className="w-full h-full flex flex-row">
                    <LeftSideBar/>
                    <div className="w-full h-full p-4">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
};