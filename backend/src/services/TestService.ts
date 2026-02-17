import { Test } from '../models/Test';
import logger from '../utils/logger';

export class TestService {
  /**
   * Get all tests with filtering
   */
  static async listTests(filters: {
    category?: string;
    difficulty?: string;
    subcategory?: string;
    skip?: number;
    limit?: number;
  }) {
    const {
      category,
      difficulty,
      subcategory,
      skip = 0,
      limit = 10,
    } = filters;

    const filter: any = { isActive: true };
    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;
    if (subcategory) filter.subcategories = subcategory;

    const tests = await Test.find(filter)
      .skip(skip)
      .limit(limit)
      .select('-questions') // Don't include questions in list
      .sort({ createdAt: -1 });

    const total = await Test.countDocuments(filter);

    return {
      tests,
      pagination: {
        total,
        skip,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get test by ID with full details
   */
  static async getTestById(testId: string) {
    const test = await Test.findById(testId);
    if (!test) {
      throw new Error('Test not found');
    }
    return test;
  }

  /**
   * Create new test
   */
  static async createTest(testData: any) {
    const test = new Test(testData);
    await test.save();
    logger.info(`Test created: ${test.title} by ${testData.createdBy}`);
    return test;
  }

  /**
   * Update test
   */
  static async updateTest(testId: string, updates: any) {
    // Don't allow changing createdBy or results-related fields
    delete updates._id;
    delete updates.createdBy;
    delete updates.createdAt;

    const test = await Test.findByIdAndUpdate(testId, updates, {
      new: true,
      runValidators: true,
    });

    if (!test) {
      throw new Error('Test not found');
    }

    logger.info(`Test updated: ${test.title}`);
    return test;
  }

  /**
   * Delete test (soft delete)
   */
  static async deleteTest(testId: string) {
    const test = await Test.findByIdAndUpdate(
      testId,
      { isActive: false },
      { new: true }
    );

    if (!test) {
      throw new Error('Test not found');
    }

    logger.info(`Test deleted: ${test.title}`);
    return test;
  }

  /**
   * Get test questions for student (without answers)
   */
  static async getTestQuestions(testId: string) {
    const test = await Test.findById(testId, {
      questions: 1,
      title: 1,
      duration: 1,
      totalPoints: 1,
    });

    if (!test) {
      throw new Error('Test not found');
    }

    // Remove correct answer indices from questions
    const questionsForStudent = test.questions.map((q) => ({
      _id: q._id,
      text: q.text,
      type: q.type,
      category: q.category,
      difficulty: q.difficulty,
      options: q.options,
      points: q.points,
    }));

    return {
      test: {
        _id: test._id,
        title: test.title,
        duration: test.duration,
        totalPoints: test.totalPoints,
      },
      questions: questionsForStudent,
    };
  }

  /**
   * Get test with full details (for admin/counselor)
   */
  static async getTestWithAnswers(testId: string) {
    const test = await Test.findById(testId);
    if (!test) {
      throw new Error('Test not found');
    }
    return test;
  }
}
