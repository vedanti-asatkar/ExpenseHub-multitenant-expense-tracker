import type { CreateExpenseInput } from './ExpenseValidation';
import { desc, eq } from 'drizzle-orm';
import { db } from '@/libs/DB';
import { expenseSchema } from '@/models/Schema';
import { getExpenseTenant } from './ExpenseTenant';

/**
 * Lists the expenses of the caller's organization, newest first.
 *
 * The `organizationId` filter comes from the Clerk session, so this query can
 * never return rows belonging to another tenant.
 * @returns The expenses owned by the active organization.
 */
export const getOrganizationExpenses = async () => {
  const { organizationId } = await getExpenseTenant();

  return db
    .select()
    .from(expenseSchema)
    .where(eq(expenseSchema.organizationId, organizationId))
    .orderBy(desc(expenseSchema.date), desc(expenseSchema.id));
};

/**
 * Inserts an expense for the caller's organization.
 * @param input The validated, user-supplied fields of the expense.
 * @returns The created expense row.
 */
export const insertOrganizationExpense = async (input: CreateExpenseInput) => {
  const { organizationId, userId } = await getExpenseTenant();

  const [expense] = await db
    .insert(expenseSchema)
    .values({
      // Session-derived, not part of `input`.
      organizationId,
      ownerId: userId,
      amount: input.amount,
      category: input.category,
      description: input.description,
      date: new Date(input.date),
    })
    .returning();

  return expense;
};
