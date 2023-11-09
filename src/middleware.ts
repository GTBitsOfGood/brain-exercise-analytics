import { IUser } from "@/common_utils/types";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Assume a "Cookie:nextjs=fast" header to be present on the incoming request
  // Getting cookies from the request using the `RequestCookies` API
  request.cookies.getAll();
  const path = request.nextUrl.pathname;
  const user = JSON.parse(
    request.cookies.get("authUser")?.value ?? "{}",
  ) as IUser;
  if (path.match(/\/auth.*/g)) {
    if (request.cookies.has("authUser")) {
      if (user.signedUp) {
        return NextResponse.redirect(
          new URL("/search/patient", request.nextUrl.origin),
        );
      }
      // Get Mongo data
    }
    return NextResponse.next();
  }
  if (!request.cookies.has("authUser")) {
    return NextResponse.redirect(
      new URL("/auth/login", request.nextUrl.origin),
    );
  }

  if (user.signedUp) {
    return NextResponse.redirect(
      new URL("/patient/search", request.nextUrl.origin),
    );
  }
  console.log("Out of middleware");
  return NextResponse.next();
  return NextResponse.next();
  // console.log(new URL("/auth/login", request.nextUrl.origin));
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
