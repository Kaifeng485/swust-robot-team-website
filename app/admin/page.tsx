import { redirect } from "next/navigation";
import { requireChatGPTUser, chatGPTSignOutPath } from "../chatgpt-auth";
import { isAdminEmail } from "../admin-auth";
import AdminEditor from "./admin-editor";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const user = await requireChatGPTUser("/admin");
  if (!isAdminEmail(user.email)) redirect("/");
  return <AdminEditor displayName={user.displayName} signOutPath={chatGPTSignOutPath("/")} />;
}
