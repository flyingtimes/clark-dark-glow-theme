/* demo4 展示视频确定性渲染器：headless Chrome @ 2560×1440 (dsf=2 → 5120×2880 采集)
   每帧滚动位置按 30s 时间线精确计算（顶部 2.5s → 25s 匀速 → 底部 2.5s），零卡顿
   用法: NODE_PATH=/opt/homebrew/lib/node_modules node render-video.cjs */
const puppeteer = require('puppeteer-core');
const fs = require('fs');

const FRAMES_DIR = '/tmp/demo4_frames';
const FPS = 30, TOTAL_S = 30, HOLD0 = 2.5, DUR = 25;

(async () => {
  fs.rmSync(FRAMES_DIR, { recursive: true, force: true });
  fs.mkdirSync(FRAMES_DIR, { recursive: true });

  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: 'new',
    args: ['--no-sandbox', '--hide-scrollbars', '--force-color-profile=srgb', '--mute-audio', '--disable-gpu-sandbox'],
    defaultViewport: { width: 2560, height: 1440, deviceScaleFactor: 2 },
  });
  const page = await browser.newPage();
  await page.goto('http://127.0.0.1:8734/demo4.html', { waitUntil: 'networkidle2', timeout: 60000 });
  await new Promise((r) => setTimeout(r, 2500));          // 字体 + 真实数据注入

  const badge = await page.evaluate(() => document.getElementById('src-badge').textContent);
  const maxScroll = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
  console.log(`badge=${badge} maxScroll=${maxScroll}`);
  await page.evaluate(() => window.scrollTo(0, 0));

  const N = FPS * TOTAL_S;
  const t0 = Date.now();
  for (let i = 0; i < N; i++) {
    const t = i / FPS;
    const p = Math.min(1, Math.max(0, (t - HOLD0) / DUR));
    await page.evaluate((y) => window.scrollTo(0, y), Math.round(maxScroll * p));
    const buf = await page.screenshot({ type: 'jpeg', quality: 90, optimizeForSpeed: true });
    fs.writeFileSync(`${FRAMES_DIR}/f_${String(i).padStart(4, '0')}.jpg`, buf);
    if (i % 150 === 0) console.log(`frame ${i}/${N} (${((Date.now() - t0) / 1000).toFixed(0)}s)`);
  }
  await browser.close();
  console.log(`DONE ${N} frames in ${((Date.now() - t0) / 1000).toFixed(0)}s`);
})().catch((e) => { console.error(e); process.exit(1); });
