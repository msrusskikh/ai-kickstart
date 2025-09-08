export interface QuizMCQ {
  type: 'mcq';
  question: string;
  choices: string[];
  answer: string;
}

export interface QuizReflection {
  type: 'reflection';
  prompt: string;
}

export type Quiz = QuizMCQ | QuizReflection;

export interface LessonFrontmatter {
  slug: string;
  title: string;
  summary: string;
  duration: number;
  module: number;
  section: number;
  quiz?: Quiz[];
  content?: string;
  isLab?: boolean;
}

export interface Module {
  id: number;
  title: string;
  description: string;
  sections: LessonFrontmatter[];
}

export interface Progress {
  completedSections: Set<string>; // "module-section" format
  currentModule: number;
  currentSection: number;
  timeSpent: Record<string, number>; // "module-section" -> time in seconds
  sessionStartTime: number | null;
  quizAnswers: Record<string, boolean>; // "module-section-quizIndex" -> isCorrect
}

export interface SearchResult {
  module: number;
  section: number;
  title: string;
  summary: string;
  slug: string;
}
