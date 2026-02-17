'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useTest } from '@/hooks/useTest';
import { ROUTES } from '@/constants';
import { IStudentAnswer } from '@/types';

export default function TestPage() {
  const router = useRouter();
  const params = useParams();
  const testId = params.id as string;
  const { isAuthenticated } = useAuth();
  const { currentTest, getTest, submitTest, isLoading } = useTest();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<IStudentAnswer[]>([]);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(ROUTES.LOGIN);
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated && testId) {
      getTest(testId);
    }
  }, [isAuthenticated, testId]);

  if (!isAuthenticated || !currentTest) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading test...</p>
        </div>
      </div>
    );
  }

  const currentQuestion = currentTest.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / currentTest.questions.length) * 100;

  const handleAnswerSelect = (optionIndex: number) => {
    const existingAnswer = answers.find((a) => a.questionId === currentQuestion.id);

    if (existingAnswer) {
      setAnswers(answers.map((a) =>
        a.questionId === currentQuestion.id
          ? { ...a, selectedOptionIndex: optionIndex }
          : a
      ));
    } else {
      setAnswers([
        ...answers,
        {
          questionId: currentQuestion.id,
          selectedOptionIndex: optionIndex,
        },
      ]);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < currentTest.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowConfirmation(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    setShowConfirmation(false);
    await submitTest(testId, answers);
    router.push(ROUTES.DASHBOARD_RESULTS);
  };

  const currentAnswer = answers.find((a) => a.questionId === currentQuestion.id);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-900">{currentTest.title}</h1>
            <button
              onClick={() => router.back()}
              className="text-gray-600 hover:text-gray-900"
            >
              ✕
            </button>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Question {currentQuestionIndex + 1} of {currentTest.questions.length}
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Question */}
          <div className="bg-white rounded-lg shadow p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{currentQuestion.text}</h2>

            {/* Options */}
            <div className="space-y-4">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                    currentAnswer?.selectedOptionIndex === index
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center ${
                      currentAnswer?.selectedOptionIndex === index
                        ? 'border-primary-600 bg-primary-600'
                        : 'border-gray-300'
                    }`}>
                      {currentAnswer?.selectedOptionIndex === index && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                    <span className="text-gray-900 font-medium">{option.text}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Metadata */}
            <div className="mt-8 pt-8 border-t border-gray-200 flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">Difficulty</p>
                <p className="font-semibold text-gray-900 capitalize">{currentQuestion.difficulty}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Category</p>
                <p className="font-semibold text-gray-900">{currentQuestion.category}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="px-6 py-2 bg-gray-300 text-gray-900 rounded-lg font-semibold hover:bg-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Previous
            </button>

            <div className="flex gap-2">
              {Array.from({ length: currentTest.questions.length }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuestionIndex(index)}
                  className={`w-10 h-10 rounded-lg font-semibold transition-colors ${
                    currentQuestionIndex === index
                      ? 'bg-primary-600 text-white'
                      : answers.some((a) => a.questionId === currentTest.questions[index].id)
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            <button
              onClick={handleNext}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              {currentQuestionIndex === currentTest.questions.length - 1 ? 'Finish' : 'Next →'}
            </button>
          </div>

          {/* Confirmation Dialog */}
          {showConfirmation && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Submit Test?</h3>
                <p className="text-gray-600 mb-2">
                  You have answered {answers.length} out of {currentTest.questions.length} questions.
                </p>
                <p className="text-gray-600 mb-6">
                  {answers.length < currentTest.questions.length && (
                    <>
                      {currentTest.questions.length - answers.length} question{currentTest.questions.length - answers.length !== 1 ? 's' : ''} {' '}
                      will not be scored. Are you sure you want to submit?
                    </>
                  )}
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={() => setShowConfirmation(false)}
                    className="flex-1 px-4 py-2 bg-gray-300 text-gray-900 rounded-lg font-semibold hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50"
                  >
                    {isLoading ? 'Submitting...' : 'Submit'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
