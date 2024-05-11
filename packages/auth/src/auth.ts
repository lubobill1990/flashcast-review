import { headers } from "next/headers";
import { Session } from "./auth.interface";
import { getAccount, createAccount } from "./util";

const getAppServiceClaims = (): {
  // JSON representation of available claims.
  principalClaims: {
    auth_typ: string;
    claims: { typ: string; val: string }[];
  };
  // An identifier for the caller set by the identity provider.
  principalId: string;
  // A human-readable name for the caller set by the identity provider, e.g. Email Address, User Principal Name.
  principalName: string;
  // The name of the identity provider used by App Service Authentication.
  principalIdp: string;
} => {
  const reqHeaders = headers();

  const principalClaims = reqHeaders.get("X-MS-CLIENT-PRINCIPAL") || "";
  const principalId = reqHeaders.get("X-MS-CLIENT-PRINCIPAL-ID") || "";
  const principalName = reqHeaders.get("X-MS-CLIENT-PRINCIPAL-NAME") || "";
  const principalIdp = reqHeaders.get("X-MS-CLIENT-PRINCIPAL-IDP") || "";

  const parsedClaims = JSON.parse(atob(principalClaims) || "{}");

  return {
    principalClaims: parsedClaims,
    principalId,
    principalName,
    principalIdp,
  };
};

export const auth = async (): Promise<Session> => {
  const { principalClaims, principalId, principalName, principalIdp } =
    getAppServiceClaims();

  const account = await getAccount(principalIdp, principalId);
  const userEmail =
    principalClaims?.claims?.find(
      claim =>
        claim.typ ===
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/upn"
    )?.val || principalName;

  if (!account) {
    const userName =
      principalClaims?.claims?.find(claim => claim.typ === "name")?.val ||
      principalName.split("@")[0] ||
      principalName;
    const newAccount = await createAccount(
      principalIdp,
      principalId,
      userName,
      userEmail
    );
    return {
      user: newAccount?.user,
    };
  }

  return {
    user: account?.user,
  };
};
