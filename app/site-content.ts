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

export type ExploreCard = {
  id: string;
  number: string;
  title: string;
  englishTitle: string;
  text: string;
  href: string;
  image: string;
};

export type PreparationStep = {
  id: string;
  number: string;
  title: string;
  status: string;
  progress: string;
};

export type RecruitmentDirection = {
  id: string;
  number: string;
  title: string;
  text: string;
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
  exploreCards: ExploreCard[];
  preparationEyebrow: string;
  preparationTitle: string;
  preparationHighlight: string;
  preparationText: string;
  preparationSteps: PreparationStep[];
  recruitmentEyebrow: string;
  recruitmentTitle: string;
  recruitmentHighlight: string;
  recruitmentText: string;
  recruitmentDirections: RecruitmentDirection[];
  recruitmentApplyEyebrow: string;
  recruitmentApplyTitle: string;
  recruitmentApplyText: string;
};

export const defaultContent: SiteContent = {
  "heroTitle": "西南科技大学",
  "heroHighlight": "机器人小组",
  "heroText": "一群热爱机器人、创造与挑战的年轻人。\n我们用机械赋予力量，用代码注入灵魂。",
  "heroBackgroundImage": "/gate.webp",
  "aboutEyebrow": "WHO WE ARE",
  "aboutTitle": "98%的人在这里被打败，但100%的人会收获成长！",
  "aboutText": "机器人小组成立于2002年，自成立之初便开始参与ROBOCON赛事。团队坐落于德诚创意工厂（东九B座实验楼），经过二十余年的不断奋斗，已经形成了现如今的庞大规模，在ROBOCON赛事上成绩斐然。作为ROBOCON赛事的元老级团队，曾在主赛道获得全国冠军和多次全国一等奖，在马术赛道亦斩获颇丰，获得多次全国一等。多年以来，实验室陆续培养了数百名优秀工程师，为西南科技大学和社会的科技发展做出突出贡献。",
  "aboutStats": [
    {
      "value": "2002",
      "label": "成立时间"
    },
    {
      "value": "40+",
      "label": "每年团队成员"
    },
    {
      "value": "∞",
      "label": "探索的边界"
    }
  ],
  "contactTitle": "下一台机器人，下一场比赛，等你一起创造。",
  "contactText": "无论你擅长机械、电子、编程，还是刚刚对机器人产生兴趣，这里都有属于你的起点。",
  "contactEmail": "2197974202@qq.com",
  "galleryPhotos": [
    {
      "id": "gallery-2025",
      "title": "全国大学生机器人大赛",
      "caption": "2024 · ROBOCON",
      "image": "/uploads/1785407616984-fa514ae37f5d4a1bb120fbd20e4b5c10.png"
    },
    {
      "id": "gallery-2024",
      "title": "赛前定妆照",
      "caption": "2024 · 参赛机器人",
      "image": "/uploads/1785407672031-f878c1070199d966b628d42153deac21.png"
    },
    {
      "id": "gallery-2023",
      "title": "新鲜出炉的机器人",
      "caption": "2024 ·  R1终版",
      "image": "/uploads/1785407720667-d8879f398b30c2f4c25319778b5ba395.png"
    },
    {
      "id": "gallery-1785407756893",
      "title": "获奖证书",
      "caption": "2024  ·  全国一等奖",
      "image": "/uploads/1785407770677-bff036ac26f018df5b924dc2bc5bff61.png"
    },
    {
      "id": "gallery-1785407758374",
      "title": "实验室大堂",
      "caption": "备赛场地",
      "image": "/uploads/1785407852411-9f563010b8e681ed7cd9661b7c84416d.png"
    },
    {
      "id": "gallery-1785407758524",
      "title": "赛前准备",
      "caption": "2024 RC",
      "image": "/uploads/1785408029139-fa514ae37f5d4a1bb120fbd20e4b5c10.png"
    },
    {
      "id": "gallery-1785407758675",
      "title": "荣誉墙",
      "caption": "历届奖项展览",
      "image": "/uploads/1785408087000-2a07ac2800981f48db64c54acbb906a6.png"
    }
  ],
  "seasons": [
    {
      "id": "2025",
      "year": "2026",
      "title": "武林至尊",
      "kind": "ROBOCON",
      "note": "从机械结构到自主控制，我们把每一次试错都变成下一次出发的底气。",
      "image": "/gate.webp",
      "video": ""
    },
    {
      "id": "2024",
      "year": "2025",
      "title": "飞升上蓝",
      "kind": "ROBOCON",
      "note": "调试、协作、冲刺——镜头记录赛场内外每一个重要瞬间。",
      "image": "/gate.webp",
      "video": "https://www.bilibili.com/video/BV1Xn4y1f7YB/"
    },
    {
      "id": "2023",
      "year": "2024",
      "title": "颗粒归仓",
      "kind": "ROBOCON",
      "note": "从零件到整机，从第一行代码到稳定运行，见证作品逐步成形。",
      "image": "/uploads/2024-robocon.jpg",
      "video": "https://www.bilibili.com/video/BV1eXSkY3EoH/"
    }
  ],
  "pages": [],
  "exploreCards": [
    {
      "id": "records",
      "number": "01",
      "title": "历届纪录",
      "englishTitle": "TEAM LEGACY",
      "text": "回看历届赛事、重要成绩与机器人迭代轨迹。",
      "href": "/records",
      "image": "/gate.webp"
    },
    {
      "id": "learn-more",
      "number": "02",
      "title": "了解更多",
      "englishTitle": "ABOUT THE TEAM",
      "text": "认识团队方向、培养方式与真实的工程协作。",
      "href": "/learn-more",
      "image": "/gate.webp"
    },
    {
      "id": "daily",
      "number": "03",
      "title": "战队日常",
      "englishTitle": "TEAM LIFE",
      "text": "走进实验室，记录训练、调试和并肩奋斗的时刻。",
      "href": "/daily",
      "image": "/gate.webp"
    }
  ],
  "preparationEyebrow": "ROAD TO ROBOCON",
  "preparationTitle": "向赛场，",
  "preparationHighlight": "全力推进",
  "preparationText": "记录从方案到整机的每一个关键节点。",
  "preparationSteps": [
    {
      "id": "step-1",
      "number": "01",
      "title": "需求分析与方案设计",
      "status": "已完成",
      "progress": "100%"
    },
    {
      "id": "step-2",
      "number": "02",
      "title": "机械结构加工与装配",
      "status": "进行中",
      "progress": "72%"
    },
    {
      "id": "step-3",
      "number": "03",
      "title": "电控系统与底层驱动",
      "status": "进行中",
      "progress": "58%"
    },
    {
      "id": "step-4",
      "number": "04",
      "title": "视觉算法与策略联调",
      "status": "准备中",
      "progress": "35%"
    },
    {
      "id": "step-5",
      "number": "05",
      "title": "整机测试与赛场模拟",
      "status": "待开始",
      "progress": "10%"
    }
  ],
  "recruitmentEyebrow": "BUILD · CODE · COMPETE",
  "recruitmentTitle": "加入我们，",
  "recruitmentHighlight": "把想法造出来。",
  "recruitmentText": "这里不只需要“已经很强”的人，更欢迎愿意学习、敢于动手、能和伙伴一起把问题解决的人。",
  "recruitmentDirections": [
    {
      "id": "direction-1",
      "number": "01",
      "title": "机械结构",
      "text": "机械设计、加工装配、传动与整机可靠性"
    },
    {
      "id": "direction-2",
      "number": "02",
      "title": "电控嵌入式",
      "text": "硬件设计、底层驱动、传感器与运动控制"
    },
    {
      "id": "direction-3",
      "number": "03",
      "title": "视觉算法",
      "text": "目标识别、定位、决策与机器人智能"
    },
    {
      "id": "direction-4",
      "number": "04",
      "title": "软件开发",
      "text": "ROS 2、C++、Lua 与平台系统开发"
    }
  ],
  "recruitmentApplyEyebrow": "READY TO START?",
  "recruitmentApplyTitle": "你的下一段工程故事，从这里开始。",
  "recruitmentApplyText": "返回官网，在“加入小组”区域通过邮件投递个人信息与 PDF 简历。"
};
