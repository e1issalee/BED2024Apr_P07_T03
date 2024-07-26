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

module.exports = {
  createPost,
  getAllPosts
};
