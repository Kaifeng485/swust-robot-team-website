import Link from "next/link";

export default function RecordsPage() {
  return (
    <main className="inner-page">
      <header className="inner-nav"><Link href="/explore">← 返回探索</Link><b>历届纪录</b></header>
      <section className="inner-hero"><p className="eyebrow">TEAM LEGACY</p><h1>每一届，都是<br /><span>新的起点</span></h1><p>这里将持续整理机器人小组的历届赛事、关键作品、成绩与技术传承。</p></section>
      <section className="story-list">
        {["2025 · 全国大学生机器人大赛", "2024 · 区域赛与技术迭代", "2023 · 训练与机器人原型"].map((item, i) => <article key={item}><span>0{i + 1}</span><h2>{item}</h2><p>完整纪录正在持续整理中，后续将加入照片、视频、参赛成员与技术复盘。</p></article>)}
      </section>
    </main>
  );
}
