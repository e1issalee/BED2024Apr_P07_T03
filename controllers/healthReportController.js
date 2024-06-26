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
    userActivityLevel
  };

  try {
    // Create a new health report instance
    const newReport = await HealthReport.create(userDetails);

    console.log('User details saved successfully:', newReport);

    // Respond with JSON indicating success
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error creating user details:', error);
    res.status(500).json({ error: 'Error saving user details' });
  }
};

module.exports = {
  saveUserDetails,
};
