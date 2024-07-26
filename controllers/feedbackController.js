const FeedbackModel = require('../models/feedbackModel'); // Ensure the path is correct

// Function to create a new feedback entry
const createFeedback = async (req, res) => {
  const { userID, comments } = req.body;

  // Validate input
  if (!userID || !comments) {
    return res.status(400).json({ error: 'User ID and comments are required.' });
  }

  try {
    // Create new feedback
    const feedback = await FeedbackModel.create({ userID, comments });

    console.log('Feedback created successfully with feedbackID:', feedback.feedbackID);

    // Respond with JSON indicating success
    res.status(201).json({ success: true, feedbackID: feedback.feedbackID });
  } catch (error) {
    console.error('Error creating feedback:', error);
    res.status(500).json({ error: 'Error saving feedback' });
  }
};


module.exports = {
    createFeedback,
  };