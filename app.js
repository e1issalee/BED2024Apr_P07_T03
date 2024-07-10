const express = require("express");
const usersController = require("./controllers/usersController");
const vouchersController = require("./controllers/vouchersController");
const voucherUsersController = require("./controllers/voucherUsersController");
const foodItemsController = require("./controllers/foodItemsController");
const tabNamesController = require('./controllers/tabNamesController');
const healthReportController = require('./controllers/healthReportController');

const path = require('path');
const sql = require("mssql"); // Assuming you've installed mssql
const dbConfig = require("./dbConfig");
const validateUser = require("./middlewares/validateUser");
const validateVoucher = require("./middlewares/validateVoucher");
const bodyParser = require("body-parser"); // Import body-parser
const cors = require('cors');
const publicstaticMiddleware = express.static("public"); 

const app = express();
const port = process.env.PORT || 3000; // Use environment variable or default port


// Include body-parser middleware to handle JSON data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // For form data handling
app.use(cors());
app.use(publicstaticMiddleware); 
app.use(express.json());
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


app.post('/users/login', usersController.getUserByEmailAndPassword)
app.post('/users/create', validateUser, usersController.createUser)
app.put("/users/updatePointsAndVouchers/:id", usersController.updateUserPointsAndVouchers); // PUT for updating users
app.put("/users/updateDailyCalories/:id", usersController.updateUserCalories); // PUT for updating daily calories
app.put("/users/resetDailyCalories/:id", usersController.resetUserCalories); // PUT for updating daily calories

app.post("/vouchers/create", validateVoucher, vouchersController.createVoucher);
app.get("/vouchers/with-users", vouchersController.getVouchersWithUsers);
app.get("/vouchers/:id", vouchersController.getVoucherById);

app.post("/voucherUsers/create", voucherUsersController.createVoucherUsers);
app.get("/voucherUsers/:id", voucherUsersController.getVoucherUserById);

// [USERS] Routes for GET requests (replace with appropriate routes for update and delete later)
app.get("/users", usersController.getAllUsers);
app.get("/users/:id", usersController.getUserById);
app.post("/users", validateUser, usersController.createUser); // POST for creating user (can handle JSON data)
app.delete("/users/:id", validateUser, usersController.deleteUser); // DELETE for deleting users


// [FOOD] ======================================================
app.post('/food', foodItemsController.createFoodItem);
app.get('/food', foodItemsController.getAllFoodItems);
app.get('/food/:id', foodItemsController.getFoodItemById);
app.get('/nutrition', foodItemsController.getNutritionData);
app.get('/fetchFoodItems', foodItemsController.fetchFoodItems); 
app.put('/food/:id', foodItemsController.updateFoodItemQuantity)
app.delete('/deleteFoodItem/:id', foodItemsController.deleteFoodItem); 

app.post('/tabNames', tabNamesController.saveTabName);

// [health report] ===================================================================
app.post('/saveUserDetails', healthReportController.saveUserDetails);
app.get('/healthReport/:reportID', healthReportController.getReportByID);


app.listen(port, async () => {
  try {
    // Connect to the datsabase
    await sql.connect(dbConfig);
    console.log("Database connection established successfully");
    console.log(`Server is running on http://localhost:${port}`);
  } catch (err) {
    console.error("Database connection error:", err); // Terminate the application with an error code (optional)
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