export function keyChecker(keys: string[], fields: Object): string[] {
  const keysToCheck = Object.keys(fields)

  const missingKeys = keys.filter((item) => !keysToCheck.includes(item))
  if (missingKeys.length > 0) {
    return missingKeys
  }
  return []
}
