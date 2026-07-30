export type Season = {
  id: string;
  year: string;
  title: string;
  kind: string;
  note: string;
  image: string;
  video: string;
};

export type CustomPage = {
  id: string;
  slug: string;
  navLabel: string;
  eyebrow: string;
  title: string;
  body: string;
  backgroundImage: string;
  visible: boolean;
};

export type AboutStat = {
  value: string;
  label: string;
};

export type GalleryPhoto = {
  id: string;
  title: string;
  caption: string;
  image: string;
};

export type SiteContent = {
  heroTitle: string;
  heroHighlight: string;
  heroText: string;
  heroBackgroundImage: string;
  aboutEyebrow: string;
  aboutTitle: string;
  aboutText: string;
  aboutStats: AboutStat[];
  contactTitle: string;
  contactText: string;
  contactEmail: string;
  galleryPhotos: GalleryPhoto[];
  seasons: Season[];
  pages: CustomPage[];
};

export const defaultContent: SiteContent = {
  heroTitle: "让想象成为",
  heroHighlight: "机器",
  heroText: "一群热爱机器人、创造与挑战的年轻人。\n我们用机械赋予力量，用代码注入灵魂。",
  heroBackgroundImage: "/gate.png",
  aboutEyebrow: "WHO WE ARE",
  aboutTitle: "我们不只制造机器人，也在创造可能。",
  aboutText:
    "西南科技大学机器人小组是一个专注于机器人技术研发与竞赛实践的学生团队。机械、电控、视觉和算法在这里汇合，让大胆的构想一步步落地。",
  aboutStats: [
    { value: "10+", label: "年技术积累" },
    { value: "40+", label: "团队成员" },
    { value: "∞", label: "探索的边界" },
  ],
  contactTitle: "下一台机器人，等你一起创造。",
  contactText:
    "无论你擅长机械、电子、编程，还是刚刚对机器人产生兴趣，这里都有属于你的起点。",
  contactEmail: "robot@swust.edu.cn",
  galleryPhotos: [
    { id: "gallery-1", title: "全国大学生机器人大赛", caption: "备赛与赛场记录", image: "/gate.png" },
    { id: "gallery-2", title: "机器人调试现场", caption: "机械 · 电控 · 算法", image: "/gate.png" },
    { id: "gallery-3", title: "战队日常", caption: "并肩创造的每一天", image: "/gate.png" },
  ],
  seasons: [
    { id: "2025", year: "2025", title: "全国大学生机器人大赛", kind: "ROBOCON", note: "从机械结构到自主控制，我们把每一次试错都变成下一次出发的底气。", image: "/gate.png", video: "" },
    { id: "2024", year: "2024", title: "区域赛 · 赛场纪实", kind: "MATCH DAY", note: "调试、协作、冲刺——镜头记录赛场内外每一个重要瞬间。", image: "/gate.png", video: "" },
    { id: "2023", year: "2023", title: "机器人小组训练记录", kind: "LAB NOTES", note: "从零件到整机，从第一行代码到稳定运行，见证作品逐步成形。", image: "/gate.png", video: "" },
  ],
  pages: [],
};
