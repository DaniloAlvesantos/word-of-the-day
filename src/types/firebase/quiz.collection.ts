import { Timestamp } from "firebase-admin/firestore";

export interface QuizCollectionType {
  statement: string;
  slug: string;
  mode: string;
  data: {
    question: string;
    options: string[];
    answer: string;
    explanation: string;
  }[];
  updatedAt: Timestamp;
}

export interface QuizDocumentType extends Omit<QuizCollectionType, "updatedAt"> {
  updatedAt: string;
}