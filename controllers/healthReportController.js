
const HealthReport = require('../models/healthReportModel');

const saveUserDetails = async (req, res) => {
  const { userAge, userHeight, userWeight, userGender, userActivityLevel } = req.body;

  // Extract userID from the request, typically from the authenticated session or token
  const userID = req.user.id; // Assumes user information is available in req.user

  if (!userAge || !userHeight || !userWeight || !userGender || !userActivityLevel) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const userDetails = {
    userID, // Include userID
    userAge,
    userHeight,
    userWeight,
    userGender,
    userActivityLevel,
  };

  try {
    // Create a new health report instance
    const newReport = await HealthReport.create(userDetails);

    console.log('User details saved successfully with reportID:', newReport.reportID);

    // Respond with JSON indicating success
    res.status(200).json({ success: true, reportID: newReport.reportID });
  } catch (error) {
    console.error('Error creating user details:', error);
    res.status(500).json({ error: 'Error saving user details' });
  }
};

const getReportByUserID = async (req, res) => {
  const userID = parseInt(req.params.userID);
  
  // Ensure userID is valid
  if (isNaN(userID)) {
    return res.status(400).send("Invalid user ID");
  }

  console.log('Fetching report for user ID:', userID);

  try {
    const healthReports = await HealthReport.findByUserID(userID);

    if (healthReports.length === 0) {
      return res.status(404).send("No health reports found for this user");
    }

    res.json(healthReports);
  } catch (error) {
    console.error('Error retrieving health report:', error);
    res.status(500).send("Error retrieving health report");
  }
};


// New delete function
const deleteReportByUserID = async (req, res) => {
  const userID = parseInt(req.params.userID);
  
  // Ensure userID is valid
  if (isNaN(userID)) {
    return res.status(400).send("Invalid user ID");
  }

  console.log('Deleting report for user ID:', userID);

  try {
    const result = await HealthReport.deleteByUserID(userID);

    if (result.deletedCount > 0) {
      res.status(200).json({ message: 'Report deleted successfully' });
    } else {
      res.status(404).json({ message: 'No report found for this user ID' });
    }
  } catch (error) {
    console.error('Error deleting health report:', error);
    res.status(500).send("Error deleting health report");
  }
};

module.exports = {
  saveUserDetails,
  getReportByUserID,
  deleteReportByUserID, // Export the delete function
};
