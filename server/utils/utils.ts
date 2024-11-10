import { DateRangeEnum, IAuthUserCookie, IUser } from "@/common_utils/types";
import { getLowerAdminRoles } from "@src/utils/utils";
import { SignJWT, jwtVerify } from "jose";
import { JWTExpired } from "jose/errors";

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

export function formatDateByRangeEnum(date: Date, range: DateRangeEnum, month?: boolean) {
  month = month || false
  const monthName = date.toLocaleString("default", {
    timeZone: "UTC",
    month: "short",
  });
  const day = String(date.getUTCDate()).padStart(2, "0");
  const year = String(date.getUTCFullYear());


  if (
    [DateRangeEnum.RECENT, DateRangeEnum.QUARTER, DateRangeEnum.HALF, DateRangeEnum.MAX].includes(
      range,
    ) && !month
  ) {
    return `${monthName} ${day}`;
  }
  return `${monthName} ${year}`;
}

export function checkValidUserPermissions(
  currentUser: IUser,
  otherUser: IUser,
) {
  if (
    currentUser._id.toString() === otherUser._id.toString() ||
    getLowerAdminRoles(currentUser.role).includes(otherUser.role)
  ) {
    return true;
  }
  return false;
}

export async function parseAuthCookie(cookie: string) {
  const encoder = new TextEncoder();
  // const jwt = await jwtVerify(cookie, encoder.encode(process.env.JWT_SECRET));
  // return jwt.payload.data as IAuthUserCookie;
  try {
    const jwt = await jwtVerify(cookie, encoder.encode(process.env.JWT_SECRET));
    return jwt.payload.data as IAuthUserCookie;
  } catch (error) {
    if (error instanceof JWTExpired) {
      console.error("Token expired:", error.message);
      return { user: {} as IUser, keepLogged: false } as IAuthUserCookie;
      // Handle token expiration: e.g., redirect to login, refresh the token, etc.
    }
    throw error; // Rethrow any other errors
  }
}

export async function signAuthCookie(data: IAuthUserCookie) {
  const encoder = new TextEncoder();
  const jwt = await new SignJWT({ data })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("1 week")
    .sign(encoder.encode(process.env.JWT_SECRET));
  return jwt;
}
