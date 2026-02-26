# Daily Usage Tracking Strategy (Neon + Prisma)

## 1. Atomic Upsert Strategy
- **Pattern**: Use Prisma's `upsert` combined with `count: { increment: 1 }`.
- **Reasoning**: In serverless environments, multiple concurrent requests can hit the same database record. `upsert` ensures that if a record for "Today" doesn't exist, it's created, and if it does, it's incremented atomically at the database level.
- **Race Conditions**: By using the `@@unique([userId, date])` constraint and atomic `increment`, we avoid "read-modify-write" cycles that lead to lost updates.

## 2. Reset Strategy
- **Zero-Maintenance Resets**: Resets happen **automatically** by virtue of the `date` key. When the calendar day changes, the `upsert` logic will fail to find a record for the new date and will trigger the `create` block instead of `update`.
- **Retention**: To keep the database lean, you can run a monthly cron job (e.g., via Vercel Cron or GitHub Actions) to delete records older than 30-90 days:
  ```typescript
  await prisma.usage.deleteMany({
    where: { date: { lt: thirtyDaysAgo } }
  });
  ```

## 3. Query Optimization
- **Indexing**: The `@@index([userId, date])` ensures that checking a user's usage for "Today" is an O(log N) operation rather than a full table scan.
- **Serverless Safety**: The use of the Prisma singleton ensures we don't exhaust Neon's connection pool during high-concurrency usage spikes.

## 4. Usage Example
```typescript
const usage = await incrementDailyUsage(user.id);
if (usage.count > DAILY_QUOTA) {
  throw new Error("Quota exceeded");
}
```
