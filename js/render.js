/* =========================================================================
 * render.js — 将 SITE_DATA 渲染为页面 DOM
 * ========================================================================= */

(function () {
  "use strict";

  var KEY = "academic-site-data-v1";
  var D = {};

  function el(id) { return document.getElementById(id); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  }); }

  /* 数据源优先级：localStorage(用户可视化编辑保存) > data.js */
  function load() {
    var user = null;
    try { user = JSON.parse(localStorage.getItem(KEY) || "null"); } catch (e) { user = null; }
    D = (user && typeof user === "object") ? user : (window.SITE_DATA || {});
  }

  function icons(name) {
    var p = { fill: "none", stroke: "currentColor", "stroke-width": "1.8",
              "stroke-linecap": "round", "stroke-linejoin": "round" };
    switch (name) {
      case "education": return '<svg viewBox="0 0 24 24" width="18" height="18" ' + attrStr(p) + '><path d="M22 9L12 4 2 9l10 5 10-5z"/><path d="M6 11.5V16c0 1.5 2.7 3 6 3s6-1.5 6-3v-4.5"/><path d="M22 9v5"/></svg>';
      case "work": return '<svg viewBox="0 0 24 24" width="18" height="18" ' + attrStr(p) + '><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/><path d="M3 12h18"/></svg>';
      case "star": return '<svg viewBox="0 0 24 24" width="18" height="18" ' + attrStr(p) + '><path d="M12 3l2.7 5.8 6.3.7-4.7 4.3 1.3 6.2L12 17l-5.6 3 1.3-6.2L3 9.5l6.3-.7z"/></svg>';
      case "mail": return '<svg viewBox="0 0 24 24" width="16" height="16" ' + attrStr(p) + '><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>';
      case "pin": return '<svg viewBox="0 0 24 24" width="16" height="16" ' + attrStr(p) + '><path d="M12 21s-7-5.6-7-11a7 7 0 0 1 14 0c0 5.4-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>';
      case "scholar": return '<svg viewBox="0 0 24 24" width="16" height="16" ' + attrStr(p) + '><path d="M12 3L1 8l11 5 9-4.1V15h2V8z"/><path d="M5 13.5V17c0 1.5 3.1 3 7 3s7-1.5 7-3v-3.5"/></svg>';
      case "github": return '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 .5A11.5 11.5 0 0 0 .5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.2.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.4-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.2 1.2a11 11 0 0 1 5.8 0C17.3 4.5 18.3 4.8 18.3 4.8c.6 1.6.2 2.8.1 3.1.7.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.3c0 .4.2.7.8.6a11.5 11.5 0 0 0 7.9-10.9A11.5 11.5 0 0 0 12 .5z"/></svg>';
      default: return '<svg viewBox="0 0 24 24" width="18" height="18" ' + attrStr(p) + '><circle cx="12" cy="12" r="9"/></svg>';
    }
  }
  function attrStr(o) {
    return Object.keys(o).map(function (k) { return k + '="' + o[k] + '"'; }).join(" ");
  }

  function socialBtns(links) {
    if (!links) return "";
    var out = [], L = links;
    if (L.email) {} // 邮件走 mailto 按钮，单独生成
    if (L.googleScholar) out.push('<a class="btn" target="_blank" rel="noopener" href="' + esc(L.googleScholar) + '">' + icons("scholar") + 'Google Scholar</a>');
    if (L.github) out.push('<a class="btn" target="_blank" rel="noopener" href="' + esc(L.github) + '">' + icons("github") + 'GitHub</a>');
    if (L.linkedin) out.push('<a class="btn" target="_blank" rel="noopener" href="' + esc(L.linkedin) + '">LinkedIn</a>');
    if (L.twitter) out.push('<a class="btn" target="_blank" rel="noopener" href="' + esc(L.twitter) + '">Twitter / X</a>');
    return out.join("");
  }

  /* ---------- 渲染各区块 ---------- */
  function renderHero() {
    var p = D.profile || {};
    document.title = (D.site && D.site.title) || (p.name || "学术主页");

    el("navBrand").innerHTML = esc(p.name || "Academia") + '<small>' + esc((p.headline||"").split("/")[0] || "") + '</small>';

    var letter = el("avatarLetter"), img = el("avatarImg");
    if (p.avatar) {
      img.src = p.avatar; img.style.display = "flex"; letter.style.display = "none";
    } else {
      var ch = (p.name || "?").trim().charAt(0);
      letter.style.display = "flex"; img.style.display = "none"; letter.textContent = ch;
    }
    el("name").textContent = p.name || "";
    el("nameEn").textContent = p.nameEn || "";
    el("headline").textContent = p.headline || "";
    el("affiliation").textContent = p.affiliation || "";
    el("affiliationEn").textContent = p.affiliationEn || "";
    el("tagline").textContent = p.tagline || "";

    var btns = "";
    if (p.email || (p.links && p.links.homepage)) {
      if (p.email) btns += '<a class="btn btn-primary" href="mailto:' + esc(p.email) + '">' + icons("mail") + '邮件联系</a>';
      if (p.links && p.links.homepage) btns += '<a class="btn" target="_blank" rel="noopener" href="' + esc(p.links.homepage) + '">个人主页</a>';
    }
    btns += socialBtns(p.links);
    el("heroActions").innerHTML = btns;
  }

  function renderAbout() {
    var a = D.about || {};
    var prose = "";
    (a.paragraphs || []).forEach(function (p) { prose += "<p>" + esc(p) + "</p>"; });
    el("aboutProse").innerHTML = prose || '<p class="empty-tip">（暂未填写介绍，可在编辑器中补充）</p>';

    var hl = "";
    (a.highlights || []).forEach(function (h) {
      hl += '<li><span class="hl-ico">' + icons(h.icon || "star") + "</span><span>" + esc(h.text) + "</span></li>";
    });
    el("highlights").innerHTML = hl || "";
  }

  function renderResearch() {
    var arr = D.research || [], html = "";
    if (!arr.length) html = '<p class="empty-tip">（暂未填写）</p>';
    arr.forEach(function (r) {
      html += '<div class="res-card"><h3>' + esc(r.title) + "</h3><p>" + esc(r.desc) + "</p></div>";
    });
    el("researchGrid").innerHTML = html;
  }

  function renderPublications() {
    var P = D.publications || {};
    var groups = (P.groups || []).slice();
    if (P.order === "asc") groups.reverse();

    var total = 0;
    groups.forEach(function (g) { total += (g.papers || []).length; });
    el("pubSub").textContent = "Publications · 共 " + total + " 篇";

    var html = "", count = 0;
    if (!groups.length) {
      html = '<p class="empty-tip">（暂无论文，可在编辑器中添加）</p>';
    }
    groups.forEach(function (g, gi) {
      html += '<div class="pub-year" id="pubyear-' + gi + '">' + esc(g.title || "年份") + "</div>";
      html += '<ul class="pub-list">';
      (g.papers || []).forEach(function (pp) {
        count++;
        var linksHtml = "";
        var L = pp.links || {};
        function linkTag(label, url, cl) { if (url) return '<a href="' + esc(url) + '"' + (cl ? ' class="' + cl + '"' : "") + ' target="_blank" rel="noopener">' + label + "</a>"; return ""; }
        linksHtml += linkTag("PDF", L.pdf, "pdf");
        linksHtml += linkTag("DOI", (L.doi ? "https://doi.org/" + L.doi : ""), "doi");
        linksHtml += linkTag("代码", L.code, "code");
        linksHtml += linkTag("项目页", L.project, "project");
        var authors = esc(pp.authors || "");
        var me = D.profile ? D.profile.nameEn : "";
        if (me) {
          var meEsc = me.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
          authors = authors.replace(new RegExp("\\b" + meEsc.split(" ")[0] + "\\b", "i"),
            '<span class="me">$&</span>');
        }
        html += '<li class="pub-item">'
          + '<span class="pub-num">[' + count + "]</span>"
          + '<div class="pub-main">'
          + '<p class="pub-title">' + esc(pp.title) + "</p>"
          + '<p class="pub-authors">' + authors + "</p>"
          + '<p class="pub-venue">' + esc(pp.venue || "") + (pp.year ? " (" + esc(pp.year) + ")" : "") + "</p>"
          + (linksHtml ? '<div class="pub-links">' + linksHtml + "</div>" : "")
          + "</div></li>";
      });
      html += "</ul>";
    });
    el("publicationsWrap").innerHTML = html;
  }

  function renderTeachingAwardsService() {
    var t = D.teaching || [], html = "";
    if (!t.length) html = '<p class="empty-tip">（暂未填写）</p>';
    t.forEach(function (x) {
      html += '<div class="teach-item"><span class="teach-term">' + esc(x.term) + '</span>'
        + '<div><div class="teach-course">' + esc(x.course) + '</div>'
        + (x.note ? '<div class="teach-note">' + esc(x.note) + "</div>" : "") + "</div></div>";
    });
    el("teachingWrap").innerHTML = html;

    var aw = "", a = D.awards || [];
    a.forEach(function (x) { aw += "<li>" + esc(x) + "</li>"; });
    el("awardsWrap").innerHTML = aw || '<li class="empty-tip">（暂未填写）</li>';

    var sv = "", s = D.service || [];
    s.forEach(function (x) { sv += "<li>" + esc(x) + "</li>"; });
    el("serviceWrap").innerHTML = sv || '<li class="empty-tip">（暂未填写）</li>';

    var c = D.contact || {}, w = "";
    if (c.email) w += '<p style="display:flex;align-items:center;gap:8px;margin:6px 0">' + icons("mail") + '<a href="mailto:' + esc(c.email) + '">' + esc(c.email) + "</a></p>";
    if (c.address) w += '<p style="display:flex;align-items:center;gap:8px;margin:6px 0">' + icons("pin") + '<span>' + esc(c.address) + "</span></p>";
    w += socialBtns(c.links);
    el("contactWrap").innerHTML = w || '<p class="empty-tip">（暂未填写）</p>';
  }

  function renderFooter() {
    var s = D.site || {};
    el("footerText").textContent = s.footerText || "";
    var fl = "";
    if (D.contact && D.contact.email) fl += '<a href="mailto:' + esc(D.contact.email) + '">邮箱</a>';
    if (D.contact && D.contact.links && D.contact.links.googleScholar) fl += '<a target="_blank" rel="noopener" href="' + esc(D.contact.links.googleScholar) + '">Scholar</a>';
    if (D.contact && D.contact.links && D.contact.links.github) fl += '<a target="_blank" rel="noopener" href="' + esc(D.contact.links.github) + '">GitHub</a>';
    el("footerLinks").innerHTML = fl;
  }

  function applyAccent() {
    var a = (D.site && D.site.accent) ? D.site.accent : "#185FA5";
    var r = document.documentElement.style;
    r.setProperty("--accent", "#" + a.replace("#", ""));
    // 派生深色
    r.setProperty("--accent-dark", shade("#" + a.replace("#", ""), -0.45));
  }
  function shade(hex, amt) {
    var n = parseInt(hex.slice(1), 16), r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
    function f(c){ c = Math.round(c * (1 + amt)); return Math.max(0, Math.min(255, c)).toString(16).padStart(2, "0"); }
    return "#" + f(r) + f(g) + f(b);
  }

  /* 供编辑器模块使用的公开接口 */
  window.SiteData = {
    load: load,
    current: function () { return D; },
    persist: function (obj) { D = obj; try { localStorage.setItem(KEY, JSON.stringify(obj)); } catch (e) {} },
    storageKey: function () { return KEY; },
    clearLocal: function () { try { localStorage.removeItem(KEY); } catch (e) {} },
    renderAll: function () {
      applyAccent();
      renderHero(); renderAbout(); renderResearch(); renderPublications();
      renderTeachingAwardsService(); renderFooter();
    }
  };

  function init() {
    load();
    SiteData.renderAll();
    // 导航
    el("navToggle").addEventListener("click", function () {
      el("navLinks").classList.toggle("open");
    });
    el("navLinks").addEventListener("click", function (e) {
      if (e.target.tagName === "A") el("navLinks").classList.remove("open");
    });
    // 编辑入口按钮由 editor.js 绑定（editor.js 在 render.js 之后加载）
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
