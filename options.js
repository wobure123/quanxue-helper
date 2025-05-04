// options.js

// This file will handle the authentication logic for the options page.

document.addEventListener('DOMContentLoaded', () => {
  // 读取本地配置
  chrome.storage.local.get(['bmobAppId', 'bmobAppKey'], (result) => {
    if (result.bmobAppId) document.getElementById('bmob-appid').value = result.bmobAppId;
    if (result.bmobAppKey) document.getElementById('bmob-appkey').value = result.bmobAppKey;
  });

  // 测试 Bmob 连接
  function testBmobConnection(appId, appKey, cb) {
    if (!window.Bmob) {
      cb(false, '未加载 Bmob SDK');
      return;
    }
    try {
      Bmob.initialize(appId, appKey);
      // 尝试查询表结构
      const Reading = Bmob.Object.extend('ReadingHistory');
      const query = new Bmob.Query(Reading);
      query.limit(1);
      query.find().then(() => cb(true)).catch(e => cb(false, e.message || e));
    } catch (e) {
      cb(false, e.message || e);
    }
  }

  document.getElementById('test-bmob').addEventListener('click', function() {
    const appId = document.getElementById('bmob-appid').value.trim();
    const appKey = document.getElementById('bmob-appkey').value.trim();
    const resultDiv = document.getElementById('bmob-test-result');
    if (!appId || !appKey) {
      resultDiv.textContent = '请填写完整 Bmob AppId 和 AppKey';
      resultDiv.style.color = '#d00';
      return;
    }
    resultDiv.textContent = '正在测试连接...';
    resultDiv.style.color = '#444';
    testBmobConnection(appId, appKey, (ok, msg) => {
      if (ok) {
        resultDiv.textContent = '连接成功！';
        resultDiv.style.color = '#080';
      } else {
        resultDiv.textContent = '连接失败：' + (msg || '未知错误');
        resultDiv.style.color = '#d00';
      }
    });
  });

  document.getElementById('save-bmob').addEventListener('click', function() {
    const appId = document.getElementById('bmob-appid').value.trim();
    const appKey = document.getElementById('bmob-appkey').value.trim();
    if (!appId || !appKey) {
      alert('请填写完整 Bmob AppId 和 AppKey');
      return;
    }
    chrome.storage.local.set({ bmobAppId: appId, bmobAppKey: appKey });
    alert('Bmob 配置已保存');
  });

  // 认证相关逻辑全部本地处理
  let supabaseClient = null;
  let currentUser = null;

  function getSupabaseClient() {
    const url = document.getElementById('supabase-url').value.trim();
    const anonKey = document.getElementById('supabase-key').value.trim();
    if (!url || !anonKey || !window.supabase) return null;
    if (!supabaseClient || supabaseClient._supabaseUrl !== url || supabaseClient._supabaseKey !== anonKey) {
      supabaseClient = window.supabase.createClient(url, anonKey);
      supabaseClient._supabaseUrl = url;
      supabaseClient._supabaseKey = anonKey;
    }
    return supabaseClient;
  }

  function showUserInfo(user) {
    const userInfo = document.getElementById('user-info');
    const logoutBtn = document.getElementById('logout-btn');
    if (user) {
      userInfo.textContent = `已登录：${user.email}`;
      logoutBtn.style.display = '';
    } else {
      userInfo.textContent = '未登录';
      logoutBtn.style.display = 'none';
    }
  }

  function showMessage(msg, isError) {
    const msgDiv = document.getElementById('message');
    msgDiv.textContent = msg;
    msgDiv.style.color = isError ? '#d00' : '#080';
  }

  async function refreshAuthState() {
    const client = getSupabaseClient();
    if (!client) {
      showUserInfo(null);
      return;
    }
    const { data: { session } } = await client.auth.getSession();
    currentUser = session && session.user;
    showUserInfo(currentUser);
  }

  document.getElementById('login-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const client = getSupabaseClient();
    if (!client) {
      showMessage('Supabase 未配置', true);
      return;
    }
    const { data, error } = await client.auth.signInWithPassword({ email, password });
    if (error) {
      showMessage(error.message || '登录失败', true);
    } else {
      showMessage('登录成功');
      refreshAuthState();
    }
  });

  document.getElementById('register-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value;
    const client = getSupabaseClient();
    if (!client) {
      showMessage('Supabase 未配置', true);
      return;
    }
    const { data, error } = await client.auth.signUp({ email, password });
    if (error) {
      showMessage(error.message || '注册失败', true);
    } else {
      showMessage('注册成功，请检查邮箱激活账户');
      refreshAuthState();
    }
  });

  document.getElementById('logout-btn').addEventListener('click', async function() {
    const client = getSupabaseClient();
    if (!client) return;
    await client.auth.signOut();
    showMessage('已登出');
    refreshAuthState();
  });

  refreshAuthState();
});
