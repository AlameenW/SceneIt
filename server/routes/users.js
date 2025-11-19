import express from 'express';
import UserController from '../controllers/userController.js'

const router = express.Router();

// GET requests
router.get("/users", UserController.getAllUsers);
router.get("/user/:username", UserController.getUserByUsername)

router.get('/:username/reviews', UserController.getUserReviews) // NOT YET IMPLEMENTED

// POST requests
router.post('/:username/review/:movie_id', UserController.createUserReview)

export default router;