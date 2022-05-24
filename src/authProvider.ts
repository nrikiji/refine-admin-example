import { axiosInstance } from "App";
import { HttpError } from "@pankod/refine-core";

export const authProvider = {
  login: async ({ email, password }: { email: string; password: string }) => {
    if (password != "password") {
      throw new Error();
    }
    localStorage.setItem("auth", JSON.stringify({ name: "admin_user" }));
  },

  logout: async () => {
    localStorage.removeItem("auth");
  },

  checkError: (error: HttpError) => (error.statusCode === 401 ? Promise.reject() : Promise.resolve()),

  checkAuth: () => (localStorage.getItem("auth") ? Promise.resolve() : Promise.reject()),

  getPermissions: () => Promise.resolve(),

  getUserIdentity: () => {
    const auth = localStorage.getItem("auth");
    return auth ? Promise.resolve(JSON.parse(auth)) : Promise.reject();
  },
};
