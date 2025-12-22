import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";

function MovieDetailPage({ user }) {
  const { id } = useParams();
  const username = user?.username;
  const [movie, setMovie] = useState(null);
  const [rating, setRating] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [submitMessage, setSubmitMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Build TMDB image URL
  const buildImageURL = (path, size = "w500") => {
    if (!path) return "/placeholder-movie.svg";
    return `https://image.tmdb.org/t/p/${size}${path}`;
  };

  // Format rating
  const formatRating = (rating) => {
    return rating ? parseFloat(rating).toFixed(1) : "N/A";
  };

  // Format release date
  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Generate distinct colors for genre pills
  const getGenreColor = (genre, index) => {
    const colors = [
      "bg-blue-100 text-blue-800",
      "bg-green-100 text-green-800",
      "bg-purple-100 text-purple-800",
      "bg-orange-100 text-orange-800",
      "bg-pink-100 text-pink-800",
      "bg-indigo-100 text-indigo-800",
      "bg-yellow-100 text-yellow-800",
      "bg-red-100 text-red-800",
    ];
    return colors[index % colors.length];
  };

  // Handle user submit rating
  const handleSubmitRating = async () => {
    if (!rating) {
      setSubmitStatus("error");
      setSubmitMessage("Please enter a rating");
      return;
    }
    if (!user) {
      setSubmitStatus("error");
      setSubmitMessage("Please log in to rate movies");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);
    try {
      const response = await fetch(
        `http://localhost:3001/api/${username}/review/${movie.id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ rating: parseFloat(rating), review_text: "" }),
        }
      );
      const data = await response.json();
      if (data.success) {
        setSubmitStatus("success");
        setSubmitMessage("Rating submitted successfully");
        setRating("");
        setTimeout(() => setSubmitStatus(null), 3000);
      } else {
        setSubmitStatus("error");
        setSubmitMessage(data.error);
      }
    } catch (error) {
      console.error(error);
      setSubmitStatus('error')
      setSubmitMessage('Failed to submit rating, Please try again');
    }
    finally{
      setIsSubmitting(false);
    }
  };

  // Handle user add movie to watchlist
  const handleAddWatchlist = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/${username}/watchlist/${movie.id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            status: "Not watched",
            watchlist_priority: 1,
          }),
        }
      );
      const data = await response.json();
    } catch (error) {
      console.error(error);
    }
  };

  // Fetch movie details
  useEffect(() => {
    const fetchMovie = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`http://localhost:3001/api/movies/${id}`);
        const data = await response.json();

        if (data.success) {
          setMovie(data.data);
        } else {
          setError("Movie not found");
        }
      } catch (error) {
        console.error("Error fetching movie:", error);
        setError("Failed to load movie details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMovie();
    }
  }, [id]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg
              className="mx-auto h-16 w-16"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 48 48"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            {error || "Movie not found"}
          </h3>
          <p className="text-gray-600 mb-6">
            The movie you're looking for doesn't exist or couldn't be loaded.
          </p>
          <Link
            to="/movies"
            className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Back to Movies
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with back button */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            to="/movies"
            className="inline-flex items-center text-gray-600 hover:text-gray-800 font-medium transition-colors"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Movies
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="md:flex">
            {/* Movie Poster */}
            <div className="md:w-1/3 lg:w-1/4">
              <img
                src={buildImageURL(movie.img_path, "w500")}
                alt={movie.title}
                className="w-full h-auto object-cover"
                onError={(e) => {
                  e.target.src = "/placeholder-movie.svg";
                }}
              />
            </div>

            {/* Movie Details */}
            <div className="md:w-2/3 lg:w-3/4 p-8">
              {/* Title and Basic Info */}
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {movie.title}
                </h1>

                <div className="flex flex-wrap items-center gap-4 mb-4">
                  {/* Rating */}
                  <div className="flex items-center">
                    <span className="text-yellow-500 mr-1">★</span>
                    <span className="text-gray-600 mr-2">External Rating:</span>
                    <span className="font-semibold text-gray-900">
                      {formatRating(movie.external_avg_rating)}
                    </span>
                  </div>

                  {/* Release Date */}
                  <span className="text-gray-600">•</span>
                  <span className="text-gray-600">
                    {formatDate(movie.release_date)}
                  </span>
                </div>

                {/* Genres */}
                {movie.genres && movie.genres.length > 0 && (
                  <div className="mb-6">
                    <span className="text-sm font-medium text-gray-700 mr-2">
                      Genres:
                    </span>
                    <div className="inline-flex flex-wrap gap-2">
                      {movie.genres.map((genre, index) => (
                        <span
                          key={index}
                          className={`px-3 py-1 text-sm font-medium rounded-full ${getGenreColor(
                            genre,
                            index
                          )}`}
                        >
                          {genre}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Add to Watchlist Button */}
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors mb-6"
                  onClick={handleAddWatchlist}
                >
                  Add to Shelve
                </button>
              </div>

              {/* Overview */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Overview:
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {movie.overview || "No overview available for this movie."}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Your Rating:
          </h3>

          {/* Status message */}
          {submitStatus && (
            <div
              className={`mb-4 p-3 rounded-lg ${
                submitStatus === "success"
                  ? "bg-green-100 text-green-700 border border-green-300"
                  : "bg-red-100 text-red-700 border border-red-300"
              }`}
            >
              {submitMessage}
            </div>
          )}

          <div className="flex items-center justify-center gap-4">
            <input
              type="number"
              min="0"
              max="10"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              placeholder="0"
              className="border border-gray-300 rounded px-3 py-2 w-20"
              style={{ appearance: "none", MozAppearance: "textfield" }}
            />
            <span>/10</span>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              onClick={handleSubmitRating}
            >
              Rate This Movie
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieDetailPage;
