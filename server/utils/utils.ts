export function getCurrentMonday() {
  const date = new Date(
    new Date().toLocaleString("en-US", { timeZone: "America/New_York" }),
  ); // gets EDT time
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
  return date.setDate(diff);
}
