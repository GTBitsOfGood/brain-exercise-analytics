import { HttpMethod, IUser } from "@/common_utils/types";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Assume a "Cookie:nextjs=fast" header to be present on the incoming request
  // Getting cookies from the request using the `RequestCookies` API
  const path = request.nextUrl.pathname;
  if (path === "/") {
    return NextResponse.redirect(
      new URL("/auth/login", request.nextUrl.origin),
    );
  }

  const user = JSON.parse(
    request.cookies.get("authUser")?.value ?? "{}",
  ) as IUser;

  // Unprotected routes
  if (
    path.match(/\/auth\/password-reset/g) ||
    path.match(/\/auth\/email-verification\/[a-z0-9-]{36}/g)
  ) {
    return NextResponse.next();
  }

  /*
  1. User does not have a cookie: redirect to /auth/login or /auth/signup if not already there
  2. Cookie Exists:
  a. SignUp and Verify both true: simply continue (if not going to login or email-verification or information pages)
  b. Refresh data from mongo
      i. No response / Error: redirect to /auth/login
      ii. SignUp and Verify both true: simply continue (if not going to login or email-verification or information pages)
      iii. Verify is not true: redirect to /auth/email-verification if not already there
      iv. SignUp is not true: redirect to /auth/information if not already there
  */
  if (!request.cookies.has("authUser")) {
    if (path.match(/\/auth\/(login|signup)/g)) {
      return NextResponse.next();
    }
    return NextResponse.redirect(
      new URL("/auth/login", request.nextUrl.origin),
    );
  }

  if (user.verified && user.signedUp) {
    if (path.match(/\/auth\/(login|signup|email-verification|information)/g)) {
      return NextResponse.redirect(
        new URL("/patient/search", request.nextUrl.origin),
      );
    }
    return NextResponse.next();
  }

  const response = (await (
    await fetch(`${process.env.URL}/api/volunteer/internal/get-volunteer`, {
      method: HttpMethod.POST,
      body: JSON.stringify({
        id: user._id,
        secret: process.env.INTERNAL_SECRET,
      }),
    })
  ).json()) as { success: boolean; message: string; payload: object };
  if (!response || response.success === false || !response.payload) {
    request.cookies.delete("authUser");
    if (path.match(/\/auth\/(login|signup)/g)) {
      return NextResponse.next();
    }
    return NextResponse.redirect(
      new URL("/auth/login", request.nextUrl.origin),
    );
  }

  const fetchedUser = response.payload as IUser;
  request.cookies.set("authUser", JSON.stringify(fetchedUser));

  if (fetchedUser.verified && fetchedUser.signedUp) {
    if (path.match(/\/auth\/(login|signup|email-verification|information)/g)) {
      return NextResponse.redirect(
        new URL("/patient/search", request.nextUrl.origin),
      );
    }
    return NextResponse.next();
  }
  if (!fetchedUser.verified) {
    if (path.match(/auth\/email-verification/g)) {
      return NextResponse.next();
    }
    return NextResponse.redirect(
      new URL("/auth/email-verification", request.nextUrl.origin),
    );
  }
  if (path.match(/auth\/information/g)) {
    return NextResponse.next();
  }
  return NextResponse.redirect(
    new URL("/auth/information", request.nextUrl.origin),
  );
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
