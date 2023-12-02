import { useEffect } from "react";
import { useRef } from "react";

export default function Search({ query, setQuery }) {
    const inputEl = useRef(null);

    useEffect(function () {
        function callback(e) {
            if (document.activeElement === inputEl.current) {
                return;
            }

            if (e.code === "Enter") {
                inputEl.current.focus();
                setQuery("");
            }
        }
        document.addEventListener("keydown", callback);

        return function () {
            document.removeEventListener("keydown", callback);
        };
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
