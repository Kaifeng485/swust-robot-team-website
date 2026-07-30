import Link from "next/link";

const directions = [
  ["01", "机械结构", "机械设计、加工装配、传动与整机可靠性"],
  ["02", "电控嵌入式", "硬件设计、底层驱动、传感器与运动控制"],
  ["03", "视觉算法", "目标识别、定位、决策与机器人智能"],
  ["04", "软件开发", "ROS 2、C++、Lua 与平台系统开发"],
];

export default function RecruitmentPage() {
  return (
    <main className="recruit-page">
      <header className="inner-nav">
        <Link href="/">← 返回官网</Link>
        <b>SWUST ROBOT TEAM · RECRUITMENT</b>
      </header>

      <section className="recruit-hero">
        <div className="recruit-grid" aria-hidden="true" />
        <p className="eyebrow">BUILD · CODE · COMPETE</p>
        <h1>加入我们，<br /><span>把想法造出来。</span></h1>
        <p>这里不只需要“已经很强”的人，更欢迎愿意学习、敢于动手、能和伙伴一起把问题解决的人。</p>
        <a href="#directions" className="primary">查看招新方向 <Arrow /></a>
      </section>

      <section className="recruit-directions" id="directions">
        <div className="recruit-section-head">
          <p className="eyebrow">RECRUITING DIRECTIONS</p>
          <h2>找到你的<span>位置</span></h2>
        </div>
        <div className="recruit-cards">
          {directions.map(([number, title, text]) => (
            <article key={number}>
              <b>{number}</b>
              <h3>{title}</h3>
              <p>{text}</p>
              <i />
            </article>
          ))}
        </div>
      </section>

      <section className="recruit-apply" id="apply">
        <p className="eyebrow">READY TO START?</p>
        <h2>你的下一段工程故事，<br />从这里开始。</h2>
        <p>返回官网，在“加入小组”区域提交个人信息与 PDF 简历。</p>
        <Link href="/#contact" className="primary">前往投递简历 <Arrow /></Link>
      </section>
    </main>
  );
}

function Arrow() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h13m-5-5 5 5-5 5" />
    </svg>
  );
}
