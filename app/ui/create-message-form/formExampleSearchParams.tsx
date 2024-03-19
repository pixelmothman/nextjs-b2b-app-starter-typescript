'use client'

import { createExampleMessage } from "@/lib/actions"
import FormButtonAbstraction from "../miscelaneous/formButtonAbstraction"

export default function formExampleSearchParams(){

    return (
        <div className="w-full h-full flex flex-col p-5 rounded-sm bg-white border border-neutral-800 shadow-sm overflow-y-auto">
            <h2 className="text-2xl font-bold text-neutral-800">
            Get a message from the machine
            </h2>
            <p className="text-neutral-800 mb-4">
            After completing the form, you will be redirected to a page with a message created using data from the url.
            </p>
            <form action={createExampleMessage} className="w-full h-full flex flex-col gap-4 justify-between">
                <div className="flex flex-col gap-4">
                    <div className="w-full flex flex-row gap-4">
                        <div className="w-full flex flex-col gap-2">
                            <label htmlFor="username-example" className="font-bold text-sm text-neutral-800">
                            Username
                            </label>
                            <input autoComplete="off" type="text" id="username-example" name="username-example" className="w-full h-8 px-2 border border-neutral-800 rounded-md shadow-sm text-sm font-normal text-neutral-800 focus-visible:border-0 focus-visible:ring-2 focus-visible:ring-black"/>
                        </div>
                        <div className="w-full flex flex-col gap-2">
                            <label htmlFor="age-example" className="font-bold text-sm text-neutral-800">
                            Age
                            </label>
                            <input autoComplete="off" type="text" id="age-example" name="age-example" className="w-full h-8 px-2 border border-neutral-800 rounded-md shadow-sm text-sm font-normal text-neutral-800 focus-visible:border-0 focus-visible:ring-2 focus-visible:ring-black"/>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="movie-genre-example" className="font-bold text-sm text-neutral-800">
                        Favorite movie genre
                        </label>
                        <select id="movie-genre-example" name="movie-genre-example" className="w-full h-10 px-2 border border-neutral-800 rounded-md shadow-sm text-sm font-normal text-neutral-800 focus-visible:border-0 focus-visible:ring-2 focus-visible:ring-black">
                            <option value="horror">
                                Horror
                            </option>
                            <option value="sci-fi">
                                Science Fiction
                            </option>
                            <option value="romantic comedies">
                                Romantic Comedies
                            </option>
                            <option value="action">
                                Action
                            </option>
                        </select> 
                    </div>
                </div>
                <FormButtonAbstraction loadingText="Creating message..." buttonText="Create message" />
            </form>
        </div>
    )
};