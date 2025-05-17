// background.js

// 只保留页面跳转相关逻辑，其余 Supabase 相关代码全部移除

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'NAVIGATE_TO') {
    if (message.url) {
      chrome.tabs.create({ url: message.url }, tab => {
        // 如果有滚动位置，注入脚本滚动到指定位置
        if (message.scroll_y && typeof message.scroll_y === 'number') {
          chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: (y) => {
              window.scrollTo(0, y);
            },
            args: [message.scroll_y]
          });
        }
      });
      sendResponse({ success: true });
    } else {
      sendResponse({ success: false });
    }
    return true;
  }
});