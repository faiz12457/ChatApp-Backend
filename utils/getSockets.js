import { userSocketIds } from "./store.js";





export const getSockets = (users = []) => {
  return users
    .map((user) => userSocketIds.get(user?.toString()))
    .filter(Boolean); // remove undefined values (offline users)
};

