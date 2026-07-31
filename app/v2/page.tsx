import Link from "next/link";
import { defaultContent } from "../site-content";
import "./v2.css";
import "./v2-polish.css";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const asset = (path: string) => (path.startsWith("/") ? `${basePath}${path}` : path);

const disciplines = [
  { no: "01", name: "MECHANICAL", cn: "机械设计", text: "从任务拆解、结构设计到加工装配，让每一个机构都服务于速度、稳定与可靠性。" },
  { no: "02", name: "EMBEDDED", cn: "电控系统", text: "构建供电、驱动、传感与通信系统，让机器人拥有稳定运行的神经网络。" },
  { no: "03", name: "CONTROL", cn: "运动控制", text: "把模型、轨迹与反馈写进代码，让高速运动依然精准、可控。" },
  { no: "04", name: "VISION", cn: "机器视觉", text: "从目标识别、定位到策略决策，完成从感知到行动的闭环。" },
];

export default function V2Page() {
  const gallery = defaultContent.galleryPhotos.slice(0, 7);
  const seasons = defaultContent.seasons.slice(0, 3);
  const hero = gallery[5]?.image || gallery[0]?.image || defaultContent.heroBackgroundImage || "/gate.webp";

  return (
    <main className="v2-site">
      <header className="v2-nav">
        <Link href="/" className="v2-brand"><img src={asset("/logo-transparent.webp")} alt="" /><span>SWUST ROBOTICS</span></Link>
        <nav><a href="#manifesto">理念</a><a href="#engineering">工程</a><a href="#robocon">赛场</a><a href="#join">加入</a></nav>
        <span className="v2-index">V2 / MIANYANG</span>
      </header>

      <section className="v2-hero">
        <div className="v2-grid" /><div className="v2-noise" />
        <div className="v2-hero-media"><img src={asset(hero)} alt="西南科技大学机器人小组" /></div>
        <div className="v2-hero-shade" />
        <div className="v2-hero-copy">
          <p className="v2-overline">SOUTHWEST UNIVERSITY OF SCIENCE AND TECHNOLOGY · EST. 2002</p>
          <h1 className="v2-hero-title-cn">机器人小组</h1>
          <p className="v2-hero-title-en">BUILD INTELLIGENCE INTO MOTION</p>
          <div className="v2-hero-bottom">
            <p><strong>西南科技大学机器人小组</strong>用机械赋予力量，用代码注入灵魂。<br />Engineering is where imagination becomes motion.</p>
            <a href="#manifesto">探索战队 <b>↓</b></a>
          </div>
        </div>
        <span className="v2-coordinate left">31.534° N</span><span className="v2-coordinate right">104.697° E</span>
      </section>

      <section className="v2-manifesto" id="manifesto">
        <div className="v2-section-mark"><span>01</span><b>OUR MANIFESTO / 我们相信</b></div>
        <p className="v2-manifesto-lead">A ROBOT IS NEVER JUST A MACHINE.</p>
        <h2>它是结构、电子、控制、视觉与人的意志，在同一个目标下完成的<em>系统协作</em>。</h2>
        <div className="v2-manifesto-meta">
          <p>自 2002 年起，我们持续参与机器人竞赛与工程实践。方案在白板上诞生，在实验室里迭代，最终在赛场上接受检验。</p>
          <div><strong>2002</strong><span>TEAM FOUNDED / 成立</span></div><div><strong>40+</strong><span>ENGINEERS / YEAR</span></div>
        </div>
      </section>

      <section className="v2-product">
        <div className="v2-product-image"><img src={asset(gallery[2]?.image || "/gate.webp")} alt="参赛机器人" /></div>
        <div className="v2-product-ui top"><span>ROBOT PLATFORM / 参赛平台</span><span>SWUST · R SERIES</span></div>
        <div className="v2-product-ui bottom"><span>DESIGNED FOR THE FIELD</span><span>PROTOTYPE → TEST → COMPETE</span></div>
        <div className="v2-product-copy"><p>ENGINEERED, NOT ASSEMBLED.</p><h2>每一颗螺栓，<br />都有它存在的理由。<small>EVERY DETAIL EXISTS FOR A REASON.</small></h2></div>
      </section>

      <section className="v2-engineering" id="engineering">
        <div className="v2-section-head"><div className="v2-section-mark"><span>02</span><b>ENGINEERING / 工程系统</b></div><h2>ONE SYSTEM.<br />FOUR DISCIPLINES.</h2></div>
        <div className="v2-discipline-list">{disciplines.map((item) => <article key={item.no}><span>{item.no}</span><div><h3>{item.name}</h3><b>{item.cn}</b></div><p>{item.text}</p><i>↗</i></article>)}</div>
      </section>

      <section className="v2-robocon" id="robocon">
        <div className="v2-robocon-bg"><img src={asset(gallery[0]?.image || "/gate.webp")} alt="ROBOCON 赛场" /></div><div className="v2-robocon-overlay" />
        <div className="v2-robocon-copy"><div className="v2-section-mark light"><span>03</span><b>ROBOCON / 全国大学生机器人大赛</b></div><p>THE FIELD IS THE FINAL TEST.</p><h2><span>TEN MONTHS OF WORK. A FEW MINUTES ON THE FIELD.</span>十个月的设计、制造与调试，最终被压缩进赛场上的几分钟。</h2></div>
        <div className="v2-process">{[["01","CONCEPT / 方案"],["02","PROTOTYPE / 原型"],["03","INTEGRATION / 联调"],["04","FIELD TEST / 赛场"]].map(([n,t]) => <div key={n}><span>{n}</span><b>{t}</b></div>)}</div>
      </section>

      <section className="v2-space">
        <div className="v2-space-head"><div className="v2-section-mark"><span>04</span><b>THE LAB / 实验室</b></div><div><h2>WHERE IDEAS<br />BECOME REAL.</h2><p>这里既是加工、调试与讨论发生的地方，也是不同专业、不同年级共同完成一台机器人的起点。</p></div></div>
        <div className="v2-space-grid">
          <figure><img src={asset(gallery[4]?.image || "/gate.webp")} alt="实验室空间" /><figcaption><span>01 / LAB SPACE</span><span>实验室</span></figcaption></figure>
          <figure><img src={asset(gallery[6]?.image || gallery[3]?.image || "/gate.webp")} alt="荣誉展示" /><figcaption><span>02 / LEGACY</span><span>荣誉与传承</span></figcaption></figure>
          <figure><img src={asset(gallery[3]?.image || "/gate.webp")} alt="团队成果" /><figcaption><span>03 / RESULTS</span><span>工程成果</span></figcaption></figure>
        </div>
      </section>

      <section className="v2-seasons">
        <div className="v2-section-head dark"><div className="v2-section-mark"><span>05</span><b>SEASON ARCHIVE / 历届赛季</b></div><h2>SEASONS<br />IN MOTION.</h2></div>
        <div className="v2-season-grid">{seasons.map((season,index)=><article key={season.id} className={index===0?"featured":""}><img src={asset(index===0?(gallery[0]?.image||season.image):(season.image||gallery[index]?.image||"/gate.webp"))} alt={season.title}/><div className="v2-season-shade"/><span>0{index+1} / {season.kind}</span><div><h3>{season.year}</h3><p>{season.title}</p></div></article>)}</div>
      </section>

      <section className="v2-gallery"><div className="v2-marquee"><span>DESIGN / BUILD / TEST / REPEAT / 设计 / 制造 / 调试 / 再出发 / </span><span>DESIGN / BUILD / TEST / REPEAT / 设计 / 制造 / 调试 / 再出发 / </span></div><div className="v2-gallery-strip">{gallery.map((photo,index)=><figure key={photo.id}><img src={asset(photo.image)} alt={photo.title}/><figcaption><span>0{index+1}</span><b>{photo.title}</b><em>{photo.caption}</em></figcaption></figure>)}</div></section>

      <section className="v2-join" id="join">
        <svg className="v2-circuit" viewBox="0 0 1600 900" preserveAspectRatio="none" aria-hidden="true"><g><path d="M0 145H220L300 225H500"/><path d="M0 330H300L370 260H590"/><path d="M0 650H210L330 530H520"/><path d="M1600 120H1370L1280 210H1090"/><path d="M1600 390H1350L1260 300H1050"/><path d="M1600 710H1390L1280 600H1060"/></g><g className="nodes"><circle cx="220" cy="145" r="7"/><circle cx="370" cy="260" r="7"/><circle cx="330" cy="530" r="7"/><circle cx="1370" cy="120" r="7"/><circle cx="1260" cy="300" r="7"/><circle cx="1280" cy="600" r="7"/></g></svg>
        <img className="v2-join-logo" src={asset("/logo-transparent.webp")} alt="" />
        <div className="v2-join-copy"><p>下一台机器人，需要你的参与 · THE NEXT SYSTEM NEEDS YOU.</p><h2>JOIN<br />THE<br />FUTURE.</h2><a href={`mailto:${defaultContent.contactEmail}`}>加入我们 / APPLY <span>↗</span></a></div>
        <footer><span>SWUST ROBOTICS © 2027</span><Link href="/">返回当前官网</Link><span>MIANYANG / CHINA</span></footer>
      </section>
    </main>
  );
}
