import { ChangeEvent, useRef, useState } from 'react';
import { useAppData } from '../context/AppDataContext';
import { exportAllData, importAllData } from '../utils/localStorage';

const SettingsPage = () => {
  const { settings, updateSettings, importState, resetState } = useAppData();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 2000);
  };

  const handleCheckbox = (key: keyof typeof settings) => (event: ChangeEvent<HTMLInputElement>) => {
    updateSettings({ [key]: event.target.checked });
    showToast('设置已保存');
  };

  const handleNumber = (key: keyof typeof settings) => (event: ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    updateSettings({ [key]: value });
    showToast('设置已保存');
  };

  const handleExport = () => {
    const data = exportAllData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'typingwizard-data.json';
    a.click();
    URL.revokeObjectURL(url);
    showToast('数据已导出');
  };

  const handleImportFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    try {
      const state = importAllData(text);
      importState(state);
      showToast('数据导入成功');
    } catch (error) {
      console.error(error);
      alert('导入失败，请检查文件内容。');
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleReset = () => {
    const confirmText = window.prompt('重置将清空所有数据，输入 "RESET" 继续。');
    if (confirmText === 'RESET') {
      resetState();
      showToast('已恢复默认数据');
    }
  };

  return (
    <div style={{ marginTop: 24 }}>
      <div className="card">
        <h1>练习设置</h1>
        <p className="subtitle">调整练习体验与目标阈值。</p>

        <div className="form-group" style={{ marginTop: 16 }}>
          <label>
            <input type="checkbox" checked={settings.keyboardHint} onChange={handleCheckbox('keyboardHint')} /> 显示键盘提示
          </label>
        </div>

        <div className="form-group">
          <label>
            <input type="checkbox" checked={settings.sound} onChange={handleCheckbox('sound')} /> 错误提示音
          </label>
        </div>

        <div className="form-group">
          <label>
            <input type="checkbox" checked={settings.backspacePenalty} onChange={handleCheckbox('backspacePenalty')} /> 退格扣分
          </label>
        </div>

        <div className="form-group">
          <label>全局目标准确率（0-1）</label>
          <input type="number" step={0.01} min={0.5} max={1} value={settings.targetAccuracy} onChange={handleNumber('targetAccuracy')} />
        </div>

        <div className="form-group">
          <label>全局目标 WPM</label>
          <input type="number" min={10} max={120} value={settings.targetWpm} onChange={handleNumber('targetWpm')} />
        </div>
      </div>

      <div className="card" style={{ marginTop: 24 }}>
        <h2>数据管理</h2>
        <p className="subtitle">导入导出数据，或重置为默认状态。</p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 16 }}>
          <button className="primary" onClick={handleExport}>导出数据</button>
          <button className="secondary" onClick={() => fileInputRef.current?.click()}>导入数据</button>
          <button className="secondary" onClick={handleReset}>重置所有数据</button>
        </div>
        <input ref={fileInputRef} type="file" accept="application/json" style={{ display: 'none' }} onChange={handleImportFile} />
      </div>

      {toast && (
        <div className="toast-container">
          <div className="toast">{toast}</div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
