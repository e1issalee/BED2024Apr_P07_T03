const jwt = require("jsonwebtoken");
require('dotenv').config();

const verifyJWT = (req, res, next) => {
    const token =
      req.headers.authorization && req.headers.authorization.split(" ")[1];
  
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Forbidden" });
      }
  
      // Check user role for authorization (replace with your logic)
      const authorizedRoles = {
        "/users/with-vouchers": ["Admin"],
        "/users/login": ["User", "Admin"],
        "/users/create": ["User", "Admin"],
        "/users/with-vouchers/[0-9]+": ["User", "Admin"],
        "/users/updatePointsAndVouchers/[0-9]+": ["User", "Admin"],
        "/users/updateDailyCalories/[0-9]+": ["User", "Admin"],
        "/users/resetDailyCalories/[0-9]+": ["User", "Admin"],
        "/vouchers/create": ["User", "Admin"],
        "/vouchers/with-users": ["User", "Admin"],
        "/vouchers/delete/[0-9]+": ["User", "Admin"],
        "/vouchers/[0-9]+": ["User", "Admin"],
        "/voucherUsers/create/": ["User", "Admin"],
        "/voucherUsers/delete/[0-9]+": ["User", "Admin"],
        "/voucherUsers/[0-9]+": ["User", "Admin"],

        "/saveUserDetails": ["User", "Admin"],
        "/healthReport/[0-9]+": ["User", "Admin"],
        "/deleteReport/[0-9]+": ["User", "Admin"],
        '/userFeedback/createFeedback': ["User", "Admin"],
        "/forum/createPost": ["User", "Admin"], 
        "/forum/getAllPosts": ["User", "Admin"], 
        "/forum/editPost" : ["User", "Admin"],
          
        "/food/[0-9]+/[a-zA-Z]+": ["User", "Admin"],
        "/food": ["User", "Admin"], 
        "/food/[0-9]+": ["User", "Admin"], 
        "/deleteFoodItem/[0-9]+": ["User", "Admin"],

      };
  
      const requestedEndpoint = req.url.split("?")[0];
      const userRole = decoded.role;
  
      const authorizedRole = Object.entries(authorizedRoles).find(
        ([endpoint, roles]) => {
          const regex = new RegExp(`^${endpoint}$`); // Create RegExp from endpoint
          return regex.test(requestedEndpoint) && roles.includes(userRole);
        }
      );
  
      if (!authorizedRole) {
        return res.status(403).json({ message: "Forbidden" });
      }
  
      req.user = decoded; // Attach decoded user information to the request object
      next();
    });
}

module.exports = verifyJWT;