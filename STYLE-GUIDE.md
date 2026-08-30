# clark 的暗黑辉光主题 · 组件规范（Dark Glow Theme）

本仓库是「clark 的暗黑辉光主题」的参考实现——一套 terminal 气质的暗色设计系统。
任何会话（ZCode / Claude / 人）按本文件开发即可保证风格统一。视觉总基准：`example.html`（完整主题展示 = 行情终端 + 全控件库合并版）；组件行为权威：`demo6.html`（真源渲染）。

## 主题命名

**clark 的暗黑辉光主题（Clark Dark Glow Theme）**
关键词：五色系 token · 1px 渐变描边 · box-shadow 环境辉光 · JetBrains Mono · copy-own-code

## 技术栈与结构

- Next.js (App Router) + Tailwind v4 + shadcn 方式（copy-own-code：组件源码进仓库，不引黑盒 UI 包）
- 原语组件 → `components/ui/*.tsx`；组合组件 → `components/*.tsx`
- `cn()` 来自 `lib/utils.ts`（clsx + tailwind-merge）；变体用 `class-variance-authority`
- 原语带 `data-slot` 属性；受状态组件加 `"use client"`

## 主题 token（globals.css / styles/clone-ui-tokens.css）

组件内**禁止硬编码色值**，一律引用 CSS 变量：

| token | 用途 |
|---|---|
| `--background / --card / --border` | 底色三层（近黑 / 卡片 / 描边） |
| `--accent-amber` | 主 accent（ROOT.md、主按钮、焦点态） |
| `--accent-violet / teal / red / green` | 四个分区色（也用于任意控件的 tone 变体） |
| `--radius` | 统一圆角基准 |

## 风格公式（全站统一）

1. **字体**：JetBrains Mono（`--font-mono`），正文 12–13px，标签/按钮 11px 大写 + 加宽字距
2. **辉光公式**：`box-shadow: 0 0 <扩散>px -<收缩>px color-mix(in oklab, <accent> 75%, transparent)`
   - 卡片常态 48px/-14px，hover 64px/-12px；按钮/焦点 18–20px/-8px；微元素 14–16px/-6px
3. **描边**：1px 渐变描边（白 10% → border → 透明）或 `accent/45%` 实色描边
4. **焦点/hover**：边框转向 accent + 辉光增强，永远有 `focus-visible` 态
5. **否定/风险**：红色 + **虚线边框**（dashed）
6. **排版气质**：文案保留 `·` 分隔的小写英文短句、`+` 前缀 chips、muted 灰结论行

## 组件清单（对标 ui.shadcn.com 全类别，均已辉光化）

原语（components/ui/）：
accordion · alert · alert-dialog · aspect-ratio · avatar · badge · breadcrumb · button · calendar ·
card · carousel · chart · checkbox · chip · collapsible · command · context-menu · data-table ·
date-picker · dialog · drawer · dropdown-menu · form · hover-card · input · input-otp · kbd ·
label · menubar · navigation-menu · pagination · popover · progress · radio-group · resizable ·
scroll-area · select · separator · sheet · sheet(侧滑) · skeleton · slider · sonner(toast) ·
spinner · switch · table · tabs · textarea · toggle · toggle-group · tooltip · typography

组合（components/）：glow-card · the-dial（60 分钟轮动盘）· node-flow · minute-list

复用 Hooks（hooks/）：
- `use-minute-clock` — 连续分钟时钟（rAF，小数分钟，60/30/10s 一圈）
- `use-focus-trap` — 模态焦点陷阱 + Esc + 关闭还原焦点（Dialog/AlertDialog/Sheet/Drawer/Command 内建）
- `use-disclose` — 开合状态 + 外点关闭 + Esc（Dropdown/Popover 类组件的统一底座）

约定：覆盖层类组件一律经过 useFocusTrap；弹出/下拉一律经过 useDisclose；弹入动画统一
`clarkPop`（120ms，opacity+scale，respect prefers-reduced-motion）——不要在页面里手写这套逻辑。
Hooks：hooks/use-minute-clock.ts（连续分钟时钟）

**Agent 生成页面的推荐入口：`example.html`** —— 主题完整参考样例（真实行情数据驱动：
轮动盘 / 板块卡片 / 预测 / 自选表单 + 全控件库），全部逻辑内联在页尾单一脚本内。
全部组件另在 `demo5.html`（组件总览主页）、`demo4.html`（行情终端实战）、`demo3.html`（控件画廊）
中有可交互演示（历史分层快照）。

## 真源渲染（demo6）

`demo6.html` 是**权威演示**：零构建管线，在浏览器内 fetch `components/ui/*.tsx` 真实源码 →
Babel 转译（typescript→react→env）→ 迷你模块注册表 → React 挂载；样式由 `@tailwindcss/browser`
按 `@theme` token 实时编译。运行时依赖已 vendor 至 `vendor/`（react/react-dom/babel/clsx/tailwind-merge/tailwind-browser）。

**铁律：组件行为以 demo6 为准。** 手写 HTML 镜像（demo2/3/4/5）仅作静态快照——它们会漂移，
已实际发生（toast/轮播/折叠三处漂移事故）。修改组件后刷新 demo6 即可验证真源效果。

## 数据管线

`fetch-data.py` 拉取腾讯行情/分钟K + 东财行业资金流 → `demo4-data.json`；`example.html` 与
`demo4.html` 加载时先用 MOCK 立即渲染，fetch 成功后整体替换为真实数据（badge 显示 REAL·抓取时间）。

## 视觉基准

`demo2.html`（TheDial 转盘 + 时钟联动）、`demo3.html`（全控件总览）。改任何组件前先看这两页。

---

## ZCode 生成指令（复制即用）

**方式 A —— 仓库内开发（推荐）**：把本文件提交进仓库后，ZCode 会自动读取仓库约定，直接说需求即可：

> 按本仓库风格规范，新增一个「设置页」，包含模型选择、预算滑杆、开关组和保存按钮。

**方式 B —— 新会话 / 新仓库**：把下面这段粘贴为第一条消息（或存成 AGENTS.md）：

```text
按以下规范开发一个暗色终端辉光风的前端界面（Next.js + Tailwind v4，组件用 shadcn 方式：
源码复制进 components/ui/，cva 管变体，cn() 合并类名，组件加 data-slot）：

1. 主题全部走 CSS 变量：--background/--card/--border 近黑三层；五个 accent：
   --accent-amber(主) / --accent-violet / --accent-teal / --accent-red / --accent-green；
   组件内禁止硬编码色值。
2. 全站 JetBrains Mono；正文 12-13px；标签与按钮 11px 大写 + tracking-wider。
3. 辉光公式：box-shadow: 0 0 Npx -Mpx color-mix(in oklab, <accent> 75%, transparent)，
   卡片 48/-14，hover 增强 64/-12，按钮与焦点态 18-20/-8；焦点必须改边框色 + 增辉光。
4. 风格母题：暗底、1px 渐变描边、红色虚线表示否定项、`·` 分隔的小写英文短句做结论行。
5. 先产出 globals.css 的 token 定义，再写组件，最后给一个 demo 页横向展示全部控件。
```

**方式 C —— 团队分发**：把 `components/` + `styles/clone-ui-tokens.css` 打包成 shadcn registry（registry.json），
队友 `npx shadcn@latest add <registry-url>/button` 一条命令拉取同一风格。
