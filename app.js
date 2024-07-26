require('dotenv').config({ path: './secretkey.env' });

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
const verifyJWT = require("./middlewares/verifyJWT")
const bodyParser = require("body-parser"); // Import body-parser
const cors = require('cors');
const publicstaticMiddleware = express.static("public");

const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger-output.json"); // Import generated spec

const app = express();
const port = process.env.PORT || 3000; // Use environment variable or default port

// Serve the Swagger UI at a specific route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/your-protected-routes', verifyJWT);

// Include body-parser middleware to handle JSON data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // For form data handling
app.use(cors());
app.use(publicstaticMiddleware); 
app.use(express.json());
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get("/users/with-vouchers", usersController.getUsersWithVouchers);
app.post('/users/login', usersController.login);
app.post('/users/create', validateUser, usersController.createUser);
app.get("/users/with-vouchers/:id", usersController.getUserWithVouchersById); // GET for the user with the voucher he has
app.put("/users/updatePointsAndVouchers/:id", usersController.updateUserPointsAndVouchers); // PUT for updating users
app.put("/users/updateDailyCalories/:id", usersController.updateUserCalories); // PUT for updating daily calories
app.put("/users/resetDailyCalories/:id", usersController.resetUserCalories); // PUT for updating daily calories

// [VOUCHERS] =================================================================================
app.post("/vouchers/create", validateVoucher, vouchersController.createVoucher);
app.get("/vouchers/with-users", vouchersController.getVouchersWithUsers);
app.delete("/vouchers/delete/:id", vouchersController.deleteVoucher); // DELETE for deleting vouchers
app.get("/vouchers/:id", vouchersController.getVoucherById);

app.post("/voucherUsers/create", voucherUsersController.createVoucherUsers);
app.delete("/voucherUsers/delete/:id", voucherUsersController.deleteVoucherUsers); // DELETE for deleting voucherUsers
app.get("/voucherUsers/:id", voucherUsersController.getVoucherUserById);

// [USERS] =================================================================================
app.get("/users", usersController.getAllUsers);
app.get("/users/:id", usersController.getUserById);
app.post("/users", validateUser, usersController.createUser); // POST for creating user (can handle JSON data)
app.delete("/users/:id", validateUser, usersController.deleteUser); // DELETE for deleting users


// [FOOD] =================================================================================
app.get('/food/:userId/:tabName', foodItemsController.getFoodItemsByUserIdAndTabName);
app.post('/food', verifyJWT, foodItemsController.createFoodItem);  // addFoodToTab
app.get('/food', foodItemsController.getAllFoodItems);
app.get('/food/:id', foodItemsController.getFoodItemById);
app.get('/nutrition', foodItemsController.getNutritionData); // GET nutritional data from API + display
//app.get('/fetchFoodItems', foodItemsController.fetchFoodItems); // fetchFoodItems
app.put('/food/:id', verifyJWT, foodItemsController.updateFoodItemQuantity); // updateQuantity
app.delete('/deleteFoodItem/:id', verifyJWT, foodItemsController.deleteFoodItem);  // removeFoodItem

app.post('/tabNames', tabNamesController.saveTabName); // saveTabData

// [HEALTH REPORT] =================================================================================
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