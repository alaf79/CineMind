import { Router } from "express";
import * as movieController from "../controllers/movieController.js";
import { authRequired } from "../middleware/authMiddleware.js";
import db from "../config/db.js";

const router = Router();

// ===== USER MOVIES ROUTES (AUTH REQUIRED) =====
router.post("/add", authRequired, movieController.addMovie);
router.get("/library", authRequired, movieController.getLibrary);
router.put("/:movieId/rating", authRequired, movieController.updateRating);
router.delete("/:movieId", authRequired, movieController.deleteMovie);

// ===== SHOWCASE ROUTES (AUTH REQUIRED) =====

// Get user's showcase
router.get("/showcase", authRequired, async (req, res) => {
  try {
    // Join with user_movies to get the actual TMDB movie_id
    const result = await db.query(
      `SELECT ups.position, um.movie_id, ups.updated_at 
       FROM user_profile_showcase ups
       JOIN user_movies um ON ups.movie_id = um.id
       WHERE ups.user_id = $1 
       ORDER BY ups.position`,
      [req.user.id]
    );
    
    res.json({ success: true, showcase: result.rows });
  } catch (error) {
    console.error("Get showcase error:", error);
    res.status(500).json({ success: false, error: "Failed to get showcase" });
  }
});

// Set movie at specific position
router.put("/showcase/:position", authRequired, async (req, res) => {
  try {
    const { position } = req.params;
    const { movie_id } = req.body; // This is the TMDB movie_id from frontend
    
    console.log('📝 Showcase request:', { position, movie_id, user_id: req.user.id });
    
    // Validate position (1-4 on backend, 0-3 on frontend)
    const positionNum = parseInt(position);
    if (isNaN(positionNum) || positionNum < 1 || positionNum > 4) {
      return res.status(400).json({ success: false, error: "Position must be 1-4" });
    }

    // Validate movie_id is provided
    if (!movie_id) {
      return res.status(400).json({ success: false, error: "movie_id is required" });
    }

    // Check if movie exists in user's library AND get the user_movies.id
    const movieCheck = await db.query(
      "SELECT id FROM user_movies WHERE user_id = $1 AND movie_id = $2",
      [req.user.id, movie_id]
    );

    console.log('📊 Movie check:', movieCheck.rows);

    if (movieCheck.rows.length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: "Movie not found in your library. Please rate this movie first." 
      });
    }

    // Get the user_movies.id (not the TMDB movie_id) for the foreign key
    const userMovieId = movieCheck.rows[0].id;
    
    console.log('🔑 Using user_movies.id:', userMovieId);
    
    // Check if this movie is already in the showcase at a different position
    const existingMovie = await db.query(
      "SELECT position FROM user_profile_showcase WHERE user_id = $1 AND movie_id = $2",
      [req.user.id, userMovieId]
    );
    
    console.log('📊 Existing movie in showcase:', existingMovie.rows);
    
    if (existingMovie.rows.length > 0 && existingMovie.rows[0].position !== positionNum) {
      // Movie exists at different position - remove it first
      console.log('🗑️ Removing from old position:', existingMovie.rows[0].position);
      await db.query(
        "DELETE FROM user_profile_showcase WHERE user_id = $1 AND movie_id = $2",
        [req.user.id, userMovieId]
      );
    }
    
    // Check if position exists, update or insert
    const existing = await db.query(
      "SELECT id FROM user_profile_showcase WHERE user_id = $1 AND position = $2",
      [req.user.id, positionNum]
    );
    
    console.log('📊 Existing at position:', existing.rows);
    
    if (existing.rows.length > 0) {
      // Use userMovieId (user_movies.id) not movie_id (TMDB id)
      console.log('📝 Updating position', positionNum);
      await db.query(
        "UPDATE user_profile_showcase SET movie_id = $1, updated_at = CURRENT_TIMESTAMP WHERE user_id = $2 AND position = $3",
        [userMovieId, req.user.id, positionNum]
      );
    } else {
      // Use userMovieId (user_movies.id) not movie_id (TMDB id)
      console.log('➕ Inserting at position', positionNum);
      await db.query(
        "INSERT INTO user_profile_showcase (user_id, position, movie_id) VALUES ($1, $2, $3)",
        [req.user.id, positionNum, userMovieId]
      );
    }
    
    console.log('✅ Showcase updated successfully');
    res.json({ success: true });
  } catch (error) {
    console.error("❌ Update showcase error:", error);
    console.error("Error message:", error.message);
    console.error("Error code:", error.code);
    res.status(500).json({ success: false, error: "Failed to update showcase", details: error.message });
  }
});

// Remove movie from position
router.delete("/showcase/:position", authRequired, async (req, res) => {
  try {
    const { position } = req.params;
    
    await db.query(
      "DELETE FROM user_profile_showcase WHERE user_id = $1 AND position = $2",
      [req.user.id, position]
    );
    
    res.json({ success: true });
  } catch (error) {
    console.error("Delete showcase error:", error);
    res.status(500).json({ success: false, error: "Failed to remove from showcase" });
  }
});

// ===== WATCHLIST ROUTES (AUTH REQUIRED) =====

// Get user's watchlist
router.get("/watchlist", authRequired, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT movie_id, added_at 
       FROM user_watchlist 
       WHERE user_id = $1 
       ORDER BY added_at DESC`,
      [req.user.id]
    );
    
    res.json({ success: true, watchlist: result.rows });
  } catch (error) {
    console.error("Get watchlist error:", error);
    res.status(500).json({ success: false, error: "Failed to get watchlist" });
  }
});

// Add movie to watchlist
router.post("/watchlist/add", authRequired, async (req, res) => {
  try {
    const { movie_id } = req.body;
    
    if (!movie_id) {
      return res.status(400).json({ success: false, error: "movie_id is required" });
    }

    // Check if already in watchlist
    const existing = await db.query(
      "SELECT id FROM user_watchlist WHERE user_id = $1 AND movie_id = $2",
      [req.user.id, movie_id]
    );
    
    if (existing.rows.length > 0) {
      return res.status(400).json({ success: false, error: "Movie already in watchlist" });
    }
    
    await db.query(
      "INSERT INTO user_watchlist (user_id, movie_id) VALUES ($1, $2)",
      [req.user.id, movie_id]
    );
    
    res.json({ success: true });
  } catch (error) {
    console.error("Add to watchlist error:", error);
    res.status(500).json({ success: false, error: "Failed to add to watchlist" });
  }
});

// Remove movie from watchlist
router.delete("/watchlist/:movieId", authRequired, async (req, res) => {
  try {
    const { movieId } = req.params;
    
    await db.query(
      "DELETE FROM user_watchlist WHERE user_id = $1 AND movie_id = $2",
      [req.user.id, movieId]
    );
    
    res.json({ success: true });
  } catch (error) {
    console.error("Remove from watchlist error:", error);
    res.status(500).json({ success: false, error: "Failed to remove from watchlist" });
  }
});

// Check if movie is in watchlist
router.get("/watchlist/check/:movieId", authRequired, async (req, res) => {
  try {
    const { movieId } = req.params;
    
    const result = await db.query(
      "SELECT id FROM user_watchlist WHERE user_id = $1 AND movie_id = $2",
      [req.user.id, movieId]
    );
    
    res.json({ success: true, inWatchlist: result.rows.length > 0 });
  } catch (error) {
    console.error("Check watchlist error:", error);
    res.status(500).json({ success: false, error: "Failed to check watchlist" });
  }
});

// ===== CACHE ROUTES (NO AUTH - PUBLIC) =====

// Get cached movie
router.get("/cache/:movieId", async (req, res) => {
  try {
    const { movieId } = req.params;
    
    const result = await db.query(
      `SELECT * FROM movie_cache 
       WHERE movie_id = $1 
       AND last_updated > NOW() - INTERVAL '7 days'`,
      [movieId]
    );
    
    if (result.rows.length > 0) {
      res.json({ success: true, cached: true, movie: result.rows[0] });
    } else {
      res.json({ success: true, cached: false });
    }
  } catch (error) {
    console.error("Get cache error:", error);
    res.status(500).json({ success: false, error: "Failed to get cache" });
  }
});

// Cache movie data
router.post("/cache", async (req, res) => {
  try {
    const { movie_id, title, year, director, director_id, genres, poster_path } = req.body;
    
    if (!movie_id || !title) {
      return res.status(400).json({ success: false, error: "movie_id and title are required" });
    }

    // Upsert - update if exists, insert if not
    await db.query(
      `INSERT INTO movie_cache (movie_id, title, year, director, director_id, genres, poster_path, last_updated)
       VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP)
       ON CONFLICT (movie_id) 
       DO UPDATE SET 
         title = EXCLUDED.title,
         year = EXCLUDED.year,
         director = EXCLUDED.director,
         director_id = EXCLUDED.director_id,
         genres = EXCLUDED.genres,
         poster_path = EXCLUDED.poster_path,
         last_updated = CURRENT_TIMESTAMP`,
      [movie_id, title, year, director, director_id, JSON.stringify(genres), poster_path]
    );
    
    res.json({ success: true });
  } catch (error) {
    console.error("Cache movie error:", error);
    res.status(500).json({ success: false, error: "Failed to cache movie" });
  }
});

// Get multiple cached movies
router.post("/cache/bulk", async (req, res) => {
  try {
    const { movie_ids } = req.body;
    
    if (!Array.isArray(movie_ids) || movie_ids.length === 0) {
      return res.json({ success: true, movies: [] });
    }
    
    const result = await db.query(
      `SELECT * FROM movie_cache 
       WHERE movie_id = ANY($1::int[])
       AND last_updated > NOW() - INTERVAL '7 days'`,
      [movie_ids]
    );
    
    res.json({ success: true, movies: result.rows });
  } catch (error) {
    console.error("Bulk cache error:", error);
    res.status(500).json({ success: false, error: "Failed to get cached movies" });
  }
});

// Clean old cache entries
router.delete("/cache/cleanup", async (req, res) => {
  try {
    const result = await db.query(
      `DELETE FROM movie_cache 
       WHERE last_updated < NOW() - INTERVAL '7 days'`
    );
    
    res.json({ success: true, deleted: result.rowCount });
  } catch (error) {
    console.error("Cache cleanup error:", error);
    res.status(500).json({ success: false, error: "Failed to cleanup cache" });
  }
});

export default router;