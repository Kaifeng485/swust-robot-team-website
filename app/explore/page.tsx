"use client";

import Link from "next/link";
import { useState } from "react";
import { defaultContent } from "../site-content";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

function assetUrl(url: string) {
  return url.startsWith("/") ? `${basePath}${url}` : url;
}

export default function ExplorePage() {
  const [active, setActive] = useState(0);
  const options = defaultContent.exploreCards;

  const move = (direction: number) => {
    setActive((current) => (current + direction + options.length) % options.length);
  };

  return (
    <main className="inner-page explore-page">
      <header className="inner-nav"><Link href="/">← 返回首页</Link><b>SWUST ROBOT TEAM</b></header>
      <section className="photo-carousel" aria-roledescription="carousel" aria-label="战队照片展示">
        {options.map((option, index) => (
          <article className={index === active ? "photo-slide active" : "photo-slide"} key={option.id} aria-hidden={index !== active}>
            <img
              src={assetUrl(option.image || defaultContent.seasons[index]?.image || defaultContent.heroBackgroundImage || "/gate.webp")}
              alt={`${option.title}照片`}
              loading={index === 0 ? "eager" : "lazy"}
              decoding="async"
            />
            <div className="photo-shade" />
            <div className="photo-copy">
              <p>{option.number} / {option.englishTitle}</p>
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
              <button key={option.id} className={index === active ? "active" : ""} onClick={() => setActive(index)} aria-label={`查看${option.title}`} />
            ))}
          </div>
          <button onClick={() => move(1)} aria-label="下一张照片">→</button>
        </div>
      </section>
    </main>
  );
}
