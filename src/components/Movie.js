export default function Movie({ movie, onSelectMovie }) {
    return (
        <li>
            <img
                src={movie.Poster}
                alt={`Poster of the movie ${movie.Title}`}
            />
            <h3>{movie.Title}</h3>
            <div>
                <p>
                    <span>🗓</span>
                    <span>{movie.Year}</span>
                </p>
            </div>
        </li>
    );
}
