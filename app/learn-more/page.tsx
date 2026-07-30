import Link from "next/link";

export default function LearnMorePage() {
  return (
    <main className="inner-page">
      <header className="inner-nav"><Link href="/explore">← 返回探索</Link><b>了解更多</b></header>
      <section className="inner-hero"><p className="eyebrow">ABOUT THE TEAM</p><h1>把兴趣变成<br /><span>工程能力</span></h1><p>我们以真实机器人项目为载体，让机械、电控、视觉、算法和软件成员围绕共同目标协作。</p></section>
      <section className="story-list">
        <article><span>01</span><h2>跨专业协作</h2><p>从需求分析到整机联调，每个方向都参与完整工程闭环。</p></article>
        <article><span>02</span><h2>以赛促学</h2><p>在明确的比赛目标和截止时间中，学习设计、实现、测试与复盘。</p></article>
        <article><span>03</span><h2>技术传承</h2><p>通过文档、分享、代码规范与师徒协作，让经验沉淀为团队能力。</p></article>
      </section>
    </main>
  );
}
