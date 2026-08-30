import * as React from "react"
import { cn } from "@/lib/utils"
import { useMinuteClock } from "@/hooks/use-minute-clock"
import { TheDial } from "@/components/the-dial"
import { MinuteList } from "@/components/minute-list"
import { GlowCard } from "@/components/glow-card"
import { NodeFlow } from "@/components/node-flow"
import { Chip } from "@/components/ui/chip"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Avatar } from "@/components/ui/avatar"
import { Accordion, AccordionItem } from "@/components/ui/accordion"
import { Collapsible } from "@/components/ui/collapsible"
import { Carousel, CarouselItem } from "@/components/ui/carousel"
import { Chart } from "@/components/ui/chart"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { DataTable } from "@/components/ui/data-table"
import { Separator } from "@/components/ui/separator"
import { Kbd } from "@/components/ui/kbd"
import { Tooltip } from "@/components/ui/tooltip"
import { HoverCard } from "@/components/ui/hover-card"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { Pagination } from "@/components/ui/pagination"
import { Popover } from "@/components/ui/popover"
import { DropdownMenu } from "@/components/ui/dropdown-menu"
import { ContextMenu } from "@/components/ui/context-menu"
import { Command } from "@/components/ui/command"
import { Menubar } from "@/components/ui/menubar"
import { NavigationMenu } from "@/components/ui/navigation-menu"
import { Dialog } from "@/components/ui/dialog"
import { AlertDialog } from "@/components/ui/alert-dialog"
import { Sheet } from "@/components/ui/sheet"
import { Drawer } from "@/components/ui/drawer"
import { Calendar } from "@/components/ui/calendar"
import { DatePicker } from "@/components/ui/date-picker"
import { InputOTP } from "@/components/ui/input-otp"
import { FormField } from "@/components/ui/form"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { RadioGroup } from "@/components/ui/radio-group"
import { Toggle } from "@/components/ui/toggle"
import { ToggleGroup } from "@/components/ui/toggle-group"
import { Spinner } from "@/components/ui/spinner"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { toast, Toaster } from "@/components/ui/sonner"
import { Typography } from "@/components/ui/typography"

/* ── 小标题工具 ── */
function Section({ id, kicker, title, children }: { id: string; kicker: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mx-auto w-full max-w-5xl px-6 pt-16">
      <div className="font-mono text-[11px] uppercase tracking-[.18em] text-accent-amber">{kicker}</div>
      <h2 className="mt-2 text-[20px] font-bold">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  )
}

function Panel({ cap, children, className }: { cap: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-lg border border-border bg-card p-4", className)}>
      <div className="mb-3 font-mono text-[10px] uppercase tracking-[.14em] text-muted-foreground">{cap}</div>
      {children}
    </div>
  )
}

/* ── 应用 ── */
export default function App() {
  const [minute] = useMinuteClock({ periodMs: 60000 })
  const [dlg, setDlg] = React.useState(false)
  const [alertDlg, setAlertDialog] = React.useState(false)
  const [sheetOpen, setSheetOpen] = React.useState(false)
  const [drawerOpen, setDrawerOpen] = React.useState(false)
  const [cmdOpen, setCmdOpen] = React.useState(false)
  const [page, setPage] = React.useState(2)
  const [slider, setSlider] = React.useState(62)

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setCmdOpen(o => !o) }
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [])

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <header className="border-b border-border bg-card px-6 py-14 text-center">
        <div className="font-mono text-[11px] uppercase tracking-[.18em] text-muted-foreground">
          真源渲染 · components/ui/*.tsx 由 React 实时挂载
        </div>
        <h1 className="mt-3 text-[34px] font-bold leading-tight">
          全部组件均为 <span className="text-accent-amber">真实源码</span> 渲染
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-[13px] leading-loose text-muted-foreground">
          本页即 <b className="text-foreground">showcase/app.tsx</b> —— 由 Babel + React 在浏览器内
          转译挂载的真实组件源码，样式由 Tailwind 运行时按 clark 暗黑辉光 token 编译。
          按 <Kbd>⌘K</Kbd> 打开命令面板。
        </p>
      </header>

      {/* 01 轮动盘（组合件实战） */}
      <Section id="dial" kicker="01 · ROTATION DIAL" title="TheDial + MinuteList + useMinuteClock">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_360px]">
          <TheDial minute={minute} />
          <MinuteList
            minute={minute}
            items={[
              { label: "金融放量 · 指数站稳", at: 8 },
              { label: "科技承接 · 半导体领涨", at: 20 },
              { label: "防御轮动 · 消费高股息", at: 32 },
              { label: "医药超跌反弹", at: 47 },
            ]}
          />
        </div>
      </Section>

      {/* 02 按钮 / 徽章 / 头像 */}
      <Section id="buttons" kicker="02 · BUTTON / BADGE / AVATAR" title="按钮与徽章">
        <div className="grid gap-4 md:grid-cols-2">
          <Panel cap="button · 4 variants">
            <div className="row flex flex-wrap gap-3">
              <Button>Default</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="danger" onClick={() => setAlertDialog(true)}>Danger</Button>
            </div>
          </Panel>
          <Panel cap="badge · avatar">
            <div className="flex flex-wrap items-center gap-3">
              <Badge>default</Badge><Badge variant="secondary">secondary</Badge>
              <Badge variant="outline">outline</Badge><Badge variant="destructive">destructive</Badge>
              <Avatar fallback="CK" /><Avatar fallback="AI" tone="var(--accent-teal)" />
            </div>
          </Panel>
        </div>
      </Section>

      {/* 03 表单 */}
      <Section id="form" kicker="03 · FORM" title="表单类">
        <div className="grid gap-4 md:grid-cols-3">
          <Panel cap="input · textarea · select">
            <Input placeholder="ROOT.md" />
            <div className="h-3" />
            <Textarea placeholder="备注…" />
            <div className="h-3" />
            <Select><option>金融 FIN</option><option>科技 TECH</option></Select>
          </Panel>
          <Panel cap="form-field · date-picker · popover">
            <FormField label="项目名" htmlFor="f-name" description="描述行：展示在控件下方。">
              <Input id="f-name" placeholder="输入名称" />
            </FormField>
            <div className="h-3" />
            <FormField label="日期" error={undefined}>
              <DatePicker onChange={(d) => toast(`选择 ${d.toLocaleDateString()}`, { tone: "teal" })} />
            </FormField>
          </Panel>
          <Panel cap="switch · checkbox · radio · slider">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <Switch defaultChecked onCheckedChange={(c) => toast(c ? "已开启" : "已关闭", { tone: "teal" })} />
                <span className="text-[12px]">自动同步</span>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox defaultChecked onCheckedChange={(c) => toast(String(c), { tone: "teal" })} />
                <span className="text-[12px]">只看红盘</span>
              </div>
              <RadioGroup
                defaultValue="day"
                options={[{ value: "day", label: "日K" }, { value: "week", label: "周K" }, { value: "month", label: "月K" }]}
              />
              <div className="pt-1"><Slider defaultValue={50} max={100} onValueChange={() => {}} /></div>
            </div>
          </Panel>
          <Panel cap="input-otp">
            <InputOTP onComplete={(code) => toast(`验证码 ${code}`, { tone: "green" })} />
            <p className="mt-2 text-[11px] text-muted-foreground">填满 6 位自动回调；支持整段粘贴。</p>
          </Panel>
          <Panel cap="toggle · toggle-group · spinner">
            <div className="flex flex-wrap items-center gap-3">
              <Toggle pressed onPressedChange={() => {}}>Bold</Toggle>
              <Toggle>Italic</Toggle>
              <ToggleGroup type="multiple" items={[{ value: "a", label: "A" }, { value: "b", label: "B" }]} />
              <Spinner /><Spinner size={22} />
            </div>
          </Panel>
          <Panel cap="calendar">
            <Calendar onChange={(d) => toast(d.toLocaleDateString(), { tone: "teal" })} />
          </Panel>
        </div>
      </Section>

      {/* 04 反馈 */}
      <Section id="feedback" kicker="04 · FEEDBACK" title="反馈类">
        <div className="grid gap-4 md:grid-cols-3">
          <Panel cap="alert · 4 tones">
            <Alert><AlertTitle>amber</AlertTitle><AlertDescription>the largest line.</AlertDescription></Alert>
            <div className="h-2" />
            <Alert tone="teal"><AlertTitle>teal</AlertTitle><AlertDescription>a handful out.</AlertDescription></Alert>
          </Panel>
          <Panel cap="progress · skeleton · kbd">
            <Progress value={72} /><div className="h-2" /><Progress value={45} tone="teal" />
            <div className="mt-4 flex items-center gap-2">
              <Kbd>⌘</Kbd><Kbd>K</Kbd><span className="text-[11px] text-muted-foreground">打开命令面板</span>
            </div>
          </Panel>
          <Panel cap="sonner · toast">
            <div className="flex flex-col gap-2">
              <Button size="sm" onClick={() => toast("已保存", { description: "写入 ROOT.md", tone: "green" })}>成功 toast</Button>
              <Button size="sm" variant="outline" onClick={() => toast("已更新", { tone: "teal" })}>信息 toast</Button>
              <Button size="sm" variant="danger" onClick={() => toast("失败", { description: "请重试", tone: "red" })}>错误 toast</Button>
            </div>
          </Panel>
        </div>
      </Section>

      {/* 05 覆盖层 */}
      <Section id="overlay" kicker="05 · OVERLAY" title="覆盖层">
        <div className="grid gap-4 md:grid-cols-3">
          <Panel cap="dialog · alert-dialog · sheet · drawer">
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="outline" onClick={() => setDlg(true)}>Dialog</Button>
              <Button size="sm" variant="danger" onClick={() => setAlertDialog(true)}>AlertDialog</Button>
              <Button size="sm" variant="outline" onClick={() => setSheetOpen(true)}>Sheet</Button>
              <Button size="sm" variant="outline" onClick={() => setDrawerOpen(true)}>Drawer</Button>
            </div>
          </Panel>
          <Panel cap="command · ⌘K">
            <Button size="sm" variant="default" onClick={() => setCmdOpen(true)}>⌘K 打开命令面板</Button>
          </Panel>
          <Panel cap="dropdown · context-menu · menubar">
            <div className="flex flex-wrap items-center gap-3">
              <DropdownMenu
                trigger={<Button size="sm" variant="outline">▾ Dropdown</Button>}
                items={[
                  { label: "个人资料", shortcut: "⇧P" },
                  { label: "账单", shortcut: "⌘B" },
                  "separator",
                  { label: "退出登录", danger: true },
                ]}
              />
              <Menubar
                menus={[
                  { label: "文件", items: <><button className="w-full px-3 py-1.5 text-left hover:text-accent-amber">新建</button><button className="w-full px-3 py-1.5 text-left hover:text-accent-amber">打开</button></> },
                  { label: "编辑", items: <><button className="w-full px-3 py-1.5 text-left hover:text-accent-amber">剪切</button><button className="w-full px-3 py-1.5 text-left hover:text-accent-amber">粘贴</button></> },
                ]}
              />
            </div>
          </Panel>
          <Panel cap="tooltip · hover-card · popover" className="md:col-span-2">
            <div className="flex flex-wrap items-center gap-6">
              <Tooltip label="I am a tooltip"><Button size="sm" variant="outline">tooltip</Button></Tooltip>
              <HoverCard trigger={<span>hover-card 预览</span>}>
                <div className="flex items-center gap-3">
                  <Avatar fallback="CK" /><div><b className="text-[12px]">@clark</b><div className="text-[11px] text-muted-foreground">暗黑辉光主题作者</div></div>
                </div>
              </HoverCard>
              <Popover trigger={<Button size="sm" variant="outline">popover</Button>}>
                气泡内容 — 点击外部或 Esc 关闭。
              </Popover>
              <ContextMenu
                items={[
                  { label: "打开" }, { label: "复制配置" }, "separator", { label: "删除", danger: true },
                ]}
              >
                <div className="rounded-lg border border-dashed border-accent-amber/40 px-6 py-4 text-[12px] text-muted-foreground">
                  在此区域右键 → ContextMenu
                </div>
              </ContextMenu>
            </div>
          </Panel>
        </div>
      </Section>

      {/* 06 导航 */}
      <Section id="nav" kicker="06 · NAVIGATION" title="导航类">
        <div className="flex flex-col gap-5">
          <Breadcrumb items={[{ label: "首页", href: "#" }, { label: "组件", href: "#" }, { label: "breadcrumb" }]} />
          <NavigationMenu items={[{ label: "展示", href: "#dial", active: true }, { label: "表单", href: "#form" }, { label: "数据", href: "#data" }]} />
          <Pagination page={page} total={9} onChange={setPage} />
          <Tabs defaultValue="t1">
            <TabsList>
              <TabsTrigger value="t1">日K</TabsTrigger><TabsTrigger value="t2">周K</TabsTrigger><TabsTrigger value="t3">月K</TabsTrigger>
            </TabsList>
            <TabsContent value="t1">日K 视图。</TabsContent>
            <TabsContent value="t2">周K 视图。</TabsContent>
            <TabsContent value="t3">月K 视图。</TabsContent>
          </Tabs>
        </div>
      </Section>

      {/* 07 数据 */}
      <Section id="data" kicker="07 · DATA" title="数据类">
        <div className="grid gap-6 md:grid-cols-2">
          <Panel cap="chart · amber / teal">
            <Chart tone="amber" height={150} data={[{ label: "Q1", value: 42 }, { label: "Q2", value: 68 }, { label: "Q3", value: 35 }, { label: "Q4", value: 80 }]} />
            <div className="h-4" />
            <Chart tone="teal" height={150} showValues={false} data={[{ label: "Mon", value: 30 }, { label: "Tue", value: 55 }, { label: "Wed", value: 72 }]} />
          </Panel>
          <Panel cap="data-table · 点击表头排序">
            <DataTable
              columns={[
                { key: "name", label: "板块" },
                { key: "chg", label: "涨跌", align: "right", sortValue: (r) => r.chg },
                { key: "main", label: "主力(亿)", align: "right", sortValue: (r) => r.main },
              ]}
              rows={[
                { name: "基础化工", chg: "+1.57%", main: 26.8 },
                { name: "横向通用软件", chg: "+3.25%", main: 21.7 },
                { name: "软件开发", chg: "+0.81%", main: 21.0 },
              ]}
            />
          </Panel>
        </div>
      </Section>

      {/* 08 布局 / 展示杂项 */}
      <Section id="misc" kicker="08 · LAYOUT & MISC" title="布局与杂项">
        <div className="grid gap-4 md:grid-cols-3">
          <Panel cap="accordion">
            <Accordion>
              <AccordionItem title="什么是 copy-own-code？" defaultOpen>源码复制进仓库，没有黑盒依赖。</AccordionItem>
              <AccordionItem title="辉光怎么实现？">box-shadow 环境光 + color-mix 透明度。</AccordionItem>
            </Accordion>
          </Panel>
          <Panel cap="collapsible · carousel">
            <Collapsible title="展开的折叠面板" defaultOpen>▸ 旋转 90°，grid-rows 过渡。</Collapsible>
            <div className="h-2" />
            <Carousel>
              <CarouselItem><div className="rounded-lg border border-border p-4 text-[12px]">slide 1</div></CarouselItem>
              <CarouselItem><div className="rounded-lg border border-border p-4 text-[12px]">slide 2</div></CarouselItem>
              <CarouselItem><div className="rounded-lg border border-border p-4 text-[12px]">slide 3</div></CarouselItem>
            </Carousel>
          </Panel>
          <Panel cap="skeleton · separator · typography">
            <Skeleton className="h-3 w-3/4" /><div className="h-2" /><Skeleton className="h-3 w-1/2" />
            <Separator className="my-3" />
            <Typography variant="quote">quote — 琥珀左线引用。</Typography>
          </Panel>
        </div>
      </Section>

      {/* 页脚 */}
      <footer className="mt-20 border-t border-border py-10 text-center font-mono text-[12px] text-muted-foreground">
        clark 的暗黑辉光主题 · 真源渲染 · <span className="text-accent-amber">不构成投资建议</span>
      </footer>

      {/* 覆盖层挂载 */}
      <Dialog open={dlg} onOpenChange={setDlg} title="模态对话框" description="Esc / 遮罩关闭；焦点陷阱已启用。"
        footer={<Button size="sm" onClick={() => setDlg(false)}>关闭</Button>} />
      <AlertDialog
        open={alertDlg} onOpenChange={setAlertDialog}
        title="确认删除数据源？" description="此操作无法撤销。"
        confirmText="确认删除" onConfirm={() => toast("已删除", { tone: "red" })}
      />
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen} title="右侧 Sheet">滑入面板，Esc 关闭，焦点陷阱已启用。</Sheet>
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen} title="底部 Drawer">向上滑入，Esc 关闭。</Drawer>
      <Command
        open={cmdOpen} onOpenChange={setCmdOpen}
        items={[
          { label: "打开 Dialog 示例", hint: "overlay", onSelect: () => setDlg(true) },
          { label: "成功 Toast", hint: "sonner", onSelect: () => toast("已保存", { tone: "green" }) },
          { label: "滚回顶部", hint: "nav", onSelect: () => window.scrollTo({ top: 0, behavior: "smooth" }) },
        ]}
        onSelect={(it) => toast(it.label, { tone: "teal" })}
      />
      <Toaster />
    </div>
  )
}
