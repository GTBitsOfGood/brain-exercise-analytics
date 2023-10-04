import axios, { AxiosResponse } from "axios";
import { getAuth } from "firebase/auth";
import { InternalRequestData, InternalResponseData } from "./types";

export async function internalRequest<T>({
  url,
  queryParams,
  method,
  body,
  authRequired = true,
}: InternalRequestData): Promise<T | undefined> {
  try {
    let idToken: string | undefined;
    let newParams = queryParams;
    let newBody = body;
    if (authRequired) {
      const { currentUser } = getAuth();
      if (!currentUser) {
        throw new Error("Unable to get user");
      }
      idToken = await currentUser.getIdToken();
      const { email } = currentUser;
      if (email === null) {
        throw new Error("Email does not exist on user");
      }
      newParams = {
        ...queryParams,
        email,
      };
      newBody = {
        ...body,
        email,
      };
    }

    const response: AxiosResponse<InternalResponseData<T>> = await axios({
      method,
      url,
      params: newParams,
      headers: {
        withCredentials: true,
        mode: "cors",
        accesstoken: idToken,
      },
      data: newBody,
    });
    if (response.data.success === false) {
      throw new Error(response.data.message);
    }
    return response.data.payload;
  } catch (e) {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    throw new Error(`Unable to connect to API: ${e}`);
  }
}
