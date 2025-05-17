# 劝学网助手（Quanxue Reader Helper）

一个用于 www.quanxue.cn 网站的 Chrome 扩展，自动保存并同步你的阅读进度，支持多设备同步和本地缓存，提供便捷的悬浮窗历史记录管理。
![image](https://github.com/user-attachments/assets/7a44c9fb-5db8-4bd3-90e3-c7d05443a1a4)



## 功能特性
- 自动检测并保存你在 www.quanxue.cn 书籍页面的阅读进度
- 阅读历史支持 Google 账号云同步
- 未登录 Google 账号时也支持本地缓存
- 右下角悬浮窗，随时查看、跳转、删除历史记录
- 支持多设备同步，无需第三方云服务

## 安装与使用
1. 推荐：直接下载 [最新 release 的 zip 包](https://github.com/wobure123/quanxue-helper/releases)
   - 打开 Chrome，访问 `chrome://extensions/`，开启“开发者模式”
   - 点击“加载已解压的扩展”，选择刚下载的文件，或者直接将文件拖到浏览器中
2. 或者，克隆或下载本项目到本地：
   ```bash
   git clone https://github.com/wobure123/quanxue-helper.git
   ```
   然后同上，加载已解压的扩展。

3. 访问 www.quanxue.cn 任意页面，右下角会出现“阅”悬浮按钮
4. 点击悬浮按钮可查看、跳转、删除历史记录


## 隐私与安全
- 所有阅读进度仅保存在本地浏览器和 Google 账号云端，不上传到第三方服务器
- 不收集、不分析、不上传任何用户隐私数据

## 许可协议
MIT License

## 更新日志

### 1.0.1（2025-05-17）
- 历史记录功能优化：记录和恢复页面滚动位置更精确，支持同页刷新恢复进度。
- 修复参数重复、保存频率等细节问题，体验更流畅。

---

如有建议或问题，欢迎在 GitHub 提 issue！
