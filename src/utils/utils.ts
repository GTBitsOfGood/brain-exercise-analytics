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

export function transformPhoneNumber(phoneNumber: string) {
  const areaCode = phoneNumber.slice(0, 3);
  const firstThree = phoneNumber.slice(3, 6);
  const lastFour = phoneNumber.slice(6, 10);

  return `${areaCode}-${firstThree}-${lastFour}`;
}
