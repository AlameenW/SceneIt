import { useState, useEffect } from 'react';
import { useParams} from "react-router-dom";

function UserPage () {
    const { username } = useParams();
    const [user, setUser] = useState(null);
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
                    setReviews(data.data)
                } else {
                    setError("Reviews not found");
                    setReviews([]);
                }
            } catch (error)
            {
                console.error("Error fetching reviews:", error);
                setReviews([]);
            }
        }
    
        if (username) {
            fetchUser();
            fetchReviews();
        }
    }, [username]);

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
            <div>
                <ul>
                    {Array.isArray(reviews) && reviews.length > 0 ? (
                        reviews.map((review) => (
                        <li key={review.id}>
                            <p>Movie ID: {review.movie_id}</p>
                            <p>Rating: {review.rating}/10</p>
                            <p>Review: {review.review_text || "No text"}</p>
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