# clark 的暗黑辉光主题（Clark Dark Glow Theme）— 制作全过程

> 本文件由会话 `sess_ff4a4958` 日志整理而成：按时间顺序摘录用户的全部指令原文，
> 对照每次产出的文件与 git 提交，还原这套 UI 从一段视频到完整组件资料库的制作过程。

---

## 这是什么项目

一套 **terminal 气质的暗色设计系统**，起源于一段股市行情可视化视频，最终形成：

- `components/ui/` — 51 个 shadcn 规范原语组件（copy-own-code，零黑盒依赖）
- `components/` — 主题特色组件（GlowCard / TheDial 轮动盘 / NodeFlow / MinuteList）
- `hooks/` — use-focus-trap / use-disclose / use-minute-clock
- `demo/example.html` — 完整参考样例（真实行情数据驱动，agent 生成页面的推荐入口）
- `demo6.html` — 真源渲染管线（浏览器内 fetch TSX → Babel 转译 → React 挂载）
- `STYLE-GUIDE.md` — 设计规范 + ZCode 生成指令

**主题公式**：五色系 token（amber 主色 + violet/teal/red/green 扇区色）· 1px 渐变描边 ·
`box-shadow: 0 0 Npx -Mpx color-mix(in oklab, accent 75%, transparent)` 环境辉光 · JetBrains Mono。

---

## 制作过程

### 阶段 1 · 从视频到第一个组件（08-30 凌晨）

> **「[视频附件] 如何使用 shadcn 的方式来构建类似附件视频呈现的 ui 效果」**

拆帧分析视频：黑色底、琥珀主色、环形转盘、辉光描边。确立 shadcn 目录规范
（`components/` + `cn()` + cva 变体 + data-slot）。

> **「什么时候用 copy-own-code 的组件工程方式？」**

确立工程哲学：组件源码复制进仓库、无黑盒依赖——bug 自己修、样式随便改、AI 可直接编辑。

**产出**：`0992b78` chip / glow-card / node-flow / the-dial / minute-list + use-minute-clock + 演示页

### 阶段 2 · GlowCard 与组件库铺开

> **「帮我实现 GlowCard 组件，然后编制一个 demo 的 html 页面来渲染效果」**

GlowCard 以 CSS 变量 `--glow` / `--gi` 驱动环境辉光，成为整套主题的视觉签名。

> **「现在帮我实现 shadcn 规范的其他组件，然后编制一个可以验证所有组件的 html 页面来渲染效果（demo2.html）」**
>
> **「先使用 git 暂存当前结果」**

**产出**：`84714fa` 15 个 ui 原语（button/input/select/switch/tabs/alert/table…）统一终端辉光风
+ demo3 总览页 + STYLE-GUIDE 初版（含 ZCode 生成指令）

### 阶段 3 · TheDial 与视频逐帧对齐（三轮打磨）

> **「the-dial.tsx 这个组件跟视频中的效果还有差距，请仔细观察后改进」**

**产出**：`4f4d0d9` 当前块整块辉光高亮、环形标签联动、区块中线色点、回写箭头、刻度缝隙加宽

> **「仔细对比一下视频中的环形组件与刚才设计好的 the-dial.tsx 存在哪些效果差异（静态+动态），并进行修复」**

ffmpeg 逐帧对比后重建几何：**产出** `f0167aa` 30 段圆角环扇形（6 段/区）、7.5s 连续扫动+
逐段点亮、32° 拖尾光楔、色点外引线 / HUNT 贯穿线，并修复 polar 参数顺序反转

### 阶段 4 · 全控件统一风格 + 生成指令

> **「为了形成统一风格的界面，请把其他常用控件用与刚才生成的组件相同的样式方式也一并改造，从而形成完整的包含各类组件的新的设计。请最后检查一次产品是否符合 shadcn 规范。并告诉我在 zcode 里面，如何通过简单的指令就生成此类风格的前端设计。」**

**产出**：`810981d` 组件补齐至 **51 个原语** + demo5 主页（模仿 ui.shadcn.com：导航 / Hero 辉光
标题 / 组件拼贴 / ⌘K 命令面板）；STYLE-GUIDE 固化主题命名与 ZCode 一句话生成指令

### 阶段 5 · 第一轮「严苛视觉大师」审计

> **「请你扮演一个严苛的视觉前端大师的角色，充分利用你的视觉功能，给这个 demo5 找出来 20 个要改进的地方，包含理据。要从用户体验角度说出问题来，最严重的问题排在前面。」**
>
> **「把这里面属于组件本身做的不好的问题先 fix 掉。」**
> **「继续清」**

自此确立本项目的核心工作循环：**审计 20 条（UX 理据、按严重度排序）→ 分层修复（组件自身
问题优先于页面问题）**。

**产出**：`5907ab9` 组件自身修复（焦点陷阱 / Sonner 上限 / DataTable 排序 / OTP 粘贴 /
Popover 翻转…）；`e41f51c` 页面级清零（移动端汉堡导航 / hero 断行 / 对比度 / reduced-motion）

### 阶段 6 · TheDial 转速：匀速三档

> **「TheDial 现在的呈现的效果就是我想要的，但是转动速度太快了，而且不是匀速的，请按照 60 秒、30 秒、10 秒转一圈来设计」**

定位到不匀速根因：loop 每帧回写 offset 造成二次方加速。**产出** `65bee53` 连续 rAF 时钟 +
三档周期 + 脏检查节流，确认匀速

### 阶段 7 · 接入真实行情数据

> **「使用 ~/code/dsh-stock-analysis/Vibe-Research 项目，抓取最新的数据，把这个页面变成真实数据」**

**产出**：`91c0e15` demo4 沪市终端（大盘分时+预测带 / 轮动盘=五大板块 / 资金流卡片 / 自选表单）；
`b8a0fd5` `fetch-data.py`（腾讯行情/m5 分时 + 东财行业资金流）→ demo4 数据驱动重构：
轮动盘五区 = **当日主力净流入 TOP5 行业**、预测概率由真实动量公式推导、REAL/MOCK 徽章自动切换

### 阶段 8 · 录制展示视频

> **「帮我打开页面录制一段展现页面动态效果的视频：打开页面后从页面顶端缓缓下拉到底部，总共 30 秒」**
>
> **「我希望是平滑的下拉，现在有卡顿的感觉。另外屏幕录制需要全屏幕，高清晰度，现在清晰度太低。」**

放弃 IAB 屏幕录制，改用 **Puppeteer headless 确定性逐帧渲染**（5120×2880 采集 → lanczos →
2560×1440@30fps，每帧滚动位置精确计算 = 绝对平滑）。**产出** `083b20a` + `tools/render-video.cjs`

### 阶段 9 · 组件库抽象升级 + 真源渲染管线

> **「聚焦组件设计缺陷造成的问题，我希望最终形成完美的组件库供以后开发使用。组件的使用也应该尽量简单且可控，在使用中不需要额外不必要编码和配置，且不容易踩坑，请基于上面的问题为线索，对组件库进行抽象、升级、修复，形成完美组件库。」**

抽象共性消灭复制粘贴：use-focus-trap（5 处覆盖层）、use-disclose（dropdown/popover）。
**产出** `2c8e9f8` + **`demo6.html` 真源管线**：浏览器内 fetch 真实 TSX → Babel 转译 → React
挂载，`@tailwindcss/browser` 按 token 实时编译——**组件行为以 demo6 为准，手写 HTML 镜像仅是
快照**（该管线首次运行即捕获 chart.tsx 缺失 cn import）。

### 阶段 10 · 合并为 example，转型 Agent 组件资料库

> **「把 demo4 和 demo5 合并成一个完整的主题展示样例，命名为 example，更新和整理本项目所有文件，把本项目变成一个适合类似 zcode 这类 agent 使用的前端组件资料库，后续我要用这个项目作为前端风格的指引。」**

**产出**：`eb648db` `demo/example.html`（真实数据驱动的完整样例，单一内联脚本，零顶层重复
声明）；历史 demo 归档 `demo/`、渲染器归档 `tools/`；STYLE-GUIDE 更新 example 为视觉总基准

### 阶段 11 · 第二、三轮审计与 40 项修复

> **「请你扮演一个严苛的视觉前端大师的角色……再给这个 example 页面找出来 20 个要改进的地方，包含理据。要从用户体验角度说出问题来，最严重的问题排在前面。」**（×2 轮）
>
> **「修复问题」**

两轮各 20 条（主题破裂 / 信息错误 / 导航 / 交互可发现性 / 视觉细节 / 数据呈现 / 文案，按严重
度排序），逐条断言式批量修复。亮点：日期选择器 7 列网格坍缩修复（`width:auto` + `1fr` +
`min-width:0` 三因相乘）、⌘K 假命令改真（真切 10s 转速）、白表头/蓝链接/focus 环三处 UA 默认
样式泄漏一次清零、粘性锚点导航、chart 演示对齐真源规范。
**产出**：`7b2a37d` 40 项修复，Puppeteer 全量回归零报错

### 阶段 12 · 本文件

> **「从会话日志中将用户所有指令摘录汇总到 readme 文件中，展现这个 ui 的制作过程」**

---

## 过程沉淀的方法论

1. **审计驱动**：三轮「严苛视觉大师 20 问」累计 60 条 UX 问题，是组件库质量的主要来源；
   修复顺序永远是"组件自身缺陷 → 页面问题"。
2. **真源管线防漂移**：手写 HTML 镜像会漂移（toast/轮播/折叠/chart 四起事故），组件行为
   唯一以 demo6 渲染真实 TSX 为准。
3. **确定性验证**：视觉验收用 Puppeteer 逐帧渲染/截图 + DOM 探针（computed style /
   getBoundingClientRect），不依赖肉眼。
4. **失败即断言**：批量修改生成物用逐条断言的转换脚本，漏匹配立即退出，不允许静默跳过。
5. **媒体时间戳以 ffprobe 为准**，永不手解析 WAV 头。

## 快速入口

| 文件 | 用途 |
| --- | --- |
| [demo/example.html](demo/example.html) | 完整参考样例（真实行情数据，**agent 推荐入口**） |
| [demo6.html](demo6.html) | 真源渲染管线（组件行为权威） |
| [STYLE-GUIDE.md](STYLE-GUIDE.md) | 设计规范 + ZCode 生成指令 |
| [fetch-data.py](fetch-data.py) | 行情数据抓取（腾讯 + 东财） |
| [tools/render-video.cjs](tools/render-video.cjs) | Puppeteer 确定性视频渲染 |
