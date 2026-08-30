/**
 * Whole years elapsed since `birthDate` (an ISO yyyy-mm-dd string), decremented
 * when this year's birthday has not yet come around.
 *
 * Callers on a prerendered page must make sure this is not frozen at build
 * time — see the `revalidate` export in src/app/page.tsx.
 */
export function getAge(birthDate: string): number {
  const birth = new Date(birthDate);
  const now = new Date();

  let age = now.getFullYear() - birth.getFullYear();

  const monthsUntilBirthday = now.getMonth() - birth.getMonth();
  const birthdayHasPassed =
    monthsUntilBirthday > 0 ||
    (monthsUntilBirthday === 0 && now.getDate() >= birth.getDate());

  if (!birthdayHasPassed) age -= 1;

  return age;
}
