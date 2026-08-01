import { useState, useEffect } from "react";

const YOUTUBE_API_KEY = "adroit-resolver-504012-a6";
export default function WatchButton({ movieTitle }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button className="btn-add" onClick={() => setIsOpen(true)}>
        🎬 WATCH
      </button>

      {isOpen && (
        <TrailerModal
          movieTitle={movieTitle}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
}

function TrailerModal({ movieTitle, onClose }) {
  const [videoId, setVideoId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(
    function () {
      function callback(e) {
        if (e.code === "Escape") onClose?.();
      }
      document.addEventListener("keydown", callback);
      return () => document.removeEventListener("keydown", callback);
    },
    [onClose],
  );

  useEffect(
    function () {
      const controller = new AbortController();

      async function fetchTrailer() {
        try {
          setIsLoading(true);
          setError("");

          const query = encodeURIComponent(`${movieTitle} official trailer`);
          const res = await fetch(
            `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&maxResults=1&key=${YOUTUBE_API_KEY}`,
            { signal: controller.signal },
          );

          if (!res.ok) throw new Error("Failed to search for trailer");

          const data = await res.json();

          if (!data.items || data.items.length === 0)
            throw new Error("No trailer found for this movie");

          setVideoId(data.items[0].id.videoId);
        } catch (err) {
          if (err.name !== "AbortError") setError(err.message);
        } finally {
          setIsLoading(false);
        }
      }

      fetchTrailer();

      return () => controller.abort();
    },
    [movieTitle],
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-trailer" onClick={(e) => e.stopPropagation()}>
        <button className="btn-close-modal" onClick={onClose}>
          &times;
        </button>
        <h3>{movieTitle} — Trailer</h3>

        <div className="video-wrapper">
          {isLoading && <p className="loader">Loading trailer...</p>}
          {error && <p className="error">⚠️ {error}</p>}

          {!isLoading && !error && videoId && (
            <iframe
              width="100%"
              height="400"
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
              title={`${movieTitle} trailer`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}
        </div>
      </div>
    </div>
  );
}
