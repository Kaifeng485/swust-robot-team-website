import Link from "next/link";
import { defaultContent } from "../site-content";

export default function PreparationPage() {
  const content = defaultContent;

  return (
    <main className="inner-page progress-page">
      <header className="inner-nav"><Link href="/">← 返回首页</Link><b>战队备赛进度</b></header>
      <section className="inner-hero compact">
        <p className="eyebrow">{content.preparationEyebrow}</p>
        <h1>{content.preparationTitle}<span>{content.preparationHighlight}</span></h1>
        <p>{content.preparationText}</p>
      </section>
      <section className="progress-list" id="stages">
        {content.preparationSteps.map((step) => (
          <article key={step.id}>
            <span>{step.number}</span>
            <div><h2>{step.title}</h2><p>{step.status}</p><i><b style={{ width: step.progress }} /></i></div>
            <strong>{step.progress}</strong>
          </article>
        ))}
      </section>
    </main>
  );
}
