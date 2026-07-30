import { NextResponse } from "next/server";
import { requireAdminApi } from "../../admin-auth";
import { readContent, writeContent } from "../../server-content";
import type { SiteContent } from "../../site-content";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await readContent(), {
    headers: { "Cache-Control": "no-store, no-cache, must-revalidate" },
  });
}

export async function PUT(request: Request) {
  if (!(await requireAdminApi())) {
    return NextResponse.json({ error: "无权发布内容" }, { status: 403 });
  }
  const content = (await request.json()) as SiteContent;
  if (!content?.heroTitle || !Array.isArray(content.seasons) || !Array.isArray(content.galleryPhotos) || (content.pages !== undefined && !Array.isArray(content.pages))) {
    return NextResponse.json({ error: "内容格式不正确" }, { status: 400 });
  }
  await writeContent(content);
  return NextResponse.json({ ok: true, content: await readContent() }, {
    headers: { "Cache-Control": "no-store, no-cache, must-revalidate" },
  });
}
