// Modified API Wrapper Inspired By Nationals NPP Portal: https://github.com/GTBitsOfGood/national-npp/blob/main/server/utils/APIWrapper.ts
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { IAuthUserCookie, IUser, Role } from "@/common_utils/types";
import { getEmailFromIdToken } from "@server/firebase/auth";
import dbConnect from "@server/mongodb/config";
import firebaseConfig from "@server/firebase/config";
import { getUserByEmail } from "@server/mongodb/actions/User";
import { getAuth } from "firebase-admin/auth";

interface RouteConfig {
  requireToken?: boolean;
  roles?: Array<Role>;
  handleResponse?: boolean; // handleResponse if the route handles setting status code and body
  requireVolunteer?: boolean;
  requireAdmin?: boolean;
}

interface Route<T> {
  config?: RouteConfig;
  handler: (
    req: NextRequest,
    currentUser?: IUser | undefined,
    updatedUserRef?: IUser[],
  ) => Promise<T>;
}

function APIWrapper(route: Route<unknown>) {
  const { config, handler } = route;

  let allowedRoles: Set<Role>;

  if (config?.requireAdmin) {
    allowedRoles = new Set<Role>(
      Object.values(Role).filter(
        (role) =>
          role !== Role.NONPROFIT_PATIENT && role !== Role.NONPROFIT_VOLUNTEER,
      ),
    );
  } else if (config?.requireVolunteer) {
    allowedRoles = new Set<Role>(
      Object.values(Role).filter((role) => role !== Role.NONPROFIT_PATIENT),
    );
  } else {
    allowedRoles = new Set<Role>(config?.roles ?? Object.values(Role));
  }

  return async (req: NextRequest) => {
    // await runMiddleware(req, res, cors);
    const { method } = req;

    if (!method || !route) {
      const errorMessage = method
        ? `Request method ${method} is invalid.`
        : "Missing request method.";

      return NextResponse.json(
        {
          success: false,
          message: errorMessage,
        },
        { status: 200 },
      );
    }

    try {
      // Connect to MongoDB Database
      await dbConnect();
      // Connect to Firebase
      await firebaseConfig();

      let currentUser: IUser | undefined;

      // Handle unauthorised or invalid idTokens + user access token + roles restrictions
      if (config?.requireToken) {
        // Retrieve idToken from HEADERS
        const idToken: string | null = req.headers.get("accesstoken");
        try {
          if (idToken === null) {
            // req.cookies.delete("authUser");
            throw Error("No id token was provided");
          }
          await getAuth().verifyIdToken(idToken);
        } catch (e) {
          console.log(e);
          return NextResponse.json(
            {
              success: false,
              message: "You do not have permissions to access this API route",
            },
            { status: 200 },
          );
        }

        const email: string = await getEmailFromIdToken(idToken);
        const user = await getUserByEmail(email);
        currentUser = user === null ? undefined : user;

        if (
          (config.roles || config.requireVolunteer || config.requireAdmin) &&
          (!currentUser || !allowedRoles.has(currentUser.role))
        ) {
          return NextResponse.json(
            {
              success: false,
              message: "You do not have permissions to access this API route",
            },
            { status: 200 },
          );
        }
      }

      const updatedUserRef: IUser[] = [];
      const data = await handler(req, currentUser, updatedUserRef);
      let response;
      if (config?.handleResponse) {
        response = NextResponse.json(
          { success: true, payload: null },
          { status: 200 },
        );
      } else {
        response = NextResponse.json(
          { success: true, payload: data },
          { status: 200 },
        );
      }

      if (updatedUserRef.length === 1) {
        const { keepLogged = false } = JSON.parse(
          req.cookies.get("authUser")?.value ?? "{}",
        ) as IAuthUserCookie;

        req.cookies.get("authUser");
        response.cookies.set(
          "authUser",
          JSON.stringify({ user: updatedUserRef[0], keepLogged }),
          keepLogged ? { maxAge: 7 * 24 * 60 * 60 } : undefined,
        );
      }

      return response;
    } catch (e) {
      if (e instanceof mongoose.Error) {
        console.log(e);
        return NextResponse.json(
          {
            success: false,
            message: "An Internal Server error occurred.",
          },
          { status: 200 },
        );
      }

      const error = e as Error;
      console.log(error);
      return NextResponse.json(
        {
          success: false,
          message: error.message,
        },
        { status: 200 },
      );
    }
  };
}

export default APIWrapper;
