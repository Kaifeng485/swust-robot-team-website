import Link from "next/link";
import { defaultContent } from "../site-content";
import "./preview.css";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const asset = (path: string) => (path.startsWith("/") ? `${basePath}${path}` : path);

const disciplines = [
  { no: "01", en: "MECHANICAL", zh: "机械结构", text: "从受力、材料到加工装配，让每一个动作都建立在可靠结构之上。" },
  { no: "02", en: "ELECTRONICS", zh: "电控系统", text: "连接传感器、执行器与能源系统，为机器人建立稳定的神经网络。" },
  { no: "03", en: "CONTROL", zh: "运动控制", text: "把动力学、规划与实时反馈写进代码，让机器精准响应赛场。" },
  { no: "04", en: "VISION", zh: "视觉感知", text: "理解环境、识别目标、估计状态，让机器人获得判断能力。" },
];

export default function ApplePreviewPage() {
  const gallery = defaultContent.galleryPhotos.slice(0, 5);
  const seasons = defaultContent.seasons.slice(0, 3);
  const hero = defaultContent.heroBackgroundImage || "/gate.webp";

  return (
    <main className="nova">
      <header className="nova-nav">
        <Link className="nova-brand" href="/">
          <img src={asset("/logo-transparent.webp")} alt="西南科技大学机器人小组" />
          <span>SWUST<br />ROBOT TEAM</span>
        </Link>
        <nav>
          <a href="#manifesto">理念</a><a href="#system">系统</a><a href="#field">赛场</a><a href="#join">加入</a>
        </nav>
        <a className="nav-index" href="#join">JOIN ↗</a>
      </header>

      <section className="nova-hero">
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-meta"><span>SWUST / MIANYANG</span><span>ENGINEERING TEAM</span><span>EST. FOR THE NEXT MATCH</span></div>
        <div className="hero-copy">
          <p className="micro">SOUTHWEST UNIVERSITY OF SCIENCE AND TECHNOLOGY</p>
          <h1><span>BUILD</span><span className="outline">BEYOND</span><span>LIMITS.</span></h1>
          <p className="hero-cn">我们不是在组装一台机器。<br />我们在建立一套能赢得赛场的工程系统。</p>
        </div>
        <div className="hero-image-wrap">
          <img src={asset(hero)} alt="西南科技大学机器人小组主视觉" />
          <div className="scan" aria-hidden="true" />
        </div>
        <a className="scroll-mark" href="#manifesto"><span>SCROLL TO EXPLORE</span><i>↓</i></a>
      </section>

      <section className="manifesto" id="manifesto">
        <div className="section-code">001 / MANIFESTO</div>
        <p className="manifesto-lead">ROBOCON 始于 2002 年。每一年，新的规则都会迫使团队重新思考机器人。</p>
        <h2>十个月。<br /><em>一个赛场答案。</em></h2>
        <div className="manifesto-foot">
          <p>从规则拆解，到机械设计、电路、控制、视觉与整机联调。真正的机器人从来不是单一专业的作品，而是许多工程判断在同一时刻正确发生。</p>
          <div><strong>10</strong><span>MONTHS<br />OF ITERATION</span></div>
        </div>
      </section>

      <section className="system" id="system">
        <div className="system-head">
          <div className="section-code inverse">002 / ONE SYSTEM</div>
          <h2>ONE ROBOT.<br />FOUR DISCIPLINES.</h2>
          <p>结构、电控、控制与视觉彼此依赖。任何一个环节失效，整台机器人就不再完整。</p>
        </div>
        <div className="discipline-list">
          {disciplines.map((item) => (
            <article key={item.no}>
              <span>{item.no}</span><h3>{item.en}<small>{item.zh}</small></h3><p>{item.text}</p><i>↗</i>
            </article>
          ))}
        </div>
      </section>

      <section className="field" id="field">
        <div className="field-sticky">
          <div className="section-code">003 / TESTED IN REALITY</div>
          <h2>THE FIELD<br /><span>NEVER LIES.</span></h2>
          <p>图纸证明它能工作。赛场证明它是否真的可靠。</p>
        </div>
        <div className="field-visuals">
          {gallery.slice(0, 3).map((photo, index) => (
            <figure key={photo.id || index} className={`field-shot shot-${index + 1}`}>
              <img src={asset(photo.image || hero)} alt={photo.title} />
              <figcaption><span>0{index + 1}</span><strong>{photo.title}</strong><small>{photo.caption}</small></figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="archive">
        <div className="archive-title"><div className="section-code inverse">004 / MATCH ARCHIVE</div><h2>PAST BUILDS.<br /><span>FUTURE DATA.</span></h2></div>
        <div className="archive-track">
          {seasons.map((season, index) => (
            <article key={season.id}>
              <div className="archive-media"><img src={asset(season.image || hero)} alt={`${season.year} ${season.title}`} /><span>0{index + 1}</span></div>
              <div className="archive-copy"><p>{season.kind}</p><h3>{season.year}</h3><h4>{season.title}</h4><small>{season.note}</small>{season.video ? <a href={season.video}>WATCH FILM ↗</a> : <span className="soon">FILM COMING SOON</span>}</div>
            </article>
          ))}
        </div>
      </section>

      <section className="principle">
        <div className="principle-image"><img src={asset((gallery[3]?.image) || hero)} alt="机器人研发现场" /></div>
        <div className="principle-copy"><div className="section-code">005 / OUR PRINCIPLE</div><p>设计不是让机器看起来复杂。</p><h2>LESS NOISE.<br />MORE <span>CONTROL.</span></h2><p>减少不必要的结构、接口与动作，把性能留给最关键的任务。克制，是工程成熟度的一部分。</p></div>
      </section>

      <section className="join" id="join">
        <svg className="join-circuit" viewBox="0 0 1600 900" preserveAspectRatio="none" aria-hidden="true">
          <g><path d="M0 120H250L310 180H470"/><path d="M0 265H180L245 330H420"/><path d="M0 690H245L320 615H470"/><path d="M0 805H170L240 735H400"/><path d="M1600 100H1375L1305 170H1130"/><path d="M1600 270H1420L1345 345H1160"/><path d="M1600 675H1370L1300 605H1135"/><path d="M1600 820H1415L1330 735H1150"/></g>
          <g>{[[250,120],[310,180],[180,265],[245,330],[245,690],[320,615],[170,805],[240,735],[1375,100],[1305,170],[1420,270],[1345,345],[1370,675],[1300,605],[1415,820],[1330,735]].map(([cx,cy],i)=><circle key={i} cx={cx} cy={cy} r="5" />)}</g>
        </svg>
        <img className="join-logo" src={asset("/logo-transparent.webp")} alt="" />
        <div className="join-copy"><p>006 / NEXT GENERATION</p><h2>JOIN<br /><span>THE BUILD.</span></h2><small>这里不要求你已经无所不能。<br />只要求你愿意把一个问题追到答案出现。</small><a href={`mailto:${defaultContent.contactEmail}?subject=${encodeURIComponent("加入西南科技大学机器人小组")}`}>APPLY NOW <i>↗</i></a></div>
      </section>

      <footer><div><img src={asset("/logo-transparent.webp")} alt="" /><span>SWUST ROBOT TEAM</span></div><p>DESIGNED FOR ENGINEERING.<br />BUILT FOR THE FIELD.</p><Link href="/">CURRENT SITE ↗</Link></footer>
    </main>
  );
}
