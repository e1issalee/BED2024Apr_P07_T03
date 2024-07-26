const sql = require('mssql');
const dbConfig = require('../dbConfig');

class ForumModel {
  constructor(postID, userID, postContent, createdAt) {
    this.postID = postID;
    this.userID = userID;
    this.userName = userName;
    this.postContent = postContent;
    this.createdAt = createdAt;
  }

  // Method to create a new post entry
  static async create(postDetails) {
    const { userID, userName, postContent } = postDetails;
    const createdAt = new Date(); // Capture the current date and time
    const postID = Date.now(); // Generate a unique post ID based on the current time

    try {
      const pool = await sql.connect(dbConfig);

      const result = await pool.request()
        .input('postID', sql.BigInt, postID)
        .input('userID', sql.Int, userID)
        .input('userName', sql.NVarChar, userName)
        .input('postContent', sql.NVarChar, postContent)
        .input('createdAt', sql.DateTime, createdAt)
        .query(`
          INSERT INTO forumPosts (postID, userID, userName, postContent, createdAt)
          OUTPUT INSERTED.postID
          VALUES (@postID, @userID, @userName, @postContent, @createdAt)
        `);

      return result.recordset[0]; // Return the inserted record with the postID
    } catch (error) {
      throw error;
    } finally {
      sql.close(); // Ensure the connection is closed
    }
  }
}

module.exports = ForumModel;
