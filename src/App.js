import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Search from "./components/Search";
import NumResults from "./components/NumResults";
import Loader from "./components/Loader";
import ErrorMessage from "./components/ErrorMessage";
import { tempMovieData, tempWatchedData } from "./data";
import Box from "./components/Box";
import Main from "./components/Main";
import MovieList from "./components/MovieList";
import MovieDetails from "./components/MovieDetails";

const average = (arr) =>
    arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export default function App() {
    const [movies, setMovies] = useState(tempMovieData);
    const [watched, setWatched] = useState(tempWatchedData);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [query, setQuery] = useState("");
    const [selectedId, setSelectedId] = useState("");

    useEffect(
        function () {
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
                } catch (error) {
                    console.error(error);
                    setError(error.message);
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
        },
        [query]
    );

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

function WatchedSummary({ watched }) {
    const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
    const avgUserRating = average(watched.map((movie) => movie.userRating));
    const avgRuntime = average(watched.map((movie) => movie.runtime));

    return (
        <div className='summary'>
            <h2>Movies you watched</h2>
            <div>
                <p>
                    <span>#️⃣</span>
                    <span>{watched.length} movies</span>
                </p>
                <p>
                    <span>⭐️</span>
                    <span>{avgImdbRating.toFixed(2)}</span>
                </p>
                <p>
                    <span>🌟</span>
                    <span>{avgUserRating.toFixed(2)}</span>
                </p>
                <p>
                    <span>⏳</span>
                    <span>{avgRuntime} min</span>
                </p>
            </div>
        </div>
    );
}

function WatchedMoviesList({ watched, onDeleteWatched }) {
    return (
        <ul className='list'>
            {watched.map((movie) => (
                <WatchedMovie
                    movie={movie}
                    key={movie.imdbID}
                    onDeleteWatched={onDeleteWatched}
                />
            ))}
        </ul>
    );
}

function WatchedMovie({ movie, onDeleteWatched }) {
    return (
        <li>
            <img src={movie.poster} alt={`${movie.title} poster`} />
            <h3>{movie.title}</h3>
            <div>
                <p>
                    <span>⭐️</span>
                    <span>{movie.imdbRating}</span>
                </p>
                <p>
                    <span>🌟</span>
                    <span>{movie.userRating}</span>
                </p>
                <p>
                    <span>⏳</span>
                    <span>{movie.runtime} min</span>
                </p>
                <button
                    className='btn-delete'
                    onClick={() => onDeleteWatched(movie.imdbID)}>
                    X
                </button>
            </div>
        </li>
    );
}
