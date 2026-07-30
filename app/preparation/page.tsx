import Link from "next/link";

const steps = [
  ["01", "需求分析与方案设计", "已完成", "100%"],
  ["02", "机械结构加工与装配", "进行中", "72%"],
  ["03", "电控系统与底层驱动", "进行中", "58%"],
  ["04", "视觉算法与策略联调", "准备中", "35%"],
  ["05", "整机测试与赛场模拟", "待开始", "10%"],
];

export default function PreparationPage() {
  return (
    <main className="inner-page progress-page">
      <header className="inner-nav"><Link href="/">← 返回首页</Link><b>战队备赛进度</b></header>
      <section className="inner-hero compact"><p className="eyebrow">ROAD TO ROBOCON</p><h1>向赛场，<span>全力推进</span></h1><p>记录从方案到整机的每一个关键节点。进度为当前展示示例，可在后续替换为战队真实数据。</p></section>
      <section className="progress-list">
        {steps.map(([no, title, status, width]) => <article key={no}><span>{no}</span><div><h2>{title}</h2><p>{status}</p><i><b style={{ width }} /></i></div><strong>{width}</strong></article>)}
      </section>
    </main>
  );
}
