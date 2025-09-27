const navButtons = document.querySelectorAll('.main-nav button');
const panels = document.querySelectorAll('.panel');

const lessons = {
  basic: {
    name: '基础行',
    description: '练习 ASDF 与 JKL; 的正确指法。',
    prompts: ['fff jjj fff jjj', 'asdf jkl; asdf jkl;', 'dad sad fad lad ask fall']
  },
  extended: {
    name: '扩展行',
    description: '逐步加入 QWER 与 UIOP，提升指法覆盖范围。',
    prompts: ['qwe poi qwe poi', 'we go we go we go', 'type your power word quickly']
  },
  numbers: {
    name: '数字符号',
    description: '认识 12345 与常见符号，建立顶部键位熟悉度。',
    prompts: ['1 2 3 4 5 4 3 2 1', '123 + 456 = 579', '!(1) @(2) #(3)']
  },
  custom: {
    name: '自定义',
    description: '输入自己的练习内容或课程文本。',
    prompts: []
  }
};

const achievements = [
  {
    title: '初阶学徒',
    requirement: '完成 1 次基础行练习',
    unlocked: true,
    icon: '🎯'
  },
  {
    title: '速度小达人',
    requirement: '速度达到 25 WPM',
    unlocked: false,
    icon: '⚡'
  },
  {
    title: '精准王者',
    requirement: '准确率保持在 95% 以上',
    unlocked: false,
    icon: '🎯'
  },
  {
    title: '坚持不懈',
    requirement: '连续练习 5 天',
    unlocked: false,
    icon: '📅'
  }
];

const weeklyReport = [
  { day: '周一', speed: 20, accuracy: 92 },
  { day: '周二', speed: 22, accuracy: 93 },
  { day: '周三', speed: 24, accuracy: 94 },
  { day: '周四', speed: 26, accuracy: 95 },
  { day: '周五', speed: 27, accuracy: 96 }
];

const state = {
  currentSection: 'practice',
  activeLesson: 'basic',
  activePromptIndex: 0,
  lessonProgress: 0,
  xp: 120,
  startedAt: null,
  completed: false
};

function switchSection(sectionId) {
  state.currentSection = sectionId;
  panels.forEach((panel) => panel.classList.toggle('active', panel.id === sectionId));
  navButtons.forEach((btn) => btn.classList.toggle('active', btn.dataset.target === sectionId));

  if (sectionId === 'practice') {
    renderPracticePanel();
  } else if (sectionId === 'games') {
    renderGamesPanel();
  } else if (sectionId === 'achievements') {
    renderAchievementsPanel();
  } else if (sectionId === 'analytics') {
    renderAnalyticsPanel();
  } else if (sectionId === 'settings') {
    renderSettingsPanel();
  }
}

function renderPracticePanel() {
  const panel = document.getElementById('practice');
  const lesson = lessons[state.activeLesson];
  const prompt = lesson.prompts[state.activePromptIndex] || '';

  panel.innerHTML = `
    <div class="section-title">🚀 开始练习 <span class="badge">${lesson.name}</span></div>
    <div class="practice-layout">
      <div>
        <div class="button-group">
          ${Object.entries(lessons)
            .map(
              ([key, item]) => `
                <button data-lesson="${key}" class="${key === state.activeLesson ? 'active' : ''}">
                  ${item.name}
                </button>
              `
            )
            .join('')}
        </div>
        <div class="lesson-card">
          <h3>课程简介</h3>
          <p>${lesson.description}</p>
        </div>
        <div class="lesson-card">
          <h3>提示内容</h3>
          <div class="prompt-text" id="promptText"></div>
        </div>
        <div class="lesson-card input-area">
          <h3>开始输入</h3>
          <textarea id="typingInput" placeholder="请按照提示内容进行输入"></textarea>
          <div class="progress-bar"><span id="progressIndicator"></span></div>
          <div id="practiceSummary" class="summary" hidden></div>
        </div>
      </div>
      <aside class="side-panel">
        <div class="side-card">
          <h4>实时数据</h4>
          <div class="practice-stats">
            <div class="stat">
              <h4>速度 (WPM)</h4>
              <div class="value" id="speedValue">0</div>
            </div>
            <div class="stat">
              <h4>准确率</h4>
              <div class="value" id="accuracyValue">100%</div>
            </div>
            <div class="stat">
              <h4>进度</h4>
              <div class="value" id="progressValue">0%</div>
            </div>
          </div>
        </div>
        <div class="side-card">
          <h4>今日任务</h4>
          <p>完成三轮练习即可解锁 <strong>闪电小子</strong> 勋章！</p>
        </div>
        <div class="side-card">
          <h4>经验等级</h4>
          <p>当前经验值：<strong id="xpValue">${state.xp}</strong> XP</p>
          <p>等级：魔童 Lv.${Math.floor(state.xp / 100) + 1}</p>
        </div>
      </aside>
    </div>
  `;

  const lessonButtons = panel.querySelectorAll('[data-lesson]');
  lessonButtons.forEach((btn) =>
    btn.addEventListener('click', () => {
      state.activeLesson = btn.dataset.lesson;
      state.activePromptIndex = 0;
      state.completed = false;
      state.startedAt = null;
      renderPracticePanel();
    })
  );

  const promptText = panel.querySelector('#promptText');
  const typingInput = panel.querySelector('#typingInput');
  const progressIndicator = panel.querySelector('#progressIndicator');
  const summary = panel.querySelector('#practiceSummary');

  function updatePromptHighlight(value) {
    const target = lesson.prompts[state.activePromptIndex] || value;
    const index = Math.min(value.length, target.length - 1);
    const safeIndex = Math.max(index, 0);
    const highlightIndex = Math.min(value.length, target.length);
    const before = target.slice(0, highlightIndex);
    const current = target.slice(highlightIndex, highlightIndex + 1);
    const after = target.slice(highlightIndex + 1);
    promptText.innerHTML = `
      <span class="typed">${before.replace(/ /g, '&nbsp;')}</span>
      <span class="highlight">${current.replace(/ /g, '&nbsp;')}</span>
      <span>${after.replace(/ /g, '&nbsp;')}</span>
    `;
  }

  function updatePracticeStats() {
    const target = lesson.prompts[state.activePromptIndex] || typingInput.value;
    const value = typingInput.value;

    if (!state.startedAt && value.length > 0) {
      state.startedAt = Date.now();
    }

    const elapsedMinutes = state.startedAt ? (Date.now() - state.startedAt) / 1000 / 60 : 0;
    const correct = value.split('').filter((char, index) => char === target[index]).length;
    const accuracy = value.length ? Math.round((correct / value.length) * 100) : 100;
    const grossWpm = elapsedMinutes > 0 ? Math.round((value.length / 5) / elapsedMinutes) : 0;
    const progress = Math.min(Math.round((value.length / target.length) * 100), 100);

    document.getElementById('speedValue').textContent = `${grossWpm}`;
    document.getElementById('accuracyValue').textContent = `${accuracy}%`;
    document.getElementById('progressValue').textContent = `${progress}%`;
    progressIndicator.style.width = `${progress}%`;
    updatePromptHighlight(value);

    if (value.length >= target.length && !state.completed) {
      state.completed = true;
      state.xp += 25;
      summary.hidden = false;
      summary.innerHTML = `✅ 完成啦！<br/>速度：${grossWpm} WPM · 准确率：${accuracy}% · 奖励经验：+25 XP`;
      document.getElementById('xpValue').textContent = state.xp;
      typingInput.setAttribute('disabled', 'true');
    }
  }

  typingInput.addEventListener('input', updatePracticeStats);
  updatePromptHighlight('');

  const customEntry = document.createElement('div');
  customEntry.className = 'lesson-card';
  customEntry.innerHTML = `
    <h3>自定义练习内容</h3>
    <textarea id="customPrompt" placeholder="输入想要练习的内容，每行作为一条练习。"></textarea>
    <button id="loadCustom" class="primary">载入自定义文本</button>
  `;

  if (state.activeLesson === 'custom') {
    panel.querySelector('.practice-layout > div').appendChild(customEntry);
    panel.querySelector('#loadCustom').addEventListener('click', () => {
      const value = panel.querySelector('#customPrompt').value.trim();
      if (!value) return;
      lessons.custom.prompts = value.split('\n').map((line) => line.trim()).filter(Boolean);
      state.activePromptIndex = 0;
      state.completed = false;
      state.startedAt = null;
      renderPracticePanel();
    });
  }

  const restartButton = document.createElement('button');
  restartButton.textContent = '重新开始';
  restartButton.className = 'primary';
  restartButton.style.marginTop = '1rem';
  restartButton.addEventListener('click', () => {
    typingInput.removeAttribute('disabled');
    typingInput.value = '';
    state.startedAt = null;
    state.completed = false;
    summary.hidden = true;
    progressIndicator.style.width = '0%';
    document.getElementById('speedValue').textContent = '0';
    document.getElementById('accuracyValue').textContent = '100%';
    document.getElementById('progressValue').textContent = '0%';
    updatePromptHighlight('');
    typingInput.focus();
  });
  panel.querySelector('.input-area').appendChild(restartButton);
}

function renderGamesPanel() {
  const panel = document.getElementById('games');
  panel.innerHTML = `
    <div class="section-title">🎮 小游戏模式 <span class="badge">敬请期待</span></div>
    <div class="reward-list">
      <div class="badge-card">
        <h3>打字赛车</h3>
        <p>输入越快，小车跑得越快！完成每圈赢取金币。</p>
      </div>
      <div class="badge-card">
        <h3>字母消消乐</h3>
        <p>准确输入字母组合即可消除方块，连击触发魔法技能。</p>
      </div>
      <div class="badge-card">
        <h3>太空射击</h3>
        <p>敲击目标字符发射能量弹，守护键盘星球的和平。</p>
      </div>
    </div>
  `;
}

function renderAchievementsPanel() {
  const panel = document.getElementById('achievements');
  panel.innerHTML = `
    <div class="section-title">🏆 成就奖励 <span class="badge">勋章墙</span></div>
    <div class="reward-list">
      ${achievements
        .map(
          (badge) => `
            <div class="badge-card ${badge.unlocked ? '' : 'locked'}">
              <div class="icon" style="font-size:2rem;">${badge.icon}</div>
              <h3>${badge.title}</h3>
              <p>${badge.requirement}</p>
              <p>${badge.unlocked ? '✅ 已解锁' : '🔒 未解锁'}</p>
            </div>
          `
        )
        .join('')}
    </div>
  `;
}

function renderAnalyticsPanel() {
  const panel = document.getElementById('analytics');
  const maxSpeed = Math.max(...weeklyReport.map((item) => item.speed)) + 5;
  panel.innerHTML = `
    <div class="section-title">📈 数据中心 <span class="badge">家长视图</span></div>
    <div class="lesson-card">
      <h3>本周练习趋势</h3>
      <div class="bar-chart">
        ${weeklyReport
          .map(
            (day) => `
              <div class="bar" style="height: ${(day.speed / maxSpeed) * 220}px">
                <span>${day.speed} WPM</span>
              </div>
              <div class="bar" style="height: ${(day.accuracy / 100) * 220}px; background: linear-gradient(180deg, rgba(249,162,59,0.9), rgba(249,162,59,0.5));">
                <span>${day.accuracy}%</span>
              </div>
            `
          )
          .join('')}
      </div>
      <p class="muted">蓝色代表速度，橙色代表准确率。</p>
    </div>
    <div class="lesson-card">
      <h3>家长鼓励</h3>
      <div class="timeline">
        <div class="timeline-entry">
          <strong>本周练习总时长：85 分钟</strong><br />
          平均正确率 94%，建议保持每日 15 分钟的练习节奏。
        </div>
        <div class="timeline-entry">
          <strong>温馨提醒</strong><br />
          周末可以尝试“字母消消乐”小游戏，作为奖励环节。
        </div>
      </div>
    </div>
  `;
}

function renderSettingsPanel() {
  const panel = document.getElementById('settings');
  panel.innerHTML = `
    <div class="section-title">⚙️ 设置中心 <span class="badge">家庭模式</span></div>
    <div class="settings-list">
      <div class="setting-item">
        <span>练习音效</span>
        <div class="toggle" data-setting="sound"></div>
      </div>
      <div class="setting-item">
        <span>夜间护眼主题</span>
        <div class="toggle" data-setting="theme"></div>
      </div>
      <div class="setting-item">
        <span>每日练习上限（分钟）</span>
        <input type="number" value="30" min="10" max="120" />
      </div>
      <div class="setting-item">
        <span>家长控制密码</span>
        <input type="password" placeholder="******" />
      </div>
    </div>
  `;

  panel.querySelectorAll('.toggle').forEach((toggle) => {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('on');
    });
  });
}

navButtons.forEach((button) =>
  button.addEventListener('click', () => switchSection(button.dataset.target))
);

switchSection('practice');
