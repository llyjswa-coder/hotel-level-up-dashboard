# 酒店积分刷房看板

这是一个纯静态网站，可以部署到 Vercel、Netlify、Cloudflare Pages 或 GitHub Pages。

## 手机访问

部署后，用手机打开线上地址即可。iPhone 可以在 Safari 里点分享按钮，然后选择“添加到主屏幕”。

## 数据说明

当前版本的数据保存在浏览器本地。也就是说：

- 同一台手机上会保留记录。
- 换手机、换浏览器或清理浏览器数据后，记录不会自动同步。
- 如果需要电脑和手机实时同步，下一步需要接入一个在线数据库，比如 Supabase 或 Firebase。

## 部署建议

最简单方式是把这个文件夹上传到任一静态托管平台。需要上传的核心文件是：

- `index.html`
- `styles.css`
- `app.js`
- `manifest.webmanifest`
- `assets/`
