"use client";

import { useEffect, useState } from "react";
import type { SiteContent } from "../site-content";

export default function AdminEditor({ displayName, signOutPath }: { displayName: string; signOutPath: string }) {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [status, setStatus] = useState("正在载入网站内容…");

  useEffect(() => {
    fetch("/api/content").then((r) => r.json()).then((data) => {
      setContent(data);
      setStatus("");
    }).catch(() => setStatus("载入失败，请刷新重试"));
  }, []);

  const setField = (field: keyof SiteContent, value: string) => {
    setContent((old) => old ? { ...old, [field]: value } : old);
  };

  const setSeason = (index: number, field: string, value: string) => {
    setContent((old) => old ? {
      ...old,
      seasons: old.seasons.map((item, i) => i === index ? { ...item, [field]: value } : item),
    } : old);
  };

  const setGalleryPhoto = (index: number, field: string, value: string) => {
    setContent((old) => old ? {
      ...old,
      galleryPhotos: old.galleryPhotos.map((item, i) => i === index ? { ...item, [field]: value } : item),
    } : old);
  };

  const setPage = (index: number, field: string, value: string | boolean) => {
    setContent((old) => old ? {
      ...old,
      pages: (old.pages || []).map((item, i) => i === index ? { ...item, [field]: value } : item),
    } : old);
  };

  const setAboutStat = (index: number, field: "value" | "label", value: string) => {
    setContent((old) => old ? {
      ...old,
      aboutStats: old.aboutStats.map((item, i) => i === index ? { ...item, [field]: value } : item),
    } : old);
  };

  const uploadImage = async (file?: File) => {
    if (!file) return;
    setStatus("正在上传图片…");
    const form = new FormData();
    form.append("file", file);
    const response = await fetch("/api/upload", { method: "POST", body: form });
    const data = await response.json();
    if (!response.ok) {
      setStatus(data.error || "上传失败");
      return "";
    }
    setStatus("图片已上传，点击“保存并发布”后生效");
    return data.url as string;
  };

  const save = async () => {
    if (!content) return;
    setStatus("正在保存并发布…");
    const response = await fetch("/api/content", {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(content),
    });
    const data = await response.json();
    if (response.ok) {
      setContent(data.content);
      new BroadcastChannel("site-content").postMessage("updated");
      setStatus("发布成功，官网内容已更新");
    } else {
      setStatus(data.error || "发布失败");
    }
  };

  if (!content) return <main className="admin-shell"><p>{status}</p></main>;

  return (
    <main className="admin-shell">
      <header className="admin-header">
        <div><p>SWUST ROBOT TEAM</p><h1>网站内容管理</h1></div>
        <div className="admin-user"><span>{displayName}</span><a href="/" target="_blank">查看官网</a><a href={signOutPath}>退出</a></div>
      </header>

      <section className="admin-panel">
        <h2>首页与团队介绍</h2>
        <div className="form-grid">
          <label>首页标题<input value={content.heroTitle} onChange={(e) => setField("heroTitle", e.target.value)} /></label>
          <label>高亮文字<input value={content.heroHighlight} onChange={(e) => setField("heroHighlight", e.target.value)} /></label>
          <label className="wide">首页简介<textarea value={content.heroText} onChange={(e) => setField("heroText", e.target.value)} /></label>
          <label className="wide upload">首页背景图片
            <input type="file" accept="image/*" onChange={async (e) => {
              const url = await uploadImage(e.target.files?.[0]);
              if (url) setField("heroBackgroundImage", url);
            }} />
            {content.heroBackgroundImage && <span className="image-path">当前背景：{content.heroBackgroundImage}</span>}
          </label>
          <label className="wide">栏目小标题<input value={content.aboutEyebrow} onChange={(e) => setField("aboutEyebrow", e.target.value)} /></label>
          <label className="wide">团队标题<input value={content.aboutTitle} onChange={(e) => setField("aboutTitle", e.target.value)} /></label>
          <label className="wide">团队介绍<textarea value={content.aboutText} onChange={(e) => setField("aboutText", e.target.value)} /></label>
          {content.aboutStats.map((stat, index) => (
            <div className="stat-editor" key={index}>
              <label>数据 {index + 1}<input value={stat.value} onChange={(e) => setAboutStat(index, "value", e.target.value)} /></label>
              <label>说明<input value={stat.label} onChange={(e) => setAboutStat(index, "label", e.target.value)} /></label>
            </div>
          ))}
        </div>
      </section>

      <section className="admin-panel">
        <div className="panel-title">
          <div>
            <h2>首页照片素材</h2>
            <p className="panel-help">这里的照片会按顺序显示在首页轮播中，可继续新增、替换、排序或删除。</p>
          </div>
          <button onClick={() => setContent({
            ...content,
            galleryPhotos: [...(content.galleryPhotos || []), {
              id: crypto.randomUUID(),
              title: "新照片",
              caption: "TEAM MOMENTS",
              image: "/gate.png",
            }],
          })}>＋ 新增照片</button>
        </div>
        <div className="admin-gallery">
          {(content.galleryPhotos || []).map((photo, index) => (
            <article className="admin-photo" key={photo.id}>
              <div className="admin-photo-preview">
                <img src={photo.image || "/gate.png"} alt="" />
                <span>{String(index + 1).padStart(2, "0")}</span>
              </div>
              <div className="admin-photo-fields">
                <div className="season-admin-head">
                  <b>照片 {index + 1}</b>
                  <div className="page-actions">
                    <button disabled={index === 0} onClick={() => setContent({
                      ...content,
                      galleryPhotos: content.galleryPhotos.map((item, i, list) => i === index - 1 ? list[index] : i === index ? list[index - 1] : item),
                    })}>上移</button>
                    <button disabled={index === content.galleryPhotos.length - 1} onClick={() => setContent({
                      ...content,
                      galleryPhotos: content.galleryPhotos.map((item, i, list) => i === index ? list[index + 1] : i === index + 1 ? list[index] : item),
                    })}>下移</button>
                    <button className="danger" onClick={() => setContent({
                      ...content,
                      galleryPhotos: content.galleryPhotos.filter((_, i) => i !== index),
                    })}>删除</button>
                  </div>
                </div>
                <label>照片标题<input value={photo.title} onChange={(e) => setGalleryPhoto(index, "title", e.target.value)} /></label>
                <label>照片说明<input value={photo.caption} onChange={(e) => setGalleryPhoto(index, "caption", e.target.value)} /></label>
                <label className="upload">上传或替换照片
                  <input type="file" accept="image/*" onChange={async (e) => {
                    const url = await uploadImage(e.target.files?.[0]);
                    if (url) setGalleryPhoto(index, "image", url);
                  }} />
                  {photo.image && <span className="image-path">当前图片：{photo.image}</span>}
                </label>
              </div>
            </article>
          ))}
          {(content.galleryPhotos || []).length === 0 && (
            <div className="empty-pages">还没有首页照片，点击“新增照片”开始添加。</div>
          )}
        </div>
      </section>

      <section className="admin-panel">
        <div className="panel-title">
          <div><h2>页面管理</h2><p className="panel-help">新增页面会自动出现在官网导航中，每个页面可设置独立背景图。</p></div>
          <button onClick={() => setContent({
            ...content,
            pages: [...(content.pages || []), {
              id: crypto.randomUUID(),
              slug: `page-${Date.now()}`,
              navLabel: "新页面",
              eyebrow: "SWUST ROBOT TEAM",
              title: "新页面标题",
              body: "在这里填写页面内容。",
              backgroundImage: content.heroBackgroundImage || "/gate.png",
              visible: true,
            }],
          })}>＋ 新增页面</button>
        </div>
        <div className="admin-pages">
          {(content.pages || []).map((page, index) => (
            <article className="admin-page" key={page.id}>
              <div className="season-admin-head">
                <b>页面 {index + 1}</b>
                <div className="page-actions">
                  <button disabled={index === 0} onClick={() => setContent({
                    ...content,
                    pages: content.pages.map((item, i, list) => i === index - 1 ? list[index] : i === index ? list[index - 1] : item),
                  })}>上移</button>
                  <button disabled={index === content.pages.length - 1} onClick={() => setContent({
                    ...content,
                    pages: content.pages.map((item, i, list) => i === index ? list[index + 1] : i === index + 1 ? list[index] : item),
                  })}>下移</button>
                  <button className="danger" onClick={() => setContent({ ...content, pages: content.pages.filter((_, i) => i !== index) })}>删除</button>
                </div>
              </div>
              <div className="form-grid">
                <label>导航名称<input value={page.navLabel} onChange={(e) => setPage(index, "navLabel", e.target.value)} /></label>
                <label>英文小标题<input value={page.eyebrow} onChange={(e) => setPage(index, "eyebrow", e.target.value)} /></label>
                <label className="wide">页面标题<input value={page.title} onChange={(e) => setPage(index, "title", e.target.value)} /></label>
                <label className="wide">页面正文<textarea value={page.body} onChange={(e) => setPage(index, "body", e.target.value)} /></label>
                <label className="wide upload">页面背景图片
                  <input type="file" accept="image/*" onChange={async (e) => {
                    const url = await uploadImage(e.target.files?.[0]);
                    if (url) setPage(index, "backgroundImage", url);
                  }} />
                  {page.backgroundImage && <span className="image-path">当前背景：{page.backgroundImage}</span>}
                </label>
                <label className="visibility-toggle">
                  <input type="checkbox" checked={page.visible} onChange={(e) => setPage(index, "visible", e.target.checked)} />
                  在官网中显示
                </label>
              </div>
            </article>
          ))}
          {(content.pages || []).length === 0 && <div className="empty-pages">还没有自定义页面，点击“新增页面”开始创建。</div>}
        </div>
      </section>

      <section className="admin-panel">
        <div className="panel-title"><h2>比赛记录</h2><button onClick={() => setContent({ ...content, seasons: [...content.seasons, { id: crypto.randomUUID(), year: "2026", title: "新比赛记录", kind: "ROBOCON", note: "", image: "/gate.png", video: "" }] })}>＋ 新增记录</button></div>
        <div className="admin-seasons">
          {content.seasons.map((season, index) => (
            <article className="admin-season" key={season.id}>
              <div className="season-admin-head"><b>记录 {index + 1}</b><button onClick={() => setContent({ ...content, seasons: content.seasons.filter((_, i) => i !== index) })}>删除</button></div>
              <label>年份<input value={season.year} onChange={(e) => setSeason(index, "year", e.target.value)} /></label>
              <label>类型<input value={season.kind} onChange={(e) => setSeason(index, "kind", e.target.value)} /></label>
              <label>标题<input value={season.title} onChange={(e) => setSeason(index, "title", e.target.value)} /></label>
              <label>介绍<textarea value={season.note} onChange={(e) => setSeason(index, "note", e.target.value)} /></label>
              <label>视频链接<input value={season.video} placeholder="https://…" onChange={(e) => setSeason(index, "video", e.target.value)} /></label>
              <label className="upload">比赛图片<input type="file" accept="image/*" onChange={async (e) => {
                const url = await uploadImage(e.target.files?.[0]);
                if (url) setSeason(index, "image", url);
              }} /></label>
            </article>
          ))}
        </div>
      </section>

      <section className="admin-panel">
        <h2>招新与联系</h2>
        <div className="form-grid">
          <label className="wide">招新标题<input value={content.contactTitle} onChange={(e) => setField("contactTitle", e.target.value)} /></label>
          <label className="wide">招新介绍<textarea value={content.contactText} onChange={(e) => setField("contactText", e.target.value)} /></label>
          <label>联系邮箱<input type="email" value={content.contactEmail} onChange={(e) => setField("contactEmail", e.target.value)} /></label>
        </div>
      </section>

      <div className="admin-action"><span role="status">{status}</span><button onClick={save}>保存并发布</button></div>
    </main>
  );
}
