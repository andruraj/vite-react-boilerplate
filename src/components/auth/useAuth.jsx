import { getCookie } from "@/utils/cookies";
import { isEmpty } from "@/utils/isEmpty";

export const useAuth = () => {
  const token = getCookie("token");

  return !isEmpty(token);
};
