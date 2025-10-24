import React, { useState } from 'react';

interface QuizQuestion {
  question: string;
  options?: string[]; // If present, render as multiple choice
  type: 'multiple' | 'text';
}

interface QuizModalProps {
  open: boolean;
  onClose: () => void;
  quizTitle: string;
  quizDescription: string;
  questions: QuizQuestion[];
}

export type { QuizQuestion };

const QuizModal: React.FC<QuizModalProps> = ({ open, onClose, quizTitle, quizDescription, questions }) => {
  const [answers, setAnswers] = useState<(string | null)[]>(Array(questions.length).fill(null));
  const [error, setError] = useState('');

  if (!open) return null;

  const handleChange = (idx: number, value: string) => {
    setAnswers((prev) => {
      const copy = [...prev];
      copy[idx] = value;
      return copy;
    });
  };

  const handleClear = () => {
    setAnswers(Array(questions.length).fill(null));
    setError('');
  };

  const handleSubmit = () => {
    // Simple validation: all questions answered
    if (answers.some((a) => !a)) {
      setError('Please answer all questions.');
      return;
    }
    const quizResult = {
      quizTitle,
      answers,
      submittedAt: new Date().toISOString(),
    };
    // Save to localStorage
    const key = `quizResult_${quizTitle.replace(/\s+/g, '_')}`;
    localStorage.setItem(key, JSON.stringify(quizResult));
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="relative w-full max-w-lg p-6 bg-white shadow-2xl rounded-2xl">
        <button
          className="absolute text-2xl font-bold text-gray-400 top-3 right-4 hover:text-pink-500"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <h2 className="mb-2 text-2xl font-bold text-pink-600">{quizTitle}</h2>
        <p className="mb-6 text-gray-600">{quizDescription}</p>
        <form onSubmit={e => { e.preventDefault(); handleSubmit(); }}>
          <div className="mb-4 space-y-5">
            {questions.map((q, idx) => (
              <div key={idx}>
                <label className="block mb-1 font-semibold text-gray-800">
                  {idx + 1}. {q.question}
                </label>
                {q.type === 'multiple' && q.options ? (
                  <div className="space-y-1">
                    {q.options.map((opt, oidx) => (
                      <label key={oidx} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`q${idx}`}
                          value={opt}
                          checked={answers[idx] === opt}
                          onChange={() => handleChange(idx, opt)}
                        />
                        {opt}
                      </label>
                    ))}
                  </div>
                ) : (
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded"
                    value={answers[idx] || ''}
                    onChange={e => handleChange(idx, e.target.value)}
                  />
                )}
              </div>
            ))}
          </div>
          {error && <div className="mb-2 text-red-500">{error}</div>}
          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              className="px-4 py-2 font-semibold text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
              onClick={handleClear}
            >
              Clear
            </button>
            <button
              type="submit"
              className="px-4 py-2 font-semibold text-white rounded bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuizModal; 