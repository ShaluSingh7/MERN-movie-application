import { useEffect, useState } from "react";
import API from "../api/axios";
import "./AdminAddMovie.css";

interface Movie {
  _id: string;
  imdbId: number;
  rank: number;
  title: string;
  year: number;
  image: string;
  rating: number;
}

function AdminAddMovie() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  /* ===== FORM STATES ===== */
  const [imdbId, setImdbId] = useState<number>(0);
  const [rank, setRank] = useState<number>(0);
  const [title, setTitle] = useState("");
  const [year, setYear] = useState<number>(2024);
  const [image, setImage] = useState("");
  const [rating, setRating] = useState<number>(8);

  /* ===== PAGINATION ===== */
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  /* ================= FETCH MOVIES ================= */
  const fetchMovies = async () => {
    const res = await API.get("/movies");
    setMovies(res.data);
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  /* ================= ADD / UPDATE ================= */
  const submitMovie = async () => {
    if (!title || !image || !year) {
      alert("Please fill all required fields");
      return;
    }

    const payload = {
      imdbId,
      rank,
      title,
      year,
      image,
      rating
    };

    try {
      setLoading(true);

      if (editingId) {
        await API.put(`/movies/${editingId}`, payload);
        alert("Movie updated successfully ");
      } else {
        await API.post("/movies", payload);
        alert("Movie added successfully ");
      }

      resetForm();
      fetchMovies();
      setCurrentPage(1);
    } catch {
      alert("Operation failed ❌");
    } finally {
      setLoading(false);
    }
  };

  /* ================= EDIT ================= */
  const handleEdit = (m: Movie) => {
    setEditingId(m._id);
    setImdbId(m.imdbId);
    setRank(m.rank);
    setTitle(m.title);
    setYear(m.year);
    setImage(m.image);
    setRating(m.rating);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this movie?")) return;
    await API.delete(`/movies/${id}`);
    fetchMovies();
    setCurrentPage(1);
  };

  /* ================= RESET ================= */
  const resetForm = () => {
    setEditingId(null);
    setImdbId(0);
    setRank(0);
    setTitle("");
    setYear(2024);
    setImage("");
    setRating(8);
  };

  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(movies.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedMovies = movies.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="admin-page">
      <div className="admin-card">

        {/* ===== FORM ===== */}
        <h2>{editingId ? "Edit Movie" : "Add Movie"}</h2>

        <div className="form-row">
          <input
            type="number"
            placeholder="IMDB ID"
            value={imdbId || ""}
            onChange={(e) => setImdbId(+e.target.value)}
          />

          <input
            type="number"
            placeholder="Rank"
            value={rank || ""}
            onChange={(e) => setRank(+e.target.value)}
          />
        </div>

        <input
          placeholder="Movie Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <div className="form-row">
          <input
            type="number"
            placeholder="Release Year"
            value={year}
            onChange={(e) => setYear(+e.target.value)}
          />

          <input
            type="number"
            step="0.1"
            placeholder="Rating"
            value={rating}
            onChange={(e) => setRating(+e.target.value)}
          />
        </div>

        <input
          placeholder="Poster Image URL"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />

        <button className="submit-btn" onClick={submitMovie} disabled={loading}>
          {editingId ? "Update Movie" : "Add Movie"}
        </button>

        {editingId && (
          <button className="submit-btn cancel-btn" onClick={resetForm}>
            Cancel Edit
          </button>
        )}

        {/* ===== TABLE ===== */}
        <h3 style={{ marginTop: "2rem" }}>All Movies</h3>

        <div className="table-wrapper">
          <table className="movie-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Rating</th>
                <th>Year</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {paginatedMovies.map((m) => (
                <tr key={m._id}>
                  <td>{m.title}</td>
                  <td>{m.rating}</td>
                  <td>{m.year}</td>
                  <td className="actions">
                    <button onClick={() => handleEdit(m)}>Edit</button>
                    <button
                      className="danger"
                      onClick={() => handleDelete(m._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ===== PAGINATION ===== */}
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

      </div>
    </div>
  );
}

export default AdminAddMovie;
