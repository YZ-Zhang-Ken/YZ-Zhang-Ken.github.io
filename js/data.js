/* =========================================================================
 * data.js — 站点内容数据源
 * -------------------------------------------------------------------------
 * 这是本学术主页的"唯一内容入口"。你的所有信息（姓名、简介、论文、荣誉、
 * 联系方式等）都在这里集中维护。
 *
 * 使用方法：
 *   1. 直接编辑本文件的对应字段；
 *   2. 或在网页右下角点击齿轮按钮，使用"可视化编辑器"填写 —— 编辑结果会
 *      保存在浏览器本地(localStorage)，并通过"导出数据"得到本文件内容。
 *
 * 修改保存后刷新页面即可看到效果。
 * ========================================================================= */

var SITE_DATA = {
  /* ---------- 基础信息 ---------- */
  profile: {
    // 你的中文名
    name: "张元泽",
    // 英文名 / 拼音（显示在名字下方）
    nameEn: "Yuanze Zhang",
    // 一段一句话定位，如：Associate Professor / PhD Candidate
    headline: "助理教授 / Assistant Professor",
    // 所在院系或单位
    affiliation: "示例大学 · 计算机科学与技术学院",
    // 单位英文
    affiliationEn: "School of Computer Science, Example University",
    // 一段 2-3 行的个人简介（在 About 区块顶部显示）
    bio: "我是一名计算机科学研究者，研究方向包括机器学习、自然语言处理与可信人工智能。欢迎对本页面展示的研究工作感兴趣的朋友与我交流合作。",
    // 头像图片路径（放到 assets/ 目录后，把文件名填到此处；留空则显示姓名首字）
    avatar: "",
    // 一句话短签名，显示在资料卡右侧
    tagline: "Research interests: Machine Learning, NLP, Trustworthy AI"
  },

  /* ---------- 关于 / 详细介绍（支持分段与列表） ---------- */
  about: {
    paragraphs: [
      "在这里填写你的详细介绍。可以写学历经历、工作经历、研究方向、代表性成果等。下方两个列表可自由增删条目。",
      "编辑器可对该区块进行可视化编辑：每段文字可加粗，每个要点支持排序与删除。"
    ],
    // 列表式要点，例如教育经历、工作经历、荣誉等，可自由增删
    highlights: [
      { icon: "education", text: "Ph.D. in Computer Science, 2018" },
      { icon: "work",      text: "Postdoc at Example Lab, 2018–2021" },
      { icon: "star",      text: "Best Paper Award, XX Conference 2022" }
    ]
  },

  /* ---------- 研究方向 ---------- */
  research: [
    { title: "机器学习",     desc: "深度生成模型、表示学习与少样本学习。" },
    { title: "自然语言处理", desc: "大规模语言模型、信息抽取与对话系统。" },
    { title: "可信人工智能", desc: "模型可解释性、鲁棒性与公平性研究。" }
  ],

  /* ---------- 论文发表（可按年份/类别分组） ---------- */
  publications: {
    // 排序方式：desc(最新在前) / asc(最早在前)
    order: "desc",
    // 论文分组。每组一个 title 与 papers 列表。可按年份、会议、期刊等分。
    groups: [
      {
        title: "2024",
        papers: [
          {
            authors: "Z. Zhang, A. Li, B. Wang",
            title: "A Robust Framework for Trustworthy Machine Learning",
            venue: "Conference on Artificial Intelligence (AAAI)",
            year: "2024",
            // 可选：论文链接、PDF、项目页、代码等，留空字符串则不显示
            links: { doi: "", pdf: "", code: "", project: "" }
          }
        ]
      },
      {
        title: "2023",
        papers: [
          {
            authors: "Z. Zhang, A. Li",
            title: "Efficient Neural Network Compression via Structured Pruning",
            venue: "NeurIPS",
            year: "2023",
            links: { doi: "10.0000/example.2023.001", pdf: "", code: "", project: "" }
          },
          {
            authors: "A. Li, Z. Zhang, C. Chen",
            title: "On the Robustness of Language Models to Adversarial Prompts",
            venue: "ACL",
            year: "2023",
            links: { doi: "", pdf: "", code: "", project: "" }
          }
        ]
      }
    ]
  },

  /* ---------- 教学经历 ---------- */
  teaching: [
    { term: "2024 Fall", course: "Machine Learning", note: "Graduate level, ~80 students" },
    { term: "2023 Spring", course: "Introduction to AI", note: "Undergraduate level" }
  ],

  /* ---------- 荣誉奖项 ---------- */
  awards: [
    "Best Paper Award, XX Conference 2022",
    "Outstanding Reviewer, NeurIPS 2021",
    "National Scholarship 2019"
  ],

  /* ---------- 学术服务 ---------- */
  service: [
    "Program Committee Member: AAAI 2024, ICML 2024",
    "Journal Reviewer: TPAMI, JMLR"
  ],

  /* ---------- 联系方式 ---------- */
  contact: {
    email: "zhangyuanze@example.edu",
    // 下方社交链接，留空字符串则隐藏对应图标
    links: {
      googleScholar: "https://scholar.google.com/",
      github:        "https://github.com/",
      homepage:      "",
      linkedin:      "",
      twitter:       ""
    },
    // 备注，如办公室地址、邮编等，可留空
    address: "Building A, Room 501, Main Campus"
  },

  /* ---------- 站点外观 ---------- */
  site: {
    title: "Yuanze Zhang — Academic Homepage",
    footerText: "© 2026 Yuanze Zhang. All rights reserved.",
    // 主题色（hex，不带#），用于标题强调、按钮、链接等
    accent: "#185FA5"
  }
};
