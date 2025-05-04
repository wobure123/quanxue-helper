# 劝学网助手（Quanxue Reader Helper）

一个用于 www.quanxue.cn 网站的 Chrome 扩展，自动保存并同步你的阅读进度，支持多设备同步和本地缓存，提供便捷的悬浮窗历史记录管理。
![image](https://github.com/user-attachments/assets/9226a232-af18-4c97-8895-f4384bdbb134)



## 功能特性
- 自动检测并保存你在 www.quanxue.cn 书籍页面的阅读进度
- 阅读历史支持 Google 账号云同步（chrome.storage.sync）
- 未登录 Google 账号时也支持本地缓存（localStorage）
- 右下角悬浮窗，随时查看、跳转、删除历史记录
- 书名、章节智能提取，避免重复
- 支持多设备同步，无需第三方云服务

## 安装与使用
1. 克隆或下载本项目到本地：
   ```bash
   git clone https://github.com/你的用户名/quanxue-helper.git
   ```
2. 打开 Chrome，访问 `chrome://extensions/`，开启“开发者模式”
3. 点击“加载已解压的扩展”，选择本项目文件夹
4. 访问 www.quanxue.cn 任意页面，右下角会出现“阅”悬浮按钮
5. 点击悬浮按钮可查看、跳转、删除历史记录

## 主要文件说明
- `manifest.json`：Chrome 扩展配置
- `content.js`：页面注入脚本，负责进度保存和悬浮窗
- `popup.html`/`popup.js`：扩展图标弹窗页面（可选）
- `options.html`/`options.js`：扩展设置页面（可选）
- `background.js`：后台脚本，处理页面跳转
- `icons/`：扩展图标

## 隐私与安全
- 所有阅读进度仅保存在本地浏览器和 Google 账号云端，不上传到第三方服务器
- 不收集、不分析、不上传任何用户隐私数据

## 许可协议
MIT License

---

如有建议或问题，欢迎在 GitHub 提 issue！
