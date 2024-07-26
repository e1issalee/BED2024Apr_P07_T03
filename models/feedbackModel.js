const sql = require('mssql');
const dbConfig = require('../dbConfig');

class FeedbackModel {
  constructor(feedbackID, userID, comments, createdAt) {
    this.feedbackID = feedbackID;
    this.userID = userID;
    this.comments = comments;
    this.createdAt = createdAt;
  }

  // Method to create a new feedback entry
  static async create(feedbackDetails) {
    const { userID, comments } = feedbackDetails;
    const createdAt = new Date(); // Capture the current date and time

    try {
      const pool = await sql.connect(dbConfig);

      const result = await pool.request()
        .input('userID', sql.Int, userID)
        .input('comments', sql.NVarChar, comments)
        .input('createdAt', sql.DateTime, createdAt)
        .query(`
          INSERT INTO userFeedback (userID, comments, createdAt)
          OUTPUT INSERTED.feedbackID
          VALUES (@userID, @comments, @createdAt)
        `);

      return result.recordset[0]; // Return the inserted record with the feedbackID
    } catch (error) {
      throw error;
    } finally {
      sql.close(); // Ensure the connection is closed
    }
  }
}

module.exports = FeedbackModel;
