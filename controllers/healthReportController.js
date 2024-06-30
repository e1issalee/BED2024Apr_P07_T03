const HealthReport = require('../models/healthReportModel');

const saveUserDetails = async (req, res) => {
  const { userAge, userHeight, userWeight, userGender, userActivityLevel } = req.body;

  if (!userAge || !userHeight || !userWeight || !userGender || !userActivityLevel) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const userDetails = {
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


const getReportByID = async (req, res) => {
  const reportID = parseInt(req.params.reportID);
  console.log('Fetching report with ID:', reportID); //check report ID
  try {
    const healthReport = await HealthReport.getReportByID(reportID);
    if (!healthReport) {
      return res.status(404).send("health report not found");
    }
    res.json(healthReport);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving health report");
  }
};



module.exports = {
  saveUserDetails,
  getReportByID,
};
