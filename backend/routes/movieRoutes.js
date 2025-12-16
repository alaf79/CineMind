import { Router } from "express";
import * as movieController from "../controllers/movieController.js";
import { authRequired } from "../middleware/authMiddleware.js";

const router = Router();
router.use(authRequired);

router.post("/add", movieController.addMovie);
router.get("/library", movieController.getLibrary);
router.put("/:movieId/rating", movieController.updateRating);
router.delete("/:movieId", movieController.deleteMovie);

export default router;
