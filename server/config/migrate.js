// Database modifications
import { pool } from "./database.js";
import './dotenv.js'
const updateUsersTable = async () => {
  try {
    // top_5_favourites
    await pool.query(
      "ALTER TABLE users ADD COLUMN top_5_favourites INTEGER[];"
    );
    console.log("Added top 5 favourite column");
    // created_at
    await pool.query(
      "ALTER TABLE users ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;"
    );
    console.log("Added created_at column");
    // Update existing user with current timestamp
    await pool.query(
      "UPDATE users SET created_at = CURRENT_TIMESTAMP WHERE created_at IS NULL;"
    );
    console.log("Users table updated successfully");
  } catch (e) {
    console.log(`Error updating users table: ${e.message}`);
  }
};
const updateUserMovieShelfTable = async () => {
  try {
    await pool.query("DROP TABLE IF EXISTS user_movie_shelf;");
    console.log("user_movie_shelf table deleted successfully");

    const createTableQuery = `
        CREATE TABLE user_movie_shelf(
            user_id INTEGER NOT NULL,
            movie_id INTEGER NOT NULL,
            status TEXT CHECK (status IN ('Completed', 'Want to Watch', 'Now watching')) NOT NULL,
            watchlist_priority INTEGER,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (user_id, movie_id),
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE,
            CONSTRAINT watchlist_priority_check
                CHECK (watchlist_priority IS NULL OR status = 'Want to Watch')
        );
    `;

    await pool.query(createTableQuery);
    console.log("New user_movie_shelf table created successfully.");
  } catch (e) {
    console.log(`Error updating user_movie_shelf table ${e.message}`);
  }

};

await updateUsersTable();
await updateUserMovieShelfTable();
