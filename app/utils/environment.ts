/**
 * @Project Summarised
 * @File environment.ts
 * @Path app/utils
 * @Author BRICE ZELE
 * @Date 12/03/2023
 */
export function isNonJestDev(
  isDevEnvironment = __DEV__,
  jestWorkerId: NullUndefined<string> = process.env.JEST_WORKER_ID,
): boolean {
  return isDevEnvironment && !jestWorkerId;
}
