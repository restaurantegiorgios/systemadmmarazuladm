# AI Development Rules

This document outlines the rules and conventions for AI-driven development of this application. Following these guidelines ensures consistency, maintainability, and adherence to the project's architectural principles.

## Tech Stack

This project is built with a modern, type-safe, and efficient technology stack:

-   **Framework**: React with Vite for a fast development experience.
-   **Language**: TypeScript for static typing and improved code quality.
-   **UI Components**: A custom component library built with shadcn/ui, providing accessible and reusable components.
-   **Styling**: Tailwind CSS for a utility-first styling approach.
-   **Routing**: React Router (`react-router-dom`) for client-side navigation.
-   **State Management**: React Context for global UI state and TanStack Query for server state management (caching, fetching, mutations).
-   **Forms**: React Hook Form with Zod for performant and type-safe form handling and validation.
-   **Icons**: Lucide React for a comprehensive and consistent set of icons.
-   **Notifications**: Sonner for simple and elegant toast notifications.

## Library Usage and Coding Conventions

### 1. UI and Components

-   **Primary Component Library**: ALWAYS use components from `src/components/ui` (shadcn/ui). Do not install other component libraries like Material-UI or Ant Design.
-   **Custom Components**: If a required component does not exist in the UI library, create a new, reusable component inside `src/components`. Keep components small and focused on a single responsibility.
-   **Styling**: Use Tailwind CSS utility classes for all styling. Avoid custom CSS files (`.css`). Use the `cn` utility from `src/lib/utils.ts` to conditionally apply classes.
-   **Layout**: Pages should be created in the `src/pages` directory. The main application layout and routing structure are defined in `src/App.tsx`.

### 2. State Management

-   **Global UI State**: For state that needs to be shared across many components (e.g., user authentication, theme, language), use React Context. Create new contexts in the `src/contexts` directory.
-   **Server State**: For any data fetched from an API or that needs caching, synchronization, or optimistic updates, ALWAYS use TanStack Query (`@tanstack/react-query`). Do not use `useState` or `useEffect` for fetching data.

### 3. Forms

-   **Form Logic**: Use `react-hook-form` for handling all forms.
-   **Validation**: Use `zod` to define validation schemas for forms. Connect Zod schemas to `react-hook-form` using `@hookform/resolvers`.

### 4. Routing and Navigation

-   **Routing**: All application routes must be managed using `react-router-dom`.
-   **Route Definitions**: Define all routes in the `<Routes>` component within `src/App.tsx`.
-   **Navigation**: Use the `useNavigate` hook for programmatic navigation and the `<Link>` component for declarative navigation.

### 5. Icons and Notifications

-   **Icons**: Exclusively use icons from the `lucide-react` package.
-   **User Feedback**: Use the `sonner` library to provide non-intrusive feedback to the user via toast notifications for actions like form submissions, errors, or successful operations.

### 6. General Rules

-   **File Structure**: Maintain the existing file structure (`src/pages`, `src/components`, `src/contexts`, `src/hooks`, `src/lib`).
-   **TypeScript**: Write all new code in TypeScript. Use strong types and avoid `any` whenever possible.
-   **Dependencies**: Do not add new dependencies unless absolutely necessary. The current stack is comprehensive.