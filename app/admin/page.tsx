"use client";

import { useEffect, useMemo, useState } from "react";
import { defaultContent, type SiteContent } from "../site-content";
import "./admin.css";

const owner = "Kaifeng485";
const repo = "swust-robot-team-website";
const branch = "main";
const contentPath = "app/site-content.ts";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const oauthWorkerUrl = "https://swust-robot-team-oauth.swust-robot-team.workers.dev";
const tokenStorageKey = "swust-admin-token";
const loginStorageKey = "swust-admin-login";

type Status = { type: "idle" | "saving" | "success" | "error"; message: string };

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

export type ExploreCard = {
  id: string;
  number: string;
  title: string;
  englishTitle: string;
  text: string;
  href: string;
  image: string;
};

export type PreparationStep = {
  id: string;
  number: string;
  title: string;
  status: string;
  progress: string;
};

export type RecruitmentDirection = {
  id: string;
  number: string;
  title: string;
  text: string;
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
  exploreCards: ExploreCard[];
  preparationEyebrow: string;
  preparationTitle: string;
  preparationHighlight: string;
  preparationText: string;
  preparationSteps: PreparationStep[];
  recruitmentEyebrow: string;
  recruitmentTitle: string;
  recruitmentHighlight: string;
  recruitmentText: string;
  recruitmentDirections: RecruitmentDirection[];
  recruitmentApplyEyebrow: string;
  recruitmentApplyTitle: string;
  recruitmentApplyText: string;
};

export const defaultContent: SiteContent = ${JSON.stringify(content, null, 2)};
`;
}

function encodeUtf8Base64(value: string) {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary);
}

function encodeBytesBase64(bytes: Uint8Array) {
  let binary = "";
  const chunkSize = 0x8000;
  for (let index = 0; index < bytes.length; index += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(index, index + chunkSize));
  }
  return btoa(binary);
}

function safeFileName(name: string) {
  const dot = name.lastIndexOf(".");
  const extension = dot >= 0 ? name.slice(dot).toLowerCase().replace(/[^a-z0-9.]/g, "") : "";
  const base = (dot >= 0 ? name.slice(0, dot) : name)
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
    .replace(/^-+|-+$/g, "") || "image";
  return `${Date.now()}-${base}${extension}`;
}

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [content, setContent] = useState<SiteContent>(defaultContent);
  const [publishedSnapshot, setPublishedSnapshot] = useState(defaultContent);
  const [status, setStatus] = useState<Status>({ type: "idle", message: "尚未登录" });
  const [active, setActive] = useState("home");
  const [loginName, setLoginName] = useState("");
  const [uploading, setUploading] = useState(false);

  const changed = useMemo(
    () => JSON.stringify(content) !== JSON.stringify(publishedSnapshot),
    [content, publishedSnapshot],
  );

  useEffect(() => {
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const accessToken = hash.get("access_token");
    const oauthError = hash.get("oauth_error");
    const login = hash.get("login") ?? "";

    if (oauthError) {
      setStatus({ type: "error", message: oauthError });
      history.replaceState(null, "", window.location.pathname + window.location.search);
      return;
    }

    if (accessToken) {
      sessionStorage.setItem(tokenStorageKey, accessToken);
      sessionStorage.setItem(loginStorageKey, login);
      history.replaceState(null, "", window.location.pathname + window.location.search);
    }

    const token = accessToken || sessionStorage.getItem(tokenStorageKey);
    const storedLogin = login || sessionStorage.getItem(loginStorageKey) || "";
    if (!token) return;

    fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json" },
    })
      .then((response) => {
        if (!response.ok) throw new Error("GitHub 登录已失效，请重新授权");
        setAuthenticated(true);
        setLoginName(storedLogin);
        setStatus({ type: "success", message: storedLogin ? `已登录：${storedLogin}` : "GitHub 登录成功" });
      })
      .catch((error) => {
        sessionStorage.removeItem(tokenStorageKey);
        sessionStorage.removeItem(loginStorageKey);
        setStatus({ type: "error", message: error instanceof Error ? error.message : "登录失败" });
      });
  }, []);

  const update = <K extends keyof SiteContent>(key: K, value: SiteContent[K]) => {
    setContent((current) => ({ ...current, [key]: value }));
    setStatus({ type: "idle", message: "存在尚未发布的修改" });
  };

  const getToken = () => {
    const token = sessionStorage.getItem(tokenStorageKey) ?? "";
    if (!token) throw new Error("登录状态已失效，请重新登录");
    return token;
  };

  const uploadImage = async (file: File) => {
    if (!file.type.startsWith("image/")) throw new Error("请选择图片文件");
    if (file.size > 8 * 1024 * 1024) throw new Error("图片不能超过 8MB");

    const token = getToken();
    const fileName = safeFileName(file.name);
    const repositoryPath = `public/uploads/${fileName}`;
    const bytes = new Uint8Array(await file.arrayBuffer());

    setUploading(true);
    setStatus({ type: "saving", message: `正在上传 ${file.name}…` });
    try {
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${repositoryPath}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `media: upload ${fileName} from admin panel`,
          content: encodeBytesBase64(bytes),
          branch,
        }),
      });
      if (!response.ok) {
        const detail = await response.json().catch(() => null);
        throw new Error(detail?.message || "图片上传失败");
      }
      setStatus({ type: "success", message: "图片上传成功，请继续点击“发布到官网”" });
      return `/uploads/${fileName}`;
    } finally {
      setUploading(false);
    }
  };

  const save = async () => {
    let token = "";
    try {
      token = getToken();
    } catch (error) {
      setStatus({ type: "error", message: error instanceof Error ? error.message : "登录失效" });
      return;
    }

    setStatus({ type: "saving", message: "正在提交网站内容到 GitHub…" });
    try {
      const api = `https://api.github.com/repos/${owner}/${repo}/contents/${contentPath}`;
      const current = await fetch(`${api}?ref=${branch}`, {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json" },
      });
      if (!current.ok) throw new Error("无法读取网站配置文件");
      const currentFile = await current.json();
      const response = await fetch(api, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: "content: update website from OAuth admin panel",
          content: encodeUtf8Base64(serializeContent(content)),
          sha: currentFile.sha,
          branch,
        }),
      });
      if (!response.ok) {
        const detail = await response.json().catch(() => null);
        throw new Error(detail?.message || "GitHub 提交失败");
      }
      setPublishedSnapshot(content);
      setStatus({ type: "success", message: "发布成功，GitHub Pages 正在自动部署" });
    } catch (error) {
      setStatus({ type: "error", message: error instanceof Error ? error.message : "保存失败" });
    }
  };

  const logout = () => {
    sessionStorage.removeItem(tokenStorageKey);
    sessionStorage.removeItem(loginStorageKey);
    setAuthenticated(false);
    setLoginName("");
    setStatus({ type: "idle", message: "已退出后台" });
  };

  if (!authenticated) {
    return <main className="admin-login-shell"><section className="admin-login-card">
      <div className="admin-mark">SWUST</div>
      <p className="admin-kicker">WEBSITE CONTROL CENTER</p>
      <h1>机器人小组<br /><span>网站后台</span></h1>
      <p className="admin-login-copy">使用 GitHub 官方授权登录，仅允许管理员账号 Kaifeng485。</p>
      <button className="admin-primary" onClick={() => { window.location.href = `${oauthWorkerUrl}/login`; }}>使用 GitHub 登录</button>
      <a className="admin-back" href={`${basePath}/`}>← 返回官方网站</a>
      <p className={`admin-status ${status.type}`}>{status.message}</p>
    </section></main>;
  }

  const menu = [
    ["home", "首页内容"], ["about", "关于我们"], ["gallery", "照片展示"],
    ["seasons", "历届比赛"], ["explore", "探索战队"], ["preparation", "备赛进度"],
    ["recruitment", "招新官网"], ["contact", "加入我们"],
  ];

  return <main className="admin-shell">
    <aside className="admin-sidebar">
      <div className="admin-logo"><b>SWUST</b><span>ROBOT TEAM</span></div>
      <nav>{menu.map(([id, label]) =>
        <button key={id} className={active === id ? "active" : ""} onClick={() => setActive(id)}>{label}</button>)}</nav>
      <a href={`${basePath}/`} target="_blank" rel="noreferrer">查看官网 ↗</a>
    </aside>

    <section className="admin-workspace">
      <header className="admin-topbar">
        <div><p>CONTENT MANAGEMENT</p><h1>网站内容管理</h1></div>
        <div className="admin-actions">
          <span className={`admin-status ${status.type}`}>{status.message}</span>
          {loginName && <span className="admin-status success">@{loginName}</span>}
          <button onClick={logout}>退出</button>
          <button className="admin-primary" onClick={save} disabled={status.type === "saving" || uploading || !changed}>{status.type === "saving" ? "处理中…" : changed ? "发布到官网" : "已是最新"}</button>
        </div>
      </header>

      <div className="admin-panel">
        {active === "home" && <>
          <SectionTitle index="01" title="首页内容" description="修改官网首屏介绍和背景图片。" />
          <Field label="学校名称" value={content.heroTitle} onChange={(v) => update("heroTitle", v)} />
          <Field label="团队名称" value={content.heroHighlight} onChange={(v) => update("heroHighlight", v)} />
          <Field label="首页介绍" textarea value={content.heroText} onChange={(v) => update("heroText", v)} />
          <Field label="背景图片路径" value={content.heroBackgroundImage} onChange={(v) => update("heroBackgroundImage", v)} />
          <ImageUpload disabled={uploading} onUpload={async (file) => { const image = await uploadImage(file); update("heroBackgroundImage", image); }} />
        </>}

        {active === "about" && <>
          <SectionTitle index="02" title="关于我们" description="编辑团队简介和数据展示。" />
          <Field label="英文小标题" value={content.aboutEyebrow} onChange={(v) => update("aboutEyebrow", v)} />
          <Field label="主标题" value={content.aboutTitle} onChange={(v) => update("aboutTitle", v)} />
          <Field label="团队介绍" textarea value={content.aboutText} onChange={(v) => update("aboutText", v)} />
          <div className="admin-grid three">{content.aboutStats.map((stat, index) => <div className="admin-card" key={index}>
            <Field label={`数据 ${index + 1}`} value={stat.value} onChange={(v) => update("aboutStats", content.aboutStats.map((item, i) => i === index ? { ...item, value: v } : item))} />
            <Field label="说明" value={stat.label} onChange={(v) => update("aboutStats", content.aboutStats.map((item, i) => i === index ? { ...item, label: v } : item))} />
          </div>)}</div>
        </>}

        {active === "gallery" && <>
          <SectionTitle index="03" title="照片展示" description="新增、删除和上传首页照片。" />
          <button className="admin-primary" onClick={() => update("galleryPhotos", [...content.galleryPhotos, { id: `gallery-${Date.now()}`, title: "新照片", caption: "照片说明", image: "/gate.webp" }])}>＋ 新增照片</button>
          {content.galleryPhotos.map((photo, index) => <div className="admin-card list-card" key={photo.id}>
            <div className="card-number">{String(index + 1).padStart(2, "0")}</div>
            <div className="admin-grid three">
              <Field label="标题" value={photo.title} onChange={(v) => update("galleryPhotos", content.galleryPhotos.map((item, i) => i === index ? { ...item, title: v } : item))} />
              <Field label="说明" value={photo.caption} onChange={(v) => update("galleryPhotos", content.galleryPhotos.map((item, i) => i === index ? { ...item, caption: v } : item))} />
              <Field label="图片路径" value={photo.image} onChange={(v) => update("galleryPhotos", content.galleryPhotos.map((item, i) => i === index ? { ...item, image: v } : item))} />
            </div>
            <ImageUpload disabled={uploading} onUpload={async (file) => { const image = await uploadImage(file); update("galleryPhotos", content.galleryPhotos.map((item, i) => i === index ? { ...item, image } : item)); }} />
            <button onClick={() => update("galleryPhotos", content.galleryPhotos.filter((_, i) => i !== index))}>删除这张照片</button>
          </div>)}
        </>}

        {active === "seasons" && <>
          <SectionTitle index="04" title="历届比赛" description="新增、删除赛季，维护封面和视频链接。" />
          <button className="admin-primary" onClick={() => update("seasons", [{ id: `season-${Date.now()}`, year: String(new Date().getFullYear()), title: "新赛季", kind: "ROBOCON", note: "", image: "/gate.webp", video: "" }, ...content.seasons])}>＋ 新增赛季</button>
          {content.seasons.map((season, index) => <div className="admin-card list-card" key={season.id}>
            <div className="card-number">{season.year}</div>
            <div className="admin-grid two">
              <Field label="年份" value={season.year} onChange={(v) => update("seasons", content.seasons.map((item, i) => i === index ? { ...item, year: v } : item))} />
              <Field label="比赛名称" value={season.title} onChange={(v) => update("seasons", content.seasons.map((item, i) => i === index ? { ...item, title: v } : item))} />
              <Field label="比赛类型" value={season.kind} onChange={(v) => update("seasons", content.seasons.map((item, i) => i === index ? { ...item, kind: v } : item))} />
              <Field label="封面路径" value={season.image} onChange={(v) => update("seasons", content.seasons.map((item, i) => i === index ? { ...item, image: v } : item))} />
              <Field label="视频链接" value={season.video} onChange={(v) => update("seasons", content.seasons.map((item, i) => i === index ? { ...item, video: v } : item))} />
              <Field label="赛季说明" textarea value={season.note} onChange={(v) => update("seasons", content.seasons.map((item, i) => i === index ? { ...item, note: v } : item))} />
            </div>
            <ImageUpload disabled={uploading} onUpload={async (file) => { const image = await uploadImage(file); update("seasons", content.seasons.map((item, i) => i === index ? { ...item, image } : item)); }} />
            <button onClick={() => update("seasons", content.seasons.filter((_, i) => i !== index))}>删除这个赛季</button>
          </div>)}
        </>}

        {active === "explore" && <>
          <SectionTitle index="05" title="探索战队" description="管理探索战队轮播入口、说明、链接和背景图。" />
          <button className="admin-primary" onClick={() => update("exploreCards", [...content.exploreCards, { id: `explore-${Date.now()}`, number: String(content.exploreCards.length + 1).padStart(2, "0"), title: "新入口", englishTitle: "NEW PAGE", text: "页面说明", href: "/", image: "/gate.webp" }])}>＋ 新增入口</button>
          {content.exploreCards.map((card, index) => <div className="admin-card list-card" key={card.id}>
            <div className="card-number">{card.number}</div>
            <div className="admin-grid two">
              <Field label="序号" value={card.number} onChange={(v) => update("exploreCards", content.exploreCards.map((item, i) => i === index ? { ...item, number: v } : item))} />
              <Field label="中文标题" value={card.title} onChange={(v) => update("exploreCards", content.exploreCards.map((item, i) => i === index ? { ...item, title: v } : item))} />
              <Field label="英文标题" value={card.englishTitle} onChange={(v) => update("exploreCards", content.exploreCards.map((item, i) => i === index ? { ...item, englishTitle: v } : item))} />
              <Field label="跳转链接" value={card.href} onChange={(v) => update("exploreCards", content.exploreCards.map((item, i) => i === index ? { ...item, href: v } : item))} />
              <Field label="背景图片路径" value={card.image} onChange={(v) => update("exploreCards", content.exploreCards.map((item, i) => i === index ? { ...item, image: v } : item))} />
              <Field label="说明文字" textarea value={card.text} onChange={(v) => update("exploreCards", content.exploreCards.map((item, i) => i === index ? { ...item, text: v } : item))} />
            </div>
            <ImageUpload disabled={uploading} onUpload={async (file) => { const image = await uploadImage(file); update("exploreCards", content.exploreCards.map((item, i) => i === index ? { ...item, image } : item)); }} />
            <button onClick={() => update("exploreCards", content.exploreCards.filter((_, i) => i !== index))}>删除这个入口</button>
          </div>)}
        </>}

        {active === "preparation" && <>
          <SectionTitle index="06" title="备赛进度" description="编辑备赛页标题、简介和各阶段进度。" />
          <div className="admin-grid two">
            <Field label="英文小标题" value={content.preparationEyebrow} onChange={(v) => update("preparationEyebrow", v)} />
            <Field label="标题前半部分" value={content.preparationTitle} onChange={(v) => update("preparationTitle", v)} />
            <Field label="高亮标题" value={content.preparationHighlight} onChange={(v) => update("preparationHighlight", v)} />
            <Field label="页面说明" textarea value={content.preparationText} onChange={(v) => update("preparationText", v)} />
          </div>
          <button className="admin-primary" onClick={() => update("preparationSteps", [...content.preparationSteps, { id: `step-${Date.now()}`, number: String(content.preparationSteps.length + 1).padStart(2, "0"), title: "新阶段", status: "待开始", progress: "0%" }])}>＋ 新增阶段</button>
          {content.preparationSteps.map((step, index) => <div className="admin-card list-card" key={step.id}>
            <div className="card-number">{step.number}</div>
            <div className="admin-grid two">
              <Field label="序号" value={step.number} onChange={(v) => update("preparationSteps", content.preparationSteps.map((item, i) => i === index ? { ...item, number: v } : item))} />
              <Field label="阶段名称" value={step.title} onChange={(v) => update("preparationSteps", content.preparationSteps.map((item, i) => i === index ? { ...item, title: v } : item))} />
              <Field label="状态" value={step.status} onChange={(v) => update("preparationSteps", content.preparationSteps.map((item, i) => i === index ? { ...item, status: v } : item))} />
              <Field label="进度（如 72%）" value={step.progress} onChange={(v) => update("preparationSteps", content.preparationSteps.map((item, i) => i === index ? { ...item, progress: v } : item))} />
            </div>
            <button onClick={() => update("preparationSteps", content.preparationSteps.filter((_, i) => i !== index))}>删除这个阶段</button>
          </div>)}
        </>}

        {active === "recruitment" && <>
          <SectionTitle index="07" title="招新官网" description="编辑招新首页文案、招新方向和报名区域。" />
          <div className="admin-grid two">
            <Field label="英文小标题" value={content.recruitmentEyebrow} onChange={(v) => update("recruitmentEyebrow", v)} />
            <Field label="标题前半部分" value={content.recruitmentTitle} onChange={(v) => update("recruitmentTitle", v)} />
            <Field label="高亮标题" value={content.recruitmentHighlight} onChange={(v) => update("recruitmentHighlight", v)} />
            <Field label="招新介绍" textarea value={content.recruitmentText} onChange={(v) => update("recruitmentText", v)} />
          </div>
          <button className="admin-primary" onClick={() => update("recruitmentDirections", [...content.recruitmentDirections, { id: `direction-${Date.now()}`, number: String(content.recruitmentDirections.length + 1).padStart(2, "0"), title: "新方向", text: "方向说明" }])}>＋ 新增招新方向</button>
          {content.recruitmentDirections.map((direction, index) => <div className="admin-card list-card" key={direction.id}>
            <div className="card-number">{direction.number}</div>
            <div className="admin-grid two">
              <Field label="序号" value={direction.number} onChange={(v) => update("recruitmentDirections", content.recruitmentDirections.map((item, i) => i === index ? { ...item, number: v } : item))} />
              <Field label="方向名称" value={direction.title} onChange={(v) => update("recruitmentDirections", content.recruitmentDirections.map((item, i) => i === index ? { ...item, title: v } : item))} />
              <Field label="方向说明" textarea value={direction.text} onChange={(v) => update("recruitmentDirections", content.recruitmentDirections.map((item, i) => i === index ? { ...item, text: v } : item))} />
            </div>
            <button onClick={() => update("recruitmentDirections", content.recruitmentDirections.filter((_, i) => i !== index))}>删除这个方向</button>
          </div>)}
          <div className="admin-card">
            <Field label="报名区英文小标题" value={content.recruitmentApplyEyebrow} onChange={(v) => update("recruitmentApplyEyebrow", v)} />
            <Field label="报名区标题" value={content.recruitmentApplyTitle} onChange={(v) => update("recruitmentApplyTitle", v)} />
            <Field label="报名区说明" textarea value={content.recruitmentApplyText} onChange={(v) => update("recruitmentApplyText", v)} />
          </div>
        </>}

        {active === "contact" && <>
          <SectionTitle index="08" title="加入我们" description="修改官网底部招新文案和简历投递邮箱。" />
          <Field label="主标题" value={content.contactTitle} onChange={(v) => update("contactTitle", v)} />
          <Field label="说明文字" textarea value={content.contactText} onChange={(v) => update("contactText", v)} />
          <Field label="联系邮箱" value={content.contactEmail} onChange={(v) => update("contactEmail", v)} />
        </>}

        <footer className="admin-change-note">{changed ? "当前包含尚未发布的修改。" : "当前后台内容已与最近一次发布保持一致。"}</footer>
      </div>
    </section>
  </main>;
}

function SectionTitle({ index, title, description }: { index: string; title: string; description: string }) {
  return <div className="section-title"><span>{index}</span><div><h2>{title}</h2><p>{description}</p></div></div>;
}

function Field({ label, value, onChange, textarea = false }: { label: string; value: string; onChange: (value: string) => void; textarea?: boolean }) {
  return <label className="admin-field"><span>{label}</span>{textarea
    ? <textarea value={value} onChange={(event) => onChange(event.target.value)} rows={5} />
    : <input value={value} onChange={(event) => onChange(event.target.value)} />}</label>;
}

function ImageUpload({ onUpload, disabled }: { onUpload: (file: File) => Promise<void>; disabled: boolean }) {
  return <label className="admin-field"><span>上传本地图片（JPG / PNG / WEBP，最大 8MB）</span>
    <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" disabled={disabled} onChange={async (event) => {
      const file = event.target.files?.[0];
      if (!file) return;
      try {
        await onUpload(file);
      } catch (error) {
        alert(error instanceof Error ? error.message : "上传失败");
      } finally {
        event.target.value = "";
      }
    }} />
  </label>;
}
