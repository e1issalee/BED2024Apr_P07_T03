const express = require("express");
const usersController = require("./controllers/usersController");
const foodItemsController = require("./controllers/foodItemsController");
const path = require('path');
const sql = require("mssql"); // Assuming you've installed mssql
const dbConfig = require("./dbConfig");
const validateUser = require("./middlewares/validateUser");
const bodyParser = require("body-parser"); // Import body-parser

const app = express();
const port = process.env.PORT || 3000; // Use environment variable or default port

const staticMiddleware = express.static("Links Directed to"); // Path to the Links Directed to folder

// Include body-parser middleware to handle JSON data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // For form data handling

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// [USERS] Routes for GET requests (replace with appropriate routes for update and delete later)
app.get("/users", usersController.getAllUsers);
app.get("/users/:id", usersController.getUserById);
app.post("/users", validateUser, usersController.createUser); // POST for creating user (can handle JSON data)
app.put("/users/:id", validateUser, usersController.updateUser); // PUT for updating users
app.delete("/users/:id", validateUser, usersController.deleteUser); // DELETE for deleting users

app.use(staticMiddleware); // Mount the static middleware

// [FOOD] ======================================================
app.post('/food', foodItemsController.createFoodItem);
app.get('/food', foodItemsController.getAllFoodItems);
app.get('/food/:id', foodItemsController.getFoodItemById);
app.delete('/deleteFoodItem/:id', foodItemsController.deleteFoodItem);
app.get('/nutrition', foodItemsController.getNutritionData);

app.listen(port, async () => {
  try {
    // Connect to the database
    await sql.connect(dbConfig);
    console.log("Database connection established successfully");
    console.log(`Server is running on http://localhost:${port}`);
  } catch (err) {
    console.error("Database connection error:", err);
    // Terminate the application with an error code (optional)
    process.exit(1); // Exit with code 1 indicating an error
  }
});

// Close the connection pool on SIGINT signal
process.on("SIGINT", async () => {
  console.log("Server is gracefully shutting down");
  // Perform cleanup tasks (e.g., close database connections)
  await sql.close();
  console.log("Database connection closed");
  process.exit(0); // Exit with code 0 indicating successful shutdown
});