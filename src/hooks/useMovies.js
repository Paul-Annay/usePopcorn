import { useEffect, useState } from "react";
import { tempMovieData } from "../data";

export function useMovies(query, callback) {
    const [movies, setMovies] = useState(tempMovieData);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(
        function () {
            const controller = new AbortController();
            async function fetchMovies() {
                try {
                    setIsLoading(true);
                    setError("");
                    const res = await fetch(
                        `http://www.omdbapi.com/?i=tt3896198&apikey=${process.env.REACT_APP_KEY}&s=${query}`
                    );

                    if (!res.ok) {
                        throw new Error(
                            "Something went wrong with fetching movies"
                        );
                    }
                    const data = await res.json();

                    if (data.Response === "False") {
                        throw new Error("Movie not found");
                    }

                    setMovies(data.Search);
                    setError("");
                } catch (error) {
                    if (error.name !== "AbortError") {
                        setError(error.message);
                    }
                } finally {
                    setIsLoading(false);
                }
            }

            if (query.length < 3) {
                setMovies([]);
                setError("");
                return;
            }

            callback?.();
            fetchMovies();
            return function () {
                controller.abort();
            };
        },
        /* eslint-disable */
        [query]
    );

    return { movies, isLoading, error };
}
