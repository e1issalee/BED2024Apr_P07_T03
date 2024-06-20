const express = require("express");
const usersController = require("./controllers/usersController");
const sql = require("mssql"); // Assuming you've installed mssql
const dbConfig = require("./dbConfig");
const validateUser = require("./middlewares/validateUser");

const app = express();
const port = process.env.PORT || 3000; // Use environment variable or default port

// Routes for GET requests (replace with appropriate routes for update and delete later)
app.get("/users", usersController.getAllUsers);
app.get("/users/:id", usersController.getUserById);

// To be used soon
//app.post("/books", validateBook, booksController.createBook); // POST for creating books (can handle JSON data)
//app.put("/books/:id", validateBook, booksController.updateBook);

app.listen(port, async () => {
  try {
    // Connect to the database
    await sql.connect(dbConfig);
    console.log("Database connection established successfully");
  } catch (err) {
    console.error("Database connection error:", err);
    // Terminate the application with an error code (optional)
    process.exit(1); // Exit with code 1 indicating an error
  }

  console.log(`Server listening on port ${port}`);
});

// Close the connection pool on SIGINT signal
process.on("SIGINT", async () => {
  console.log("Server is gracefully shutting down");
  // Perform cleanup tasks (e.g., close database connections)
  await sql.close();
  console.log("Database connection closed");
  process.exit(0); // Exit with code 0 indicating successful shutdown
});