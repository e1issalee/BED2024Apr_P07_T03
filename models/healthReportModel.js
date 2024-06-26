const sql = require('mssql');
const dbConfig = require('../dbConfig');

class HealthReport {
  constructor(userAge, userHeight, userWeight, userGender, userActivityLevel) {
    this.userAge = userAge;
    this.userHeight = userHeight;
    this.userWeight = userWeight;
    this.userGender = userGender;
    this.userActivityLevel = userActivityLevel;
  }

  static async create(userDetails) {
    const { userAge, userHeight, userWeight, userGender, userActivityLevel } = userDetails;

    // Calculate BMI
    const userBMI = userWeight / (userHeight * userHeight);

    // Calculate BMR
    let bmr;
    if (userGender === 'F') {
      bmr = 655 + (9.6 * userWeight) + (1.8 * userHeight * 100) - (4.7 * userAge);
    } else if (userGender === 'M') {
      bmr = 66 + (13.7 * userWeight) + (5 * userHeight * 100) - (6.8 * userAge);
    }

    // Calculate suggested daily caloric intake
    let userDailyCaloricIntake;
    if (userActivityLevel === 'low') {
      userDailyCaloricIntake = bmr * 1.375;
    } else if (userActivityLevel === 'moderate') {
      userDailyCaloricIntake = bmr * 1.55;
    } else if (userActivityLevel === 'high') {
      userDailyCaloricIntake = bmr * 1.725;
    }

    // Calculate Body Fat Percentage
    let userBodyFatPercentage;
    if (userGender === 'F') {
      userBodyFatPercentage = (1.20 * userBMI) + (0.23 * userAge) - 5.4;
    } else if (userGender === 'M') {
      userBodyFatPercentage = (1.20 * userBMI) + (0.23 * userAge) - 16.2;
    }

    // Determine BMI Range
    let userBMIRange;
    if (userBMI >= 30.0) {
      userBMIRange = 'Obese';
    } else if (userBMI >= 23.0 && userBMI < 30.0) {
      userBMIRange = 'Overweight';
    } else if (userBMI >= 18.5 && userBMI < 23.0) {
      userBMIRange = 'Normal';
    } else {
      userBMIRange = 'Underweight';
    }

    // Determine Body Fat Percentage Range
    let userBFPRange;
    if (userGender === 'F') {
      if (userBodyFatPercentage >= 32) {
        userBFPRange = 'Obese, high body fat with increased health risks.';
      } else if (userBodyFatPercentage >= 25 && userBodyFatPercentage < 32) {
        userBFPRange = 'Average, generally healthy.';
      } else if (userBodyFatPercentage >= 21 && userBodyFatPercentage < 25) {
        userBFPRange = 'Lower than average body fat, fit and active.';
      } else if (userBodyFatPercentage >= 14 && userBodyFatPercentage < 21) {
        userBFPRange = 'Very low body fat, common in athletes.';
      } else if (userBodyFatPercentage >= 10 && userBodyFatPercentage < 14) {
        userBFPRange = 'Essential fat, minimum fat for bodily functions, very lean.';
      } else {
        userBFPRange = 'Extremely low body fat, may pose health risks.';
      }
    } else if (userGender === 'M') {
      if (userBodyFatPercentage >= 25) {
        userBFPRange = 'Too high body fat, increased health risks.';
      } else if (userBodyFatPercentage >= 18 && userBodyFatPercentage < 25) {
        userBFPRange = 'Average, generally healthy.';
      } else if (userBodyFatPercentage >= 14 && userBodyFatPercentage < 18) {
        userBFPRange = 'Lower than average body fat, fit and active.';
      } else if (userBodyFatPercentage >= 6 && userBodyFatPercentage < 14) {
        userBFPRange = 'Very low body fat, common in athletes.';
      } else if (userBodyFatPercentage >= 2 && userBodyFatPercentage < 6) {
        userBFPRange = 'Essential fat, minimum fat for bodily functions, very lean.';
      } else {
        userBFPRange = 'Extremely low body fat, may pose health risks.';
      }
    }

    try {
      let pool = await sql.connect(dbConfig);

      const result = await pool.request()
        .input('userAge', sql.Int, userAge)
        .input('userHeight', sql.Decimal(4, 2), userHeight)
        .input('userWeight', sql.Decimal(5, 2), userWeight)
        .input('userGender', sql.Char(1), userGender)
        .input('userActivityLevel', sql.VarChar(10), userActivityLevel)
        .input('userBMI', sql.Decimal(5, 2), userBMI)
        .input('userDailyCaloricIntake', sql.Decimal(10, 2), userDailyCaloricIntake)
        .input('userBodyFatPercentage', sql.Decimal(5, 2), userBodyFatPercentage)
        .input('userBMIRange', sql.VarChar(50), userBMIRange)
        .input('userBFPRange', sql.VarChar(50), userBFPRange)
        .query(`INSERT INTO userDetails (userAge, userHeight, userWeight, userGender, userActivityLevel, userBMI, userDailyCaloricIntake, userBodyFatPercentage, userBMIRange, userBFPRange)
                VALUES (@userAge, @userHeight, @userWeight, @userGender, @userActivityLevel, @userBMI, @userDailyCaloricIntake, @userBodyFatPercentage, @userBMIRange, @userBFPRange)`);
      
      return result.recordset; // Assuming you want to return the inserted record, adjust as per your needs
    } catch (error) {
      throw error;
    }
  }
}

module.exports = HealthReport;
