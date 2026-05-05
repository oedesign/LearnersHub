export const STORAGE_KEYS = {
  APP_STATE: 'edutrack:app-state',
  QUIZ_QUESTIONS: 'edutrack:quiz-questions',
  QUOTES: 'edutrack:quotes',
  LEARNING_WEEKS: 'edutrack:learning-weeks'
};

export const defaultLearningWeeks = [
  'Variables and Data Types',
  'Conditionals',
  'Functions',
  'Arrays',
  'Objects',
  'Loops',
  'Strings and Math',
  'Errors and Review',
  'DOM Basics',
  'Events',
  'Async JavaScript',
  'Fetch and APIs',
  'LocalStorage',
  'Advanced Functions',
  'Modern JavaScript ES6+',
  'Review and Capstone'
];

export const defaultQuizQuestions = [
  { question: 'Which keyword declares a block-scoped variable?', answer: 'let' },
  { question: 'What data type is returned by typeof []?', answer: 'object' },
  { question: 'Which array method adds an item to the end?', answer: 'push' },
  { question: 'What does DOM stand for?', answer: 'Document Object Model' },
  { question: 'Which method converts JSON text into a JavaScript object?', answer: 'JSON.parse' },
  { question: 'Which operator checks value and type equality?', answer: '===' },
  { question: 'What keyword is used to handle errors?', answer: 'try...catch' },
  { question: 'Which loop is guaranteed to run at least once?', answer: 'do...while' },
  { question: 'Which function schedules code to run later?', answer: 'setTimeout' },
  { question: 'Which API stores key-value data in the browser?', answer: 'localStorage' },
  { question: 'What does async/await help manage?', answer: 'Promises' },
  { question: 'Which method requests data from a URL in modern JS?', answer: 'fetch' }
];

export const defaultQuotes = [
  'Small progress is still progress.',
  'Consistency beats intensity every time.',
  'Learn one concept deeply each day.',
  'Your future is built by what you practice now.',
  'Mistakes are proof that you are learning.',
  'Discipline is choosing goals over comfort.',
  'The expert was once a beginner.',
  'Stay curious, keep shipping.',
  'Done is better than perfect.',
  'Build, break, fix, repeat.'
];

export const defaultData = {
  profile: { name: 'Student Name', program: 'Computer Science', semester: 'Spring 2026' },
  courses: [
    { id: 1, title: 'JavaScript Fundamentals', credits: 3 },
    { id: 2, title: 'Data Structures', credits: 4 },
    { id: 3, title: 'UI/UX Basics', credits: 2 }
  ],
  tasks: [
    { id: 1, title: 'Finish dashboard wireframe', done: false },
    { id: 2, title: 'Study module patterns', done: true }
  ],
  grades: [
    { course: 'JavaScript Fundamentals', score: 89 },
    { course: 'Data Structures', score: 93 }
  ],
  learningWeeks: defaultLearningWeeks,
  quizQuestions: defaultQuizQuestions,
  quotes: defaultQuotes
};
