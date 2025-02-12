const express = require("express");
const booksController = require("./controllers/booksController");
const usersController = require("./controllers/usersController")
const sql = require("mssql");
const dbConfig = require("./dbConfig");
const bodyParser = require("body-parser"); // Import body-parser
const verifyJWT = require("./middlewares/verifyJWT");

const app = express();
const port = process.env.PORT || 3000; // Use environment variable or default port

// Include body-parser middleware to handle JSON data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // For form data handling

app.post("/login", usersController.login)
app.post("/register", usersController.registerUser)
// Routes for GET requests (replace with appropriate routes for update and delete later)
app.get("/books",verifyJWT, booksController.getAllBooks);
app.put("/books/:bookId/availability", verifyJWT, booksController.updateBookAvailability); // PUT for updating books

app.get("/books/:id", booksController.getBookById);

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