export type KycStatus = 'none' | 'pending' | 'approved' | 'rejected';
export type AccreditationStatus = 'none' | 'pending' | 'approved' | 'rejected';
export type UserRole = 'creator' | 'investor' | 'both';
export type ActiveRole = 'creator' | 'investor';

export function addressesMatch(
  a: string | null | undefined,
  b: string | null | undefined,
): boolean {
  if (!a || !b) return false;
  return a.toLowerCase() === b.toLowerCase();
}
