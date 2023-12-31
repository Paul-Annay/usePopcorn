import { useEffect, useState } from "react";
import Loader from "./Loader";
import Header from "./MovieDetailsHeader";
import Section from "./MovieDetailsSection";
import { useKey } from "../hooks/useKey";

export default function MovieDetails({
    selectedId,
    watched,
    onCloseMovie,
    onAddWatched,
}) {
    const [movie, setMovie] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    useKey("Escape", onCloseMovie);

    useEffect(
        function () {
            async function getMovieDetails() {
                setIsLoading(true);
                const res = await fetch(
                    `http://www.omdbapi.com/?&apikey=${process.env.REACT_APP_KEY}&i=${selectedId}`
                );
                const data = await res.json();
                setMovie(data);
                setIsLoading(false);
            }

            getMovieDetails();
        },
        [selectedId]
    );

    useEffect(
        function () {
            document.title = `MOVIE: ${movie?.Title}`;

            return function () {
                document.title = "usePopcorn";
            };
        },
        [movie]
    );

    return (
        <div className='details'>
            {isLoading ? (
                <Loader />
            ) : (
                <>
                    <Header movie={movie} onCloseMovie={onCloseMovie} />
                    <Section
                        movie={movie}
                        watched={watched}
                        selectedId={selectedId}
                        onCloseMovie={onCloseMovie}
                        onAddWatched={onAddWatched}
                    />
                </>
            )}
        </div>
    );
}
