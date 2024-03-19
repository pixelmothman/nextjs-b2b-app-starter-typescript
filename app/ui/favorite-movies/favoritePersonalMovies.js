import { fetchFavoritePersonalMovies } from "@/lib/data";
import FormButtonAbstraction from "../miscelaneous/formButtonAbstraction";
import { deleteFavoriteMovie } from "@/lib/actions";

export default async function FavoritePersonalMovies(){
    const favPersonalMovies = await fetchFavoritePersonalMovies();

    return(
        <div className="w-full h-full flex flex-col p-5 rounded-sm bg-white border border-neutral-800 shadow-sm overflow-y-auto">
            <h2 className="text-2xl font-bold text-neutral-800">
            Favorite personal movies
            </h2>
            <p className="text-neutral-800 mb-4">
            Fetches the favorite movies that were uploaded using the form.
            </p>
            <div className="flex flex-row gap-4 flex-wrap">
            {
                favPersonalMovies !== null && favPersonalMovies.length !== 0 ? (
                    favPersonalMovies.map((movie, index) => {
                        return (
                            <div key={movie.movieName + index} className="group w-fit h-fit px-4 py-2 flex flex-row items-center justify-between gap-2 bg-neutral-100 rounded-md shadow-sm border border-neutral-800 cursor-default hover:outline hover:outline-neutral-300">
                                <span className="text-sm font-semibold text-neutral-800">
                                    {movie.movieName}
                                </span>
                                <form action={deleteFavoriteMovie} className="flex items-center">
                                    <input type="hidden" value={movie.movieId} name="movie-id" />
                                    <FormButtonAbstraction loadingText="..." buttonIcon="delete" background={false} />
                                </form>
                            </div>
                        )
                    })
                ) : (
                    <div className="w-full h-fit">
                        <span className="text-base font-semibold text-neutral-800">
                            No movies yet.
                        </span>
                    </div>
                )
            }
            </div>
        </div>
    )
};