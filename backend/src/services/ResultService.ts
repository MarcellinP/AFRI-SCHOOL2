import { Result, ICategoryScore, IRecommendation } from '../models/Result';
import { Test } from '../models/Test';
import { Program } from '../models/Program';
import logger from '../utils/logger';

interface StudentAnswerSubmission {
  questionId: string;
  selectedOptionIndex: number;
}

export class ResultService {
  /**
   * Calculate and score test result
   */
  static async scoreResult(
    testId: string,
    answers: StudentAnswerSubmission[],
    studentId: string,
    timeSpent: number
  ) {
    const test = await Test.findById(testId);
    if (!test) {
      throw new Error('Test not found');
    }

    // Score each answer
    let totalScore = 0;
    const scoredAnswers = answers.map((answer) => {
      const question = test.questions.find(
        (q) => q._id?.toString() === answer.questionId
      );

      if (!question) {
        logger.warn(`Question not found: ${answer.questionId}`);
        return {
          questionId: answer.questionId,
          selectedOptionIndex: answer.selectedOptionIndex,
          isCorrect: false,
          points: 0,
        };
      }

      const isCorrect = answer.selectedOptionIndex === question.correctOptionIndex;
      const points = isCorrect ? question.points : 0;
      totalScore += points;

      return {
        questionId: answer.questionId,
        selectedOptionIndex: answer.selectedOptionIndex,
        isCorrect,
        points,
        categoryScore: question.category,
      };
    });

    // Calculate scores by category
    const categoryScores = this.calculateCategoryScores(
      test.questions,
      scoredAnswers
    );

    // Calculate percentage
    const percentage = (totalScore / test.totalPoints) * 100;
    const status = percentage >= test.passingScore ? 'Passed' : 'Failed';

    return {
      totalScore,
      maxScore: test.totalPoints,
      percentage: Math.round(percentage),
      status,
      categoryScores,
      scoredAnswers,
      test,
    };
  }

  /**
   * Calculate scores by category
   */
  private static calculateCategoryScores(
    questions: any[],
    answers: any[]
  ): ICategoryScore[] {
    const categoryMap = new Map<
      string,
      { score: number; maxScore: number }
    >();

    // Initialize categories
    const categories = new Set<string>();
    questions.forEach((q) => categories.add(q.category));

    categories.forEach((cat) => {
      categoryMap.set(cat, { score: 0, maxScore: 0 });
    });

    // Calculate scores
    questions.forEach((question) => {
      const answer = answers.find(
        (a) => a.questionId === question._id?.toString()
      );
      const category = question.category;
      const catData = categoryMap.get(category)!;

      catData.maxScore += question.points;
      if (answer?.isCorrect) {
        catData.score += question.points;
      }
    });

    // Convert to array with percentages
    const result: ICategoryScore[] = [];
    categoryMap.forEach((data, category) => {
      const percentage =
        data.maxScore > 0
          ? Math.round((data.score / data.maxScore) * 100)
          : 0;
      result.push({
        category,
        score: data.score,
        maxScore: data.maxScore,
        percentage,
      });
    });

    // Sort by score descending
    return result.sort((a, b) => b.percentage - a.percentage);
  }

  /**
   * Generate recommendations based on test results
   */
  static async generateRecommendations(
    categoryScores: ICategoryScore[],
    studentId: string
  ): Promise<IRecommendation[]> {
    try {
      // Sort categories by performance (strongest first)
      const sortedCategories = [...categoryScores].sort(
        (a, b) => b.percentage - a.percentage
      );

      // Get top performing categories
      const topCategories = sortedCategories
        .slice(0, 3) // Top 3 categories
        .map((c) => c.category);

      if (topCategories.length === 0) {
        return [];
      }

      // Find programs matching top categories
      const programs = await Program.find({
        isActive: true,
        $or: topCategories.map((cat) => ({
          field: { $regex: cat, $options: 'i' },
        })),
      }).limit(10);

      // Create recommendations
      const recommendations: IRecommendation[] = [];

      programs.forEach((program) => {
        // Calculate match score based on category performance
        let totalMatchScore = 0;
        let matchingCategoriesCount = 0;

        topCategories.forEach((category) => {
          const catScore = categoryScores.find(
            (c) => c.category.toLowerCase() === category.toLowerCase()
          );

          if (catScore && catScore.percentage >= 60) {
            totalMatchScore += catScore.percentage;
            matchingCategoriesCount++;
          }
        });

        if (matchingCategoriesCount > 0) {
          const matchScore = Math.round(
            totalMatchScore / matchingCategoriesCount
          );

          // Get strengths and weaknesses
          const strengths: string[] = [];
          const weaknesses: string[] = [];

          categoryScores.forEach((cat) => {
            if (cat.percentage >= 75) {
              strengths.push(
                `Excellent ${cat.category} skills (${cat.percentage}%)`
              );
            } else if (cat.percentage < 50) {
              weaknesses.push(
                `Need improvement in ${cat.category} (${cat.percentage}%)`
              );
            }
          });

          recommendations.push({
            programId: program._id.toString(),
            programName: program.name,
            matchScore,
            reason: `Your strong ${topCategories.join(
              ', '
            )} skills align well with ${program.name}`,
            strengths: strengths.slice(0, 3),
            weaknesses: weaknesses.slice(0, 2),
          });
        }
      });

      // Sort by match score and return top 3
      return recommendations
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 3);
    } catch (error) {
      logger.error('Error generating recommendations:', error);
      return [];
    }
  }

  /**
   * Save result to database
   */
  static async saveResult(
    testId: string,
    studentId: string,
    scoreData: any,
    startTime: Date,
    endTime: Date,
    timeSpent: number
  ) {
    // Get existing attempts
    const existingResults = await Result.countDocuments({
      testId,
      studentId,
    });

    const result = new Result({
      testId,
      studentId,
      answers: scoreData.scoredAnswers,
      totalScore: scoreData.totalScore,
      maxScore: scoreData.maxScore,
      percentage: scoreData.percentage,
      status: scoreData.status,
      categoryScores: scoreData.categoryScores,
      recommendations: scoreData.recommendations,
      startTime,
      endTime,
      timeSpent,
      attemptNumber: existingResults + 1,
    });

    await result.save();
    logger.info(
      `Result saved for student ${studentId} on test ${testId}: ${scoreData.percentage}%`
    );

    return result;
  }

  /**
   * Get results for student
   */
  static async getStudentResults(
    studentId: string,
    skip: number = 0,
    limit: number = 10
  ) {
    const results = await Result.find({ studentId })
      .populate('testId', 'title category difficulty')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Result.countDocuments({ studentId });

    return {
      results,
      pagination: {
        total,
        skip,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get single result with recommendations
   */
  static async getResultById(resultId: string) {
    const result = await Result.findById(resultId)
      .populate('testId', 'title category difficulty totalPoints')
      .populate('studentId', 'firstName lastName email');

    if (!result) {
      throw new Error('Result not found');
    }

    return result;
  }

  /**
   * Get recommendations from result
   */
  static async getRecommendations(resultId: string) {
    const result = await Result.findById(resultId);

    if (!result) {
      throw new Error('Result not found');
    }

    if (!result.recommendations || result.recommendations.length === 0) {
      return {
        recommendations: [],
        message: 'No recommendations available yet',
      };
    }

    return {
      recommendations: result.recommendations,
      topMatch: result.recommendations[0],
      allMatches: result.recommendations,
    };
  }

  /**
   * Get student statistics
   */
  static async getStudentStatistics(studentId: string) {
    const results = await Result.find({ studentId }).sort({ createdAt: -1 });

    if (results.length === 0) {
      return {
        totalTests: 0,
        averageScore: 0,
        passedTests: 0,
        failedTests: 0,
        categoryPerformance: [],
      };
    }

    const passedTests = results.filter((r) => r.status === 'Passed').length;
    const failedTests = results.filter((r) => r.status === 'Failed').length;
    const averageScore = Math.round(
      results.reduce((sum, r) => sum + r.percentage, 0) / results.length
    );

    // Calculate category performance
    const categoryStats = new Map<string, { score: number; count: number }>();
    results.forEach((result) => {
      result.categoryScores.forEach((cat) => {
        const existing = categoryStats.get(cat.category) || {
          score: 0,
          count: 0,
        };
        existing.score += cat.percentage;
        existing.count++;
        categoryStats.set(cat.category, existing);
      });
    });

    const categoryPerformance = Array.from(categoryStats.entries()).map(
      ([category, data]) => ({
        category,
        averageScore: Math.round(data.score / data.count),
      })
    );

    return {
      totalTests: results.length,
      averageScore,
      passedTests,
      failedTests,
      passRate: Math.round((passedTests / results.length) * 100),
      categoryPerformance,
      latestResults: results.slice(0, 5),
    };
  }
}
