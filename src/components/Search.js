import { useRef } from "react";
import { useKey } from "../hooks/useKey";

export default function Search({ query, setQuery }) {
    const inputEl = useRef(null);

    useKey("Enter", function () {
        if (document.activeElement === inputEl.current) {
            return;
        }
        inputEl.current.focus();
        setQuery("");
    });

    return (
        <input
            type='text'
            placeholder='Search movies...'
            className='search'
            value={query}
            ref={inputEl}
            onChange={(e) => setQuery(e.target.value)}
        />
    );
}
