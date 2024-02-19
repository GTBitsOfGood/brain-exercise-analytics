import { IAuthUserCookie, HttpMethod, IUser } from "@/common_utils/types";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Assume a "Cookie:nextjs=fast" header to be present on the incoming request
  // Getting cookies from the request using the `RequestCookies` API
  const path = request.nextUrl.pathname;
  console.log("here1", path);
  if (path === "/") {
    console.log("here2");
    return NextResponse.redirect(
      new URL("/auth/login", request.nextUrl.origin),
    );
  }
  console.log("here3");

  const { user = {} as IUser, keepLogged = false } = JSON.parse(
    request.cookies.get("authUser")?.value ?? "{}",
  ) as IAuthUserCookie;
  console.log("here4", user, keepLogged);

  /* Unprotected routes; no need to check for user data */
  if (
    path.match(/\/auth\/password-reset/g) ||
    path.match(/\/auth\/email-verification\/[a-z0-9-]{36}/g)
  ) {
    console.log("here5");
    return NextResponse.next();
  }
  console.log("here6");

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
    console.log("here7");
    if (path.match(/\/auth\/(login|signup)/g)) {
      console.log("here8");
      return NextResponse.next();
    }
    console.log("here9");
    return NextResponse.redirect(
      new URL("/auth/login", request.nextUrl.origin),
    );
  }
  console.log("here10");

  /*
    If the user is already verified and signed up:
      a. redirect to /patient/search if they are on an auth page
      b. otherwise, continue to the intended page. This prevents pages like `/patient/dashboard` from
        redirecting to `/patient/search`.
  */
  if (user.verified && user.signedUp) {
    console.log("here11");
    if (path.match(/\/auth\/(login|signup|email-verification|information)/g)) {
      console.log("here12");
      return NextResponse.redirect(
        new URL("/patient/search", request.nextUrl.origin),
      );
    }
    console.log("here13");
    return NextResponse.next();
  }

  /* If the above conditions are not met, we need to refresh the user data from the database */
  const response = (await (
    await fetch(
      `${request.nextUrl.origin}/api/volunteer/internal/get-volunteer`,
      {
        method: HttpMethod.POST,
        body: JSON.stringify({
          id: user._id,
          secret: process.env.INTERNAL_SECRET,
        }),
      },
    )
  ).json()) as { success: boolean; message: string; payload: object };
  console.log("here14", response);

  /* If the response is not successful, redirect to /auth/login */
  if (!response || response.success === false || !response.payload) {
    console.log("here15");
    request.cookies.delete("authUser");
    if (path.match(/\/auth\/(login|signup)/g)) {
      console.log("here16");
      return NextResponse.next();
    }
    console.log("here17");
    return NextResponse.redirect(
      new URL("/auth/login", request.nextUrl.origin),
    );
  }
  console.log("here18");

  /* Update the cookie with the new user data */
  const fetchedUser = response.payload as IUser;

  let Response: NextResponse;
  console.log("here19", fetchedUser);

  /*
    Now, with the refreshed user data, if the user is already verified and signed up:
      a. redirect to /patient/search if they are on an auth page
      b. otherwise, continue to the intended page. This prevents pages like `/patient/dashboard` from
        redirecting to `/patient/search`.
  */
  if (fetchedUser.verified && fetchedUser.signedUp) {
    console.log("here20");
    if (path.match(/\/auth\/(login|signup|email-verification|information)/g)) {
      console.log("here21");
      Response = NextResponse.redirect(
        new URL("/patient/search", request.nextUrl.origin),
      );
    } else {
      console.log("here22");
      Response = NextResponse.next();
    }
  } else if (!fetchedUser.verified) {
    console.log("here23");
    /* 
    If the user has not verified their email:
      a. redirect to /auth/email-verification if not already on it
      b. if already on /auth/email-verification, continue to the page
  */
    if (path.match(/auth\/email-verification/g)) {
      console.log("here24");
      Response = NextResponse.next();
    } else {
      console.log("here25");
      Response = NextResponse.redirect(
        new URL("/auth/email-verification", request.nextUrl.origin),
      );
    }
  } else {
    console.log("here26");
    /* 
    The user will only reach here if their email is verified but they have not filled
    out their signup information yet:
      a. redirect to /auth/information if not already on it
      b. if already on /auth/information, continue to the page
  */
    // eslint-disable-next-line no-lonely-if
    if (path.match(/auth\/information/g)) {
      console.log("here27");
      Response = NextResponse.next();
    } else {
      console.log("here28");
      Response = NextResponse.redirect(
        new URL("/auth/information", request.nextUrl.origin),
      );
    }
  }

  console.log("here29");
  Response.cookies.set(
    "authUser",
    JSON.stringify({ user: fetchedUser, keepLogged }),
    keepLogged ? { maxAge: 7 * 24 * 60 * 60 } : undefined,
  );
  console.log("here30");
  return Response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
