import { getChatGPTUser } from "./chatgpt-auth";

const ADMIN_EMAIL = "2197974202@qq.com";

export async function requireAdminApi() {
  const user = await getChatGPTUser();
  return user?.email.toLowerCase() === ADMIN_EMAIL;
}

export function isAdminEmail(email: string) {
  return email.toLowerCase() === ADMIN_EMAIL;
}
