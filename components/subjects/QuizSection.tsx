"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, RotateCcw } from "lucide-react";
import type { QuizData } from "@/types";

interface QuizSectionProps {
  quizzes: QuizData[];
}

export function QuizSection({ quizzes }: QuizSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [finished, setFinished] = useState(false);

  const quiz = quizzes[currentIndex];
  const totalQuestions = quizzes.length;
  const correctCount = Object.values(answers).filter(Boolean).length;

  const handleOptionClick = (index: number) => {
    if (showResult) return;
    setSelectedOption(index);
    setShowResult(true);
    setAnswers((prev) => ({
      ...prev,
      [quiz.id]: index === quiz.answer,
    }));
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setShowResult(false);
    } else {
      setFinished(true);
    }
  };

  const handleRetry = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setShowResult(false);
    setAnswers({});
    setFinished(false);
  };

  if (!quizzes.length) return null;

  if (finished) {
    return (
      <div className="bg-[#141414] border border-[#2a2a2a] rounded-xl p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-orange-500/10 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 text-orange-500" />
        </div>
        <h3 className="text-xl font-semibold text-[#e5e5e5] mb-2">Quiz Complete!</h3>
        <p className="text-3xl font-bold text-orange-500 mb-2">
          {correctCount}/{totalQuestions} correct
        </p>
        <p className="text-[#a1a1aa] mb-6">
          {correctCount === totalQuestions
            ? "Perfect score! Great job!"
            : "Keep practicing to improve your score."}
        </p>
        <Button variant="primary" onClick={handleRetry}>
          <RotateCcw className="w-4 h-4 mr-2" />
          Retry Quiz
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-[#141414] border border-[#2a2a2a] rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-[#e5e5e5]">Practice Quiz</h3>
        <span className="text-sm text-[#a1a1aa]">
          Question {currentIndex + 1} of {totalQuestions}
        </span>
      </div>

      <div className="flex gap-1 mb-6">
        {quizzes.map((q, i) => (
          <div
            key={q.id}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-colors",
              answers[q.id] === undefined
                ? "bg-[#2a2a2a]"
                : answers[q.id]
                ? "bg-green-500"
                : "bg-red-500"
            )}
          />
        ))}
      </div>

      <p className="text-[#e5e5e5] font-medium mb-6">{quiz.question}</p>

      <div className="space-y-3">
        {quiz.options.map((option, index) => {
          const isSelected = selectedOption === index;
          const isCorrect = index === quiz.answer;
          const showCorrect = showResult && isCorrect;
          const showWrong = showResult && isSelected && !isCorrect;

          return (
            <button
              key={index}
              onClick={() => handleOptionClick(index)}
              disabled={showResult}
              className={cn(
                "w-full text-left px-4 py-3 rounded-lg border text-sm transition-all",
                "hover:border-orange-500/50 hover:bg-orange-500/5",
                !showResult && "border-[#2a2a2a] bg-[#1a1a1a] text-[#e5e5e5]",
                showCorrect &&
                  "border-green-500 bg-green-500/10 text-green-400",
                showWrong && "border-red-500 bg-red-500/10 text-red-400",
                isSelected && !showResult && "border-orange-500 bg-orange-500/10"
              )}
            >
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium shrink-0 border",
                    showCorrect && "border-green-500 bg-green-500/20",
                    showWrong && "border-red-500 bg-red-500/20",
                    !showResult && "border-[#2a2a2a] bg-[#141414]"
                  )}
                >
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="flex-1">{option}</span>
                {showCorrect && <CheckCircle2 className="w-5 h-5 shrink-0" />}
                {showWrong && <XCircle className="w-5 h-5 shrink-0" />}
              </div>
            </button>
          );
        })}
      </div>

      {showResult && (
        <div className="mt-6 space-y-4">
          <div
            className={cn(
              "p-4 rounded-lg border",
              selectedOption === quiz.answer
                ? "bg-green-500/5 border-green-500/20"
                : "bg-red-500/5 border-red-500/20"
            )}
          >
            <p
              className={cn(
                "font-medium mb-1",
                selectedOption === quiz.answer
                  ? "text-green-400"
                  : "text-red-400"
              )}
            >
              {selectedOption === quiz.answer ? "Correct!" : "Incorrect"}
            </p>
            {quiz.explanation && (
              <p className="text-sm text-[#a1a1aa]">{quiz.explanation}</p>
            )}
          </div>
          <Button variant="primary" onClick={handleNext} className="w-full">
            {currentIndex < totalQuestions - 1 ? "Next Question" : "See Results"}
          </Button>
        </div>
      )}
    </div>
  );
}
