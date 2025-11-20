import { useState, useEffect } from 'react';
import { useParams} from "react-router-dom";
import MovieCard from '../components/MovieCard';

function UserPage () {
    const { username } = useParams();
    const [user, setUser] = useState(null);
    const [rawReviews, setRawReviews] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch user information
    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true);
            setError(null);
        
            try {
                const response = await fetch(`http://localhost:3001/api/user/${username}`);
                const data = await response.json();
        
                if (data.success) {
                    setUser(data.data);
                } else {
                    setError("User not found");
                }
            } catch (error) {
                console.error("Error fetching user:", error);
                setError("Failed to load user details");
            } finally {
                setLoading(false);
            }
        };
        
        const fetchReviews = async () => {
            try {
                const response = await fetch(`http://localhost:3001/api/${username}/reviews`);
                const data = await response.json();

                if (data.success) {
                    setRawReviews(Array.isArray(data.data) ? data.data : []);
                } else {
                    setRawReviews([]);
                }
            } catch (error)
            {
                console.error("Error fetching reviews:", error);
                setRawReviews([]);
            }
        };

        if (username) {
            fetchUser();
            fetchReviews();
        }
    }, [username]);

    // Fetch movie data for each review
    useEffect(() => {
        if (!rawReviews.length) {
            setReviews([]);
            return;
        }

    const fetchMovie = async (movieId) => {
        try {
            const response = await fetch(`http://localhost:3001/api/movies/${movieId}`);
            const data = await response.json();
            return data.success ? data.data : null;
        } catch (err) {
            console.error("Error fetching movie:", err);
            return null;
        }
    };

    const loadMovies = async () => {
            const movies = await Promise.all(
                rawReviews.map((r) => fetchMovie(r.movie_id))
            );

            const enriched = rawReviews.map((review, i) => ({
                ...review,
                movie: movies[i],
            }));
            setReviews(enriched);
        };

    loadMovies();
    }, [rawReviews]);


    if (loading) return <p className="p-4">Loading...</p>;
    if (error) return <p className="text-red-500 p-4">{error}</p>;

    return (
        <div className="p-4">
            <h1 className="text-3xl font-bold text-gray-900 mb-24"> User Profile </h1>
            {/* Profile Container*/}
            {user && (
                <div className="flex flex-row items-start bg-transparent">
                    {/* Profile Image */}
                    <img
                        src={user.avatarurl || "https://via.placeholder.com/200"}
                        alt={`${user.username}-profile`}
                        width="200"
                        height="200"
                        className="object-contain border border-[2px] rounded"
                        onError={(e) => {
                            e.currentTarget.src = "https://via.placeholder.com/200";
                        }}
                    />

                    {/* User Information */}
                    <div className="p-4">
                        <h2 className="text-2xl font-semibold">{user.username}</h2>
                        <p>Number of Movies Reviewed: {reviews ? reviews.length : 0}</p>
                        <p>Favorite Movie: {/* Add logic later */}</p>
                        <p>Highest Rated Movie: </p>
                    </div>
                </div>
            )}
            {/* User's Reviewed Movies */}
            <div className="p-4">
                <h1 className="text-2xl font-semibold text-gray-800">Reviews:</h1>
                <ul className="flex flex-row ">
                    {Array.isArray(reviews) && reviews.length > 0 ? (
                        reviews.map((review) => (
                        <li key={review.id} className="w-80">
                            {review.movie ? (
                                <>
                                    <MovieCard movie={review.movie} rating={review.rating} />
                                    <p className="mt-2 text-gray-700 font-medium">
                                        Your rating: {review.rating}
                                    </p>
                                </>
                            ) : (
                                <p>Loading movie...</p>
                            )}
                        </li>
                        ))
                    ) : (
                        <p>No reviews yet.</p>
                    )}
                </ul>
            </div>
        </div>
    )
};

export default UserPage;