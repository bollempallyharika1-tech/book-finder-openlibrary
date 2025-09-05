import React, { useState } from "react";

const API_BASE = "https://openlibrary.org/search.json";

function buildCoverUrl(coverId: number | undefined) {
  return coverId
    ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
    : "https://via.placeholder.com/128x192?text=No+Cover";
}

export default function App() {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSearched(true);

    const q = query.trim();
    if (!q) {
      setBooks([]);
      return;
    }

    setLoading(true);
    try {
      const url = `${API_BASE}?title=${encodeURIComponent(q)}&limit=24`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Network error. Please try again.");
      const data = await res.json();

      const docs = Array.isArray(data.docs) ? data.docs : [];
      setBooks(docs);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
      setBooks([]);
    } finally {
      setLoading(false);
    }
  }

  const suggestions = [
    "Harry Potter",
    "Atomic Habits",
    "The Alchemist",
    "The Hobbit",
    "Data Structures",
  ];

  return (
    <div className="app">
      <header className="header">
        <h1>Book Finder</h1>
        <p className="subtitle">
          Search books by title using the Open Library API.
        </p>
        <form className="search" onSubmit={handleSearch}>
          <input
            className="input"
            type="text"
            placeholder="Search by title (e.g., Harry Potter)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="btn" type="submit" disabled={loading}>
            {loading ? "Searching..." : "Search"}
          </button>
        </form>

        <div className="chips">
          {suggestions.map((s) => (
            <button
              key={s}
              className="chip"
              onClick={() => {
                setQuery(s);
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </header>

      <main className="content">
        {error && <div className="alert">{error}</div>}

        {!loading && searched && books.length === 0 && !error && (
          <div className="empty">No books found. Try a different title.</div>
        )}

        {loading && <div className="loader">Loading...</div>}

        {!loading && books.length > 0 && (
          <div className="grid">
            {books.map((b, idx) => {
              const cover = buildCoverUrl(b.cover_i);
              const authors = (b.author_name || []).join(", ");
              const year = b.first_publish_year || "—";
              const workLink = b.key ? `https://openlibrary.org${b.key}` : "#";

              return (
                <article key={`${b.key}-${idx}`} className="card">
                  <img className="cover" src={cover} alt={b.title} />
                  <div className="card-body">
                    <h3 className="title" title={b.title}>
                      {b.title || "Untitled"}
                    </h3>
                    <p className="meta">
                      <span className="label">Author:</span>{" "}
                      {authors || "Unknown"}
                    </p>
                    <p className="meta">
                      <span className="label">First published:</span> {year}
                    </p>
                    <a
                      className="link"
                      href={workLink}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View on Open Library →
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>

      <footer className="footer">
        <p>
          Built with ❤️ using React + Open Library API.{" "}
          <a
            href="https://openlibrary.org/developers/api"
            target="_blank"
            rel="noreferrer"
          >
            API Docs
          </a>
        </p>
      </footer>
    </div>
  );
}
