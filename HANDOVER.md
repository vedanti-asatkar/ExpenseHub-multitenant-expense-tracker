\# ExpenseHub — Project Handover Doc



This doc will get you from a fresh clone to a fully running local instance, and 

gives you the context you need to pick up work on the receipt upload feature.



\## What this project is



ExpenseHub is a multi-tenant SaaS expense tracker built for our cloud computing 

course project. Multiple organizations can use the same app while their data 

stays completely isolated from each other.



\*\*Tech stack\*\*: Next.js 16 (App Router), TypeScript, Tailwind CSS, shadcn/ui, 

Clerk (auth + organizations), Drizzle ORM, PostgreSQL.



\## Prerequisites



\- \*\*Node.js v22 or later\*\* — this matters, the project will fail with older 

&#x20; versions. Check with `node --version`. If you have multiple Node versions 

&#x20; installed, consider using `nvm` to manage them.

\- \*\*Git\*\*

\- A free \*\*Clerk\*\* account (clerk.com) — for authentication keys



\## Setup steps



\### 1. Clone the repo

```bash

git clone https://github.com/kalyani8063/multitenant-expense-tracker.git

cd multitenant-expense-tracker

```



\### 2. Install dependencies

```bash

npm install

```

This takes a few minutes. You may see `EBADENGINE` warnings or dependency 

vulnerability warnings — these are normal, ignore them unless something says 

"ERROR" in red.



\### 3. Set up Clerk (authentication)

1\. Sign up at https://clerk.com (free)

2\. Create a new application

3\. Go to the API Keys page, copy your \*\*Publishable key\*\* and \*\*Secret key\*\*



\### 4. Create your environment file

Create a new file called `.env.local` in the project root (this file is 

gitignored — never commit it):

```bash

CLERK\_SECRET\_KEY=sk\_test\_your\_actual\_secret\_key

NEXT\_PUBLIC\_CLERK\_PUBLISHABLE\_KEY=pk\_test\_your\_actual\_publishable\_key

```



\### 5. Start the local database

Open a terminal, run this, and \*\*leave it running\*\*:

```bash

npx pglite-server -m 100 --db=local.db

```



\### 6. Run the database migration

In a \*\*second terminal\*\*:

```bash

npm run db:migrate

```



\### 7. Start the app

Still in that second terminal:

```bash

npx next dev

```



\### 8. Open the app

Go to http://localhost:3000 in your browser. Sign up, create a test 

organization, and confirm you can add/view expenses.



\## Known gotchas



\- \*\*`npm run dev` (the combined script) may fail silently on Windows\*\* with a 

&#x20; `spawn npm ENOENT` error inside `pglite-server`. Workaround: run the database 

&#x20; (`npx pglite-server...`) and the app (`npx next dev`) as two separate commands 

&#x20; in two separate terminals, as shown above — don't rely on the single 

&#x20; `npm run dev` command.

\- \*\*Pre-commit hooks (lefthook) can fail even when the code is actually fine\*\* — 

&#x20; if `git commit` gets blocked by `check-types` or `knip` failing, but running 

&#x20; `npm run check:types` and `npx knip` manually both pass clean, it's safe to 

&#x20; commit with `git commit -m "..." --no-verify`.

\- If Node version conflicts happen (multiple Node installs, PATH issues), the 

&#x20; cleanest fix is usually: uninstall extra versions, keep one clean install 

&#x20; (or use `nvm`), and make sure only one `node.exe` is reachable via `where node`.



\## Project structure (what matters)
src/

├── app/\[locale]/(auth)/dashboard/

│ ├── page.tsx # Dashboard homepage (expense summary)

│ ├── layout.tsx # Dashboard nav (Expenses, Members, Settings)

│ └── expenses/page.tsx # Main expenses page

├── features/expenses/

│ ├── ExpenseTenant.ts # CRITICAL — reads userId/orgId from Clerk auth()

│ ├── ExpenseQueries.ts # All database queries for expenses (READ THIS)

│ ├── ExpenseActions.ts # Server action for creating an expense

│ ├── ExpenseForm.tsx # The add-expense form (client component)

│ └── ExpenseList.tsx # The expense list/table (server component)

├── models/Schema.ts # Database schema — expense table is here

└── libs/DB.ts # Database connection setup



\## Important: tenant isolation rules — READ BEFORE YOU CODE



This is the most important thing to understand before making changes:



1\. \*\*The organization ID is NEVER trusted from user input.\*\* It always comes 

&#x20;  from `getExpenseTenant()` in `ExpenseTenant.ts`, which reads it from Clerk's 

&#x20;  `auth()` session on the server. Never add an `organizationId` field to a 

&#x20;  form, never accept it as a function parameter from the client.



2\. \*\*All database queries touching the `expense` table must live in 

&#x20;  `ExpenseQueries.ts`.\*\* If you write a new query somewhere else, it won't be 

&#x20;  automatically tenant-scoped — you have to remember to call 

&#x20;  `getExpenseTenant()` yourself and filter by `organizationId`.



3\. \*\*If you add "view/edit/delete a specific expense" features\*\* (e.g. 

&#x20;  `/expenses/\[id]`), you MUST filter by both the expense ID \*and\* the 

&#x20;  organization ID together — e.g. 

&#x20;  `where(and(eq(expenseSchema.id, id), eq(expenseSchema.organizationId, orgId)))`. 

&#x20;  Filtering by ID alone lets one org access another org's data by guessing IDs 

&#x20;  (a real vulnerability called IDOR).



\## Your task: Receipt upload feature



Here's what needs to be built:



1\. \*\*Add a `receiptUrl` field\*\* to the `expense` table in `src/models/Schema.ts` 

&#x20;  (text field, nullable — not every expense needs a receipt)

2\. Run `npm run db:generate` then `npm run db:migrate` to apply the schema change

3\. \*\*Add a file input\*\* to `ExpenseForm.tsx` for uploading a receipt image

4\. \*\*Wire the upload\*\* — for local development, you can start by saving files 

&#x20;  locally or using a placeholder; the final version needs to upload to 

&#x20;  \*\*Google Cloud Storage\*\* and save the resulting URL in `receiptUrl`

5\. \*\*Display the receipt\*\* (thumbnail or link) in `ExpenseList.tsx` if one exists



Follow the same tenant-isolation pattern as the rest of the expense feature — 

every receipt upload must be tied to the correct organization.





