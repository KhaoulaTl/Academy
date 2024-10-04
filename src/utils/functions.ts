import { setting } from "@/config/setting";
import Cookies from "js-cookie";

export const setCookies = (key: string, data: any) => {
  Cookies.set(key, data);
};

export const getCookies = (key: string) => {
  return Cookies.get(key);
};

export const removeCookies = (key: string) => {
  Cookies.remove(key);
};

export const togglePasswordFunction = (elementId: string) => {
  const type =
    document.getElementById(elementId)?.getAttribute("type") === "password"
      ? "text"
      : "password";
  document.getElementById(elementId)?.setAttribute("type", type);
};


export const logout = (router: any) => {
    removeCookies("user");
    removeCookies("USER_ROLE");
    removeCookies("token");
    removeCookies("online");
    router.push(setting.routes.SignIn);
  };
  
