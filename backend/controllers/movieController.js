import * as movieModel from "../models/movie.js";

export async function addMovie(req, res) {
  try {
    const { movie_id, rating } = req.body;
    const userId = req.user.id;

    if (!movie_id || !rating) return res.status(400).json({ error: "Missing fields" });
    if (rating < 0 || rating > 10) return res.status(400).json({ error: "Rating 0-10" });

    const movie = await movieModel.addMovieToLibrary(userId, movie_id, rating);

    res.status(201).json({ success: true, movie });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add movie" });
  }
}

export async function getLibrary(req, res) {
  try {
    const userId = req.user.id;
    const movies = await movieModel.getUserMovies(userId);
    res.json({ success: true, movies });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to get library" });
  }
}

export async function updateRating(req, res) {
  try {
    const { movieId } = req.params;
    const { rating } = req.body;
    const userId = req.user.id;

    const updated = await movieModel.updateMovieRating(userId, movieId, rating);

    if (!updated) return res.status(404).json({ error: "Movie not found" });
    res.json({ success: true, movie: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update rating" });
  }
}

export async function deleteMovie(req, res) {
  try {
    const { movieId } = req.params;
    const userId = req.user.id;

    const deleted = await movieModel.deleteMovieFromLibrary(userId, movieId);

    if (!deleted) {
      return res.status(404).json({ error: "Movie not found" });
    }
    
    res.json({ success: true, message: "Movie deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete movie" });
  }
}
