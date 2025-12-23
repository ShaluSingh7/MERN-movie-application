import mongoose, { Schema, Document } from "mongoose";

export interface IMovie extends Document {
  imdbId: number;
  rank: number;
  title: string;
  fullTitle: string;
  year: number;
  image: string;
  crew: string;
  rating: number;
  ratingCount: number;
}

const MovieSchema: Schema<IMovie> = new Schema(
  {
    imdbId: {
      type: Number,
      required: true,
      unique: true
    },

    rank: {
      type: Number,
      required: true
    },

    title: {
      type: String,
      required: true,
      trim: true
    },

    fullTitle: {
      type: String
    },

    year: {
      type: Number,
      required: true
    },

    image: {
      type: String,
      required: true
    },

    crew: {
      type: String
    },

    rating: {
      type: Number,
      required: true
    },

    ratingCount: {
      type: Number
    }
  },
  { timestamps: true }
);

export default mongoose.model<IMovie>("Movie", MovieSchema);
