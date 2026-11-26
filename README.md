# codetest-2611

React + TypeScript project built with Vite, Sass, [Bootstrap Icons](https://icons.getbootstrap.com/) and Vitest.

## Reflection

This was a fun test. After many months of working with agentic development, I got the opportunity to code manually again. The main thing I noticed was how much slower the development process becomes when writing the code myself. This functionality could probably have been implemented in less than an hour with the help of AI agents. What I gained instead was greater control over the code and, especially, the UI implementation.

What's interesting about an app like this is the possibilities for further development, especially considering what can now be achieved in a short amount of time with the help of AI agents.

Things that come to mind are user accounts with database integration, a rating system, and the ability for users to keep track of which shows and episodes they have watched. The app could also provide personalised recommendations based on genres and shows the user has previously liked.

## Getting started

```bash
npm install
npm run dev
```

## Scripts

| Script                  | Description                              |
| ----------------------- | ---------------------------------------- |
| `npm run dev`           | Start the dev server                     |
| `npm run build`         | Type-check and build for production      |
| `npm run preview`       | Preview the production build             |
| `npm test`              | Run the test suite once                  |
| `npm run test:watch`    | Run tests in watch mode                  |
| `npm run test:coverage` | Run tests with a coverage report         |
| `npm run typecheck`     | Type-check without building              |
| `npm run lint`          | Lint with oxlint                         |
| `npm run format`        | Format all files with Prettier           |
| `npm run format:check`  | Check formatting without writing changes |

## Project structure

```
src/
├── components/        Reusable UI components (component + .module.scss + .test.tsx)
├── pages/             Whole-page components (e.g. LandingPage)
├── styles/
│   ├── abstracts/     Design tokens, functions and mixins (no CSS output)
│   ├── base/          Reset and global typography (Inter)
│   └── main.scss      Global stylesheet entry point
├── test/              Test setup
├── App.tsx
└── main.tsx
```

## Testing

Tests use [Vitest](https://vitest.dev) with [React Testing Library](https://testing-library.com/docs/react-testing-library/intro)
and `@testing-library/jest-dom` matchers in a jsdom environment. Test files live next to the code they test as
`*.test.tsx`.
