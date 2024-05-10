import { IUser } from "@flashcast/auth";
import {
  FunctionComponent,
  PropsWithChildren,
  createContext,
  useContext,
  useMemo,
} from "react";

type IUserData = {
  id: number;
  uuid: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

const defaultUserData = {
  id: 0,
  uuid: "",
  name: undefined,
  email: undefined,
  image: undefined,
};

const UserContext = createContext<IUserData>(defaultUserData);
export const UserProvider: FunctionComponent<PropsWithChildren & IUser> = ({
  id,
  uuid,
  name,
  email,
  image,
  children,
}) => {
  const contextValue = useMemo<IUserData>(
    () => ({
      id: id ?? 0,
      uuid: uuid ?? "",
      name,
      email,
      image,
    }),
    [id, uuid, name, email, image]
  );
  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};
export const useUserData = () => {
  const user = useContext(UserContext);
  if (!user.id || !user.uuid) {
    throw new Error(
      "User not found, or useUserData hook should be called inside a UserProvider"
    );
  }
  return user;
};
