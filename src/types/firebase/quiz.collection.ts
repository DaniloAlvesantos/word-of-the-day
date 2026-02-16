export interface QuizCollectionType {
  sentence: string;
  options: QuizOption[];
}

type QuizOption = {
  option: string;
  isCorrect: boolean;
};
