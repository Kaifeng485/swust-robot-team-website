import Link from "next/link";
import { defaultContent } from "../site-content";

const values = [
  { icon: "✦", title: "创新驱动", text: "不盲目复制答案，用工程方法找到更好的解法。" },
  { icon: "◎", title: "团队协作", text: "机械、电控、视觉与策略彼此连接，共同完成整机。" },
  { icon: "△", title: "追求卓越", text: "把每一次测试、复盘与迭代做到更稳定、更可靠。" },
  { icon: "◇", title: "开放包容", text: "欢迎不同专业与经历的人，在真实项目中共同成长。" },
];

export default function RecruitmentPage() {
  const content = defaultContent;

  return (
    <main className="recruit-page">
      <header className="inner-nav">
        <Link href="/">← 返回官网</Link>
        <b>SWUST ROBOT TEAM · RECRUITMENT</b>
      </header>

      <section className="recruit-hero">
        <div className="recruit-grid" aria-hidden="true" />
        <p className="eyebrow">{content.recruitmentEyebrow}</p>
        <h1>{content.recruitmentTitle}<br /><span>{content.recruitmentHighlight}</span></h1>
        <p>{content.recruitmentText}</p>
        <a href="#directions" className="primary">查看招新方向 <Arrow /></a>
      </section>

      <section className="recruit-values" aria-label="团队价值观">
        {values.map((value) => (
          <article className="recruit-value" key={value.title}>
            <span aria-hidden="true">{value.icon}</span>
            <h3>{value.title}</h3>
            <p>{value.text}</p>
          </article>
        ))}
      </section>

      <section className="recruit-directions" id="directions">
        <div className="recruit-section-head">
          <p className="eyebrow">RECRUITING DIRECTIONS</p>
          <h2>找到你的<span>位置</span></h2>
        </div>
        <div className="recruit-cards">
          {content.recruitmentDirections.map((direction) => (
            <article key={direction.id}>
              <b>{direction.number}</b>
              <h3>{direction.title}</h3>
              <p>{direction.text}</p>
              <i />
            </article>
          ))}
        </div>
      </section>

      <section className="recruit-apply" id="apply">
        <p className="eyebrow">{content.recruitmentApplyEyebrow}</p>
        <h2>{content.recruitmentApplyTitle}</h2>
        <p>{content.recruitmentApplyText}</p>
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
