"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { defaultContent } from "../site-content";
import "./v2.css";
import "./v2-polish.css";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const asset = (path: string) => (path.startsWith("/") ? `${basePath}${path}` : path);

const disciplines = [
  { no: "01", name: "MECHANICAL", cn: "机械设计", text: "从任务拆解、结构设计到加工装配，让每一个机构都为速度、稳定与可靠性服务。" },
  { no: "02", name: "EMBEDDED", cn: "电控系统", text: "构建供电、驱动、传感与通信系统，让整台机器人拥有稳定运行的神经网络。" },
  { no: "03", name: "HARDWARE", cn: "硬件开发", text: "完成电路设计、器件选型、PCB 制作与硬件调试，为机器人打造可靠的电子基础。" },
  { no: "04", name: "VISION", cn: "机器视觉", text: "让机器人理解赛场，从目标识别、定位到策略决策，完成从感知到行动的闭环。" },
];

const uploadedGallery = [
  { id: "new-01", title: "赛场调试", caption: "FIELD DEBUGGING / ROBOCON 2025", image: "/v2-gallery/2025-field-debug.webp" },
  { id: "new-02", title: "四足机器人", caption: "QUADRUPED PLATFORM / PROTOTYPE", image: "/v2-gallery/quadruped-track.webp" },
  { id: "new-03", title: "并肩作战", caption: "TEAM & MACHINES / ROBOCON", image: "/v2-gallery/robocon-team-machines.webp" },
  { id: "new-04", title: "实验室日常", caption: "TEAM BRIEFING / LAB LIFE", image: "/v2-gallery/team-briefing.webp" },
  { id: "new-05", title: "赛场执行", caption: "MATCH OPERATION / ROBOCON", image: "/v2-gallery/robocon-match.webp" },
  { id: "new-06", title: "工程细节", caption: "QUADRUPED HARDWARE / SIDE VIEW", image: "/v2-gallery/quadruped-side.webp" },
  { id: "new-08", title: "系统设计", caption: "ENGINEERING NOTES / WORK IN PROGRESS", image: "/v2-gallery/engineering-whiteboard.webp" },
  { id: "new-09", title: "机器人上场", caption: "ROBOT ON FIELD / ROBOCON", image: "/v2-gallery/robocon-robot-field.webp" },
  { id: "new-10", title: "设计验证", caption: "CAD TO REALITY / QUADRUPED", image: "/v2-gallery/quadruped-cad.webp" },
  { id: "new-11", title: "原型迭代", caption: "ROBOT PROTOTYPE / ITERATION", image: "/v2-gallery/robot-prototype.webp" },
  { id: "new-12", title: "结构正视", caption: "QUADRUPED PLATFORM / FRONT VIEW", image: "/v2-gallery/quadruped-front.webp" },
  { id: "new-13", title: "我们的实验室", caption: "DECHENG CREATIVE FACTORY / LAB", image: "/v2-gallery/lab-corridor.webp" },
];

export default function V2Page() {
  const [menuOpen, setMenuOpen] = useState(false);
  const galleryRef = useRef<HTMLDivElement>(null);
  const galleryDrag = useRef({ active: false, startX: 0, scrollLeft: 0 });

  const gallery = [...uploadedGallery, ...defaultContent.galleryPhotos.slice(0, 5)];
  const seasons = defaultContent.seasons.slice(0, 3);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  const startGalleryDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    galleryDrag.current = {
      active: true,
      startX: event.clientX,
      scrollLeft: event.currentTarget.scrollLeft,
    };
    event.currentTarget.classList.add("is-dragging");
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const moveGalleryDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!galleryDrag.current.active) return;
    event.currentTarget.scrollLeft =
      galleryDrag.current.scrollLeft - (event.clientX - galleryDrag.current.startX);
  };

  const endGalleryDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    galleryDrag.current.active = false;
    event.currentTarget.classList.remove("is-dragging");
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <main className="v2-site">
      <header className="v2-nav">
        <Link href="/" className="v2-brand">
          <img src={asset("/logo-transparent.webp")} alt="SWUST Robot Team" />
          <span><strong>西南科技大学机器人小组</strong><small>SWUST ROBOTICS</small></span>
        </Link>
        <nav className="v2-desktop-nav">
          <a href="#manifesto"><strong>团队宣言</strong><small>MANIFESTO</small></a>
          <a href="#engineering"><strong>工程方向</strong><small>ENGINEERING</small></a>
          <a href="#robocon"><strong>机器人赛事</strong><small>ROBOCON</small></a>
          <a href="#join"><strong>加入我们</strong><small>JOIN US</small></a>
        </nav>
        <div className="v2-nav-actions">
          <a className="v2-recruit-link" href={`${basePath}/recruitment/`}>
            <strong>招新官网</strong><small>RECRUITMENT</small>
          </a>
          <span className="v2-index">V2 / 2027</span>
          <button
            className={`v2-menu-toggle${menuOpen ? " is-open" : ""}`}
            type="button"
            aria-label={menuOpen ? "关闭导航菜单" : "打开导航菜单"}
            aria-expanded={menuOpen}
            aria-controls="v2-mobile-menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <i /><i />
          </button>
        </div>
      </header>

      <div
        className={`v2-mobile-menu${menuOpen ? " is-open" : ""}`}
        id="v2-mobile-menu"
        aria-hidden={!menuOpen}
      >
        <div className="v2-mobile-menu-head"><span>页面导航</span><small>SITE DIRECTORY</small></div>
        <nav aria-label="移动端导航">
          <a href="#manifesto" onClick={closeMenu}><span>01</span><strong>团队宣言</strong><small>MANIFESTO</small></a>
          <a href="#engineering" onClick={closeMenu}><span>02</span><strong>工程方向</strong><small>ENGINEERING</small></a>
          <a href="#robocon" onClick={closeMenu}><span>03</span><strong>机器人赛事</strong><small>ROBOCON</small></a>
          <a href="#join" onClick={closeMenu}><span>04</span><strong>加入我们</strong><small>JOIN US</small></a>
          <a href={`${basePath}/recruitment/`} onClick={closeMenu}><span>05</span><strong>招新官网</strong><small>RECRUITMENT</small></a>
        </nav>
        <p>西南科技大学机器人小组 <small>SWUST ROBOTICS</small></p>
      </div>

      <section className="v2-hero">
        <div className="v2-grid" />
        <div className="v2-noise" />

        <div className="v2-hero-media">
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={asset(defaultContent.heroBackgroundImage || "/gate.webp")}
            aria-label="西南科技大学机器人小组备赛影像"
          >
            <source src={asset("/v2-hero-background.mp4")} type="video/mp4" />
          </video>
        </div>

        <div className="v2-hero-shade" />

        <div className="v2-hero-copy">
          <p className="v2-overline">
            <strong>西南科技大学</strong>
            <small>SOUTHWEST UNIVERSITY OF SCIENCE AND TECHNOLOGY</small>
          </p>

          <div className="v2-hero-title-group">
            <img
              className="v2-hero-calligraphy"
              src={asset("/robot-team-calligraphy.svg")}
              alt="机器人小组"
              width="1953"
              height="332"
              draggable={false}
            />

            <h1 className="v2-hero-english-title">
              <span className="v2-title-cn">让智能，驱动未来。</span>
              <span className="v2-title-en">BUILD INTELLIGENCE INTO MOTION.</span>
            </h1>
          </div>

          <div className="v2-hero-specs" aria-label="团队数据">
            <div><strong>24+</strong><span>年团队传承<small>YEARS OF LEGACY</small></span></div>
            <div><strong>04</strong><span>大工程方向<small>DISCIPLINES</small></span></div>
            <div><strong>01</strong><span>个共同目标<small>ONE SHARED GOAL</small></span></div>
          </div>

          <div className="v2-hero-bottom">
            <p>
              西南科技大学机器人小组
              <br />
              用机械赋予力量，用代码注入灵魂。
            </p>
            <a href="#manifesto">
              <strong>向下探索</strong><small>SCROLL TO EXPLORE</small><b>↓</b>
            </a>
          </div>
        </div>

        <span className="v2-coordinate left">31.534° N</span>
        <span className="v2-coordinate right">104.697° E</span>
      </section>

      <section className="v2-manifesto" id="manifesto">
        <div className="v2-section-mark"><span>01</span><div><strong>团队宣言</strong><b>MANIFESTO</b></div></div>
        <p className="v2-manifesto-lead"><strong>机器人，从来不只是一台机器。</strong><small>A ROBOT IS NOT JUST A MACHINE.</small></p>
        <h2>99%的人在这里被打败，但100%的人在这里收获成长！</h2>
        <div className="v2-manifesto-meta">
          <p>机器人小组成立于2002年，自成立之初便开始参与ROBOCON赛事。团队坐落于德诚创意工厂（东九B座实验楼），经过二十余年的不断奋斗，已经形成了现如今的庞大规模，在ROBOCON赛事上成绩斐然。作为ROBOCON赛事的元老级团队，曾在主赛道获得全国冠军和多次全国一等奖，在马术赛道亦斩获颇丰，获得多次全国一等。多年以来，实验室陆续培养了数百名优秀工程师，为西南科技大学和社会的科技发展做出突出贡献。</p>
          <div><strong>2002</strong><span><b>团队成立</b><small>TEAM FOUNDED</small></span></div>
          <div><strong>40+</strong><span><b>每年工程成员</b><small>ENGINEERS / YEAR</small></span></div>
        </div>
      </section>

      <section className="v2-product">
        <div className="v2-product-image"><img src={asset(gallery[1]?.image || "/gate.webp")} alt="参赛机器人" loading="lazy" decoding="async" /></div>
        <div className="v2-product-ui top"><span><b>机器人平台</b><small>ROBOT PLATFORM</small></span><span><b>西科大机器人系列</b><small>SWUST / R-Series</small></span></div>
        <div className="v2-product-ui bottom"><span><b>为赛场而生</b><small>DESIGNED FOR THE FIELD</small></span><span><b>原型 → 测试 → 参赛</b><small>PROTOTYPE → TEST → COMPETE</small></span></div>
        <div className="v2-product-copy"><p><strong>工程设计，而非简单组装。</strong><small>ENGINEERED, NOT ASSEMBLED.</small></p><h2>每一颗螺栓，<br />都有它存在的理由。</h2></div>
      </section>

      <section className="v2-engineering" id="engineering">
        <div className="v2-section-head"><div className="v2-section-mark"><span>02</span><div><strong>工程方向</strong><b>ENGINEERING</b></div></div><h2><strong>一个系统，<br />四大方向。</strong><small>ONE SYSTEM. FOUR DISCIPLINES.</small></h2></div>
        <div className="v2-discipline-list">
          {disciplines.map((item) => (
            <article key={item.no}>
              <span>{item.no}</span>
              <div><h3>{item.cn}</h3><b>{item.name}</b></div>
              <p>{item.text}</p>
              <i>↗</i>
            </article>
          ))}
        </div>
      </section>

      <section className="v2-robocon" id="robocon">
        <div className="v2-robocon-bg"><img src={asset(gallery[0]?.image || "/gate.webp")} alt="ROBOCON 赛场" loading="lazy" decoding="async" /></div>
        <div className="v2-robocon-overlay" />
        <div className="v2-robocon-copy">
          <div className="v2-section-mark light"><span>03</span><div><strong>机器人赛事</strong><b>ROBOCON</b></div></div>
          <p><strong>赛场，是系统的最终检验。</strong><small>THE FIELD IS THE FINAL TEST.</small></p>
          <h2>十个月的设计、制造与调试，最终被压缩进赛场上的几分钟。</h2>
        </div>
        <div className="v2-process">
          {[["01","概念设计","CONCEPT"],["02","原型制造","PROTOTYPE"],["03","系统集成","INTEGRATION"],["04","赛场测试","FIELD TEST"]].map(([n,cn,en]) => <div key={n}><span>{n}</span><strong>{cn}</strong><b>{en}</b></div>)}
        </div>
      </section>

      <section className="v2-seasons">
        <div className="v2-section-head dark"><div className="v2-section-mark"><span>04</span><div><strong>赛季档案</strong><b>ARCHIVE</b></div></div><h2><strong>赛季，<br />永不停步。</strong><small>SEASONS IN MOTION.</small></h2></div>
        <div className="v2-season-grid">
          {seasons.map((season, index) => (
            <article key={season.id} className={index === 0 ? "featured" : ""}>
              <img src={asset(season.image || gallery[index]?.image || "/gate.webp")} alt={season.title} loading="lazy" decoding="async" />
              <div className="v2-season-shade" />
              <span>{String(index + 1).padStart(2,"0")} / {season.kind}</span>
              <div><h3>{season.year}</h3><p>{season.title}</p></div>
            </article>
          ))}
        </div>
      </section>

      <section className="v2-gallery">
        <div className="v2-marquee"><span><strong>设计 / 制造 / 测试 / 再出发 / </strong><small>DESIGN / BUILD / TEST / REPEAT /</small></span><span><strong>设计 / 制造 / 测试 / 再出发 / </strong><small>DESIGN / BUILD / TEST / REPEAT /</small></span></div>
        <div
          className="v2-gallery-strip"
          ref={galleryRef}
          onPointerDown={startGalleryDrag}
          onPointerMove={moveGalleryDrag}
          onPointerUp={endGalleryDrag}
          onPointerCancel={endGalleryDrag}
          onPointerLeave={(event) => {
            if (galleryDrag.current.active) endGalleryDrag(event);
          }}
          aria-label="团队照片，可按住鼠标左右拖动或使用滚轮浏览"
        >
          {gallery.map((photo, index) => <figure key={photo.id}><img src={asset(photo.image)} alt={photo.title} loading="lazy" decoding="async" /><figcaption><span>0{index+1}</span><b>{photo.title}</b><em>{photo.caption}</em></figcaption></figure>)}
        </div>
      </section>

      <section className="v2-join" id="join">
        <svg className="v2-circuit" viewBox="0 0 1600 900" preserveAspectRatio="none" aria-hidden="true">
          <g><path d="M0 145H220L300 225H500"/><path d="M0 330H300L370 260H590"/><path d="M0 650H210L330 530H520"/><path d="M1600 120H1370L1280 210H1090"/><path d="M1600 390H1350L1260 300H1050"/><path d="M1600 710H1390L1280 600H1060"/></g>
          <g className="nodes"><circle cx="220" cy="145" r="7"/><circle cx="370" cy="260" r="7"/><circle cx="330" cy="530" r="7"/><circle cx="1370" cy="120" r="7"/><circle cx="1260" cy="300" r="7"/><circle cx="1280" cy="600" r="7"/></g>
        </svg>
        <img className="v2-join-logo" src={asset("/logo-transparent.webp")} alt="" />
        <div className="v2-join-copy"><p><strong>下一个机器人系统，需要你。</strong><small>THE NEXT SYSTEM NEEDS YOU.</small></p><h2><strong>加入我们</strong><small>JOIN US.</small></h2><a href={`mailto:${defaultContent.contactEmail}`}><strong>立即报名</strong><small>APPLY NOW</small><span>↗</span></a></div>
        <footer><span><b>西科大机器人小组</b><small>SWUST ROBOTICS © 2027</small></span><Link href="/"><b>返回当前官网</b><small>CURRENT WEBSITE</small></Link><span><b>中国 · 绵阳</b><small>MIANYANG / CHINA</small></span></footer>
      </section>
    </main>
  );
}
