import axios, { AxiosResponse } from "axios";
import { getAuth, User } from "firebase/auth";
import firebaseInit from "@src/firebase/config";
import {
  InternalRequestData,
  InternalResponseData,
  InternalResponseError,
} from "@/common_utils/types";

export async function internalRequest<T>({
  url,
  queryParams,
  method,
  body,
  authRequired = true,
}: InternalRequestData): Promise<T> {
  let idToken: string | undefined;
  let newParams = queryParams;
  let newBody = body;
  if (authRequired) {
    firebaseInit();
    const auth = getAuth();

    const currentUser: User = await new Promise((resolve, reject) => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        unsubscribe();
        if (user) {
          resolve(user);
        } else {
          reject(new Error("Unable to get user"));
        }
      }, reject);
    });

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
    throw new InternalResponseError(response.data.message);
  }
  return response.data.payload as T;
}
