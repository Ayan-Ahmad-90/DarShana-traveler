const Review = require('../models/Review');

exports.createReview = async (req, res) => {
  try {
    const { targetId, targetType, rating, comment } = req.body;
    const review = new Review({
      userId: req.userId,
      targetId,
      targetType,
      rating,
      comment,
    });
    await review.save();
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create review', error: error.message });
  }
};

exports.getReviews = async (req, res) => {
  try {
    const { targetId } = req.params;
    const reviews = await Review.find({ targetId }).populate('userId', 'fullName profileImage');
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch reviews', error: error.message });
  }
};
