'use client'

import { uploadFavMovie } from "@/lib/actions"
import FormButtonAbstraction from "../miscelaneous/formButtonAbstraction"

export default function FavMovieFormExample(){

    return (
        <div className="w-full h-full flex flex-col p-5 rounded-sm bg-white border border-neutral-800 shadow-sm overflow-y-auto">
            <h2 className="text-2xl font-bold text-neutral-800">
            Upload your favorite movie
            </h2>
            <p className="text-neutral-800 mb-4">
            After completing the form, your favorite movie should appear in the list.
            </p>
            <form action={uploadFavMovie} className="h-full flex flex-col gap-4 justify-between">
                <div className="flex flex-col gap-2">
                    <label htmlFor="movie-example" className="font-bold text-sm text-neutral-800">
                    Favorite movie
                    </label>
                    <input required autoComplete="off" type="text" id="movie-example" name="movie-example" className="w-full h-8 px-2 border border-neutral-800 rounded-md shadow-sm text-sm font-normal text-neutral-800 focus-visible:border-0 focus-visible:ring-2 focus-visible:ring-black"/>
                    <label htmlFor="movie-view-category-example" className="font-bold text-sm text-neutral-800">
                    View category
                    </label>
                    <select required id="movie-view-category-example" name="movie-view-category-example" className="w-full h-10 px-2 border border-neutral-800 rounded-md shadow-sm text-sm font-normal text-neutral-800 focus-visible:border-0 focus-visible:ring-2 focus-visible:ring-black">
                        <option value="personal">
                            Personal
                        </option>
                        <option value="org">
                            Organization
                        </option>
                    </select> 
                </div>
                <FormButtonAbstraction loadingText="Uploading..." buttonText="Upload" />
            </form>
        </div>
    )
};