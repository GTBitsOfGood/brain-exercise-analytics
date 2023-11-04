import { processRequest } from "@src/app/api/volunteer/auth/verification/validate/util";
import { redirect } from "next/navigation";

export default async function Layout({
  params,
  children,
}: {
  params: { token: string };
  children: React.ReactNode;
}) {
  try {
    const { token } = params;
    await processRequest({ token });
  } catch (error) {
    redirect("/auth/password-reset/error");
  }
  return <>{children}</>;
}
