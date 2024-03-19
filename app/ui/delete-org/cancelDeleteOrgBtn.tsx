'use client'

import { delOrgFromDeleteQueue } from "@/lib/actions"

export default function CancelDeleteOrgBtn(){

    return (
        <form action={delOrgFromDeleteQueue} className="flex flex-col gap-4">
            <button type="submit" className="self-end w-fit px-4 py-2 bg-blue-500 hover:bg-blue-700 text-zinc-100 font-bold rounded-md">
                Cancel organization deletion
            </button>
        </form>
    )
};