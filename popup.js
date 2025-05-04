document.addEventListener('DOMContentLoaded', () => {
  const authStatus = document.getElementById('auth-status');
  const historyList = document.getElementById('history-list');

  chrome.storage.sync.get({ reading_history: [] }, (result) => {
    const data = result.reading_history;
    historyList.innerHTML = '';
    if (!data || data.length === 0) {
      historyList.innerHTML = '<li>暂无阅读记录</li>';
      return;
    }
    data.forEach(item => {
      const li = document.createElement('li');
      li.textContent = `${item.book_title || '未知书名'}：${item.last_page_title || ''}`;
      const navBtn = document.createElement('button');
      navBtn.textContent = '前往';
      navBtn.onclick = () => {
        chrome.runtime.sendMessage({ type: 'NAVIGATE_TO', url: item.last_page_url });
      };
      const delBtn = document.createElement('button');
      delBtn.textContent = '删除';
      delBtn.onclick = () => {
        // 删除该条记录
        chrome.storage.sync.get({ reading_history: [] }, (res) => {
          let history = res.reading_history.filter(h => h.book_url_base !== item.book_url_base);
          chrome.storage.sync.set({ reading_history: history }, () => {
            location.reload();
          });
        });
      };
      li.appendChild(navBtn);
      li.appendChild(delBtn);
      historyList.appendChild(li);
    });
  });
  authStatus.textContent = '已登录（Google账号自动同步）';
});