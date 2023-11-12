export function classes(
  ...classNames: (string | boolean | undefined | null)[]
) {
  const nonNullClassNames = classNames.filter(
    (className) =>
      className !== null && className !== undefined && className !== false,
  );

  return nonNullClassNames.join(" ");
}
