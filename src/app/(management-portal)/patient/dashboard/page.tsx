"use client";

import { DateRangeEnum, HttpMethod } from "@/common_utils/types";
import { internalRequest } from "@src/utils/requests";
import { useEffect } from "react";

// `app/page.tsx` is the UI for the `/` URL
export default function Page() {
  useEffect(() => {
    internalRequest({
      url: "/api/patient/analytics/overview",
      method: HttpMethod.GET,
      queryParams: {
        range: DateRangeEnum.RECENT,
      },
    }).then((data) => console.log(data));
  }, []);
  return null;
}
