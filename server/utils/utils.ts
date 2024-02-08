import { DateRangeEnum } from "@/common_utils/types";

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

export function formatDateByRangeEnum(date: Date, range: DateRangeEnum) {
  const monthName = date.toLocaleString("default", {
    timeZone: "UTC",
    month: "short",
  });
  const day = String(date.getUTCDate()).padStart(2, "0");
  const year = String(date.getUTCFullYear());

  if (
    [DateRangeEnum.RECENT, DateRangeEnum.QUARTER, DateRangeEnum.HALF].includes(
      range,
    )
  ) {
    return `${monthName} ${day}`;
  }
  return `${monthName} ${year}`;
}
