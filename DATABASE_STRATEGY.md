# Database Strategy: Scalable SaaS with Prisma & Neon

## 1. Multi-tenant Architecture
- **Tenant Isolation**: Every model (except global lookups) contains an `organizationId`. 
- **Application Logic**: Ensure all queries include `where: { organizationId }` to enforce isolation.
- **Scalability**: This design supports both shared-database (multi-tenant) and can be adapted for separate schemas if needed.

## 2. Optimized Indexing Strategy
- **Partial/Compound Indexes**:
    - `@@index([organizationId, date])` on `UsageLimit` for fast daily lookups.
    - `@@index([organizationId, createdAt])` on `Generation` for efficient dashboard timelines.
- **Unique Constraints**:
    - `@@unique([organizationId, type, date])` on `UsageLimit` prevents double-counting and facilitates `upsert` operations.
- **Foreign Keys**: All relation fields are indexed to avoid full table scans on joins.

## 3. Relation Explanation
- **Organization ↔ User**: One-to-many. A user belongs to one org (can be expanded to many-to-many with a Membership table).
- **Organization ↔ CreditBalance**: One-to-one. Centralized credit pool for the entire team.
- **Organization ↔ UsageLimit**: One-to-many (by type/date). Tracks daily quotas.
- **Generation ↔ User/Org**: Dual relations. Allows auditing both "who did it" and "which billable entity pays for it".

## 4. Avoiding N+1 Queries
- **Prisma Joins**: Prefer using `include` or `select` within a single batch query.
- **Aggregation**: Use Prisma's `aggregate` and `groupBy` for usage stats instead of fetching individual records.
- **Credit Checks**: Perform credit balance checks as part of the transaction when creating a `Generation` to ensure atomicity.

## 5. Serverless Optimization (Neon)
- **Direct vs Pooled**:
    - Use `DIRECT_URL` for migrations and heavy schema changes.
    - Use `DATABASE_URL` (with pooled connection) for runtime queries in serverless functions.
- **Connection Health**: The singleton pattern in `src/lib/prisma.ts` handles the lifecycle efficiently.
