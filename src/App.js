import { useEffect, useState } from "react";
import Box from "./components/Box";
import ErrorMessage from "./components/ErrorMessage";
import Loader from "./components/Loader";
import Main from "./components/Main";
import MovieDetails from "./components/MovieDetails";
import MovieList from "./components/MovieList";
import Navbar from "./components/Navbar";
import NumResults from "./components/NumResults";
import Search from "./components/Search";
import WatchedMoviesList from "./components/WatchedMoviesList";
import WatchedSummary from "./components/WatchedSummary";
import { tempMovieData, tempWatchedData } from "./data";

export default function App() {
    const [movies, setMovies] = useState(tempMovieData);
    const [watched, setWatched] = useState(tempWatchedData);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [query, setQuery] = useState("");
    const [selectedId, setSelectedId] = useState("");

    function handleSelectMovie(id) {
        setSelectedId((prevId) => (id === prevId ? null : id));
    }

    function handleCloseMovie() {
        setSelectedId(null);
    }

    function handleAddWatched(movie) {
        setWatched((watched) => [...watched, movie]);
    }

    function handleDeleteWatched(id) {
        setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
    }

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

            fetchMovies();
            return function () {
                controller.abort();
            };
        },
        [query]
    );

    return (
        <>
            <Navbar>
                <Search query={query} setQuery={setQuery} />
                <NumResults movies={movies} />
            </Navbar>

            <Main>
                <Box>
                    {isLoading && <Loader />}
                    {!isLoading && !error && (
                        <MovieList
                            movies={movies}
                            onSelectMovie={handleSelectMovie}
                        />
                    )}
                    {error && <ErrorMessage message={error} />}
                </Box>

                <Box>
                    {selectedId ? (
                        <MovieDetails
                            onCloseMovie={handleCloseMovie}
                            onAddWatched={handleAddWatched}
                            selectedId={selectedId}
                            watched={watched}
                        />
                    ) : (
                        <>
                            <WatchedSummary watched={watched} />
                            <WatchedMoviesList
                                onDeleteWatched={handleDeleteWatched}
                                watched={watched}
                            />
                        </>
                    )}
                </Box>
            </Main>
        </>
    );
}
