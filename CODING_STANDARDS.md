# SaaS Project Coding Standards

## 1. Project Structure
- `src/app/`: App Router pages and layouts.
- `src/components/`: Reusable React components.
- `src/lib/`: Shared utility libraries and client instances (Prisma, Stripe).
- `src/actions/`: Next.js Server Actions for data mutations.
- `src/hooks/`: Custom React hooks.
- `src/types/`: TypeScript definitions.
- `src/utils/`: Pure helper functions.

## 2. Naming Conventions
- **Components**: PascalCase (e.g., `UserAvatar.tsx`).
- **Hooks**: camelCase starting with `use` (e.g., `useAuth.ts`).
- **Server Actions**: camelCase (e.g., `createUserAction.ts`).
- **Utilities**: camelCase (e.g., `formatCurrency.ts`).

## 3. Best Practices
- **Server Components by Default**: Use Client Components only when necessary (interactivity, hooks).
- **Type Safety**: Avoid using `any`. Define interfaces for all data structures.
- **Server Actions**: Use Server Actions for all form submissions and data mutations.
- **Prisma**: Always use the global Prisma singleton from `src/lib/prisma.ts`.
- **Environment Variables**: Add all variables to `.env.example` and validate them at runtime where possible.

## 4. Error Handling
- Use `error.tsx` at the route level for UI-friendly error states.
- Wrap complex logic in `try-catch` blocks and log errors appropriately.
- Use explicit return types for Server Actions (e.g., `{ success: boolean, data?: any, error?: string }`).

## 5. Performance
- Use `next/image` for image optimization.
- Leverage `loading.tsx` for visual skeleton states.
- Minimize Client Component payload size.
