export function getCurrentMonday() {
  const date = new Date();
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
  date.setDate(diff);
  return new Date(date.toDateString());
}

export function getCurrentSunday() {
  const date = new Date();
  const day = date.getDay();
  const diff = date.getDate() - day;
  date.setDate(diff);
  return new Date(date.toDateString());
}
