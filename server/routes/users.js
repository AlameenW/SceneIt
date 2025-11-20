import express from 'express';
import UserController from '../controllers/userController.js'

const router = express.Router();

// GET requests
router.get("/users", UserController.getAllUsers);
router.get("/user/:username", UserController.getUserByUsername)
router.get('/:username/reviews', UserController.getUserReviews)

router.get("/users/watchlists", UserController.getAllWatchlist)
router.get("/:username/watchlist", UserController.getUserWatchlist)

// POST requests
router.post('/:username/review/:movie_id', UserController.createUserReview)
router.post('/:username/watchlist/:movie_id', UserController.createUserWatchlist)

export default router;