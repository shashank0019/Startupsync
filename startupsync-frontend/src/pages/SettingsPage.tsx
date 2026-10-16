import React, { useEffect, useState } from 'react';
import { Bell, Lock, Moon, Save, Sun, Trash2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../context/ThemeContext';
import { settingsService, UserSettings } from '../api/settingsService';

export const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<'account' | 'notifications' | 'privacy' | 'appearance' | 'danger'>('account');
  const [settings, setSettings] = useState<UserSettings>({
    emailNotifications: true,
    applicationUpdates: true,
    messageNotifications: true,
    profileVisible: true,
    showLocation: true,
    allowMessaging: true,
    theme: 'light',
    language: 'en',
  });
  const [passwordForm, setPasswordForm] = useState({ current: '', newPass: '', confirm: '' });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    settingsService.getSettings()
      .then((s) => {
        setSettings(s);
        if (s.theme) setTheme(s.theme);
      })
      .catch(console.error);
  }, [setTheme]);

  const handleSaveSettings = async () => {
    setSaving(true);
    setMessage('');
    try {
      const updated = await settingsService.updateSettings({ ...settings, theme });
      setSettings(updated);
      setTheme(updated.theme);
      setMessage('Settings saved successfully.');
    } catch {
      setMessage('Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    setSaving(true);
    setMessage('');
    try {
      await settingsService.changePassword({
        currentPassword: passwordForm.current,
        newPassword: passwordForm.newPass,
        confirmPassword: passwordForm.confirm,
      });
      setPasswordForm({ current: '', newPass: '', confirm: '' });
      setMessage('Password changed successfully.');
    } catch {
      setMessage('Failed to change password. Check your current password.');
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'account', label: 'Account' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'privacy', label: 'Privacy' },
    { id: 'appearance', label: 'Appearance' },
    { id: 'danger', label: 'Danger Zone' },
  ] as const;

  const toggle = (key: keyof UserSettings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="mx-auto max-w-6xl">
      {message && (
        <div className="mb-4 rounded-xl bg-brand-50 px-4 py-3 text-sm font-medium text-brand-700">{message}</div>
      )}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-100 bg-white shadow-card overflow-hidden">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full border-b border-slate-100 px-6 py-4 text-left text-sm font-medium transition last:border-b-0 ${
                activeTab === tab.id ? 'bg-brand-50 text-brand-600' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="lg:col-span-3">
          {activeTab === 'account' && (
            <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-card space-y-6">
              <h2 className="text-xl font-bold text-slate-900">Account Settings</h2>
              <div>
                <label className="text-sm font-medium text-slate-500">Email</label>
                <p className="mt-1 text-slate-900">{user?.email}</p>
              </div>
              <div className="space-y-3 border-t border-slate-100 pt-6">
                <h3 className="font-semibold text-slate-900">Change Password</h3>
                <input type="password" placeholder="Current password" value={passwordForm.current}
                  onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm" />
                <input type="password" placeholder="New password" value={passwordForm.newPass}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPass: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm" />
                <input type="password" placeholder="Confirm new password" value={passwordForm.confirm}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm" />
                <button onClick={handleChangePassword} disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-50">
                  <Lock size={16} /> Change Password
                </button>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-card space-y-4">
              <h2 className="text-xl font-bold text-slate-900">Notification Preferences</h2>
              {([
                ['emailNotifications', 'Email Notifications', 'Receive important updates via email'],
                ['applicationUpdates', 'Application Updates', 'Get notified about your applications'],
                ['messageNotifications', 'Message Notifications', 'Get notified when you receive new messages'],
              ] as const).map(([key, title, desc]) => (
                <label key={key} className="flex cursor-pointer items-center gap-4 rounded-xl border border-slate-100 p-4 hover:bg-slate-50">
                  <input type="checkbox" checked={settings[key]} onChange={() => toggle(key)} className="h-5 w-5 rounded" />
                  <div>
                    <p className="font-semibold text-slate-900">{title}</p>
                    <p className="text-sm text-slate-500">{desc}</p>
                  </div>
                </label>
              ))}
              <button onClick={handleSaveSettings} disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700">
                <Save size={16} /> Save Preferences
              </button>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-card space-y-4">
              <h2 className="text-xl font-bold text-slate-900">Privacy & Visibility</h2>
              {([
                ['profileVisible', 'Make Profile Visible', 'Allow others to find and view your profile'],
                ['showLocation', 'Show Location', 'Display your location on your profile'],
                ['allowMessaging', 'Allow Messaging', 'Let other users send you messages'],
              ] as const).map(([key, title, desc]) => (
                <label key={key} className="flex cursor-pointer items-center gap-4 rounded-xl border border-slate-100 p-4 hover:bg-slate-50">
                  <input type="checkbox" checked={settings[key]} onChange={() => toggle(key)} className="h-5 w-5 rounded" />
                  <div>
                    <p className="font-semibold text-slate-900">{title}</p>
                    <p className="text-sm text-slate-500">{desc}</p>
                  </div>
                </label>
              ))}
              <button onClick={handleSaveSettings} disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700">
                <Save size={16} /> Save Settings
              </button>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-card space-y-6">
              <h2 className="text-xl font-bold text-slate-900">Appearance</h2>
              <div className="grid grid-cols-3 gap-3">
                {([
                  ['light', Sun, 'Light'],
                  ['dark', Moon, 'Dark'],
                  ['system', Bell, 'System'],
                ] as const).map(([value, Icon, label]) => (
                  <button key={value} onClick={() => { setTheme(value); setSettings((s) => ({ ...s, theme: value })); }}
                    className={`flex flex-col items-center gap-2 rounded-xl border p-4 transition ${
                      theme === value ? 'border-brand-500 bg-brand-50 text-brand-600' : 'border-slate-200 hover:bg-slate-50'
                    }`}>
                    <Icon size={20} />
                    <span className="text-sm font-medium">{label}</span>
                  </button>
                ))}
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Language</label>
                <select value={settings.language} onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm">
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                </select>
              </div>
              <button onClick={handleSaveSettings} disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700">
                <Save size={16} /> Save Appearance
              </button>
            </div>
          )}

          {activeTab === 'danger' && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-8 shadow-card">
              <h2 className="text-xl font-bold text-red-900">Danger Zone</h2>
              <p className="mt-1 text-sm text-red-700">These actions cannot be undone.</p>
              <div className="mt-6 rounded-xl border border-red-200 bg-white p-4">
                <h3 className="font-semibold text-slate-900">Delete Account</h3>
                <p className="mt-1 text-sm text-slate-500">Permanently delete your account and all associated data.</p>
                <button className="mt-4 inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700">
                  <Trash2 size={16} /> Delete Account
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
