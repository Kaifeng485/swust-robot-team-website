import Link from "next/link";
import { defaultContent } from "../site-content";
import "./v2.css";
import "./v2-polish.css";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const asset = (path: string) => (path.startsWith("/") ? `${basePath}${path}` : path);

const disciplines = [
  { no: "01", name: "MECHANICAL", cn: "机械设计", text: "从任务拆解、结构设计到加工装配，让每一个机构都为速度、稳定与可靠性服务。" },
  { no: "02", name: "EMBEDDED", cn: "电控系统", text: "构建供电、驱动、传感与通信系统，让整台机器人拥有稳定运行的神经网络。" },
  { no: "03", name: "CONTROL", cn: "运动控制", text: "把模型、轨迹与反馈写进代码，让机器人在高速运动中依然精准响应。" },
  { no: "04", name: "VISION", cn: "机器视觉", text: "让机器人理解赛场，从目标识别、定位到策略决策，完成从感知到行动的闭环。" },
];

export default function V2Page() {
  const gallery = defaultContent.galleryPhotos.slice(0, 5);
  const seasons = defaultContent.seasons.slice(0, 3);

  return (
    <main className="v2-site">
      <header className="v2-nav">
        <Link href="/" className="v2-brand">
          <img src={asset("/logo-transparent.webp")} alt="SWUST Robot Team" />
          <span>SWUST ROBOTICS</span>
        </Link>
        <nav>
          <a href="#manifesto">Manifesto</a>
          <a href="#engineering">Engineering</a>
          <a href="#robocon">ROBOCON</a>
          <a href="#join">Join</a>
        </nav>
        <span className="v2-index">V2 / 2027</span>
      </header>

      <section className="v2-hero">
        <div className="v2-grid" />
        <div className="v2-noise" />
        <div className="v2-hero-media">
          <img src={asset(defaultContent.heroBackgroundImage || "/gate.webp")} alt="机器人小组" />
        </div>
        <div className="v2-hero-shade" />
        <div className="v2-hero-copy">
          <p className="v2-overline">SOUTHWEST UNIVERSITY OF SCIENCE AND TECHNOLOGY</p>
          <img className="v2-hero-calligraphy" src={asset("/robot-team-calligraphy.svg")} alt="机器人小组" />
          <h1><span>BUILD</span><span>INTELLIGENCE</span><span>INTO MOTION.</span></h1>
          <div className="v2-hero-bottom">
            <p>西南科技大学机器人小组<br />用机械赋予力量，用代码注入灵魂。</p>
            <a href="#manifesto">SCROLL TO EXPLORE <b>↓</b></a>
          </div>
        </div>
        <span className="v2-coordinate left">31.534° N</span>
        <span className="v2-coordinate right">104.697° E</span>
      </section>

      <section className="v2-manifesto" id="manifesto">
        <div className="v2-section-mark"><span>01</span><b>MANIFESTO</b></div>
        <p className="v2-manifesto-lead">A ROBOT IS NOT A MACHINE.</p>
        <h2>它是结构、电子、控制、视觉与人的意志，在同一个目标下完成的系统协作。</h2>
        <div className="v2-manifesto-meta">
          <p>成立于 2002 年。二十余年持续参与机器人竞赛与工程实践，将课堂中的理论转化为可以在真实赛场运行的系统。</p>
          <div><strong>2002</strong><span>TEAM FOUNDED</span></div>
          <div><strong>40+</strong><span>ENGINEERS / YEAR</span></div>
        </div>
      </section>

      <section className="v2-product">
        <div className="v2-product-image"><img src={asset(gallery[1]?.image || "/gate.webp")} alt="参赛机器人" /></div>
        <div className="v2-product-ui top"><span>ROBOT PLATFORM</span><span>SWUST / R-Series</span></div>
        <div className="v2-product-ui bottom"><span>DESIGNED FOR THE FIELD</span><span>PROTOTYPE → TEST → COMPETE</span></div>
        <div className="v2-product-copy"><p>ENGINEERED, NOT ASSEMBLED.</p><h2>每一颗螺栓，<br />都有它存在的理由。</h2></div>
      </section>

      <section className="v2-engineering" id="engineering">
        <div className="v2-section-head"><div className="v2-section-mark"><span>02</span><b>ENGINEERING</b></div><h2>ONE SYSTEM.<br />FOUR DISCIPLINES.</h2></div>
        <div className="v2-discipline-list">
          {disciplines.map((item) => (
            <article key={item.no}>
              <span>{item.no}</span>
              <div><h3>{item.name}</h3><b>{item.cn}</b></div>
              <p>{item.text}</p>
              <i>↗</i>
            </article>
          ))}
        </div>
      </section>

      <section className="v2-robocon" id="robocon">
        <div className="v2-robocon-bg"><img src={asset(gallery[0]?.image || "/gate.webp")} alt="ROBOCON 赛场" /></div>
        <div className="v2-robocon-overlay" />
        <div className="v2-robocon-copy">
          <div className="v2-section-mark light"><span>03</span><b>ROBOCON</b></div>
          <p>THE FIELD IS THE FINAL TEST.</p>
          <h2>十个月的设计、制造与调试，最终被压缩进赛场上的几分钟。</h2>
        </div>
        <div className="v2-process">
          {[["01","CONCEPT"],["02","PROTOTYPE"],["03","INTEGRATION"],["04","FIELD TEST"]].map(([n,t]) => <div key={n}><span>{n}</span><b>{t}</b></div>)}
        </div>
      </section>

      <section className="v2-seasons">
        <div className="v2-section-head dark"><div className="v2-section-mark"><span>04</span><b>ARCHIVE</b></div><h2>SEASONS<br />IN MOTION.</h2></div>
        <div className="v2-season-grid">
          {seasons.map((season, index) => (
            <article key={season.id} className={index === 0 ? "featured" : ""}>
              <img src={asset(season.image || gallery[index]?.image || "/gate.webp")} alt={season.title} />
              <div className="v2-season-shade" />
              <span>{String(index + 1).padStart(2,"0")} / {season.kind}</span>
              <div><h3>{season.year}</h3><p>{season.title}</p></div>
            </article>
          ))}
        </div>
      </section>

      <section className="v2-gallery">
        <div className="v2-marquee"><span>DESIGN / BUILD / TEST / REPEAT / </span><span>DESIGN / BUILD / TEST / REPEAT / </span></div>
        <div className="v2-gallery-strip">
          {gallery.map((photo, index) => <figure key={photo.id}><img src={asset(photo.image)} alt={photo.title} /><figcaption><span>0{index+1}</span><b>{photo.title}</b><em>{photo.caption}</em></figcaption></figure>)}
        </div>
      </section>

      <section className="v2-join" id="join">
        <svg className="v2-circuit" viewBox="0 0 1600 900" preserveAspectRatio="none" aria-hidden="true">
          <g><path d="M0 145H220L300 225H500"/><path d="M0 330H300L370 260H590"/><path d="M0 650H210L330 530H520"/><path d="M1600 120H1370L1280 210H1090"/><path d="M1600 390H1350L1260 300H1050"/><path d="M1600 710H1390L1280 600H1060"/></g>
          <g className="nodes"><circle cx="220" cy="145" r="7"/><circle cx="370" cy="260" r="7"/><circle cx="330" cy="530" r="7"/><circle cx="1370" cy="120" r="7"/><circle cx="1260" cy="300" r="7"/><circle cx="1280" cy="600" r="7"/></g>
        </svg>
        <img className="v2-join-logo" src={asset("/logo-transparent.webp")} alt="" />
        <div className="v2-join-copy"><p>THE NEXT SYSTEM NEEDS YOU.</p><h2>JOIN<br />THE<br />FUTURE.</h2><a href={`mailto:${defaultContent.contactEmail}`}>APPLY NOW <span>↗</span></a></div>
        <footer><span>SWUST ROBOTICS © 2027</span><Link href="/">CURRENT WEBSITE</Link><span>MIANYANG / CHINA</span></footer>
      </section>
    </main>
  );
}
