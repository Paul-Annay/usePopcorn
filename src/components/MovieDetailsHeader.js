export default function Header({ movie, onCloseMovie }) {
    const {
        Title: title,
        Poster: poster,
        Released: released,
        Runtime: runtime,
        Genre: genre,
        imdbRating,
    } = movie;

    return (
        <header>
            <button className='btn-back' onClick={onCloseMovie}>
                &larr;
            </button>
            <img src={poster} alt={`Poster of ${title}`} />
            <div className='details-overview'>
                <h2>{title}</h2>
                <p>
                    {released} &bull; {runtime}
                </p>
                <p>{genre}</p>
                <p>
                    <span>⭐</span>
                    {imdbRating} IMDb rating
                </p>
            </div>
        </header>
    );
}
