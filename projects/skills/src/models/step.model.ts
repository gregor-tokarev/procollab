/** @format */

export interface InfoSlide {
  text: string;
  files: string[];
}

export interface ConnectQuestion {
  connectLeft: { id: number; text: string }[];
  connectRight: { id: number; text: string }[];
  description: string;
  files: string[];
  id: number;
  isAnswered: boolean;
  questionText: string;
}
export type ConnectQuestionRequest = { leftId: number; rightId: number }[];
export type ConnectQuestionResponse = {
  leftId: number;
  rightId: number;
  isCorrect: boolean;
}[];

export interface SingleQuestion {
  answers: { id: number; text: string }[];
  description: string;
  files: string[];
  id: number;
  isAnswered: boolean;
  questionText: string;
}
export interface SingleQuestionError {
  correctAnswer: number;
  isCorrect: boolean;
}

export interface ExcludeQuestion {
  answers: { id: number; text: string }[];
  description: string;
  files: string[];
  id: number;
  isAnswered: boolean;
  questionText: string;
}
export interface ExcludeQuestionResponse {
  isCorrect: boolean;
  wrongAnswers: number[];
}

export type StepType = InfoSlide | ConnectQuestion | SingleQuestion | ExcludeQuestion;
