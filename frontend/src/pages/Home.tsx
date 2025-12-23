import { useEffect, useState } from "react";
import axios from "../api/axios";
import "./Home.css";

interface Movie {
  _id: string;
  title: string;
  description: string;
  rating: number;
  releaseDate: string;
  duration: number;
}

function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // 🔍 Search & sort input states
  const [searchText, setSearchText] = useState("");
  const [selectedSort, setSelectedSort] = useState("");


  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("");


  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9; // 3x3 grid

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

        const response = await axios.get("/movies", { params });
        setMovies(response.data);
      } catch {
        setError("Unable to load movies. Please check server.");
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [query, sort]);

  const applyFilters = () => {
    setQuery(searchText);
    setSort(selectedSort);
    setCurrentPage(1); 
  };

  /* ================= Pagination logic ================= */
  const totalPages = Math.ceil(movies.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedMovies = movies.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const getYear = (date: string) =>
    new Date(date).getFullYear().toString();

  const formatDuration = (min: number) =>
    min >= 60 ? `${Math.floor(min / 60)}h ${min % 60}m` : `${min}m`;

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
          <h2>Oops!</h2>
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
          <option value="rating-desc">Rating (High → Low)</option>
          <option value="releaseDate-desc">Release (Newest)</option>
          <option value="duration-asc">Duration (Short → Long)</option>
        </select>

        <button className="apply-btn" onClick={applyFilters}>
          Apply
        </button>
      </div>

      {paginatedMovies.length === 0 ? (
        <div className="empty-state">
          <p>No movies found.</p>
        </div>
      ) : (
        <>
          <div className="movies-grid">
            {paginatedMovies.map((movie) => (
              <div key={movie._id} className="movie-card">
                <div className="movie-header">
                  <h2 className="movie-title">{movie.title}</h2>
                  <span className="rating-badge">
                    {movie.rating.toFixed(1)}
                  </span>
                </div>

                <p className="movie-description">{movie.description}</p>

                <div className="movie-meta">
                  <span className="release-year">
                    {getYear(movie.releaseDate)}
                  </span>
                  <span className="duration">
                    {formatDuration(movie.duration)}
                  </span>
                </div>
              </div>
            ))}
          </div>

      
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
