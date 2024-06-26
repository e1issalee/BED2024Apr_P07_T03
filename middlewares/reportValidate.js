// validate.js
const validateUserDetails = (req, res, next) => {
  let { userAge, userHeight, userWeight, userGender, userActivityLevel } = req.body;

  userAge = parseInt(userAge); // Convert userAge to integer
  try {
    if (userHeight < 1.00 || userHeight > 2.00) {
      throw new Error('Height must be between 1.00 and 2.00 meters.');
    }

    if (!Number.isInteger(userAge) || userAge < 1) {
      throw new Error('Age must be a positive integer.');
    }

    if (userWeight < 0 || userWeight > 999.9 || !(/^\d+(\.\d)?$/.test(userWeight))) {
      throw new Error('Weight must be a positive number with up to one decimal place.');
    }

    if (!['M', 'F'].includes(userGender)) {
      throw new Error('Gender must be either "M" or "F".');
    }

    if (!['low', 'moderate', 'high'].includes(userActivityLevel)) {
      throw new Error('Activity Level must be either "low", "moderate", or "high".');
    }

    next();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = validateUserDetails;
