/* =========================================================================
 * editor.js — 可视化内容编辑器（惰性加载）
 * 点击右下角齿轮打开；编辑结果保存到 localStorage 并实时重渲染页面。
 * 右上角可"导出 data.js"，供粘贴回 js/data.js 实现源码级保存（GitHub 部署用）。
 * ========================================================================= */
(function () {
  "use strict";

  function $id(x) { return document.getElementById(x); }
  function $(x) { return document.getElementById(x); }

  /* 构建面板 DOM */
  function buildShell() {
    var overlay = document.createElement("div");
    overlay.className = "editor-overlay"; overlay.id = "edOverlay";

    var drawer = document.createElement("div");
    drawer.className = "editor-drawer"; drawer.id = "edDrawer";
    drawer.innerHTML =
      '<div class="editor-head"><h3>内容编辑</h3><div style="display:flex;align-items:center;gap:10px">' +
      '<span class="editor-save-msg" id="edMsg"></span>' +
      '<button class="editor-close" id="edClose" aria-label="关闭">×</button></div></div>' +
      '<div class="editor-tabs" id="edTabs"></div>' +
      '<div class="editor-body" id="edBody"></div>' +
      '<div class="editor-actions">' +
      '<button class="btn btn-primary grow1" id="edExport">导出 data.js</button>' +
      '<button class="btn" id="edImport">导入</button>' +
      '<button class="btn" id="edReset">重置</button>' +
      '</div>' +
      '<input type="file" id="edFile" accept=".js,.json,.txt" style="display:none">';

    document.body.appendChild(overlay);
    document.body.appendChild(drawer);
  }

  var TABS = [
    { id: "profile", label: "基本信息" },
    { id: "about", label: "关于/简介" },
    { id: "research", label: "研究方向" },
    { id: "publications", label: "论文" },
    { id: "teaching", label: "教学/荣誉/服务" },
    { id: "contact", label: "联系方式" },
    { id: "appearance", label: "外观" }
  ];

  var activeTab = "profile";
  var D; // current working copy

  /* ---------- 各 tab 渲染 ---------- */
  function inputField(label, id, val, ph) {
    return '<div class="editor-field"><label>' + label + "</label><input id='" + id +
      "' value='" + escAttr(val) + "'" + (ph ? " placeholder='" + escAttr(ph) + "'" : "") + "></div>";
  }
  function textAreaField(label, id, val, ph) {
    return '<div class="editor-field"><label>' + label + "</label><textarea id='" + id +
      "'" + (ph ? " placeholder='" + escAttr(ph) + "'" : "") + ">" + esc(val) + "</textarea></div>";
  }
  function escAttr(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;"); }
  function esc(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  function clean(s){ return s == null ? "" : String(s); }

  /* 从 DOM 收集通用值 */
  function readVal(id) { var e = $(id); return e ? clean(e.value) : ""; }

  /* ---------- tab: profile ---------- */
  function renderProfile() {
    var p = D.profile || {};
    return '<div class="editor-note">此处的信息显示在网页顶部资料卡。头像请放到 <b>assets/</b> 目录后在“头像路径”填文件名。</div>' +
      inputField("姓名", "p_name", p.name, "张元泽") +
      inputField("英文名", "p_nameEn", p.nameEn, "Yuanze Zhang") +
      inputField("身份头衔", "p_headline", p.headline, "副教授 / Associate Professor") +
      inputField("单位(中文)", "p_affil", p.affiliation, "××大学 · 学院") +
      inputField("单位(英文)", "p_affilEn", p.affiliationEn, "") +
      textAreaField("一句话签名", "p_tagline", p.tagline, "") +
      inputField("头像图片路径", "p_avatar", p.avatar, "assets/avatar.jpg (留空用姓名首字)");
  }

  /* ---------- tab: about ---------- */
  function renderAbout() {
    var a = D.about || {};
    var html = '<div class="hint-row">完整介绍段落（每段一个文本框）</div>';
    (a.paragraphs || [""]).forEach(function (p, i) {
      html += '<div class="editor-field" style="position:relative">' +
        (i > 0 ? '<button class="del" data-rm-para="' + i + '" style="position:absolute;right:2px;top:2px">×</button>' : "") +
        "<label>段落 " + (i + 1) + "</label><textarea id='ab_p" + i + "'>" + esc(p) + "</textarea></div>";
    });
    html += '<button class="editor-add" id="ab_addPara">+ 添加段落</button>';

    html += '<h4>要点 / 亮点列表（如教育、工作、荣誉）</h4>';
    (a.highlights || []).forEach(function (h, i) {
      html += '<div class="editor-card"><div class="row">' +
        "<input id='hl_t" + i + "' value='" + escAttr(h.text) + "' placeholder='要点文字'>" +
        "<select id='hl_i" + i + "'>" + iconOptions(h.icon || "star") + "</select>" +
        '<button class="del" data-rm-hl="' + i + '">×</button></div></div>';
    });
    html += '<button class="editor-add" id="ab_addHl">+ 添加要点</button>';
    return html;
  }
  function iconOptions(cur) {
    var items = [["education", "教育"], ["work", "工作"], ["star", "星标"]];
    var o = "";
    items.forEach(function (it) { o += '<option value="' + it[0] + '"' + (cur === it[0] ? " selected" : "") + ">" + it[1] + "</option>"; });
    return o;
  }

  /* ---------- tab: research ---------- */
  function renderResearch() {
    var arr = D.research || [];
    var html = "";
    arr.forEach(function (r, i) {
      html += '<div class="editor-card"><div class="row">' +
        "<input id='r_t" + i + "' value='" + escAttr(r.title) + "' placeholder='方向名称'>" +
        '<button class="del" data-rm-research="' + i + '">×</button></div>' +
        '<div style="margin-top:8px"><textarea id="r_d' + i + '" placeholder="方向描述">' + esc(r.desc) + "</textarea></div></div>";
    });
    if (!arr.length) html = '<p class="mini-hint">暂无方向。</p>';
    html += '<button class="editor-add" id="r_add">+ 添加研究方向</button>';
    return html;
  }

  /* ---------- tab: publications ---------- */
  function renderPublications() {
    var P = D.publications || {};
    var order = P.order === "asc" ? "asc" : "desc";
    var html = '<div class="editor-field"><label>论文排序</label><select id="pub_order">' +
      '<option value="desc"' + (order === "desc" ? " selected" : "") + ">最新在前 (desc)</option>" +
      '<option value="asc"' + (order === "asc" ? " selected" : "") + ">最早在前 (asc)</option></select></div>";

    (P.groups || []).forEach(function (g, gi) {
      html += '<h4 style="display:flex;align-items:center;gap:8px">分组：' +
        "<input id='g_title" + gi + "' value='" + escAttr(g.title) + "' placeholder='如 2024 / 期刊名' style='flex:1'>" +
        '<button class="del" data-rm-group="' + gi + '">×</button></h4>';
      (g.papers || []).forEach(function (pp, pi) {
        var L = pp.links || {};
        var cardId = "pp_" + gi + "_" + pi;
        html += '<div class="editor-card" data-paper="' + cardId + '">' +
          '<div class="row"><b style="font-size:13px;color:var(--ink-3)">论文 ' + (pi + 1) + "</b>" +
          '<button class="del" data-rm-paper="' + gi + "-" + pi + '" style="margin-left:auto">×</button></div>' +
          '<div style="margin-top:6px">' + pubInput(cardId + "_t", "标题", pp.title) +
          pubInput(cardId + "_a", "作者(英文，加粗自己的名字，如 Z. Zhang)", pp.authors) +
          pubInput(cardId + "_v", "会议/期刊", pp.venue) +
          '<div class="row" style="margin-top:8px">' +
          '<div style="flex:1"><label style="display:block;font-size:12px;color:var(--ink-3)">年份</label><input id="' + cardId + '_y" value="' + escAttr(pp.year) + '"></div>' +
          '<div style="flex:1"><label style="display:block;font-size:12px;color:var(--ink-3)">DOI</label><input id="' + cardId + '_doi" value="' + escAttr(L.doi) + '" placeholder="10.xxxx/..."></div></div>' +
          '<div style="margin-top:6px">' + pubInput(cardId + "_pdf", "PDF 链接(可选)", L.pdf) +
          pubInput(cardId + "_code", "代码链接(可选)", L.code) +
          pubInput(cardId + "_proj", "项目页链接(可选)", L.project) + "</div></div>";
      });
      html += '<button class="editor-add" data-add-paper="' + gi + '">+ 在该组添加论文</button>';
    });
    html += '<button class="editor-add" id="pub_addGroup" style="margin-top:12px">+ 添加论文分组</button>';
    return html;
  }
  function pubInput(id, label, val) {
    return '<div style="margin-top:8px"><label style="display:block;font-size:12px;color:var(--ink-3)">' + label +
      '</label><input id="' + id + '" value="' + escAttr(val) + '"></div>';
  }

  /* ---------- tab: teaching/awards/service ---------- */
  function renderTeach() {
    var html = '<h4>教学经历</h4>';
    (D.teaching || []).forEach(function (t, i) {
      html += '<div class="editor-card"><div class="row">' +
        "<input id='t_tm" + i + "' value='" + escAttr(t.term) + "' placeholder='学期 如 2024 Fall'>" +
        "<input id='t_cs" + i + "' value='" + escAttr(t.course) + "' placeholder='课程名称'>" +
        '<button class="del" data-rm-teach="' + i + '">×</button></div>' +
        '<div style="margin-top:8px"><input id="t_nt' + i + '" value="' + escAttr(t.note) + '" placeholder="备注(可选)"></div></div>';
    });
    html += '<button class="editor-add" id="t_add">+ 添加教学经历</button>';

    html += '<h4>荣誉奖项</h4>';
    (D.awards || []).forEach(function (a, i) {
      html += '<div class="editor-card"><div class="row"><input id="aw_' + i + '" value="' + escAttr(a) +
        '" placeholder="奖项"><button class="del" data-rm-award="' + i + '">×</button></div></div>';
    });
    html += '<button class="editor-add" id="aw_add">+ 添加奖项</button>';

    html += '<h4>学术服务</h4>';
    (D.service || []).forEach(function (s, i) {
      html += '<div class="editor-card"><div class="row"><input id="sv_' + i + '" value="' + escAttr(s) +
        '" placeholder="服务/审稿"><button class="del" data-rm-svc="' + i + '">×</button></div></div>';
    });
    html += '<button class="editor-add" id="sv_add">+ 添加学术服务</button>';
    return html;
  }

  /* ---------- tab: contact ---------- */
  function renderContact() {
    var c = D.contact || {};
    var l = c.links || {};
    return inputField("邮箱", "c_email", c.email, "you@example.edu") +
      inputField("地址/备注", "c_addr", c.address, "Building A, Room 501") +
      inputField("Google Scholar 链接", "c_scholar", l.googleScholar, "https://scholar.google.com/...") +
      inputField("GitHub 链接", "c_github", l.github, "https://github.com/用户名") +
      inputField("LinkedIn 链接", "c_linkedin", l.linkedin, "") +
      inputField("Twitter / X 链接", "c_twitter", l.twitter, "") +
      inputField("个人主页链接", "c_home", l.homepage, "https://yourlab.example.org");
  }

  /* ---------- tab: appearance ---------- */
  function renderAppearance() {
    var s = D.site || {};
    return '<div class="editor-note">主题色用于标题、强调与按钮。修改后需点击底部“保存到页面并预览”查看。</div>' +
      '<div class="editor-field"><label>主题色 (hex)</label><div class="row">' +
      '<input id="s_accent" value="' + escAttr(s.accent || "185FA5") + '" placeholder="185FA5">' +
      '<input type="color" id="s_accentColor" value="#' + escAttr(s.accent || "185FA5").replace("#","") + '" style="flex:0 0 46px;padding:2px"></div></div>' +
      '<div class="editor-field"><label>浏览器标签标题</label><input id="s_title" value="' + escAttr(s.title) + '"></div>' +
      '<div class="editor-field"><label>页脚文字</label><input id="s_footer" value="' + escAttr(s.footerText) + '"></div>';
  }

  var RENDER = {
    profile: renderProfile,
    about: renderAbout,
    research: renderResearch,
    publications: renderPublications,
    teaching: renderTeach,
    contact: renderContact,
    appearance: renderAppearance
  };

  /* 打开抽屉并渲染 */
  function open() {
    D = JSON.parse(JSON.stringify(window.SiteData.current()));
    $id("edOverlay").classList.add("show");
    $id("edDrawer").classList.add("open");
    switchTab(activeTab);
    $id("edMsg").textContent = "";
  }
  function close() {
    $id("edDrawer").classList.remove("open");
    $id("edOverlay").classList.remove("show");
  }

  function switchTab(id) {
    activeTab = id;
    var tabs = $id("edTabs"); tabs.innerHTML = "";
    TABS.forEach(function (t) {
      var b = document.createElement("button");
      b.textContent = t.label;
      b.className = (t.id === id) ? "active" : "";
      b.onclick = function () { switchTab(t.id); };
      tabs.appendChild(b);
    });
    $id("edBody").innerHTML = (RENDER[id] || function(){return "";})();
    bindDynamic();
  }

  /* 事件委托：动态添加/删除与颜色联动 */
  function bindDynamic() {
    var body = $id("edBody");
    body.querySelectorAll("[data-rm-para]").forEach(function (b) {
      b.onclick = function () { (D.about.paragraphs = D.about.paragraphs || []).splice(+b.dataset.rmPara, 1); switchTab("about"); };
    });
    body.querySelectorAll("[data-rm-hl]").forEach(function (b) {
      (D.about.highlights = D.about.highlights || []).splice(+b.dataset.rmHl, 1); switchTab("about");
    });
    body.querySelectorAll("[data-rm-research]").forEach(function (b) {
      (D.research = D.research || []).splice(+b.dataset.rmResearch, 1); switchTab("research");
    });
    body.querySelectorAll("[data-rm-group]").forEach(function (b) {
      (D.publications.groups = D.publications.groups || []).splice(+b.dataset.rmGroup, 1); switchTab("publications");
    });
    body.querySelectorAll("[data-rm-teach]").forEach(function (b) {
      (D.teaching = D.teaching || []).splice(+b.dataset.rmTeach, 1); switchTab("teaching");
    });
    body.querySelectorAll("[data-rm-award]").forEach(function (b) {
      (D.awards = D.awards || []).splice(+b.dataset.rmAward, 1); switchTab("teaching");
    });
    body.querySelectorAll("[data-rm-svc]").forEach(function (b) {
      (D.service = D.service || []).splice(+b.dataset.rmSvc, 1); switchTab("teaching");
    });
    body.querySelectorAll("[data-rm-paper]").forEach(function (b) {
      var key = b.dataset.rmPaper.split("-"); var gi = +key[0], pi = +key[1];
      (D.publications.groups[gi].papers || []).splice(pi, 1);
      switchTab("publications");
    });
    body.querySelectorAll("[data-add-paper]").forEach(function (b) {
      var gi = +b.dataset.addPaper;
      D.publications.groups[gi].papers.push({ authors: "", title: "", venue: "", year: "", links: { doi: "", pdf: "", code: "", project: "" } });
      switchTab("publications");
    });

    /* 添加按钮 */
    var addMap = { ab_addPara: addPara, ab_addHl: addHl, r_add: addResearch, t_add: addTeach, aw_add: addAward, sv_add: addService, pub_addGroup: addGroup };
    Object.keys(addMap).forEach(function (id) {
      var b = body.querySelector("#" + id); if (b) b.onclick = addMap[id];
    });

    /* 颜色联动 */
    var ac = body.querySelector("#s_accent"), ac2 = body.querySelector("#s_accentColor");
    if (ac && ac2) {
      ac.oninput = function () { ac2.value = normHex(ac.value); };
      ac2.oninput = function () { ac.value = ac2.value.replace("#", ""); };
    }
  }
  function normHex(v){ v = String(v||"").replace("#",""); return v.length===3 ? v[0]+v[0]+v[1]+v[1]+v[2]+v[2] : (v.length===6? v : "185FA5"); }

  function addPara() { (D.about.paragraphs = D.about.paragraphs || []).push(""); switchTab("about"); }
  function addHl() { (D.about.highlights = D.about.highlights || []).push({ icon: "star", text: "" }); switchTab("about"); }
  function addResearch() { (D.research = D.research || []).push({ title: "", desc: "" }); switchTab("research"); }
  function addTeach() { (D.teaching = D.teaching || []).push({ term: "", course: "", note: "" }); switchTab("teaching"); }
  function addAward() { (D.awards = D.awards || []).push(""); switchTab("teaching"); }
  function addService() { (D.service = D.service || []).push(""); switchTab("teaching"); }
  function addGroup() { (D.publications.groups = D.publications.groups || []).push({ title: "New Year", papers: [] }); switchTab("publications"); }

  /* ---------- 保存：从 DOM 收集回 D ---------- */
  function collect() {
    function g(id) { var e = $(id); return e ? clean(e.value) : ""; }
    // profile
    D.profile = D.profile || {};
    D.profile.name = g("p_name"); D.profile.nameEn = g("p_nameEn"); D.profile.headline = g("p_headline");
    D.profile.affiliation = g("p_affil"); D.profile.affiliationEn = g("p_affilEn");
    D.profile.tagline = g("p_tagline"); D.profile.avatar = g("p_avatar");

    // about
    if (D.about) {
      D.about.paragraphs = (D.about.paragraphs || []).map(function (_, i) { return g("ab_p" + i); });
      D.about.highlights = (D.about.highlights || []).map(function (h, i) {
        return { icon: h.icon, text: g("hl_t" + i) };
      });
      D.about.highlights.forEach(function (h, i) {
        var sel = $("hl_i" + i); if (sel) h.icon = sel.value;
      });
    }
    // research
    D.research = (D.research || []).map(function (_, i) { return { title: g("r_t" + i), desc: g("r_d" + i) }; });

    // publications
    var P = D.publications = D.publications || {};
    var orderSel = $("pub_order"); if (orderSel) P.order = orderSel.value;
    P.groups = (P.groups || []).map(function (gr, gi) {
      gr.title = g("g_title" + gi);
      gr.papers = (gr.papers || []).map(function (pp, pi) {
        var c = "pp_" + gi + "_" + pi;
        pp.title = g(c + "_t"); pp.authors = g(c + "_a"); pp.venue = g(c + "_v"); pp.year = g(c + "_y");
        pp.links = pp.links || {};
        pp.links.doi = g(c + "_doi"); pp.links.pdf = g(c + "_pdf"); pp.links.code = g(c + "_code"); pp.links.project = g(c + "_proj");
        return pp;
      });
      return gr;
    });

    // teaching etc
    D.teaching = (D.teaching || []).map(function (_, i) { return { term: g("t_tm" + i), course: g("t_cs" + i), note: g("t_nt" + i) }; });
    D.awards = (D.awards || []).map(function (_, i) { return g("aw_" + i); });
    D.service = (D.service || []).map(function (_, i) { return g("sv_" + i); });

    // contact
    D.contact = D.contact || {}; D.contact.links = D.contact.links || {};
    D.contact.email = g("c_email"); D.contact.address = g("c_addr");
    D.contact.links.googleScholar = g("c_scholar"); D.contact.links.github = g("c_github");
    D.contact.links.linkedin = g("c_linkedin"); D.contact.links.twitter = g("c_twitter"); D.contact.links.homepage = g("c_home");

    // appearance
    D.site = D.site || {};
    D.site.accent = g("s_accent"); D.site.title = g("s_title"); D.site.footerText = g("s_footer");
    return D;
  }

  function saveAndPreview() {
    collect();
    window.SiteData.persist(D);
    window.SiteData.current();
    window.SiteData.renderAll();
    flash("已保存到本页，实时生效 ✓");
  }

  function flash(msg) {
    var m = $id("edMsg"); m.textContent = msg;
    setTimeout(function () { if ($id("edMsg").textContent === msg) $id("edMsg").textContent = ""; }, 2600);
  }

  /* 导出为 data.js 可粘贴文件 */
  function exportDataJs() {
    collect();
    var obj = JSON.parse(JSON.stringify(D));
    var body = JSON.stringify(obj, null, 2);
    var content =
      "/* 由可视化编辑器导出。将下列代码整体替换 js/data.js 中的 SITE_DATA 即可。 */\n\n" +
      "var SITE_DATA = " + body + ";\n";
    var blob = new Blob([content], { type: "application/javascript;charset=utf-8" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "data.js";
    document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 400);
    flash("已导出 data.js（下载到本地）");
  }

  function importData() { $id("edFile").click(); }
  function onFile(e) {
    var f = e.target.files[0]; if (!f) return;
    var reader = new FileReader();
    reader.onload = function () {
      var txt = reader.result, obj = null;
      try {
        // 若是 SITE_DATA = {...} 形式则抽取花括号块
        var m = txt.match(/SITE_DATA\s*=\s*(\{[\s\S]*\});?\s*$/);
        var src = m ? m[1] : txt;
        obj = JSON.parse(src);
      } catch (err) {
        try { obj = JSON.parse(txt); } catch (e2) { flash("导入失败：不是有效的 data.js / JSON"); return; }
      }
      if (!obj || !obj.profile) { flash("导入失败：缺少 profile 字段"); return; }
      window.SiteData.persist(obj);
      D = JSON.parse(JSON.stringify(obj));
      window.SiteData.renderAll();
      switchTab(activeTab);
      flash("导入成功 ✓");
    };
    reader.readAsText(f, "utf-8");
    e.target.value = "";
  }

  function resetAll() {
    if (!confirm("确定要重置为 data.js 的默认内容吗？你通过编辑器做的本地修改将丢失。")) return;
    window.SiteData.clearLocal();
    location.reload();
  }

  function init() {
    if (!$id("editFab")) return;
    buildShell();
    $id("editFab").addEventListener("click", open);
    $id("edClose").addEventListener("click", close);
    $id("edOverlay").addEventListener("click", close);
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
    $id("edExport").addEventListener("click", exportDataJs);
    $id("edImport").addEventListener("click", importData);
    $id("edReset").addEventListener("click", resetAll);
    $id("edFile").addEventListener("change", onFile);
    // 保存按钮置于编辑器底部（加入 actions 容器前）
    var saveBtn = document.createElement("button");
    saveBtn.className = "btn btn-primary"; saveBtn.textContent = "保存到本页并预览";
    saveBtn.style.width = "100%"; saveBtn.style.margin = "4px 0 0"; saveBtn.style.order = "-1";
    saveBtn.onclick = saveAndPreview;
    document.querySelector(".editor-actions").prepend(saveBtn);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
