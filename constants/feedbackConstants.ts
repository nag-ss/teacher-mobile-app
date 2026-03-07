export const PAGE_COUNT = 3;
export const ROLES = ['Teacher', 'Principal', 'Administrator'];

export const LIKERT_OPTIONS = [
  'Highly Likely',
  'Very Likely',
  'Neutral',
  'Unlikely',
  'Highly Unlikely',
];

export type FormState = {
  name: string;
  role: string;
  school: string;
  q1: string;
  q2: string;
  q3: string;
  q4: string;
  q5: string;
  q6: string;
  q7: string;
  q8: string;
};

export const initialForm: FormState = {
  name: '',
  role: '',
  school: '',
  q1: '',
  q2: '',
  q3: '',
  q4: '',
  q5: '',
  q6: '',
  q7: '',
  q8: '',
};

export type FeedbackQuestion = {
  key: keyof FormState;
  page: number;
  index: number;
  question: string;
  type: 'multiple_choice' | 'text';
  options?: string[];
  placeholder?: string;
};

export const FEEDBACK_QUESTIONS: FeedbackQuestion[] = [
  { key: 'q1', page: 1, index: 1, question: 'Do you like using our teacher app in the class ?', type: 'multiple_choice', options: LIKERT_OPTIONS },
  { key: 'q2', page: 1, index: 2, question: 'Do you think this will be helpful for the teachers to use in classroom?', type: 'multiple_choice', options: ['Yes', 'No'] },
  { key: 'q3', page: 1, index: 3, question: 'Was the navigation and flow intuitive/ feel natural to you?', type: 'multiple_choice', options: ['Yes', 'No'] },
  { key: 'q4', page: 2, index: 4, question: 'Will this help you to reduce the amount of time spent on correcting notes, assignments, and quizzes?', type: 'multiple_choice', options: LIKERT_OPTIONS },
  { key: 'q5', page: 2, index: 5, question: 'Which feature did you like the most in the teacher app and why?', type: 'text' },
  { key: 'q6', page: 2, index: 6, question: 'What did you not like about the experience?', type: 'text' },
  { key: 'q7', page: 3, index: 7, question: 'What are few things that you think if added to this app will help teachers the most?', type: 'text' },
  { key: 'q8', page: 3, index: 8, question: 'Please write down your thoughts on using superslate teacher app:', type: 'text' },
];
