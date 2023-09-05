// Modified API Wrapper Inspired By Nationals NPP Portal: https://github.com/GTBitsOfGood/national-npp/blob/main/server/utils/APIWrapper.ts
// import Cors, { CorsRequest } from "cors";
import mongoose from "mongoose";
import { NextApiRequest } from "next";
import { NextResponse } from "next/server";
import { Role } from "../../common_utils/types";
// import { getEmailFromIdToken } from "../firebase/auth";
import dbConnect from "../mongodb/config";
import { createUserEmail, getUserByEmail } from "../mongodb/actions/User";

/* eslint-disable @typescript-eslint/no-unused-vars */
// Sets up the MongoDB models
import User from "../mongodb/models/User";
/* eslint-enable @typescript-eslint/no-unused-vars */

interface ApiRequest extends NextApiRequest {
  json: () => Promise<Record<string, unknown>>;
}

interface RouteConfig {
  requireToken?: boolean;
  roles?: Array<Role>;
  handleResponse?: boolean; // handleResponse if the route handles setting status code and body
  requireAdminVerification?: boolean;
  requireEmailVerified?: boolean;
}

interface Route<T> {
  config?: RouteConfig;
  handler: (
    req: ApiRequest,
  ) => Promise<T>;
}

function APIWrapper(
  route: Route<unknown>,
) {
  return async (req: ApiRequest) => {
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
        { status: 400 },
      );
    }

    const { config, handler } = route;

    try {
      // Connect to MongoDB Database
      await dbConnect();

      // Handle user access token + roles restrictions
      if (config?.requireToken) {
        const { email } = await req.json();
        // const email = await getEmailFromIdToken(idToken as string);
        let user = await getUserByEmail(email as string);
        if (!user) {
          user = await createUserEmail(email as string);
        }
        if (config.roles) {
          if (
            config.roles.length !== 0
            && !config.roles.some((role) => user?.role?.includes(role))
          ) {
            return NextResponse.json(
              {
                success: false,
                message: "You do not have permissions to access this API route",
              },
              { status: 403 },
            );
          }
        }
        req.body._tokenUser = user;
      }
      const data = await handler(req);
      if (config?.handleResponse) {
        return NextResponse.json({ success: true, payload: null }, { status: 200 });
      }
      return NextResponse.json({ success: true, payload: data }, { status: 200 });
    } catch (e) {
      if (e instanceof mongoose.Error) {
        return NextResponse.json(
          {
            success: false,
            message: "An Internal Server error occurred.",
          },
          { status: 500 },
        );
      }

      const error = e as Error;
      return NextResponse.json({ success: false, message: error.message });
    }
  };
}

export default APIWrapper;
