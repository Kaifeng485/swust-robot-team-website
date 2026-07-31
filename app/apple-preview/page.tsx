import Link from "next/link";
import { defaultContent } from "../site-content";
import "./preview.css";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const asset = (path: string) => (path.startsWith("/") ? `${basePath}${path}` : path);

export default function ApplePreviewPage() {
  const gallery = defaultContent.galleryPhotos.slice(0, 4);
  const seasons = defaultContent.seasons.slice(0, 3);

  return (
    <main className="ap-site">
      <header className="ap-nav">
        <Link className="ap-brand" href="/">
          <img src={asset("/logo-transparent.webp")} alt="" />
          <span>SWUST Robot Team</span>
        </Link>
        <nav>
          <a href="#about">关于</a>
          <a href="#gallery">影像</a>
          <a href="#archive">赛事</a>
          <a href="#join">加入我们</a>
        </nav>
      </header>

      <section className="ap-hero">
        <div className="ap-hero-copy">
          <p className="ap-kicker">SOUTHWEST UNIVERSITY OF SCIENCE AND TECHNOLOGY</p>
          <h1>让机械拥有力量。<br /><span>让代码拥有灵魂。</span></h1>
          <p>我们是一支持续探索机器人、创造与竞赛边界的学生工程团队。</p>
          <div className="ap-actions">
            <a className="ap-btn primary" href="#about">进一步了解</a>
            <a className="ap-btn ghost" href="#join">加入我们</a>
          </div>
        </div>
        <div className="ap-hero-media">
          <img src={asset(defaultContent.heroBackgroundImage || "/gate.webp")} alt="机器人小组主视觉" />
        </div>
      </section>

      <section className="ap-about" id="about">
        <p className="ap-kicker dark">WHO WE ARE</p>
        <h2>把课堂知识，变成真正能运动、感知与决策的机器人。</h2>
        <p className="ap-lead">{defaultContent.aboutText}</p>
        <div className="ap-stats">
          {defaultContent.aboutStats.map((item) => (
            <article key={item.label}><strong>{item.value}</strong><span>{item.label}</span></article>
          ))}
        </div>
      </section>

      <section className="ap-gallery" id="gallery">
        <div className="ap-section-head">
          <p className="ap-kicker">TEAM GALLERY</p>
          <h2>每一张照片，都是工程成长的证据。</h2>
        </div>
        <div className="ap-gallery-grid">
          {gallery.map((photo, index) => (
            <figure key={photo.id || index}>
              <img src={asset(photo.image || "/gate.webp")} alt={photo.title} />
              <figcaption><span>{photo.caption}</span><strong>{photo.title}</strong></figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="ap-archive" id="archive">
        <div className="ap-section-head light">
          <p className="ap-kicker dark">MATCH ARCHIVE</p>
          <h2>每一届比赛，都像一次产品发布。</h2>
          <p>聚焦一个主题、一台机器人和一段完整的工程旅程。</p>
        </div>
        <div className="ap-season-stack">
          {seasons.map((season, index) => (
            <article className={index % 2 ? "reverse" : ""} key={season.id}>
              <div className="ap-season-copy">
                <span>{season.kind}</span>
                <h3>{season.year}<br />{season.title}</h3>
                <p>{season.note}</p>
                <a href={season.video || "#"}>{season.video ? "查看比赛影像 →" : "影像敬请期待"}</a>
              </div>
              <div className="ap-season-media"><img src={asset(season.image || "/gate.webp")} alt={`${season.year} ${season.title}`} /></div>
            </article>
          ))}
        </div>
      </section>

      <section className="ap-join" id="join">
        <div className="ap-circuit" aria-hidden="true">
          <span className="line l1"/><span className="line l2"/><span className="line l3"/><span className="line l4"/>
          <span className="line r1"/><span className="line r2"/><span className="line r3"/><span className="line r4"/>
        </div>
        <img className="ap-join-logo" src={asset("/logo-transparent.webp")} alt="" />
        <div className="ap-join-copy">
          <p className="ap-kicker">BUILD THE FUTURE WITH US</p>
          <h2>{defaultContent.contactTitle}</h2>
          <p>{defaultContent.contactText}</p>
          <a className="ap-btn primary" href={`mailto:${defaultContent.contactEmail}`}>邮件投递简历</a>
        </div>
      </section>

      <footer className="ap-footer">
        <span>SWUST ROBOT TEAM</span>
        <Link href="/">返回当前官网</Link>
      </footer>
    </main>
  );
}
