# 部署到 GitHub Pages —— 图文指引（纯网页操作，无需命令行）

你已有 GitHub 账号，下面是**完全用网页操作**把本学术主页免费上线的方法。
上线后你会得到一个公开网址，形如 `https://你的用户名.github.io`，可发给任何人访问。

> 想用域名或不同的网址，可在下方"进阶"中查看，可选。

---

## 第 1 步：新建仓库（给网站起个"家"）

1. 打开 [github.com](https://github.com) 并登录。
2. 点击右上角 **+** → **New repository**（新建仓库）。
3. 在 **Repository name** 一栏填入你的用户名 + `.github.io`。
   - 例如你的用户名是 `zhangyuanze`，就填 `zhangyuanze.github.io`
   - ⚠️ 必须是"小写用户名 + `.github.io`"这种格式，这样网址最漂亮。
4. 选择 **Public**（公开；Pages 免费版要求公开仓库）。
5. **不要**勾选 "Add a README file" 等任何初始化选项（保持空仓库即可）。
6. 点击 **Create repository**。

✅ 完成后你会进入一个空的仓库页面。

---

## 第 2 步：上传本项目的文件

1. 在这个空仓库页面，点 **"uploading an existing file"**（上传已有文件）链接。
   - 它通常在中间提示区 / "Quick setup" 里；也可以点 **Add file → Upload files**。
2. 系统会打开一个拖放上传区。
3. 打开你电脑上的项目文件夹 `academic-homepage/`，**把里面的内容拖进上传区**：
   - 上传 `index.html`
   - 上传 `css`、`js`、`assets`、`docs` 这几个**文件夹**（把整个文件夹拖进去即可，网页会保留目录结构）
   - 注意：是拖 `academic-homepage` **内部**的东西，不要连外层文件夹一起拖。
4. 页面底部填写 Commit message（如 `first upload`），点击 **Commit changes**。

✅ 上传完成后，仓库里应能看到 `index.html`、`css/`、`js/` 等文件和文件夹。

---

## 第 3 步：开启 GitHub Pages

1. 在仓库页面顶部点击 **Settings**（设置）。
2. 左侧菜单往下找，点击 **Pages**（位于 "Code and automation" 分类下）。
3. 在 **Build and deployment** 区域：
   - **Source** 选择 **Deploy from a branch**
   - **Branch** 选择分支 `main`，右侧目录选择 **/ (root)**
   - 点击 **Save**
4. 等待约 1–3 分钟，页面顶部会出现一个网址：`https://你的用户名.github.io/`
   - 地址可能先显示黄色 "Your site is live"，刷新后变为绿色带链接。

---

## 第 4 步：访问你的主页

在浏览器打开 `https://你的用户名.github.io` 即可看到你的学术主页。

每次你在这个仓库上传修改过的文件后，GitHub Pages 会自动重新发布（几分钟内生效）。

---

## 内容修改流程（最佳实践）

由于纯静态站点无后端，推荐这样长期维护内容：

1. 在本地浏览器打开 `index.html`，用右下角 **齿轮编辑器** 填写/修改你的真实资料与论文。
2. 点 **导出 data.js**，获得一份 `data.js` 文件。
3. 在电脑上把 `js/data.js` 的内容替换为你刚导出的内容（保持文件路径、文件名不变）。
4. 回到 GitHub 仓库 → **Add file → Upload files**，重新上传 `js/data.js`（覆盖旧文件）。
5. 等 1–2 分钟刷新线上网址即可看到更新。

> 小技巧：无论你电脑或手机打开页面看到的都是你在**那台设备本地**存的内容。所以真正决定"线上别人看到什么"的，是仓库里 `js/data.js` 这份文件——记得用它作为唯一可信内容源。

---

## 常见问题

**Q：网址显示 404？**
等几分钟再刷新；确认 Settings→Pages 里 Branch 选的是 `main` + `/ (root)`。若刚建的仓库，也可能需要几分钟才生效。

**Q：网页打不开且一直黄色？**
部署需要时间，稍等 2–5 分钟；或重新上传一次文件触发重建。

**Q：想换头像？**
把你的图片放进 `assets/` 目录，命名如 `avatar.jpg`，在编辑器中"基本信息 → 头像图片路径"填 `assets/avatar.jpg`，保存并同步到 `data.js`。

**Q：名字显示了 `?` 或占位内容？**
那是示例数据。请务必用编辑器或 `data.js` 替换为你的真实信息。

**Q：想要自己的域名（可选）？**
Pages 设置里可绑定自定义域名（需先购买域名并按其提示配置 DNS CNAME）。本项目本身可继续使用默认域名。

---

## 联系与帮助

- 遇到报错：把 Settings → Pages 页面顶部的红色/黄色提示发给我分析。
- 想加区块（如项目展示、CV 下载、博客）：告诉我你的需求即可继续扩展。
