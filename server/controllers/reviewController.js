import { pool } from "../config/database.js";
export const getMovieReviews = async (req, res) => {
    const id = req.params.movieId;
    try{
        const result = await pool.query(`
            SELECT ur.id, ur.review_text, ur.rating, ur.created_at, u.username 
            FROM user_reviews ur
            JOIN users u ON ur.user_id = u.id
            WHERE ur.movie_id = $1 
            ORDER BY ur.created_at DESC
            `,[id]);
        console.log(result);
        return res.status(200).json({
          success: true,
          data: result.rows,
        });

    }
    catch(e){
        console.log(`Error fetching movie: ${e}`)
        return res.status(500).json({
            success: false,
            error: e.message,
        })
    }
};
