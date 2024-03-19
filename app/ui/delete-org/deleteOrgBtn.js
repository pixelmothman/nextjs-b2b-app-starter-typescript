'use client'

import { addOrgToDeleteQueue } from "@/lib/actions"

export default function DeleteOrgExample(){

    return (
        <form action={addOrgToDeleteQueue} className="flex flex-col gap-4">
            <button type="submit" className="self-end w-fit px-4 py-2 bg-red-500 hover:bg-red-700 text-zinc-100 font-bold rounded-md">Delete Organization</button>
        </form>
    )
};