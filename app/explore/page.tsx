"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { defaultContent, type SiteContent } from "../site-content";

const options = [
  { href: "/records", number: "01", title: "历届纪录", en: "TEAM LEGACY", text: "回看历届赛事、重要成绩与机器人迭代轨迹。" },
  { href: "/learn-more", number: "02", title: "了解更多", en: "ABOUT THE TEAM", text: "认识团队方向、培养方式与真实的工程协作。" },
  { href: "/daily", number: "03", title: "战队日常", en: "TEAM LIFE", text: "走进实验室，记录训练、调试和并肩奋斗的时刻。" },
];

export default function ExplorePage() {
  const [active, setActive] = useState(0);
  const [content, setContent] = useState<SiteContent>(defaultContent);

  useEffect(() => {
    fetch("/api/content", { cache: "no-store" })
      .then((response) => response.json())
      .then(setContent)
      .catch(() => {});
  }, []);

  const move = (direction: number) => {
    setActive((current) => (current + direction + options.length) % options.length);
  };

  return (
    <main className="inner-page explore-page">
      <header className="inner-nav"><Link href="/">← 返回首页</Link><b>SWUST ROBOT TEAM</b></header>
      <section className="photo-carousel" aria-roledescription="carousel" aria-label="战队照片展示">
        {options.map((option, index) => (
          <article className={index === active ? "photo-slide active" : "photo-slide"} key={option.href} aria-hidden={index !== active}>
            <img src={content.seasons[index]?.image || content.heroBackgroundImage || "/gate.png"} alt={`${option.title}照片`} />
            <div className="photo-shade" />
            <div className="photo-copy">
              <p>{option.number} / {option.en}</p>
              <h1>{option.title}</h1>
              <span>{option.text}</span>
              <Link href={option.href}>进入页面 →</Link>
            </div>
          </article>
        ))}
        <div className="carousel-controls">
          <button onClick={() => move(-1)} aria-label="上一张照片">←</button>
          <div>
            {options.map((option, index) => (
              <button key={option.href} className={index === active ? "active" : ""} onClick={() => setActive(index)} aria-label={`查看${option.title}`} />
            ))}
          </div>
          <button onClick={() => move(1)} aria-label="下一张照片">→</button>
        </div>
      </section>
    </main>
  );
}
