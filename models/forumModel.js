const sql = require('mssql');
const dbConfig = require('../dbConfig');

class ForumModel {
  constructor(postID, userID, userName, postContent, createdAt, likes, comments) {
    this.postID = postID;
    this.userID = userID;
    this.userName = userName;
    this.postContent = postContent;
    this.createdAt = createdAt;
    this.likes = likes;
    this.comments = comments;
  }

  // Method to create a new post entry
  static async create(postDetails) {
    const { userID, userName, postContent } = postDetails;
    const createdAt = new Date(); // Capture the current date and time

    try {
      const pool = await sql.connect(dbConfig);

      const result = await pool.request()
        .input('userID', sql.Int, userID)
        .input('userName', sql.NVarChar, userName)
        .input('postContent', sql.NVarChar, postContent)
        .input('createdAt', sql.DateTime, createdAt)
        .query(`
          INSERT INTO forumPosts (userID, userName, postContent, createdAt)
          OUTPUT INSERTED.postID
          VALUES (@userID, @userName, @postContent, @createdAt)
        `);

      return result.recordset[0]; // Return the inserted record with the postID
    } catch (error) {
      console.error('Database query error:', error.message);
      throw new Error('Database operation failed');
    } finally {
      sql.close(); // Ensure the connection is closed
    }
  }

  // Method to retrieve all posts
  static async getAllPosts() {
    try {
      const pool = await sql.connect(dbConfig);

      const result = await pool.request()
        .query(`
          SELECT postID, userID, userName, postContent, createdAt, likes, comments
          FROM forumPosts
          ORDER BY createdAt DESC
        `);

      return result.recordset.map(row => new ForumModel(
        row.postID,
        row.userID,
        row.userName,
        row.postContent,
        row.createdAt,
        row.likes || 0,
        row.comments || 0
      ));
    } catch (error) {
      console.error('Database query error:', error.message);
      throw new Error('Failed to retrieve posts');
    } finally {
      sql.close(); // Ensure the connection is closed
    }
  }

  // Method to get post ID by content
  static async getPostIdByContent(postContent) {
    try {
      const pool = await sql.connect(dbConfig);

      const result = await pool.request()
        .input('postContent', sql.NVarChar, postContent)
        .query(`
          SELECT postID
          FROM forumPosts
          WHERE postContent = @postContent
        `);

      if (result.recordset.length > 0) {
        return result.recordset[0].postID;
      } else {
        throw new Error('Post not found');
      }
    } catch (error) {
      console.error('Database query error:', error.message);
      throw new Error('Failed to retrieve post ID');
    } finally {
      sql.close(); // Ensure the connection is closed
    }
  }
  
  static async updatePostContent(postID, userID, newPostContent) {
    try {
        const pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .input('postID', sql.Int, postID)
            .input('userID', sql.Int, userID)
            .input('newPostContent', sql.NVarChar, newPostContent)
            .query(`
                UPDATE forumPosts
                SET postContent = @newPostContent
                WHERE postID = @postID AND userID = @userID;
            `);

        console.log('Post updated successfully:', result);
        return result;
    } catch (err) {
        console.error('Error updating post:', err);
        throw err;
    }
  }
}

module.exports = ForumModel;
