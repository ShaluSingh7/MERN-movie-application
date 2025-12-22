import mongoose, { Schema, Document } from "mongoose";

export interface IMovie extends Document {
  title: string;
  description: string;
  rating: number;
  releaseDate: Date;
  duration: number;
}

const MovieSchema: Schema<IMovie> = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    rating: { type: Number, required: true },
    releaseDate: { type: Date, required: true },
    duration: { type: Number, required: true }
  },
  { timestamps: true }
);

export default mongoose.model<IMovie>("Movie", MovieSchema);
