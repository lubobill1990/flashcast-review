import { auth as authActual } from "./src/auth";
import { auth as authMock } from "./src/auth.mock";
export const auth =
  process.env.NODE_ENV === "development" ? authMock : authActual;
export * from "./src/util";
