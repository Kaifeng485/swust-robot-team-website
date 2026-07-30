import { NextResponse } from "next/server";
import { requireAdminApi } from "../../admin-auth";
import { getRuntimeEnv } from "../../runtime-env";

export async function POST(request: Request) {
  const env = getRuntimeEnv();
  if (!(await requireAdminApi())) {
    return NextResponse.json({ error: "无权上传图片" }, { status: 403 });
  }
  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File) || !file.type.startsWith("image/")) {
    return NextResponse.json({ error: "请选择图片文件" }, { status: 400 });
  }
  if (file.size > 8 * 1024 * 1024) {
    return NextResponse.json({ error: "图片不能超过 8MB" }, { status: 400 });
  }
  const ext = file.name.split(".").pop()?.replace(/[^a-zA-Z0-9]/g, "") || "jpg";
  const key = `uploads/${crypto.randomUUID()}.${ext}`;
  await env.BUCKET.put(key, await file.arrayBuffer(), {
    httpMetadata: { contentType: file.type },
  });
  return NextResponse.json({ url: `/api/images/${encodeURIComponent(key)}` });
}
