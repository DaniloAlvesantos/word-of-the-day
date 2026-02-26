"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { QuizDocumentType } from "@/types/firebase";
import { Brain, CheckCircle2, XCircle } from "lucide-react";
import { useState } from "react";

interface DefaultQuizProps {
  quizData: QuizDocumentType;
}

export function DefaultQuiz({ quizData }: DefaultQuizProps) {
  const [current, setCurrent] = useState(0);
  const currentQuestion = quizData.data[current];
  const totalSteps = quizData.data.length - 1;

  const handleNext = () => {
    setCurrent((prev) => prev + 1);
    console.log(current);
  };

  return (
    <CardQuiz
      quizItem={currentQuestion}
      currentStep={current}
      totalSteps={totalSteps}
      onNext={handleNext}
    />
  );
}

type QuizItem = QuizDocumentType["data"][number];

interface CardQuizProps {
  quizItem: QuizItem;
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
}

export function CardQuiz(props: CardQuizProps) {
  const {
    quizItem: { question, options, answer, explanation },
    currentStep,
    totalSteps,
    onNext,
  } = props;

  const [selected, setSelected] = useState<string | null>(null);

  const currentProgress = ((currentStep + 1) / (totalSteps + 1)) * 100;
  const isCorrect = selected === answer;

  const handleNextClick = () => {
    setSelected(null);
    onNext();
  };

  return (
    <Card className="w-full max-w-xl shadow-lg border-zinc-200">
      <CardHeader>
        <div className="flex justify-between items-center mb-2">
          <CardTitle className="inline-flex items-center gap-2 text-app-primary">
            <Brain className="size-5" /> Quick Quiz
          </CardTitle>
          <span className="text-xs font-medium text-zinc-400">
            Question {currentStep + 1} of {totalSteps + 1}
          </span>
        </div>
        <CardDescription className="text-zinc-800 font-medium text-lg">
          {question}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col gap-3">
          {options.map((option) => {
            const isAnswer = option === answer;
            const isUserSelection = option === selected;

            let variantClass = "bg-white border-zinc-200";
            if (selected) {
              if (isAnswer)
                variantClass =
                  "border-green-500 bg-green-50 text-green-700 ring-1 ring-green-500";
              if (isUserSelection && !isAnswer)
                variantClass =
                  "border-red-500 bg-red-50 text-red-700 ring-1 ring-red-500";
            }

            return (
              <Button
                key={option}
                variant="outline"
                disabled={!!selected}
                onClick={() => setSelected(option)}
                className={`h-auto w-full py-4 px-4 justify-start text-left whitespace-normal transition-all duration-300 disabled:opacity-100 ${variantClass}`}
              >
                <div className="flex items-center gap-3 w-full">
                  <span className="flex-1">{option}</span>
                  {selected && isAnswer && (
                    <CheckCircle2 className="size-5 text-green-600" />
                  )}
                  {selected && isUserSelection && !isAnswer && (
                    <XCircle className="size-5 text-red-600" />
                  )}
                </div>
              </Button>
            );
          })}
        </div>
      </CardContent>

      <CardFooter className="flex-col gap-4">
        {selected && (
          <div
            className={`w-full p-4 rounded-lg border text-sm animate-in fade-in slide-in-from-top-2 duration-500 ${
              isCorrect
                ? "bg-green-50/50 border-green-100 text-green-800"
                : "bg-zinc-50 border-zinc-200 text-zinc-700"
            }`}
          >
            <p className="font-bold mb-1">
              {isCorrect ? "Correct!" : "Context & Nuance:"}
            </p>
            {explanation}
          </div>
        )}

        <Progress
          value={currentProgress}
          className="h-2 [&>div]:bg-app-primary"
        />

        <div className="flex justify-end w-full">
          <Button
            onClick={handleNextClick}
            disabled={!selected || currentStep === totalSteps}
            className={`px-8 ${currentStep === totalSteps ? "bg-zinc-900" : "bg-app-primary hover:bg-app-primary/80"}`}
          >
            {currentStep === totalSteps
              ? "Finish Experience"
              : "Next Challenge"}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
