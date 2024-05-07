import { Session } from "./auth.interface";
import { getAccount, createAccount } from "./util";

const MOCK_USER = {
  principalIdp: "mock",
  principalId: "0537dadc-469f-4bed-94ed-33d87168b691",
  userName: "User Mock",
  userEmail: "usermock@contoso.com",
};

export const auth = async (): Promise<Session> => {
  const account = await getAccount(
    MOCK_USER.principalIdp,
    MOCK_USER.principalId
  );
  if (!account) {
    const newAccount = await createAccount(
      MOCK_USER.principalIdp,
      MOCK_USER.principalId,
      MOCK_USER.userName,
      MOCK_USER.userEmail
    );
    return {
      user: newAccount?.user,
    };
  }

  return {
    user: account?.user,
  };
};
