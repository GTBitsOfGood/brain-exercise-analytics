import { IUser } from "@/common_utils/types";
import { getUserByEmail } from "@server/mongodb/actions/User";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Assume a "Cookie:nextjs=fast" header to be present on the incoming request
  // Getting cookies from the request using the `RequestCookies` API
  const path = request.nextUrl.pathname;
  const user = JSON.parse(
    request.cookies.get("authUser")?.value ?? "{}"
  ) as IUser;

  if (path.match(/\/auth\/[login|signup]*/g)) {
    console.log("Auth");
    if (request.cookies.has("authUser")) {
      console.log("Has Auth");
      if (user.signedUp && user.verified) {
        console.log("signed and verfified")
        return NextResponse.redirect(
          new URL("/search/patient", request.nextUrl.origin)
        );
      }
      console.log("fetching");
      const fetchedUser = await getUserByEmail(user.email);
      console.log("fetched");
      if (fetchedUser === null) {
        return NextResponse.next();
      }
      if (fetchedUser.signedUp && fetchedUser.verified) {
        return NextResponse.redirect(
          new URL("/search/patient", request.nextUrl.origin)
        );
      }
      if (fetchedUser.signedUp && !fetchedUser.verified) {
        return NextResponse.redirect(
          new URL("/auth/email-verification", request.nextUrl.origin)
        );
      }
      return NextResponse.redirect(
        new URL("/auth/information", request.nextUrl.origin)
      );
    }
    return NextResponse.next();
  }
  if (!request.cookies.has("authUser")) {
    return NextResponse.redirect(
      new URL("/auth/login", request.nextUrl.origin)
    );
  }

  if (user.signedUp && user.verified) {
    return NextResponse.next();
  }
  const fetchedUser = await getUserByEmail(user.email);
  if (fetchedUser === null) {
    return NextResponse.redirect(
      new URL("/auth/login", request.nextUrl.origin)
    );
  }
  if (fetchedUser.signedUp && fetchedUser.verified) {
    return NextResponse.next();
  }
  if (fetchedUser.signedUp && !fetchedUser.verified) {
    return NextResponse.redirect(
      new URL("/auth/email-verification", request.nextUrl.origin)
    );
  }
  return NextResponse.redirect(
    new URL("/auth/information", request.nextUrl.origin)
  );
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
