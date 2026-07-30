"use client";

import { useEffect, useState } from "react";
import { defaultContent, type Season, type SiteContent } from "./site-content";

function getVideoEmbed(url: string) {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtube.com")) {
      const id = parsed.searchParams.get("v");
      return id ? `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&rel=0` : url;
    }
    if (parsed.hostname === "youtu.be") {
      return `https://www.youtube.com/embed/${parsed.pathname.slice(1)}?autoplay=1&mute=1&rel=0`;
    }
    if (parsed.hostname.includes("bilibili.com")) {
      const bv = parsed.pathname.match(/\/video\/(BV[\w]+)/i)?.[1];
      return bv
        ? `https://player.bilibili.com/player.html?bvid=${bv}&autoplay=1&muted=1&high_quality=1`
        : url;
    }
  } catch {
    return url;
  }
  return url;
}

function isDirectVideo(url: string) {
  return /\.(mp4|webm|ogg)(?:\?|#|$)/i.test(url);
}

function Arrow({ down = false }: { down?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={down ? "down" : ""}>
      <path d="M5 12h13m-5-5 5 5-5 5" />
    </svg>
  );
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selected, setSelected] = useState<Season | null>(null);
  const [resumeOpen, setResumeOpen] = useState(false);
  const [resumeStatus, setResumeStatus] = useState("");
  const [content, setContent] = useState<SiteContent>(defaultContent);
  const [suppressedDropdown, setSuppressedDropdown] = useState<string | null>(null);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [carouselPaused, setCarouselPaused] = useState(false);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setSelected(null);
    const loadContent = () => fetch("/api/content", { cache: "no-store" })
      .then((response) => response.json())
      .then(setContent)
      .catch(() => {});
    const onVisible = () => document.visibilityState === "visible" && loadContent();
    const channel = new BroadcastChannel("site-content");
    channel.addEventListener("message", loadContent);
    window.addEventListener("keydown", onKey);
    window.addEventListener("pageshow", loadContent);
    document.addEventListener("visibilitychange", onVisible);
    loadContent();
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pageshow", loadContent);
      document.removeEventListener("visibilitychange", onVisible);
      channel.close();
    };
  }, []);

  useEffect(() => {
    const targets = Array.from(document.querySelectorAll<HTMLElement>(
      ".about > div, .home-gallery-head > *, .home-gallery-viewport, " +
      ".archive-head > *, .season-card, .custom-page-content, .contact > *:not(img)",
    ));
    targets.forEach((target, index) => {
      target.classList.add("reveal-on-scroll");
      target.style.setProperty("--reveal-delay", `${(index % 4) * 90}ms`);
    });
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      }),
      { threshold: 0.14, rootMargin: "0px 0px -7% 0px" },
    );
    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, []);

  const galleryPhotos = content.galleryPhotos?.length
    ? content.galleryPhotos
    : [{ id: "default", title: "机器人小组", caption: "TEAM MOMENTS", image: "/gate.png" }];

  useEffect(() => {
    if (photoIndex >= galleryPhotos.length) setPhotoIndex(0);
  }, [galleryPhotos.length, photoIndex]);

  useEffect(() => {
    if (carouselPaused || galleryPhotos.length < 2) return;
    const timer = window.setInterval(
      () => setPhotoIndex((current) => (current + 1) % galleryPhotos.length),
      2500,
    );
    return () => window.clearInterval(timer);
  }, [carouselPaused, galleryPhotos.length]);

  const go = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const closeDropdownAndGo = (dropdown: string, id: string) => {
    setSuppressedDropdown(dropdown);
    go(id);
  };

  const movePhoto = (direction: number) => {
    setPhotoIndex((current) => (current + direction + galleryPhotos.length) % galleryPhotos.length);
  };

  const pages = content.pages || [];
  const heroBackgroundImage = content.heroBackgroundImage || "/gate.png";

  return (
    <main>
      <section className="hero" id="home">
        <img className="hero-photo" src={heroBackgroundImage} alt="西南科技大学机器人小组首页背景" />
        <div className="hero-overlay" />

        <header className="nav-wrap">
          <button className="brand" onClick={() => go("home")} aria-label="返回首页">
            <img src="/logo-transparent.png" alt="" />
            <span>
              <b>西南科技大学</b>
              <small>机器人小组</small>
            </span>
          </button>

          <nav className={menuOpen ? "nav-links open" : "nav-links"} aria-label="主导航">
            <div
              className={`nav-item${suppressedDropdown === "about" ? " dropdown-suppressed" : ""}`}
              onMouseEnter={() => setSuppressedDropdown(null)}
            >
              <button onClick={() => closeDropdownAndGo("about", "about")}>关于我们</button>
              <div className="nav-dropdown">
                <button onClick={() => closeDropdownAndGo("about", "about")}>团队简介</button>
                <button onClick={() => closeDropdownAndGo("about", "archive")}>历届比赛影像</button>
              </div>
            </div>
            <div className="nav-item">
              <a href="/explore">探索战队</a>
              <div className="nav-dropdown">
                <a href="/records">历届纪录</a>
                <a href="/learn-more">了解更多</a>
                <a href="/daily">战队日常</a>
              </div>
            </div>
            <div className="nav-item">
              <a href="/preparation">战队备赛进度</a>
              <div className="nav-dropdown">
                <a href="/preparation">当前进度</a>
                <a href="/preparation#stages">备赛阶段</a>
              </div>
            </div>
            <div className="nav-item recruit-nav">
              <a href="/recruitment">招新官网</a>
              <div className="nav-dropdown">
                <a href="/recruitment">招新首页</a>
                <a href="/recruitment#directions">招新方向</a>
                <a href="/recruitment#apply">报名方式</a>
              </div>
            </div>
            {pages.filter((page) => page.visible).map((page) => (
              <button key={page.id} onClick={() => go(`page-${page.id}`)}>{page.navLabel}</button>
            ))}
            <button onClick={() => go("contact")}>加入小组</button>
          </nav>
          <button
            className="menu-button"
            onClick={() => setMenuOpen((value) => !value)}
            aria-label="打开或关闭导航"
            aria-expanded={menuOpen}
          >
            <span /><span />
          </button>
        </header>

        <div className="hero-content">
          <p className="kicker"><span /> SOUTHWEST UNIVERSITY OF SCIENCE AND TECHNOLOGY</p>
          <div className="hero-title" role="heading" aria-level={1}>
            <span className="hero-school-name">西南科技大学</span>
            <img
              className="hero-team-title"
              src="/robot-team-title.png"
              alt="机器人小组"
            />
          </div>
          <p className="hero-text">{content.heroText}</p>
          <button className="primary" onClick={() => go("archive")}>
            探索我们的故事 <Arrow />
          </button>
        </div>

        <button className="scroll-cue" onClick={() => go("about")} aria-label="向下浏览">
          <span>SCROLL TO EXPLORE</span>
          <i><Arrow down /></i>
        </button>
      </section>

      <section className="about" id="about">
        <div>
          <p className="eyebrow">{content.aboutEyebrow}</p>
          <h2>{content.aboutTitle}</h2>
        </div>
        <div className="about-copy">
          <p>{content.aboutText}</p>
          <p className="about-extra">
            在这里，课堂知识会变成能真正运动、感知和决策的机器人。成员在一次次设计评审、
            加工装配、程序调试与赛场检验中共同成长，也把跨专业协作、工程规范和解决真实问题的能力带向更远的未来。
          </p>
          <div className="stats">
            {content.aboutStats.map((stat, index) => (
              <div key={index}><b>{stat.value}</b><span>{stat.label}</span></div>
            ))}
          </div>
        </div>
      </section>

      <section
        className="home-gallery"
        id="gallery"
        aria-label="战队照片展示"
        onMouseEnter={() => setCarouselPaused(true)}
        onMouseLeave={() => setCarouselPaused(false)}
      >
        <div className="home-gallery-head">
          <div>
            <p className="eyebrow">TEAM GALLERY</p>
            <h2>照片展示</h2>
          </div>
          <p>记录备赛、调试与赛场上的每一个珍贵瞬间。</p>
        </div>
        <div className="home-gallery-viewport">
          <div
            className="home-gallery-track"
            style={{ transform: `translateX(-${photoIndex * 100}%)` }}
          >
            {galleryPhotos.map((photo, index) => (
              <figure className="home-gallery-slide" key={photo.id || index}>
                <img src={photo.image || "/gate.png"} alt={photo.title} />
                <figcaption>
                  <span>{String(index + 1).padStart(2, "0")} / {String(galleryPhotos.length).padStart(2, "0")}</span>
                  <div>
                    <p>{photo.caption}</p>
                    <h3>{photo.title}</h3>
                  </div>
                  <strong>{String(index + 1).padStart(2, "0")}</strong>
                </figcaption>
              </figure>
            ))}
          </div>
          <button className="gallery-arrow prev" onClick={() => movePhoto(-1)} aria-label="上一张照片">←</button>
          <button className="gallery-arrow next" onClick={() => movePhoto(1)} aria-label="下一张照片">→</button>
          <div className="gallery-dots" aria-label="选择照片">
            {galleryPhotos.map((photo, index) => (
              <button
                key={photo.id || index}
                className={index === photoIndex ? "active" : ""}
                onClick={() => setPhotoIndex(index)}
                aria-label={`查看第 ${index + 1} 张照片`}
                aria-current={index === photoIndex ? "true" : undefined}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="archive" id="archive">
        <div className="archive-head">
          <div>
            <p className="eyebrow">MATCH ARCHIVE</p>
            <h2>历届比赛影像</h2>
          </div>
          <p>每一次上场，都是技术与勇气的共同答案。</p>
        </div>
        <div className="season-grid">
          {content.seasons.map((season, index) => (
            <article className="season-card" key={season.id}>
              <button
                className={`card-visual${season.video ? "" : " awaiting-video"}`}
                onClick={() => season.video && setSelected(season)}
                aria-label={season.video
                  ? `查看 ${season.year} ${season.title} 比赛影像`
                  : `${season.year} ${season.title} 视频敬请期待`}
                disabled={!season.video}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <img src={season.image || "/gate.png"} alt={`${season.year} ${season.title}比赛影像封面`} />
                <strong>{season.year}</strong>
                {!season.video && <em className="awaiting-label">敬请期待</em>}
                {season.video && <i className="card-play" aria-hidden="true">▶</i>}
              </button>
              <div className="card-copy">
                <p>{season.kind}</p>
                <h3>{season.title}</h3>
                <button
                  onClick={() => season.video && setSelected(season)}
                  disabled={!season.video}
                >
                  {season.video ? "查看记录" : "敬请期待"} {season.video && <Arrow />}
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {pages.filter((page) => page.visible).map((page, index) => (
        <section className="custom-page" id={`page-${page.id}`} key={page.id}>
          <img src={page.backgroundImage || heroBackgroundImage} alt="" />
          <div className="custom-page-overlay" />
          <div className="custom-page-content">
            <p className="kicker"><span />{page.eyebrow || `PAGE ${String(index + 1).padStart(2, "0")}`}</p>
            <h2>{page.title}</h2>
            <p>{page.body}</p>
          </div>
        </section>
      ))}

      <section className="contact" id="contact">
        <div className="contact-circuit" aria-hidden="true">
          <svg viewBox="0 0 1600 720" preserveAspectRatio="none">
            <g className="circuit-traces">
              <path d="M492 152L420 80L302 80L254 32L0 32" />
              <path d="M466 228L398 160L286 160L228 102L92 102L36 46" />
              <path d="M454 314L376 236L250 236L192 178L0 178" />
              <path d="M476 428L386 518L270 518L214 574L56 574L0 630" />
              <path d="M520 518L458 580L344 580L292 632L104 632" />
              <path d="M1088 136L1168 56L1304 56L1360 0" />
              <path d="M1134 226L1204 156L1348 156L1414 90L1600 90" />
              <path d="M1146 330L1228 248L1372 248L1422 198L1544 198L1600 142" />
              <path d="M1122 438L1198 514L1338 514L1402 578L1600 578" />
              <path d="M1070 528L1140 598L1278 598L1332 652L1480 652" />
              <path d="M560 118L500 58L440 58L382 0" />
              <path d="M684 88L634 38L634 0" />
              <path d="M916 96L980 32L1082 32L1114 0" />
              <path d="M1046 132L1120 58L1202 58L1260 0" />
              <path d="M548 596L488 656L370 656L306 720" />
              <path d="M700 632L656 676L656 720" />
              <path d="M922 620L980 678L1088 678L1130 720" />
              <path d="M1058 574L1140 656L1240 656L1304 720" />
              <path d="M436 256L370 256L328 214L268 214" />
              <path d="M452 470L388 470L340 518L276 518" />
              <path d="M1168 262L1230 262L1280 212L1360 212" />
              <path d="M1148 474L1214 474L1274 534L1348 534" />
            </g>
            <g className="circuit-nodes">
              <circle cx="420" cy="80" r="4" /><circle cx="302" cy="80" r="5" /><circle cx="254" cy="32" r="4" />
              <circle cx="398" cy="160" r="4" /><circle cx="286" cy="160" r="4" /><circle cx="228" cy="102" r="5" />
              <circle cx="376" cy="236" r="5" /><circle cx="250" cy="236" r="4" /><circle cx="192" cy="178" r="4" />
              <circle cx="386" cy="518" r="5" /><circle cx="270" cy="518" r="4" /><circle cx="214" cy="574" r="4" />
              <circle cx="458" cy="580" r="4" /><circle cx="344" cy="580" r="5" /><circle cx="292" cy="632" r="4" />
              <circle cx="1204" cy="156" r="4" /><circle cx="1348" cy="156" r="5" /><circle cx="1414" cy="90" r="4" />
              <circle cx="1228" cy="248" r="5" /><circle cx="1372" cy="248" r="4" /><circle cx="1422" cy="198" r="4" />
              <circle cx="1198" cy="514" r="4" /><circle cx="1338" cy="514" r="5" /><circle cx="1402" cy="578" r="4" />
              <circle cx="1140" cy="598" r="5" /><circle cx="1278" cy="598" r="4" /><circle cx="1332" cy="652" r="4" />
              <circle cx="500" cy="58" r="4" /><circle cx="440" cy="58" r="4" /><circle cx="634" cy="38" r="5" />
              <circle cx="980" cy="32" r="5" /><circle cx="1120" cy="58" r="4" /><circle cx="1202" cy="58" r="4" />
              <circle cx="488" cy="656" r="4" /><circle cx="370" cy="656" r="4" /><circle cx="656" cy="676" r="5" />
              <circle cx="980" cy="678" r="5" /><circle cx="1140" cy="656" r="4" /><circle cx="1240" cy="656" r="4" />
            </g>
          </svg>
        </div>
        <img src="/logo-transparent.png" alt="" />
        <p className="eyebrow">BUILD THE FUTURE WITH US</p>
        <h2>{content.contactTitle}</h2>
        <p>{content.contactText}</p>
        <button className="primary light" onClick={() => setResumeOpen(true)}>投递简历 <Arrow /></button>
      </section>

      <footer>
        <div className="footer-brand">
          <img src="/logo-transparent.png" alt="" />
          <span><b>西南科技大学机器人小组</b><small>SWUST ROBOT TEAM</small></span>
        </div>
        <p>© SWUST ROBOT TEAM</p>
        <button onClick={() => go("home")}>回到顶部 ↑</button>
      </footer>

      {selected && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setSelected(null)}>
          <div className="modal match-modal" role="dialog" aria-modal="true" aria-label={`${selected.year} 比赛记录`} onMouseDown={(event) => event.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelected(null)} aria-label="关闭">×</button>
            <p className="eyebrow">{selected.kind}</p>
            <h2>{selected.year}</h2>
            <h3>{selected.title}</h3>
            <p>{selected.note}</p>
            {selected.video ? (
              <div className="video-player">
                {isDirectVideo(selected.video) ? (
                  <video src={selected.video} autoPlay muted controls playsInline />
                ) : (
                  <iframe
                    src={getVideoEmbed(selected.video)}
                    title={`${selected.year} ${selected.title} 比赛视频`}
                    allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                    allowFullScreen
                  />
                )}
                <a href={selected.video} target="_blank" rel="noreferrer">无法播放？打开原视频 ↗</a>
              </div>
            ) : <div className="video-placeholder">
              <span>▶</span>
              <p>比赛视频待添加</p>
            </div>}
          </div>
        </div>
      )}

      {resumeOpen && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setResumeOpen(false)}>
          <form
            className="modal resume-modal"
            onMouseDown={(event) => event.stopPropagation()}
            onSubmit={async (event) => {
              event.preventDefault();
              setResumeStatus("正在提交…");
              const response = await fetch("/api/applications", {
                method: "POST",
                body: new FormData(event.currentTarget),
              });
              const data = await response.json();
              if (response.ok) {
                event.currentTarget.reset();
                setResumeStatus("投递成功，我们会尽快与你联系。");
              } else {
                setResumeStatus(data.error || "提交失败，请稍后重试。");
              }
            }}
          >
            <button type="button" className="modal-close" onClick={() => setResumeOpen(false)} aria-label="关闭">×</button>
            <p className="eyebrow">JOIN SWUST ROBOT TEAM</p>
            <h2>简历投递</h2>
            <div className="resume-grid">
              <label>姓名<input name="name" required maxLength={40} /></label>
              <label>联系方式<input name="contact" required maxLength={80} placeholder="手机 / 邮箱 / QQ" /></label>
              <label className="wide">申请方向
                <select name="direction" required defaultValue="">
                  <option value="" disabled>请选择方向</option>
                  <option>机械结构</option><option>电控与嵌入式</option><option>视觉与算法</option>
                  <option>软件开发</option><option>运营与宣传</option><option>暂未确定</option>
                </select>
              </label>
              <label className="wide">自我介绍<textarea name="introduction" required maxLength={1200} /></label>
              <label className="wide">上传简历（PDF，最大 8MB）<input name="resume" type="file" accept=".pdf,application/pdf" required /></label>
            </div>
            <button className="primary resume-submit" type="submit">确认投递 <Arrow /></button>
            <p className="resume-destination">我们期待你的加入。</p>
            <p className="resume-status" role="status">{resumeStatus}</p>
          </form>
        </div>
      )}
    </main>
  );
}
