import { useState } from "react";
import StarRating from "./StarRating";

export default function Section({
    movie,
    watched,
    selectedId,
    onCloseMovie,
    onAddWatched,
}) {
    const [userRating, setUserRating] = useState("");
    const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);

    const watchedUserRating = watched.find(
        (movie) => movie.imdbID === selectedId
    )?.userRating;

    const {
        Title: title,
        Year: year,
        Poster: poster,
        imdbRating,
        Runtime: runtime,
        Plot: plot,
        Actors: actors,
        Director: director,
    } = movie;

    function handleAdd() {
        const newWatchedMovie = {
            imdbID: selectedId,
            title,
            year,
            poster,
            imdbRating: Number(imdbRating),
            runtime: Number(runtime.split(" ").at(0)),
            userRating,
        };
        onAddWatched(newWatchedMovie);
        onCloseMovie();
    }

    return (
        <section>
            <div className='rating'>
                {!isWatched ? (
                    <>
                        <StarRating
                            maxRating={10}
                            size={24}
                            onSetRating={setUserRating}
                        />
                        {userRating > 0 && (
                            <button className='btn-add' onClick={handleAdd}>
                                + Add to list
                            </button>
                        )}
                    </>
                ) : (
                    <p>
                        You've already rated this movie with {watchedUserRating}
                    </p>
                )}
            </div>
            <p>
                <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
        </section>
    );
}
