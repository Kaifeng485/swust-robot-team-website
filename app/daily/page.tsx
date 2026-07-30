import Link from "next/link";

export default function DailyPage() {
  return (
    <main className="inner-page">
      <header className="inner-nav"><Link href="/explore">← 返回探索</Link><b>战队日常</b></header>
      <section className="inner-hero"><p className="eyebrow">TEAM LIFE</p><h1>实验室里的<br /><span>每一天</span></h1><p>方案讨论、零件加工、深夜调试、赛前冲刺——真正的团队故事发生在每一个共同解决问题的瞬间。</p></section>
      <section className="daily-grid"><div><b>DESIGN</b><h2>方案讨论</h2></div><div><b>BUILD</b><h2>加工装配</h2></div><div><b>TEST</b><h2>整机联调</h2></div><div><b>TOGETHER</b><h2>团队生活</h2></div></section>
    </main>
  );
}
