import Document from "../models/Document.js";
import Flashcard from "../models/Flashcard.js";
import Quiz from "../models/Quiz.js";

export const getDashboard = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // 1. Run all independent queries in parallel to drastically improve load times
    const [
      totalDocuments,
      totalQuizzes,
      totalFlashcardSets,
      completedQuizzesCount,
      quizzesForScore,
      recentDocuments,
      recentQuizzes,
      flashcardStats,
    ] = await Promise.all([
      Document.countDocuments({ userId }),
      Quiz.countDocuments({ userId }),
      Flashcard.countDocuments({ userId }),
      Quiz.countDocuments({ userId, completedAt: { $ne: null } }),

      // Fetch only the score for calculation
      Quiz.find({ userId, completedAt: { $ne: null } })
        .select("score")
        .lean(),

      // Use .lean() for faster read-only queries
      Document.find({ userId })
        .sort({ lastAccessed: -1 })
        .limit(5)
        .select("title fileName lastAccessed status")
        .lean(),

      Quiz.find({ userId })
        .sort({ completedAt: -1 })
        .limit(5)
        .populate("documentId", "title")
        .select("title score totalQuestions completedAt")
        .lean(),

      // 2. Use MongoDB Aggregation to count cards directly in the database
      // This completely replaces the .forEach() loop that was causing your error
      Flashcard.aggregate([
        { $match: { userId } },
        { $unwind: "$cards" },
        {
          $group: {
            _id: null,
            totalCards: { $sum: 1 },
            reviewedCards: {
              $sum: { $cond: [{ $gt: ["$cards.reviewCount", 0] }, 1, 0] },
            },
            starredCards: {
              $sum: { $cond: [{ $eq: ["$cards.isStarred", true] }, 1, 0] },
            },
          },
        },
      ]),
    ]);

    // 3. Calculate Average Score safely
    const averageScore =
      quizzesForScore.length > 0
        ? Math.round(
            quizzesForScore.reduce((sum, q) => sum + q.score, 0) /
              quizzesForScore.length,
          )
        : 0;

    // 4. Handle Aggregation results (if user has no cards, default to 0)
    const stats = flashcardStats[0] || {
      totalCards: 0,
      reviewedCards: 0,
      starredCards: 0,
    };

    // Placeholder: This should eventually be pulled from your User model
    const studyStreak = 1;

    // 5. Send Response
    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalDocuments,
          totalFlashcardSets,
          totalFlashcards: stats.totalCards,
          reviewedFlashcards: stats.reviewedCards,
          starredFlashcards: stats.starredCards,
          totalQuizzes,
          completedQuizzes: completedQuizzesCount,
          averageScore,
          studyStreak,
        },
        recentActivity: {
          documents: recentDocuments,
          quizzes: recentQuizzes,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
