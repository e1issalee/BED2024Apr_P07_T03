const ForumModel = require('../models/forumModel'); // Ensure the path is correct

// Function to create a new forum post
const createPost = async (req, res) => {
  const { userID, userName, postContent } = req.body;

  // Validate input
  if (!userID || !userName || !postContent) {
    return res.status(400).json({ error: 'User ID and post content are required.' });
  }

  try {
    // Create new post
    const post = await ForumModel.create({ userID, userName, postContent });

    console.log('Post created successfully with postID:', post.postID);

    // Respond with JSON indicating success
    res.status(201).json({ success: true, postID: post.postID });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Error saving post' });
  }
};

// Function to get all posts
const getAllPosts = async (req, res) => {
    try {
      const posts = await ForumModel.getAllPosts();
      res.status(200).json(posts);
    } catch (error) {
      console.error('Error retrieving posts:', error.message);
      res.status(500).json({ error: 'Failed to retrieve posts' });
    }
  };

  // Function to get post ID by content
const getPostIdByContent = async (req, res) => {
  const { postContent } = req.body;

  if (!postContent) {
    return res.status(400).json({ error: 'Post content is required to find the post ID.' });
  }

  try {
    const postID = await ForumModel.getPostIdByContent(postContent);
    res.status(200).json({ postID });
  } catch (error) {
    console.error('Error getting post ID:', error.message);
    res.status(500).json({ error: 'Failed to get post ID' });
  }
};

const updatePostContent = async (req, res) => {
  // Extract postID from URL parameters and userID, newPostContent from request body
  const { postID } = req.params;
  const { userID, postContent } = req.body;

  console.log('Received update request:', { postID, userID, postContent });

  // Validate parameters
  if (!postID || !userID || !postContent) {
      return res.status(400).json({ error: 'Invalid request data' });
  }

  try {
      // Update post content in the database
      await ForumModel.updatePostContent(postID, userID, postContent);

      // Respond with success message
      res.json({ message: 'Post updated successfully', postID });
  } catch (err) {
      console.error('Error updating post:', err);

      // Respond with error message
      res.status(500).json({ error: 'Failed to update post content' });
  }
};

module.exports = {
  createPost,
  getAllPosts,
  getPostIdByContent,
  updatePostContent
};