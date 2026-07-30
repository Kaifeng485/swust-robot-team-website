"use client";

import { useMemo, useState } from "react";
import { defaultContent, type SiteContent } from "../site-content";
import "./admin.css";

const owner = "Kaifeng485";
const repo = "swust-robot-team-website";
const contentPath = "app/site-content.ts";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

type Status = { type: "idle" | "saving" | "success" | "error"; message: string };

function escapeString(value: string) {
  return JSON.stringify(value);
}

function serializeContent(content: SiteContent) {
  return `export type Season = {
  id: string;
  year: string;
  title: string;
  kind: string;
  note: string;
  image: string;
  video: string;
};

export type CustomPage = {
  id: string;
  slug: string;
  navLabel: string;
  eyebrow: string;
  title: string;
  body: string;
  backgroundImage: string;
  visible: boolean;
};

export type AboutStat = {
  value: string;
  label: string;
};

export type GalleryPhoto = {
  id: string;
  title: string;
  caption: string;
  image: string;
};

export type SiteContent = {
  heroTitle: string;
  heroHighlight: string;
  heroText: string;
  heroBackgroundImage: string;
  aboutEyebrow: string;
  aboutTitle: string;
  aboutText: string;
  aboutStats: AboutStat[];
  contactTitle: string;
  contactText: string;
  contactEmail: string;
  galleryPhotos: GalleryPhoto[];
  seasons: Season[];
  pages: CustomPage[];
};

export const defaultContent: SiteContent = ${JSON.stringify(content, null, 2)};
`;
}

function encodeBase64(value: string) {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary);
}

export default function AdminPage() {
  const [token, setToken] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [content, setContent] = useState<SiteContent>(defaultContent);
  const [status, setStatus] = useState<Status>({ type: "idle", message: "尚未保存" });
  const [active, setActive] = useState("home");

  const changed = useMemo(() => JSON.stringify(content) !== JSON.stringify(defaultContent), [content]);

  const update = <K extends keyof SiteContent>(key: K, value: SiteContent[K]) => {
    setContent((current) => ({ ...current, [key]: value }));
    setStatus({ type: "idle", message: "存在尚未发布的修改" });
  };

  const login = async () => {
    if (!token.trim()) {
      setStatus({ type: "error", message: "请输入 GitHub Fine-grained Token" });
      return;
    }
    setStatus({ type: "saving", message: "正在验证 GitHub 权限…" });
    try {
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
        headers: { Authorization: `Bearer ${token.trim()}`, Accept: "application/vnd.github+json" },
      });
      if (!response.ok) throw new Error("令牌无效，或没有访问该仓库的权限");
      sessionStorage.setItem("swust-admin-token", token.trim());
      setAuthenticated(true);
      setStatus({ type: "success", message: "GitHub 身份验证成功" });
    } catch (error) {
      setStatus({ type: "error", message: error instanceof Error ? error.message : "登录失败" });
    }
  };

  const save = async () => {
    const activeToken = token.trim() || sessionStorage.getItem("swust-admin-token") || "";
    if (!activeToken) {
      setAuthenticated(false);
      setStatus({ type: "error", message: "登录状态已失效，请重新输入令牌" });
      return;
    }
    setStatus({ type: "saving", message: "正在提交到 GitHub…" });
    try {
      const api = `https://api.github.com/repos/${owner}/${repo}/contents/${contentPath}`;
      const current = await fetch(api, {
        headers: { Authorization: `Bearer ${activeToken}`, Accept: "application/vnd.github+json" },
      });
      if (!current.ok) throw new Error("无法读取网站配置文件");
      const currentFile = await current.json();
      const source = serializeContent(content);
      const response = await fetch(api, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${activeToken}`,
          Accept: "application/vnd.github+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: "content: update website from admin panel",
          content: encodeBase64(source),
          sha: currentFile.sha,
          branch: "main",
        }),
      });
      if (!response.ok) {
        const detail = await response.json().catch(() => null);
        throw new Error(detail?.message || "GitHub 提交失败");
      }
      setStatus({ type: "success", message: "发布成功，GitHub Pages 正在自动部署" });
    } catch (error) {
      setStatus({ type: "error", message: error instanceof Error ? error.message : "保存失败" });
    }
  };

  if (!authenticated) {
    return (
      <main className="admin-login-shell">
        <section className="admin-login-card">
          <div className="admin-mark">SWUST</div>
          <p className="admin-kicker">WEBSITE CONTROL CENTER</p>
          <h1>机器人小组<br /><span>网站后台</span></h1>
          <p className="admin-login-copy">使用仅授权给本仓库的 GitHub Fine-grained Token 登录。令牌只保存在当前浏览器会话，不会写入网站代码。</p>
          <label>
            GitHub Token
            <input type="password" value={token} onChange={(event) => setToken(event.target.value)} placeholder="github_pat_..." autoComplete="off" />
          </label>
          <button className="admin-primary" onClick={login}>验证并进入后台</button>
          <a className="admin-back" href={`${basePath}/`}>← 返回官方网站</a>
          <p className={`admin-status ${status.type}`}>{status.message}</p>
        </section>
      </main>
    );
  }

  return (
    <main className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-logo"><b>SWUST</b><span>ROBOT TEAM</span></div>
        <nav>
          {[
            ["home", "首页内容"], ["about", "关于我们"], ["gallery", "照片展示"],
            ["seasons", "历届比赛"], ["contact", "加入我们"],
          ].map(([id, label]) => (
            <button key={id} className={active === id ? "active" : ""} onClick={() => setActive(id)}>{label}</button>
          ))}
        </nav>
        <a href={`${basePath}/`} target="_blank" rel="noreferrer">查看官网 ↗</a>
      </aside>

      <section className="admin-workspace">
        <header className="admin-topbar">
          <div><p>CONTENT MANAGEMENT</p><h1>网站内容管理</h1></div>
          <div className="admin-actions">
            <span className={`admin-status ${status.type}`}>{status.message}</span>
            <button className="admin-primary" onClick={save} disabled={status.type === "saving"}>{status.type === "saving" ? "发布中…" : "发布到官网"}</button>
          </div>
        </header>

        <div className="admin-panel">
          {active === "home" && <>
            <SectionTitle index="01" title="首页内容" description="修改官网首屏介绍和背景图片路径。" />
            <Field label="学校名称" value={content.heroTitle} onChange={(v) => update("heroTitle", v)} />
            <Field label="团队名称" value={content.heroHighlight} onChange={(v) => update("heroHighlight", v)} />
            <Field label="首页介绍" textarea value={content.heroText} onChange={(v) => update("heroText", v)} />
            <Field label="背景图片路径" value={content.heroBackgroundImage} onChange={(v) => update("heroBackgroundImage", v)} />
          </>}

          {active === "about" && <>
            <SectionTitle index="02" title="关于我们" description="编辑团队简介和数据展示。" />
            <Field label="英文小标题" value={content.aboutEyebrow} onChange={(v) => update("aboutEyebrow", v)} />
            <Field label="主标题" value={content.aboutTitle} onChange={(v) => update("aboutTitle", v)} />
            <Field label="团队介绍" textarea value={content.aboutText} onChange={(v) => update("aboutText", v)} />
            <div className="admin-grid three">
              {content.aboutStats.map((stat, index) => <div className="admin-card" key={index}>
                <Field label={`数据 ${index + 1}`} value={stat.value} onChange={(v) => update("aboutStats", content.aboutStats.map((item, i) => i === index ? { ...item, value: v } : item))} />
                <Field label="说明" value={stat.label} onChange={(v) => update("aboutStats", content.aboutStats.map((item, i) => i === index ? { ...item, label: v } : item))} />
              </div>)}
            </div>
          </>}

          {active === "gallery" && <>
            <SectionTitle index="03" title="照片展示" description="维护首页轮播照片、标题与图片路径。" />
            {content.galleryPhotos.map((photo, index) => <div className="admin-card list-card" key={photo.id}>
              <div className="card-number">{String(index + 1).padStart(2, "0")}</div>
              <div className="admin-grid three">
                <Field label="标题" value={photo.title} onChange={(v) => update("galleryPhotos", content.galleryPhotos.map((item, i) => i === index ? { ...item, title: v } : item))} />
                <Field label="说明" value={photo.caption} onChange={(v) => update("galleryPhotos", content.galleryPhotos.map((item, i) => i === index ? { ...item, caption: v } : item))} />
                <Field label="图片路径" value={photo.image} onChange={(v) => update("galleryPhotos", content.galleryPhotos.map((item, i) => i === index ? { ...item, image: v } : item))} />
              </div>
            </div>)}
          </>}

          {active === "seasons" && <>
            <SectionTitle index="04" title="历届比赛" description="修改赛季年份、名称、封面与视频链接。" />
            {content.seasons.map((season, index) => <div className="admin-card list-card" key={season.id}>
              <div className="card-number">{season.year}</div>
              <div className="admin-grid two">
                <Field label="年份" value={season.year} onChange={(v) => update("seasons", content.seasons.map((item, i) => i === index ? { ...item, year: v } : item))} />
                <Field label="比赛名称" value={season.title} onChange={(v) => update("seasons", content.seasons.map((item, i) => i === index ? { ...item, title: v } : item))} />
                <Field label="比赛类型" value={season.kind} onChange={(v) => update("seasons", content.seasons.map((item, i) => i === index ? { ...item, kind: v } : item))} />
                <Field label="封面路径" value={season.image} onChange={(v) => update("seasons", content.seasons.map((item, i) => i === index ? { ...item, image: v } : item))} />
                <Field label="视频链接" value={season.video} onChange={(v) => update("seasons", content.seasons.map((item, i) => i === index ? { ...item, video: v } : item))} />
                <Field label="赛季说明" value={season.note} onChange={(v) => update("seasons", content.seasons.map((item, i) => i === index ? { ...item, note: v } : item))} />
              </div>
            </div>)}
          </>}

          {active === "contact" && <>
            <SectionTitle index="05" title="加入我们" description="修改招新文案和简历投递邮箱。" />
            <Field label="主标题" value={content.contactTitle} onChange={(v) => update("contactTitle", v)} />
            <Field label="说明文字" textarea value={content.contactText} onChange={(v) => update("contactText", v)} />
            <Field label="联系邮箱" value={content.contactEmail} onChange={(v) => update("contactEmail", v)} />
          </>}

          <footer className="admin-change-note">{changed ? "当前页面包含修改，发布后才会更新官网。" : "当前内容与网站默认配置一致。"}</footer>
        </div>
      </section>
    </main>
  );
}

function SectionTitle({ index, title, description }: { index: string; title: string; description: string }) {
  return <div className="section-title"><span>{index}</span><div><h2>{title}</h2><p>{description}</p></div></div>;
}

function Field({ label, value, onChange, textarea = false }: { label: string; value: string; onChange: (value: string) => void; textarea?: boolean }) {
  return <label className="admin-field"><span>{label}</span>{textarea
    ? <textarea value={value} onChange={(event) => onChange(event.target.value)} rows={5} />
    : <input value={value} onChange={(event) => onChange(event.target.value)} />}</label>;
}
