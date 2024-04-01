import { Role } from "@/common_utils/types";

export function classes(
  ...classNames: (string | boolean | undefined | null)[]
) {
  const nonNullClassNames = classNames.filter(
    (className) =>
      className !== null && className !== undefined && className !== false,
  );

  return nonNullClassNames.join(" ");
}

export function transformDate(date: Date | string) {
  const d = new Date(date);
  const year = d.getUTCFullYear().toString();
  const month = (d.getUTCMonth() + 1).toString().padStart(2, "0");
  const day = d.getUTCDate().toString().padStart(2, "0");
  return `${month}-${day}-${year}`;
}

export function formatPhoneNumber(num: string) {
  const len = num.length;
  if (len === 0) return "";
  if (len <= 3) return num;
  if (len <= 6) return `(${num.slice(0, 3)}) ${num.slice(3)}`;
  return `(${num.slice(0, 3)}) ${num.slice(3, 6)}-${num.slice(6)}`;
}

export function transformPhoneNumber(phoneNumber: string) {
  const areaCode = phoneNumber.slice(0, 3);
  const firstThree = phoneNumber.slice(3, 6);
  const lastFour = phoneNumber.slice(6, 10);

  return `${areaCode}-${firstThree}-${lastFour}`;
}

export function getLowerRoles(role: Role): Role[] {
  const roleIndex = Object.values(Role).indexOf(role);
  return Object.values(Role).filter((_, i) => i < roleIndex);
}

export function getLowerAdminRoles(role: Role): Role[] {
  const roleIndex = Object.values(Role).indexOf(role);
  const roles = Object.values(Role).filter(
    (r, i) => i < roleIndex && r !== Role.NONPROFIT_PATIENT,
  );
  if (role === Role.NONPROFIT_DIRECTOR) {
    roles.push(Role.NONPROFIT_DIRECTOR);
  }
  return roles;
}
