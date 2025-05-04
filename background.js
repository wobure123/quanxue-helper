// background.js

// 只保留页面跳转相关逻辑，其余 Supabase 相关代码全部移除

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'NAVIGATE_TO') {
    if (message.url) {
      chrome.tabs.create({ url: message.url });
      sendResponse({ success: true });
    } else {
      sendResponse({ success: false });
    }
    return true;
  }
});