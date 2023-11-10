import { HttpMethod, IUser } from "@/common_utils/types";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Assume a "Cookie:nextjs=fast" header to be present on the incoming request
  // Getting cookies from the request using the `RequestCookies` API
  const path = request.nextUrl.pathname;
  const user = JSON.parse(
    request.cookies.get("authUser")?.value ?? "{}",
  ) as IUser;

  /*
  Login and Signup
  1. User does not have a cookie: simply continue
  2. Cookie Exists:
    a. SignUp and Verify both true: redirect to /patients/search
    b. Refresh data from mongo
      i. No response / Error: simply continue
      ii. SignUp and Verify both true: redirect to /patients/search
      iii. SignUp is true: redirect to /auth/email-verification
      iv. Verify is true: redirect to /auth/information
  */
  if (path.match(/\/auth\/[login|signup]/g)) {
    if (request.cookies.has("authUser")) {
      if (user.signedUp && user.verified) {
        return NextResponse.redirect(
          new URL("/patient/search", request.nextUrl.origin),
        );
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
      if (!response || response.success === false) {
        return NextResponse.redirect(
          new URL("/auth/login", request.nextUrl.origin),
        );
      }
      const fetchedUser = response.payload as IUser;
      if (fetchedUser === null) {
        return NextResponse.next();
      }
      if (fetchedUser.signedUp && fetchedUser.verified) {
        return NextResponse.redirect(
          new URL("/patient/search", request.nextUrl.origin),
        );
      }
      if (fetchedUser.signedUp && !fetchedUser.verified) {
        return NextResponse.redirect(
          new URL("/auth/email-verification", request.nextUrl.origin),
        );
      }
      return NextResponse.redirect(
        new URL("/auth/information", request.nextUrl.origin),
      );
    }
    return NextResponse.next();
  }
  /*
  All other routes
  1. User does not have a cookie: redirect to /auth/login
  2. Cookie Exists:
  a. SignUp and Verify both true: simply continue (if not going to email-verification or information pages)
  b. Refresh data from mongo
      i. No response / Error: redirect to /auth/login
      ii. SignUp and Verify both true: simply continue (if not going to email-verification or information pages)
      iii. SignUp is true: redirect to /auth/email-verification if not already there
      iv. Verify is true: redirect to /auth/information if not already there
  */
  if (!request.cookies.has("authUser")) {
    return NextResponse.redirect(
      new URL("/auth/login", request.nextUrl.origin),
    );
  }

  if (user.signedUp && user.verified) {
    if (
      path.match(/auth\/email-verification/g) ||
      path.match(/auth\/information/g)
    ) {
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
  if (!response || response.success === false) {
    return NextResponse.redirect(
      new URL("/auth/login", request.nextUrl.origin),
    );
  }
  const fetchedUser = response.payload as IUser;
  if (fetchedUser.signedUp && fetchedUser.verified) {
    if (
      path.match(/auth\/email-verification/g) ||
      path.match(/auth\/information/g)
    ) {
      return NextResponse.redirect(
        new URL("/patient/search", request.nextUrl.origin),
      );
    }
    return NextResponse.next();
  }
  if (fetchedUser.signedUp && !fetchedUser.verified) {
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
