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
  heroTitle: "西南科技大学",
  heroHighlight: "机器人小组",
  heroText: "一群热爱机器人、创造与挑战的年轻人。\n我们用机械赋予力量，用代码注入灵魂。",
  heroBackgroundImage: "/gate.png",
  aboutEyebrow: "WHO WE ARE",
  aboutTitle: "98%的人在这里被打败，但100%的人会收获成长！",
  aboutText:
    "机器人小组成立于2002年，自成立之初便开始参与ROBOCON赛事。团队坐落于德诚创意工厂（东九B座实验楼），经过二十余年的不断奋斗，已经形成了现如今的庞大规模，在ROBOCON赛事上成绩斐然。作为ROBOCON赛事的元老级团队，曾在主赛道获得全国冠军和多次全国一等奖，在马术赛道亦斩获颇丰，获得多次全国一等。多年以来，实验室陆续培养了数百名优秀工程师，为西南科技大学和社会的科技发展做出突出贡献。",
  aboutStats: [
    { value: "2002", label: "成立时间" },
    { value: "40+", label: "每年团队成员" },
    { value: "∞", label: "探索的边界" },
  ],
  contactTitle: "下一台机器人，下一场比赛，等你一起创造。",
  contactText:
    "无论你擅长机械、电子、编程，还是刚刚对机器人产生兴趣，这里都有属于你的起点。",
  contactEmail: "2197974202@qq.com",
  galleryPhotos: [
    { id: "gallery-2025", title: "全国大学生机器人大赛", caption: "2025 · ROBOCON", image: "/gate.png" },
    { id: "gallery-2024", title: "区域赛 · 赛场纪实", caption: "2024 · MATCH DAY", image: "/gate.png" },
    { id: "gallery-2023", title: "机器人小组训练记录", caption: "2023 · LAB NOTES", image: "/gate.png" },
  ],
  seasons: [
    { id: "2025", year: "2026", title: "武林至尊", kind: "ROBOCON", note: "从机械结构到自主控制，我们把每一次试错都变成下一次出发的底气。", image: "/gate.png", video: "" },
    { id: "2024", year: "2025", title: "飞升上蓝", kind: "ROBOCON", note: "调试、协作、冲刺——镜头记录赛场内外每一个重要瞬间。", image: "/gate.png", video: "https://www.bilibili.com/video/BV1Xn4y1f7YB/" },
    { id: "2023", year: "2024", title: "颗粒归仓", kind: "ROBOCON", note: "从零件到整机，从第一行代码到稳定运行，见证作品逐步成形。", image: "/uploads/2024-robocon.jpg", video: "https://www.bilibili.com/video/BV1eXSkY3EoH/" },
  ],
  pages: [],
};
