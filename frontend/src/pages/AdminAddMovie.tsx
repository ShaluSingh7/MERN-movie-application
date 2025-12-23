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

export default function AdminAddMovie() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  // form state
  const [imdbId, setImdbId] = useState<number | "">("");
  const [rank, setRank] = useState<number | "">("");
  const [title, setTitle] = useState("");
  const [year, setYear] = useState<number | "">("");
  const [rating, setRating] = useState<number | "">("");
  const [image, setImage] = useState("");

  // pagination
  const [page, setPage] = useState(1);
  const perPage = 8;

  const fetchMovies = async () => {
    const res = await API.get("/movies");
    setMovies(res.data);
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setImdbId("");
    setRank("");
    setTitle("");
    setYear("");
    setRating("");
    setImage("");
  };

  const submitMovie = async () => {
    if (!imdbId || !rank || !title || !year || !rating || !image) {
      alert("Please fill all fields");
      return;
    }

    const payload = { imdbId, rank, title, year, rating, image };

    if (editingId) {
      await API.put(`/movies/${editingId}`, payload);
    } else {
      await API.post("/movies", payload);
    }

    resetForm();
    fetchMovies();
  };

  const handleEdit = (m: Movie) => {
    setEditingId(m._id);
    setImdbId(m.imdbId);
    setRank(m.rank);
    setTitle(m.title);
    setYear(m.year);
    setRating(m.rating);
    setImage(m.image);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this movie?")) return;
    await API.delete(`/movies/${id}`);
    fetchMovies();
  };

  // pagination calc
  const totalPages = Math.ceil(movies.length / perPage);
  const start = (page - 1) * perPage;
  const paginated = movies.slice(start, start + perPage);

  return (
    <div className="admin-page">
      <div className="admin-card">

        <h2>{editingId ? "Edit Movie" : "Add Movie"}</h2>

        {/* FORM */}
        <div className="form-grid">
          <input placeholder="IMDB ID" value={imdbId} onChange={e => setImdbId(+e.target.value)} />
          <input placeholder="Rank" value={rank} onChange={e => setRank(+e.target.value)} />
          <input placeholder="Movie Title" value={title} onChange={e => setTitle(e.target.value)} />
          <input placeholder="Year" value={year} onChange={e => setYear(+e.target.value)} />
          <input placeholder="Rating" value={rating} onChange={e => setRating(+e.target.value)} />
          <input placeholder="Poster Image URL" value={image} onChange={e => setImage(e.target.value)} />
        </div>

        <div className="form-actions">
          <button onClick={submitMovie}>
            {editingId ? "Update Movie" : "Add Movie"}
          </button>
          {editingId && <button className="cancel" onClick={resetForm}>Cancel</button>}
        </div>

        {/* TABLE */}
        <h3>All Movies</h3>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Rating</th>
                <th>Year</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map(m => (
                <tr key={m._id}>
                  <td title={m.title}>{m.title}</td>
                  <td>{m.rating}</td>
                  <td>{m.year}</td>
                  <td className="actions">
                    <button onClick={() => handleEdit(m)}>Edit</button>
                    <button className="danger" onClick={() => handleDelete(m._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="pagination">
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>Prev</button>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              className={page === i + 1 ? "active" : ""}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next</button>
        </div>

      </div>
    </div>
  );
}
