import { useEffect, useState } from "react";
import API from "../api/axios";
import "./AdminAddMovie.css";

interface Movie {
  _id: string;
  title: string;
  description: string;
  rating: number;
  duration: number;
  releaseDate: string;
}

function AdminAddMovie() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [rating, setRating] = useState(8);
  const [duration, setDuration] = useState(120);
  const [releaseDate, setReleaseDate] = useState("");
  const [loading, setLoading] = useState(false);

  // Pagination states
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
    if (!title || !description || !releaseDate) {
      alert("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);
      const payload = { title, description, rating, duration, releaseDate };

      if (editingId) {
        await API.put(`/movies/${editingId}`, payload);
        alert("Movie updated successfully");
      } else {
        await API.post("/movies", payload);
        alert("Movie added successfully");
      }

      resetForm();
      fetchMovies();
      setCurrentPage(1);
    } catch {
      alert("Operation failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= EDIT ================= */
  const handleEdit = (m: Movie) => {
    setEditingId(m._id);
    setTitle(m.title);
    setDescription(m.description);
    setRating(m.rating);
    setDuration(m.duration);
    setReleaseDate(m.releaseDate.split("T")[0]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this movie?")) return;
    await API.delete(`/movies/${id}`);
    fetchMovies();
    setCurrentPage(1);
  };

  /* ================= RESET ================= */
  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setRating(8);
    setDuration(120);
    setReleaseDate("");
  };

  /* ================= PAGINATION LOGIC ================= */
  const totalPages = Math.ceil(movies.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedMovies = movies.slice(startIndex, endIndex);

  return (
    <div className="admin-page">
      <div className="admin-card">

        {/* ===== FORM ===== */}
        <h2>{editingId ? "Edit Movie" : "Add Movie"}</h2>

        <div className="form-group">
          <label>Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Rating</label>
            <input
              type="number"
              step="0.1"
              value={rating}
              onChange={(e) => setRating(+e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Duration (min)</label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(+e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Release Date</label>
          <input
            type="date"
            value={releaseDate}
            onChange={(e) => setReleaseDate(e.target.value)}
          />
        </div>

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
                <th>Duration</th>
                <th>Year</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {paginatedMovies.map((m) => (
                <tr key={m._id}>
                  <td>{m.title}</td>
                  <td>{m.rating}</td>
                  <td>{m.duration} min</td>
                  <td>{new Date(m.releaseDate).getFullYear()}</td>
                  <td className="actions">
                    <button onClick={() => handleEdit(m)}>Edit</button>
                    <button className="danger" onClick={() => handleDelete(m._id)}>
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
