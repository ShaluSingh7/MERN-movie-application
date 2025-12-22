import express from "express";
import {
  getMovies,
  addMovie,
  updateMovie,
  deleteMovie
} from "../controllers/movieController";
import { protect, admin } from "../middleware/authMiddleware";

const router = express.Router();

// ✅ GET movies (search + sort supported)
router.get("/", getMovies);

// ✅ ADD movie (admin only)
router.post("/", protect, admin, addMovie);

// ✅ UPDATE movie (admin only)
router.put("/:id", protect, admin, updateMovie);

// ✅ DELETE movie (admin only)
router.delete("/:id", protect, admin, deleteMovie);

export default router;
