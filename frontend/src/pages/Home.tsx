import { useEffect, useState } from "react";
import axios from "../api/axios";
import "./Home.css";

interface Movie {
  _id: string;
  title: string;
  year: number;
  image: string;
  rating: number;
}

function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* Search & Sort */
  const [searchText, setSearchText] = useState("");
  const [selectedSort, setSelectedSort] = useState("");

  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("");

  /* Pagination */
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        setError("");

        const params: any = {};
        if (query) params.q = query;

        if (sort) {
          const [sortBy, order] = sort.split("-");
          params.sortBy = sortBy;
          params.order = order;
        }

        const res = await axios.get("/movies", { params });
        setMovies(res.data);
      } catch {
        setError("Failed to load movies.");
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [query, sort]);

  const applyFilters = () => {
    setQuery(searchText.trim());
    setSort(selectedSort);
    setCurrentPage(1);
  };

  /* Pagination */
  const totalPages = Math.ceil(movies.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedMovies = movies.slice(startIndex, startIndex + itemsPerPage);

  if (loading) {
    return (
      <div className="home-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading movies...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home-container">
        <div className="error-message">
          <h2>Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="home-container">
      <header className="page-header">
        <h1>Movies</h1>
      </header>

      {/* Search + Sort */}
      <div className="search-sort-bar">
        <input
          className="search-input"
          placeholder="Search movies..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />

        <select
          className="sort-select"
          value={selectedSort}
          onChange={(e) => setSelectedSort(e.target.value)}
        >
          <option value="">Sort By</option>
          <option value="title-asc">Name (A–Z)</option>
          <option value="title-desc">Name (Z–A)</option>
          <option value="imDbRating-desc">Rating (High → Low)</option>
          <option value="year-desc">Year (Newest)</option>
        </select>

        <button className="apply-btn" onClick={applyFilters}>
          Apply
        </button>
      </div>

      {/* Movie Grid */}
      {paginatedMovies.length === 0 ? (
        <div className="empty-state">
          <p>No movies found.</p>
        </div>
      ) : (
        <>
          <div className="movies-grid">
            {paginatedMovies.map((movie) => (
              <div key={movie._id} className="movie-card">
                
                {/* Poster */}
               {/* Poster */}
<div className="movie-poster">
  <img src={movie.image} alt={movie.title} />
 <span className="poster-rating">⭐ {movie.rating}</span> 
</div>

{/* Title */}
<h2 className="movie-title">{movie.title}</h2>


                {/* Year */}
                <div className="movie-meta">
                 <span className="release-year">
  {movie.year}
</span>

                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  className={currentPage === i + 1 ? "active" : ""}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Home;
