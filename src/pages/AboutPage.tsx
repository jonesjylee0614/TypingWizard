const AboutPage = () => {
  return (
    <div className="card" style={{ marginTop: 24 }}>
      <h1>关于 TypingWizard</h1>
      <p className="subtitle">TypingClub 学生端离线版，仅在浏览器中运行。</p>

      <section style={{ marginTop: 16 }}>
        <h2>使用说明</h2>
        <ul style={{ color: '#475569', lineHeight: 1.8 }}>
          <li>首次进入从课程列表开始，逐关练习，达到目标后自动解锁下一关。</li>
          <li>练习时直接敲击键盘，页面会实时显示目标字符、进度、WPM 与准确率。</li>
          <li>每次练习结束后成绩自动保存在浏览器 <code>localStorage</code> 中。</li>
          <li>在设置页可导出数据备份，或导入历史数据恢复练习记录。</li>
        </ul>
      </section>

      <section style={{ marginTop: 24 }}>
        <h2>快捷键</h2>
        <ul style={{ color: '#475569', lineHeight: 1.8 }}>
          <li><kbd>Enter</kbd> 用于输入换行。</li>
          <li><kbd>Backspace</kbd> 撤销上一个字符。</li>
          <li><kbd>Esc</kbd> 可在练习中打开退出确认。</li>
        </ul>
      </section>

      <section style={{ marginTop: 24 }}>
        <h2>隐私说明</h2>
        <p style={{ color: '#475569' }}>所有练习数据均存储在本地浏览器，不会上传到任何服务器。如需删除数据，可在设置页选择重置。</p>
      </section>
    </div>
  );
};

export default AboutPage;
