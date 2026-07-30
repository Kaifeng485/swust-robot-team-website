import { NextResponse } from "next/server";
import { getRuntimeEnv } from "../../runtime-env";

export async function POST(request: Request) {
  const env = getRuntimeEnv();
  const form = await request.formData();
  const name = String(form.get("name") || "").trim();
  const contact = String(form.get("contact") || "").trim();
  const direction = String(form.get("direction") || "").trim();
  const introduction = String(form.get("introduction") || "").trim();
  const resume = form.get("resume");
  if (!name || !contact || !direction || !introduction || !(resume instanceof File)) {
    return NextResponse.json({ error: "请完整填写投递信息" }, { status: 400 });
  }
  if (resume.type !== "application/pdf" || resume.size > 8 * 1024 * 1024) {
    return NextResponse.json({ error: "请上传不超过 8MB 的 PDF 简历" }, { status: 400 });
  }
  const id = crypto.randomUUID();
  const key = `resumes/${id}.pdf`;
  await env.BUCKET.put(key, await resume.arrayBuffer(), { httpMetadata: { contentType: "application/pdf" } });
  await env.DB.prepare(
    "CREATE TABLE IF NOT EXISTS applications (id TEXT PRIMARY KEY, name TEXT NOT NULL, contact TEXT NOT NULL, direction TEXT NOT NULL, introduction TEXT NOT NULL, resume_key TEXT NOT NULL, created_at TEXT NOT NULL)"
  ).run();
  await env.DB.prepare(
    "INSERT INTO applications (id, name, contact, direction, introduction, resume_key, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)"
  ).bind(id, name, contact, direction, introduction, key, new Date().toISOString()).run();
  return NextResponse.json({ ok: true });
}
