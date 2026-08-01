import { useState } from "react";
import { useMovies } from "./components/UseHoke/UseMovies";
import { useLocalStorageState } from "./components/UseHoke/UseLocalStorageState";
import Logo from "./components/Navber/Logo";
import SearchMovies from "./components/Navber/SearchMovies";
import NumResults from "./components/Navber/NumResults";
import { ErrorMessage } from "./components/ErrorMessage/ErrorMessage";
import { Loader } from "./components/ErrorMessage/Loader";
import { MovieDetails } from "./components/Movie/MovieDetails";
import { MovieList } from "./components/Movie/MovieList";
import { Box } from "./components/Movie/Box";
import { Main } from "./components/Movie/Main";
import { WatchSummary } from "./components/Movie/Watch/WatchSummary";
import { WatchedList } from "./components/Movie/Watch/WatchedList";
import { average } from "./components/Movie/Watch/average";
export const KEY = "f9d82c0f";
export default function App() {
  const [query, setQuery] = useState("");

  const [selectedId, setSelectedId] = useState(null);

  const { movies, isLoading, error } = useMovies(query);
  const [watched, setWatched] = useLocalStorageState([], "watched");

  function handleSelectMovie(id) {
    setSelectedId((selectedId) => (id = selectedId ? null : id));
  }
  function handleCloseMovie() {
    setSelectedId(null);
  }

  function handleAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);
  }

  function handleDeleteWatch(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  return (
    <>
      <Logo>
        {" "}
        <SearchMovies query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </Logo>
      <Main>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList movies={movies} onSelectMovie={handleSelectMovie} />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>

        <Box>
          <>
            {selectedId ? (
              <MovieDetails
                selectedId={selectedId}
                onCloseMovie={handleCloseMovie}
                onAddWatched={handleAddWatched}
                watched={watched}
              />
            ) : (
              <>
                <WatchSummary watched={watched} average={average} />
                <WatchedList
                  watched={watched}
                  onDeleteWatched={handleDeleteWatch}
                />
              </>
            )}
          </>
        </Box>
      </Main>
    </>
  );
}
