# EduTrack — Student Course & Task Manager

## Project Overview
EduTrack is a portfolio-ready **Vanilla JavaScript capstone project** designed to help students organize coursework, tasks, learning progress, grades, and daily motivation in one dashboard. It is fully client-side, modular, and deployable as a static website (e.g., GitHub Pages).

## Problem It Solves
Students often manage learning across many scattered tools (notes, spreadsheets, to-do apps, calculators, etc.). EduTrack solves this by providing a single focused dashboard where users can:
- Track courses and assignments
- Monitor weekly JavaScript learning progress
- Calculate grades and quiz performance
- Save profile preferences and productivity data locally

## Features
- **Responsive dashboard layout** (desktop, tablet, mobile)
- **Profile manager** with preferred theme (light/dark)
- **Course manager** (add, edit, delete, search, filter, complete)
- **Task/assignment manager** (add, edit, delete, overdue highlighting, search, filter)
- **Learning progress tracker** for 16 JavaScript weeks with live progress bar
- **Grade calculator** with score validation, letter grade, pass/fail, persistence
- **Quiz practice** with scoring, explanations, best-score tracking
- **Password generator** with copy-to-clipboard support
- **Study quotes** with favorites and duplicate prevention
- **API resource demo** using `fetch` + async error handling + retry
- **JS practice tools** (calculator, guessing game, multiplication table, closure counter, delayed message)
- **LocalStorage persistence** for major user data

## Technologies Used
- HTML5
- CSS3
- Vanilla JavaScript (ES6+)
- ES6 Modules
- Browser LocalStorage API
- Fetch API

## JavaScript Concepts Practiced
This capstone specifically covers:
- Variables
- Data types
- Conditionals
- Functions
- Arrays
- Objects
- Loops
- DOM manipulation
- Events
- Async JavaScript
- Fetch API
- LocalStorage
- ES6 modules
- Debugging

## Folder Structure
```text
edutrack-student-dashboard/
├── index.html
├── README.md
├── css/
│   └── style.css
└── js/
    ├── app.js
    ├── data.js
    ├── storage.js
    ├── dashboard.js
    ├── profile.js
    ├── courses.js
    ├── tasks.js
    ├── progress.js
    ├── grades.js
    ├── quiz.js
    ├── password.js
    ├── quotes.js
    ├── api.js
    └── tools.js
```

## How to Run Locally
1. Clone the repository.
2. Open a terminal in the project root.
3. Run a simple local server:

```bash
python -m http.server
```

4. Open in your browser:

```text
http://localhost:8000/edutrack-student-dashboard/
```

> You can also use **VS Code Live Server**.

## How to Use the App
1. Start on the **Dashboard** to view summary cards.
2. Open **Profile** and save your details + theme preference.
3. Use **Courses** to manage course status and progress.
4. Use **Tasks** to track assignment deadlines and priorities.
5. Update **Progress** weekly as you complete JavaScript topics.
6. Calculate results in **Grades** and practice in **Quiz**.
7. Use **Password**, **Quotes**, **API**, and **JS Tools** for utilities and practice.

## Screenshots
_Add screenshots here after capturing UI states._

- Dashboard view: `./screenshots/dashboard.png`
- Course manager: `./screenshots/courses.png`
- Task manager: `./screenshots/tasks.png`
- Progress tracker: `./screenshots/progress.png`

## Live Demo
[Live Demo Link Placeholder](https://your-live-demo-link-here)

## GitHub Repository
[GitHub Repository Link Placeholder](https://github.com/your-username/your-repo-name)

## What I Learned
- How to structure a medium-sized app with **modular ES6 JavaScript files**
- How to design a reusable UI system using **cards, forms, and responsive grids**
- How to safely persist and retrieve state with **LocalStorage**
- How to build interactive tools with clean event-driven logic
- How to handle async APIs with `async/await`, loading states, and graceful errors
- How to improve accessibility and UX through focus states, labels, and validations

## Future Improvements
- Add drag-and-drop task ordering
- Add export/import backup for user data
- Add unit tests for utility and storage functions
- Add optional charts for progress analytics
- Add keyboard shortcuts and improved accessibility audits
- Add onboarding walkthrough for first-time users
