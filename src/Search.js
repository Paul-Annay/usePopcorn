export default function Search({ query, setQuery }) {
    return (
        <input
            type='text'
            placeholder='Search movies...'
            className='search'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
        />
    );
}
