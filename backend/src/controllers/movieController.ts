import { Request, Response } from "express";
import Movie from "../models/Movie";

export const getMovies = async (req: Request, res: Response) => {
  try {
    const { q, sortBy, order } = req.query;

    const filter: any = {};

    if (q && typeof q === "string") {
      filter.$or = [
        { title: { $regex: q, $options: "i" } },
        { fullTitle: { $regex: q, $options: "i" } },
        { crew: { $regex: q, $options: "i" } }
      ];
    }
    const sort: any = {};

    if (sortBy && typeof sortBy === "string") {
      const allowedFields = [
        "title",
        "rating",
        "year",
        "rank"
      ];

      if (!allowedFields.includes(sortBy)) {
        return res.status(400).json({
          message: "Invalid sort field"
        });
      }

      sort[sortBy] = order === "asc" ? 1 : -1;
    }

    const movies = await Movie.find(filter).sort(sort);

    res.status(200).json(movies);
  } catch (error) {
    console.error("GET MOVIES ERROR:", error);
    res.status(500).json({
      message: "Failed to fetch movies"
    });
  }
};


export const addMovie = async (req: Request, res: Response) => {
  try {
    const movie = await Movie.create(req.body);
    res.status(201).json(movie);
  } catch (error) {
    console.error("ADD MOVIE ERROR:", error);
    res.status(500).json({
      message: "Failed to add movie"
    });
  }
};


export const updateMovie = async (req: Request, res: Response) => {
  try {
    const updatedMovie = await Movie.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedMovie) {
      return res.status(404).json({
        message: "Movie not found"
      });
    }

    res.status(200).json(updatedMovie);
  } catch (error) {
    console.error("UPDATE MOVIE ERROR:", error);
    res.status(500).json({
      message: "Failed to update movie"
    });
  }
};


export const deleteMovie = async (req: Request, res: Response) => {
  try {
    const deletedMovie = await Movie.findByIdAndDelete(req.params.id);

    if (!deletedMovie) {
      return res.status(404).json({
        message: "Movie not found"
      });
    }

    res.status(200).json({
      message: "Movie deleted successfully"
    });
  } catch (error) {
    console.error("DELETE MOVIE ERROR:", error);
    res.status(500).json({
      message: "Failed to delete movie"
    });
  }
};
