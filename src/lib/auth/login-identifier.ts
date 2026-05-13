export function normalizeLoginIdentifier(identifier: string): string {
  return identifier.includes('@') ? identifier.toLowerCase() : identifier;
}
