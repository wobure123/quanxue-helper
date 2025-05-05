// content.js

// This file will be used to inject scripts into the page to extract reading information.

(function() {
  // ===== 悬浮窗入口按钮和面板（始终注入） =====
  if (!document.getElementById('qx-helper-fab')) {
    const fab = document.createElement('div');
    fab.id = 'qx-helper-fab';
    fab.style.cssText = `
      position: fixed; z-index: 99999; right: 32px; bottom: 32px;
      width: 48px; height: 48px; background: #2563eb; color: #fff;
      border-radius: 50%; box-shadow: 0 2px 8px rgba(0,0,0,0.18);
      display: flex; align-items: center; justify-content: center;
      font-size: 22px; cursor: pointer; transition: box-shadow 0.2s;
    `;
    fab.title = '查看阅读历史';
    fab.innerHTML = '<span style="font-weight:bold;">阅</span>';
    document.body.appendChild(fab);

    // 悬浮窗面板
    const panel = document.createElement('div');
    panel.id = 'qx-helper-panel';
    panel.style.cssText = `
      position: fixed; z-index: 99999; right: 32px; bottom: 90px;
      width: 320px; max-height: 400px; background: #fff; color: #222;
      border-radius: 10px; box-shadow: 0 4px 24px rgba(0,0,0,0.18);
      display: none; flex-direction: column; overflow: hidden;
      font-size: 15px;
    `;
    panel.innerHTML = `
      <div style="background:#2563eb;color:#fff;padding:10px 16px;font-size:16px;display:flex;align-items:center;justify-content:space-between;">
        <span>阅读历史</span>
        <button id="qx-helper-close" style="background:none;border:none;color:#fff;font-size:18px;cursor:pointer;">×</button>
      </div>
      <ul id="qx-helper-history" style="list-style:none;margin:0;padding:0;max-height:320px;overflow:auto;"></ul>
      <div id="qx-helper-empty" style="padding:16px;text-align:center;color:#888;display:none;">暂无阅读记录</div>
    `;
    document.body.appendChild(panel);

    // 美化面板样式，字体自适应
    const style = document.createElement('style');
    style.textContent = `
      #qx-helper-panel {
        font-size: 1rem;
        max-width: 90vw;
        box-shadow: 0 4px 24px rgba(0,0,0,0.18);
        font-family: 'Kaiti', '楷体', 'STKaiti', serif;
      }
      #qx-helper-panel ul { font-size: 1em; }
      #qx-helper-panel li {
        padding: 0.7em 1em;
        border-bottom: 1px solid #f0f0f0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        transition: background 0.2s;
        position: relative;
      }
      #qx-helper-panel li:hover {
        background: #f6f8fa;
      }
      #qx-helper-panel .qx-helper-fulltext {
        display: none;
        position: absolute;
        left: 0;
        top: 100%;
        z-index: 100;
        background: rgba(255,255,255,0.92);
        color: #222;
        border: 1px solid #2563eb;
        border-radius: 6px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.12);
        padding: 12px 18px;
        min-width: 220px;
        max-width: 90vw;
        white-space: normal;
        font-size: 1.08em;
        font-family: 'SimHei', 'Heiti SC', '黑体', 'Microsoft YaHei', Arial, sans-serif;
        word-break: break-all;
        line-height: 1.7;
        letter-spacing: 0.02em;
        pointer-events: none;
        user-select: none;
      }
      #qx-helper-panel li.qx-helper-last:hover .qx-helper-fulltext {
        top: auto;
        bottom: 100%;
      }
      #qx-helper-panel li:hover .qx-helper-fulltext {
        display: block;
      }
      #qx-helper-panel li.qx-helper-btn-hover .qx-helper-fulltext {
        display: none !important;
      }
      #qx-helper-panel .qx-helper-btns {
        display: flex;
        gap: 8px;
        margin-left: 16px;
        flex-shrink: 0;
      }
      #qx-helper-panel button {
        background: #2563eb;
        color: #fff;
        border: none;
        border-radius: 4px;
        padding: 2px 12px;
        font-size: 0.98em;
        cursor: pointer;
        transition: background 0.2s;
      }
      #qx-helper-panel button:hover {
        background: #1749b1;
      }
      #qx-helper-panel button:last-child {
        background: #eee;
        color: #d00;
      }
      #qx-helper-panel button:last-child:hover {
        background: #fdd;
      }
      #qx-helper-panel ul {
        max-height: 320px;
        overflow-y: auto;
      }
    `;
    document.head.appendChild(style);

    // 展开/收起逻辑
    fab.onclick = () => {
      if (panel.style.display === 'flex') {
        panel.style.display = 'none';
      } else {
        panel.style.display = 'flex';
        loadHistory();
      }
    };
    panel.querySelector('#qx-helper-close').onclick = () => {
      panel.style.display = 'none';
    };

    // 加载历史记录
    function loadHistory() {
      const list = panel.querySelector('#qx-helper-history');
      const empty = panel.querySelector('#qx-helper-empty');
      list.innerHTML = '';
      chrome.storage.sync.get({ reading_history: [] }, (result) => {
        let data = result.reading_history;
        // fallback: 如果没有云同步数据，尝试本地缓存
        if ((!data || data.length === 0) && localStorage.getItem('qx_reading_history')) {
          try {
            data = JSON.parse(localStorage.getItem('qx_reading_history')) || [];
          } catch(e) { data = []; }
        }
        if (!data || data.length === 0) {
          empty.style.display = '';
          return;
        }
        empty.style.display = 'none';
        data.forEach((item, idx) => {
          const li = document.createElement('li');
          li.style.cssText = 'padding:10px 16px;border-bottom:1px solid #f0f0f0;display:flex;align-items:center;justify-content:space-between;';
          // 主内容span
          const mainSpan = document.createElement('span');
          mainSpan.style.cssText = 'flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;';
          const text = `${item.book_title || '未知书名'}：${item.last_page_title || ''}`;
          mainSpan.textContent = text;
          // 悬浮完整内容
          const fullText = document.createElement('div');
          fullText.className = 'qx-helper-fulltext';
          fullText.textContent = text;
          mainSpan.appendChild(fullText);
          li.appendChild(mainSpan);
          // 让最后一条li加特殊class，气泡向上弹出
          if (idx === data.length - 1) li.classList.add('qx-helper-last');
          const btns = document.createElement('span');
          btns.className = 'qx-helper-btns';
          btns.style.cssText = 'display:flex;gap:8px;margin-left:16px;flex-shrink:0;';
          btns.onmouseenter = () => li.classList.add('qx-helper-btn-hover');
          btns.onmouseleave = () => li.classList.remove('qx-helper-btn-hover');
          // 跳转按钮
          const navBtn = document.createElement('button');
          navBtn.className = 'qx-helper-btn';
          navBtn.textContent = '前往';
          navBtn.style.cssText = 'background:#2563eb;color:#fff;border:none;border-radius:4px;padding:2px 10px;cursor:pointer;';
          navBtn.onclick = () => {
            window.open(item.last_page_url, '_blank');
          };
          // 删除按钮
          const delBtn = document.createElement('button');
          delBtn.className = 'qx-helper-btn';
          delBtn.textContent = '删除';
          delBtn.style.cssText = 'background:#eee;color:#d00;border:none;border-radius:4px;padding:2px 10px;cursor:pointer;';
          delBtn.onclick = () => {
            // 删除时两处都同步
            chrome.storage.sync.get({ reading_history: [] }, (res) => {
              let history = res.reading_history.filter(h => h.book_url_base !== item.book_url_base);
              chrome.storage.sync.set({ reading_history: history }, () => {
                try {
                  localStorage.setItem('qx_reading_history', JSON.stringify(history));
                } catch(e) {}
                loadHistory();
              });
            });
          };
          btns.appendChild(navBtn);
          btns.appendChild(delBtn);
          li.appendChild(btns);
          list.appendChild(li);
        });
      });
    }
  }

  // ===== 仅在内容页保存进度，目录页/首页不保存 =====
  // 目录页通常为 index.html、xxxindex.html，首页为 / 或 /index.html
  const url = location.href;
  const isIndex = /index\.html$/i.test(url) || /[a-zA-Z0-9]+index\.html$/i.test(url);
  const isHome = /www\.quanxue\.cn\/?(index\.html)?$/i.test(url);
  const h1 = document.querySelector('h1');
  const mainContent = document.querySelector('.content, #content, .main, #main, .article, #article');
  if (isIndex || isHome || (!h1 && !mainContent)) return;

  // 提取书籍基础 URL（如 https://www.quanxue.cn/lishi/shiji/）
  const match = location.pathname.match(/^\/(\w+)\/(\w+)\//);
  const book_url_base = match ? `${location.origin}${match[0]}` : location.origin + location.pathname;

  // 优化书名提取：优先面包屑，其次 <title> 的《书名》，再次 <title> 的“书名_章节”，最后 h1
  let book_title = '';
  const breadcrumb = document.querySelector('.breadcrumb, .nav, .path');
  if (breadcrumb) {
    const t = breadcrumb.textContent.match(/首页[\s>\|»]+([^\s>\|»]+)/);
    if (t) book_title = t[1];
  }
  if (!book_title) {
    const titleTag = document.querySelector('title');
    if (titleTag) {
      let t = titleTag.textContent.match(/《([^》]+)》/);
      if (t) book_title = t[1];
      else {
        t = titleTag.textContent.match(/^([^_\-]+)[_\-]/);
        if (t) book_title = t[1].trim();
      }
    }
  }
  if (!book_title && h1) {
    book_title = h1.textContent.trim();
  }
  // 当前页面标题（去掉书名前缀，避免重复）
  let last_page_title = '';
  if (h1) last_page_title = h1.textContent.trim();
  if (!last_page_title) {
    const titleTag = document.querySelector('title');
    if (titleTag) last_page_title = titleTag.textContent.trim();
  }
  // 去掉 last_page_title 中重复的书名前缀
  if (book_title && last_page_title && last_page_title.startsWith(book_title)) {
    last_page_title = last_page_title.replace(book_title, '').replace(/^[:：\s\-]+/, '');
  }

  // 保存/更新到 chrome.storage.sync 和 localStorage
  const record = {
    book_url_base,
    book_title,
    last_page_url: location.href,
    last_page_title,
    updated_at: Date.now()
  };

  // 双存储：chrome.storage.sync + localStorage
  function saveHistory(record) {
    // 1. chrome.storage.sync
    chrome.storage.sync.get({ reading_history: [] }, (result) => {
      let history = result.reading_history;
      history = history.filter(item => item.book_url_base !== record.book_url_base);
      history.unshift(record);
      if (history.length > 100) history = history.slice(0, 100);
      chrome.storage.sync.set({ reading_history: history });
      // 2. localStorage
      try {
        localStorage.setItem('qx_reading_history', JSON.stringify(history));
      } catch(e) {}
    });
  }
  saveHistory(record);
})();