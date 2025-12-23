import axios from "axios";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Movie from "./models/Movie";

dotenv.config();

const SOURCE_URL =
  "https://gist.githubusercontent.com/pjbelo/c5e28dbb7a8fea6713a2fd74f1cd80ae/raw/top250movies.json";

const seedMovies = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("✅ MongoDB connected for seeding");

    const response = await axios.get(SOURCE_URL);

    const movies = response.data.top250movies;

    if (!Array.isArray(movies)) {
      throw new Error("Invalid movie data format");
    }

    // Clear old data
    await Movie.deleteMany({});
    console.log("🗑 Old movies removed");

    const formattedMovies = movies.map((movie: any) => ({
      imdbId: movie.id,
      rank: movie.rank,
      title: movie.title,
      fullTitle: movie.fullTitle,
      year: movie.year,
      image: movie.image,
      crew: movie.crew,
      rating: Number(movie.imDbRating),
      ratingCount: Number(movie.imDbRatingCount)
    }));

    await Movie.insertMany(formattedMovies);

    console.log(`🎉 ${formattedMovies.length} movies inserted successfully`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seedMovies();
