import { auth } from '@clerk/nextjs/server';

export type ExpenseTenant = {
  organizationId: string;
  userId: string;
};

/**
 * Resolves the tenant the current request belongs to.
 *
 * This is the ONLY place where `organizationId` and `ownerId` are allowed to
 * come from: both values are read from the Clerk session on the server and can
 * never be influenced by user input. Every read and write on the `expense`
 * table must go through this helper.
 * @returns The active organization id and the signed-in user id.
 * @throws When the request has no signed-in user or no active organization.
 */
export const getExpenseTenant = async (): Promise<ExpenseTenant> => {
  const { userId, orgId } = await auth();

  if (!userId) {
    throw new Error('Unauthenticated: no signed-in user for this request.');
  }

  if (!orgId) {
    throw new Error('No active organization: expenses are organization-scoped.');
  }

  return { organizationId: orgId, userId };
};
