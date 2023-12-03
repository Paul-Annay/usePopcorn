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
import { useMovies } from "./hooks/useMovies";

export default function App() {
    const [watched, setWatched] = useState([], function () {
        return JSON.parse(localStorage.getItem("watched"));
    });
    const [query, setQuery] = useState("");
    const { movies, isLoading, error } = useMovies(query, handleCloseMovie);
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
            localStorage.setItem("watched", JSON.stringify(watched));
        },
        [watched]
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
