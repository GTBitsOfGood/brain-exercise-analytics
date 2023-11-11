export function classes(...classNames: (string | undefined | null)[]) {
  const nonNullClassNames = classNames.filter(
    (className) => className !== null && className !== undefined,
  );

  return nonNullClassNames.join(" ");
}
